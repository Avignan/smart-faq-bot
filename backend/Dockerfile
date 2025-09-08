FROM python:3.13-slim

WORKDIR /app

COPY requirement.txt .

RUN pip install --no-cache-dir -r requirement.txt


# Configure NLTK data path inside container
ENV NLTK_DATA=/app/nltk_data
RUN mkdir -p /app/nltk_data

# (Optional) Pre-download common nltk packages so runtime doesn’t fail
RUN python -m nltk.downloader punkt stopwords -d /app/nltk_data || true

COPY . .



CMD ["uvicorn", "scripts.main:app", "--host", "0.0.0.0", "--port", "7860"]