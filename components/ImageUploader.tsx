import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

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
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {preview ? (
        <div className="flex flex-col items-center gap-4">
          <img src={preview} alt="Image preview" className="max-h-80 mx-auto rounded-lg shadow-md" />
           <button onClick={onBrowseClick} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-md transition-colors">
            Change Image
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 py-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-400 dark:text-slate-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <p className="font-semibold text-slate-700 dark:text-slate-300">Drag & Drop an image here</p>
          <p className="text-sm my-2">or</p>
          <button onClick={onBrowseClick} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-transform duration-200 hover:scale-105">
            Browse Files
          </button>
          <p className="text-xs mt-4 text-slate-400 dark:text-slate-500">Supports PNG, JPG, WebP</p>
        </div>
      )}
    </div>
  );
};