
import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="subtitle-remover-loader mx-auto">
            <div className="video-frame">
                <div className="subtitle-bar"></div>
            </div>
            <div className="brush"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Inpainting video frames...</p>
        <style>{`
            .subtitle-remover-loader {
                width: 120px;
                height: 80px;
                position: relative;
            }
            .video-frame {
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #a5b4fc, #60a5fa);
                border: 3px solid #9ca3af;
                border-radius: 4px;
                position: relative;
                overflow: hidden;
            }
            .subtitle-bar {
                position: absolute;
                bottom: 10px;
                left: 10%;
                width: 80%;
                height: 12px;
                background: rgba(0,0,0,0.5);
                border-radius: 2px;
            }
            .brush {
                position: absolute;
                bottom: 8px;
                left: -10px;
                width: 25px;
                height: 16px;
                background: #f1f5f9;
                border-radius: 4px;
                animation: erase-subtitle 2s infinite ease-in-out;
            }
            .dark .brush {
                 background: #1e293b;
            }
            @keyframes erase-subtitle {
                from { left: -10px; }
                to { left: 105px; }
            }
        `}</style>
    </div>
);

export const VideoSubtitleRemover: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleAttempt = () => {
        if (!file) return;
        setIsLoading(true);
        setShowExplanation(false);
        setTimeout(() => {
            setIsLoading(false);
            setShowExplanation(true);
        }, 3000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Simulates removing hardcoded subtitles from a video.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>}
                {!isLoading && !showExplanation && (
                    <div className="space-y-4">
                        <FileUploader onFileSelected={setFile} acceptedTypes="video/*" label="Upload Video with Subtitles" />
                        <button onClick={handleAttempt} disabled={!file} className="w-full btn-primary text-lg">
                            Remove Subtitles
                        </button>
                    </div>
                )}
                {showExplanation && (
                    <div className="p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
                        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical Limitation</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                            <p>Removing hardcoded subtitles (text that is part of the video image itself) is a very difficult computer vision problem.</p>
                            <p>It requires advanced AI "inpainting" models to analyze the pixels around the text and intelligently reconstruct the original background. This is a highly intensive task performed on powerful servers, not feasible within a browser.</p>
                        </div>
                        <button onClick={() => { setFile(null); setShowExplanation(false); }} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">OK</button>
                    </div>
                )}
            </div>
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-primary:disabled { background-color: #9ca3af; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
