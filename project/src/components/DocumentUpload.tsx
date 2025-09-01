import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { uploadDocument } from '../services/api';

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (fileName: string) => void;
}

const DocumentUpload = ({ isOpen, onClose, onUploadSuccess }: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      setUploadStatus('error');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');

    try {
      const response = await uploadDocument(file);
      console.log('Upload response:', response);
      if (response.success) {
        setUploadStatus('success');
        onUploadSuccess(file.name);
        setTimeout(() => {
          onClose();
          setUploadStatus('idle');
        }, 2000);
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadStatus === 'success' ? (
            <div className="text-green-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="font-medium">Upload successful!</p>
            </div>
          ) : (
            <>
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">
                Drag and drop your document here, or{' '}
                <label className="text-blue-600 cursor-pointer hover:underline">
                  browse files
                  <input
                    type="file"
                    className="hidden"
                    accept=".docx,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">Supports DOCX and PDF files</p>
            </>
          )}
        </div>

        {uploading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <p className="mt-4 text-sm text-red-600 text-center">
            Upload failed. Please try again with a valid document.
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;