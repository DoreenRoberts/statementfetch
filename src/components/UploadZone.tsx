import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Sparkles } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (files: FileList) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  return (
    <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-8">
        <div
          className="text-center space-y-4"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Upload PDF Statements
            </h3>
            <p className="text-gray-600">
              Drag & drop your PDF files here or click to browse
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </label>
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadZone;