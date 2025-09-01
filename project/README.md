# Smart FAQ Bot

A professional React application that allows users to upload documents and get AI-powered answers to their questions.

## Features

- **Document Upload**: Drag-and-drop interface for uploading DOCX and PDF files
- **AI Chat Interface**: Interactive chat with intelligent responses
- **Professional Design**: Modern, responsive UI with Tailwind CSS
- **Real-time Feedback**: Loading states and success/error notifications
- **TypeScript Support**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Backend Setup

Make sure your backend API is running on `http://localhost:8000` or update the `REACT_APP_API_URL` environment variable.

Expected API endpoints:
- `POST /query` - Send questions and receive AI responses
- `POST /upload` - Upload documents for processing

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Create React App** for project setup

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── DocumentUpload.tsx  # File upload modal
│   ├── ChatContainer.tsx   # Chat interface
│   ├── ChatMessage.tsx     # Individual message component
│   └── ChatInput.tsx       # Message input component
├── services/           # API services
│   └── api.ts         # API functions
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared interfaces
└── App.tsx            # Main application component
```