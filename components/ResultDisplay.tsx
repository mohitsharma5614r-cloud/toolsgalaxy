import React from 'react';

interface ResultDisplayProps {
  editedImageUrl: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ editedImageUrl }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImageUrl;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col items-center w-full">
        <img 
            src={editedImageUrl} 
            alt="Edited result" 
            className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
        />
        <button 
            onClick={handleDownload}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
        >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Image
        </button>
    </div>
  );
};