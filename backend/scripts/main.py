from fastapi import FastAPI, Request, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from mangum import Mangum
from scripts.rag_engine import get_answer, chunk_text
from scripts.utils import db_connection, preprocess_docx, extract_text_from_docx
import os
import uuid
from dotenv import load_dotenv

load_dotenv()
mongodb_URI = os.getenv("MONGODB_URI")


app = FastAPI(title='Gen AI RAG API', version='1.0.0')

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set to your frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/health')
def health_check():
    return {"status": "ok"}


class Query(BaseModel):
    query: str

@app.post('/ask')
def ask_question(query: Query):
    answer = ""
    try:
        db_con = db_connection(mongodb_URI)
        if db_con is None:
            raise HTTPException(status_code=500, detail="Failed to connect to database.")
            
        print(f"Received query: {query.query}")
        
        # Get most recently uploaded document (fallback to _id if no uploaded_at)
        latest_doc = db_con.find_one({}, {"filename": 1}, sort=[("_id", -1)])
        if not latest_doc:
            raise HTTPException(status_code=404, detail="No documents found")
        
        doc_name = latest_doc["filename"]
        
        # Get all chunks for this document
        chunks = list(db_con.find({"filename": doc_name}, {"text": 1}).sort("chunk_id", 1))
        
        print(f"Document name: {doc_name}, Chunks: {len(chunks)}")
        answer = get_answer(query.query, chunks, doc_name)
        if answer:
            return {"answer": answer}
        else:
            raise HTTPException(status_code=404, detail="Failed to retrieve answer.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


ALLOWED_EXTS = {".pdf", ".docx", ".txt"}

@app.post("/upload")
async def upload_doc(file: UploadFile = File(...)):
    try:
        print(f"Uploading file: {file.filename}")
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTS:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

        file_bytes = await file.read()
        print(f"File size: {len(file_bytes)} bytes")

        text = preprocess_docx(file_bytes)
        print(f"Preprocessed document: {text is not None}")
        
        text = extract_text_from_docx(text) if text else ""
        print(f"Extracted text length: {len(text) if text else 0}")
        
        if not text:
            raise HTTPException(status_code=500, detail="Failed to process document.")
        
        chunks = chunk_text(text)
        print(f"Created {len(chunks) if chunks else 0} chunks")
        
        if not chunks:
            raise HTTPException(status_code=500, detail="Failed to chunk document.")
        
        db_con = db_connection(mongodb_URI)
        print(f"Database connection: {db_con is not None}")
        
        if db_con is None:
            raise HTTPException(status_code=500, detail="Failed to connect to database.")

        # Store in MongoDB
        doc_id = str(uuid.uuid4())
        from datetime import datetime
        timestamp = datetime.utcnow()
        
        for i, chunk in enumerate(chunks):
            result = db_con.insert_one({
                "doc_id": doc_id,
                "filename": file.filename,
                "chunk_id": i,
                "text": chunk,
                "uploaded_at": timestamp
            })
            print(f"Inserted chunk {i}: {result.inserted_id}")

        return {"message": f"Uploaded {file.filename}", "chunks_added": len(chunks), "success": True}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))