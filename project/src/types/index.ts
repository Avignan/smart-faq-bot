export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
}