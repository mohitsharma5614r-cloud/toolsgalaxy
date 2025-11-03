
import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="waveform-loader mx-auto">
            {Array.from({ length: 30 }).map((_, i) => <div key={i} className="bar" style={{ animationDelay: `${i * 50}ms` }}></div>)}
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing audio spectrum...</p>
        <style>{`
            .waveform-loader { width: 150px; height: 80px; display: flex; align-items: center; justify-content: space-between; }
            .bar { width: 3px; height: 10px; background-color: #6366f1; border-radius: 2px; animation: wave 1.5s infinite ease-in-out; }
            @keyframes wave { 0%, 100% { height: 10px; } 50% { height: 80px; } }
        `}</style>
    </div>
);

export const AudioWatermarkDetector: React.FC<{ title: string }> = ({ title }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDetect = () => {
    if (!file) return;
    setIsLoading(true);
    setShowExplanation(false);
    setTimeout(() => {
      setIsLoading(false);
      setShowExplanation(true);
    }, 2500);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setShowExplanation(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload an audio file to check for hidden watermarks.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <div className="space-y-4">
                <FileUploader onFileSelected={handleFileSelect} acceptedTypes="audio/*" label="Upload Audio File" />
                <button onClick={handleDetect} disabled={!file} className="w-full btn-primary text-lg">Detect Watermark</button>
            </div>
        ) : null}
        
        {showExplanation && (
          <div className="mt-8 p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
             <div className="flex">
              <div className="flex-shrink-0">
                 <svg className="w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical Limitation</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  <p>Detecting digital audio watermarks is a highly complex task that involves advanced signal processing and forensic analysis, often specific to the watermarking algorithm used.</p>
                  <p className="mt-2">This functionality is too computationally intensive and specialized for a browser-only tool. It typically requires powerful server-side processing or dedicated desktop software.</p>
                </div>
                <button onClick={() => { setFile(null); setShowExplanation(false); }} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">Try Another File</button>
              </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-primary:disabled { background: #9ca3af; }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};
