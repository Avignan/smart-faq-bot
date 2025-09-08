from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, pipeline
from sentence_transformers import SentenceTransformer, SimilarityFunction
import numpy as np
import faiss
import pickle
import os
import nltk
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize
import docx
import logging
from dotenv import load_dotenv

os.environ["NLTK_DATA"] = os.getenv("NLTK_DATA", "./nltk_data")

# Example: Download stopwords if not already present
nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)


# Remove warnings and set logging level
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("faiss").setLevel(logging.ERROR)
logging.getLogger("nltk").setLevel(logging.ERROR)


load_dotenv()

model_for_sequence_classification = os.getenv("SEQ_MODEL")
model_for_sentence_embedding = os.getenv("SENTENCE_EMBEDDING_MODEL")
qa_model = os.getenv("QA_MODEL")


def load_model():
    try:
        logging.info(f"Loading SentenceTransformer model: {model_for_sentence_embedding}")
        sentence_transformer_model = SentenceTransformer(model_for_sentence_embedding or 'all-MiniLM-L6-v2')
        logging.info("SentenceTransformer model loaded successfully")
        return sentence_transformer_model
    except Exception as e:
        print(f"Error loading models: {e}")
        return None

# Load model at module level (startup)
sentence_transformer_model = load_model()

def chunk_text(text, max_chunk=100):
    try:
        sentences = sent_tokenize(text)
        chunk, current_chunk, word_count = [], [], 0
        for sentence in sentences:
            words = sentence.split()
            if word_count + len(words) > max_chunk:
                chunk.append(" ".join(current_chunk))
                current_chunk, word_count = [], 0
            current_chunk.append(sentence)
            word_count += len(words)
        
        if current_chunk:
            chunk.append(" ".join(current_chunk))
        
        return chunk
    except Exception as e:
        print(f"Error chunking text: {e}")
        return []


def generate_embedding(text, model):
    try:
        embedding = model.encode(text)
        return embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None  


def qa_model_initializer(context: str, query: str):
    try:
        prompt = f"Context: {context}\n\nQuestion: {query}\n\nAnswer:"
        qa_model_obj = pipeline("text2text-generation", model=qa_model)
        result = qa_model_obj(prompt, max_length=128, temperature=0)
        return result[0]["generated_text"]
    except:
        print("Sorry! I don't exactly know the answer to that :(")


def get_answer(user_query: str, chunks: list[str], filename: str):
    doc_chunks = []
    logging.info("sentence_transformer_model", sentence_transformer_model)
    if sentence_transformer_model:
        if chunks:
            for chunk in chunks:
                doc_chunks.append({"doc": filename, "text": chunk})
            logging.info('doc_chunks', doc_chunks)
            chunks_hybrid = [chunk["text"] for chunk in doc_chunks]

            embedding = generate_embedding(chunks_hybrid, sentence_transformer_model)

            if embedding is not None:
                # Create FAISS index
                index = faiss.IndexFlatL2(embedding.shape[1])
                index.add(np.array(embedding))

                q_emb = sentence_transformer_model.encode([user_query])
                D, I = index.search(q_emb, k=2)
                for idx in I[0]:
                    response = "".join(chunks_hybrid[idx])
                    final_output = qa_model_initializer(context=response, query=user_query)
                    return final_output
            else:
                return f"Apologies! It appears as if something went wrong while trying to generate embedding"
        else:
            return "Apologies! It appears as if something went wrong while processing the document."
    else:
        return "Apologies! It appears as if something went wrong while loading the models."
    

# get_answer("What is the purpose of the document?")
