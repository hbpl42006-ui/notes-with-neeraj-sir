import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

const FileUpload = ({ 
  onFileSelect, 
  accept = '.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxSizeLabel,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError('');
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!accept.includes(fileExtension)) {
      setError('Invalid file type. Please upload a PDF file.');
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSizeLabel || formatFileSize(maxSize)} limit.`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleChange}
            accept={accept}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2 dark:text-gray-300">
              Drag & drop your file here, or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PDF files up to {maxSizeLabel || formatFileSize(maxSize)}
            </p>
          </label>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
