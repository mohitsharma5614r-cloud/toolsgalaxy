import React, { useState, useCallback, useRef } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  acceptedTypes: string;
  label: string;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, acceptedTypes, label }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      onFileSelected(file);
      setSelectedFile(file);
    }
  }, [onFileSelected]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const onRemoveFile = () => {
    setSelectedFile(null);
    // You might want to notify the parent component that the file was removed.
    // onFileSelected(null); // This depends on your parent component's logic.
  };
  
  return (
    <div 
      className={`relative p-6 border-2 border-dashed rounded-xl text-center transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept={acceptedTypes}
        className="hidden"
      />
      {selectedFile ? (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-slate-700 dark:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="9"></line></svg>
            <p className="font-semibold">{selectedFile.name}</p>
            <p className="text-sm text-slate-500">{formatBytes(selectedFile.size)}</p>
            <button onClick={onRemoveFile} className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 text-red-700 dark:text-red-300 rounded-md transition-colors text-sm font-semibold">
                Remove File
            </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 py-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-400 dark:text-slate-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
          <p className="text-sm my-2">or drag & drop here</p>
          <button onClick={onBrowseClick} className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm">
            Browse File
          </button>
        </div>
      )}
    </div>
  );
};
