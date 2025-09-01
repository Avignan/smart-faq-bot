import React, { useState } from 'react';
import Header from './components/Header';
import DocumentUpload from './components/DocumentUpload';
import ChatContainer from './components/ChatContainer';
import { Message } from './types';
import { sendQuery } from './services/api';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDocuments, setHasDocuments] = useState(false);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendQuery(messageText);
      console.log('API Response:', response);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer || "I apologize, but I couldn't find an answer to your question.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your question. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (fileName: string) => {
    setHasDocuments(true);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Great! I've successfully processed "${fileName}". You can now ask me questions about this document.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onUploadClick={() => setIsUploadOpen(true)} />
      
      <main className="flex-1 max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg my-6 overflow-hidden">
        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          hasDocuments={hasDocuments}
        />
      </main>

      <DocumentUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2025 Smart FAQ Bot. Powered by AI for intelligent document assistance.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;