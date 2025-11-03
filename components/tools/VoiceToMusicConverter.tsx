
import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="voice-music-loader mx-auto">
            <div className="waveform"></div>
            <div className="note n1">♪</div>
            <div className="note n2">♫</div>
            <div className="note n3">🎶</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating AI cover...</p>
        <style>{`
            .voice-music-loader { width: 120px; height: 100px; position: relative; }
            .waveform {
                width: 100%; height: 4px;
                background: #6366f1;
                position: absolute; top: 50%;
                transform: translateY(-50%);
                border-radius: 2px;
                animation: wave-flatten 3s infinite ease-in-out;
            }
            .dark .waveform { background: #818cf8; }
            .note {
                position: absolute;
                font-size: 30px;
                color: #6366f1;
                opacity: 0;
                animation: float-note 3s infinite ease-out;
            }
            .dark .note { color: #818cf8; }
            .n1 { top: 40%; left: 10%; animation-delay: 0.5s; }
            .n2 { top: 10%; left: 40%; animation-delay: 1s; }
            .n3 { top: 50%; left: 70%; animation-delay: 1.5s; }
            @keyframes wave-flatten {
                0%, 100% { transform: translateY(-50%) scaleY(10); }
                50% { transform: translateY(-50%) scaleY(1); }
            }
            @keyframes float-note {
                0%, 40% { opacity: 0; transform: translateY(0); }
                70% { opacity: 1; transform: translateY(-30px); }
                100% { opacity: 0; transform: translateY(-40px); }
            }
        `}</style>
    </div>
);

export const VoiceToMusicConverter: React.FC<{ title: string }> = ({ title }) => {
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
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload your voice recording to create an AI song cover.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>}
                {!isLoading && !showExplanation && (
                    <div className="space-y-4">
                        <FileUploader onFileSelected={setFile} acceptedTypes="audio/*" label="Upload Your Voice Recording" />
                        <button onClick={handleAttempt} disabled={!file} className="w-full btn-primary text-lg">
                            Generate AI Cover
                        </button>
                    </div>
                )}
                {showExplanation && (
                    <div className="p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
                        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical Limitation</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                            <p>Creating AI song covers involves multiple complex AI processes like voice cloning, pitch analysis, and music generation.</p>
                            <p>These tasks require massive computational resources and highly specialized models, which are exclusively performed on dedicated servers, not within a web browser.</p>
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
