const API_URL = "https://smart-faq-bot-82nn.onrender.com";

interface QueryResponse {
  answer: string;
  success: boolean;
}

interface UploadResponse {
  success: boolean;
  message: string;
  documentId?: string;
}

export async function sendQuery(question: string): Promise<QueryResponse> {
  
  const response = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: question }),
  });

  console.log('Fetch response:', response.status);
  if (!response.ok) {
    throw new Error('Failed to get answer');
  }

  return response.status === 200 ? response.json() : { answer: '', success: false };
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  console.log(`${API_URL}/upload`);
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload document');
  }

  return response.status === 200 ? response.json() : { success: false, message: 'Upload failed' };
}