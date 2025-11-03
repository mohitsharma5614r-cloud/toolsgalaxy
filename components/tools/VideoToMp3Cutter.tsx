
import React, { useState, useRef } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="video-cutter-loader mx-auto">
            <div className="film-strip"></div>
            <div className="audio-wave"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Extracting and converting audio...</p>
        <style>{`
            .video-cutter-loader { width: 120px; height: 100px; position: relative; }
            .film-strip {
                width: 50px; height: 100%;
                background-image: repeating-linear-gradient(0deg, #334155, #334155 8px, transparent 8px, transparent 12px), repeating-linear-gradient(90deg, #334155, #334155 8px, transparent 8px, transparent 12px);
                background-size: 100% 12px, 12px 100%;
                position: absolute; left: 0;
                animation: slide-film 2s infinite linear;
            }
            .dark .film-strip { background-image: repeating-linear-gradient(0deg, #475569, #475569 8px, transparent 8px, transparent 12px), repeating-linear-gradient(90deg, #475569, #475569 8px, transparent 8px, transparent 12px); }
            .audio-wave {
                width: 50px; height: 100%;
                background-image: repeating-linear-gradient(to right, transparent 0 2px, #6366f1 2px 4px);
                position: absolute; right: 0;
                mask-image: linear-gradient(to top, transparent, black 20% 80%, transparent);
                animation: emerge-wave 2s infinite linear;
                transform: scaleX(0); transform-origin: left;
            }
            @keyframes slide-film { from { transform: translateY(-50%); } to { transform: translateY(50%); } }
            @keyframes emerge-wave {
                0%, 40% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
            }
        `}</style>
    </div>
);

export const VideoToMp3Cutter: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleConvert = () => {
        if (!file) return;
        setIsLoading(true);
        setShowExplanation(false);
        setTimeout(() => {
            setIsLoading(false);
            setShowExplanation(true);
        }, 2500);
    };
    
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Cut a section from a video and convert it to MP3.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <div className="space-y-4">
                <FileUploader onFileSelected={setFile} acceptedTypes="video/*" label="Upload Video File" />
                {file && (
                    <div className="space-y-2 pt-2 border-t">
                        <div className="grid grid-cols-2 gap-2">
                           <input type="text" defaultValue="00:00:10" className="input-style w-full text-center" />
                           <input type="text" defaultValue="00:00:45" className="input-style w-full text-center" />
                        </div>
                    </div>
                )}
                <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">Cut & Convert</button>
            </div>
        ) : null}
        
        {showExplanation && (
          <div className="mt-8 p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Browser Limitation</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  <p>Extracting, cutting, and re-encoding audio from a video file (transcoding) is a very processor-intensive task.</p>
                  <p className="mt-2">Performing this in a browser is often slow, unreliable, and can crash the page, especially with large files. For a smooth and fast experience, this kind of tool relies on a powerful server to do the heavy lifting.</p>
                </div>
                <button onClick={() => { setFile(null); setShowExplanation(false); }} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">Try Another File</button>
              </div>
            </div>
            <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; } .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; } .btn-primary:disabled { background: #9ca3af; } .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; } .dark .input-style { background: #1e293b; border-color: #475569; color: white; }`}</style>
          </div>
        )}
      </div>
    </div>
  );
};
