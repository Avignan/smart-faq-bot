import React from 'react';
import { MessageCircle, Upload } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
}

const Header = ({ onUploadClick }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Smart FAQ Bot</h1>
              <p className="text-blue-100">AI-powered document assistant</p>
            </div>
          </div>
          <button
            onClick={onUploadClick}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;