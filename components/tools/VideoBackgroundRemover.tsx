
import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="bg-remover-loader mx-auto">
            <div className="page"></div>
            <div className="wiper"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing video frames...</p>
        <style>{`
            .bg-remover-loader { width: 100px; height: 120px; position: relative; border: 2px solid #9ca3af; border-radius: 4px; overflow: hidden; background: linear-gradient(45deg, #a5b4fc, #f472b6); }
            .dark .bg-remover-loader { border-color: #475569; }
            .wiper {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: repeating-conic-gradient(#cbd5e1 0 25%, transparent 0 50%) 50% / 20px 20px;
                animation: wipe-bg 2.5s forwards;
            }
            .dark .wiper { background: repeating-conic-gradient(#334155 0 25%, transparent 0 50%) 50% / 20px 20px; }
            @keyframes wipe-bg {
                from { clip-path: inset(0 100% 0 0); }
                to { clip-path: inset(0 0 0 0); }
            }
        `}</style>
    </div>
);

export const VideoBackgroundRemover: React.FC<{ title: string }> = ({ title }) => {
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
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Simulates removing the background from video footage.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>}
                {!isLoading && !showExplanation && (
                    <div className="space-y-4">
                        <FileUploader onFileSelected={setFile} acceptedTypes="video/*" label="Upload Video File" />
                        <button onClick={handleAttempt} disabled={!file} className="w-full btn-primary text-lg">
                            Remove Background
                        </button>
                    </div>
                )}
                {showExplanation && (
                    <div className="p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
                        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical Limitation</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                            <p>Video background removal is a highly complex task that requires immense processing power, typically done on powerful servers with advanced AI models (like chroma keying without a green screen).</p>
                            <p>Performing this in real-time or even quickly in a browser is not feasible with current web technologies, as it would be extremely slow and likely crash the browser.</p>
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
