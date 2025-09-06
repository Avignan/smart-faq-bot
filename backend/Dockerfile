FROM python:3.13-slim

WORKDIR /app

COPY requirement.txt .
RUN pip install --no-cache-dir -r requirement.txt

COPY . .

CMD ["sh", "-c", "uvicorn backend.scripts.main:app --host 0.0.0.0 --port ${PORT}"]