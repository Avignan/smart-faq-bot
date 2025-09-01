export async function getAnswer(query) {
    const response = await fetch('{process.env.REACT_APP_API_URL}/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch answer');
    }
    return await response.json();
}


export async function uploadFiles(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('{process.env.REACT_APP_API_URL}/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }
    return await response.json();
}