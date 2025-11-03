
import React, { useState, useCallback } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="metadata-loader mx-auto">
            <div className="tag">Title: ...</div>
            <div className="tag">Artist: ...</div>
            <div className="tag">Album: ...</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Processing metadata...</p>
        <style>{`
            .metadata-loader { width: 150px; height: 100px; position: relative; }
            .tag {
                position: absolute;
                left: 0;
                width: 100%;
                padding: 4px;
                background: #e2e8f0; dark:bg-slate-700;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                opacity: 0;
                animation: slide-in-tag 2s infinite;
            }
            .tag:nth-child(1) { top: 0; animation-delay: 0s; }
            .tag:nth-child(2) { top: 35px; animation-delay: 0.3s; }
            .tag:nth-child(3) { top: 70px; animation-delay: 0.6s; }
            @keyframes slide-in-tag {
                0% { transform: translateX(-100%); opacity: 0; }
                20%, 80% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
        `}</style>
    </div>
);

export const VideoMetadataEditor: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({ title: '', artist: '', album: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setShowExplanation(false);
        // In a real scenario with a library like `jsmediatags`, you would read the tags here.
        // For this demo, we'll just pre-fill the name.
        setMetadata({ title: selectedFile.name.split('.')[0], artist: '', album: '' });
    };

    const handleSaveAttempt = () => {
        setIsLoading(true);
        setShowExplanation(false);
        setTimeout(() => {
            setIsLoading(false);
            setShowExplanation(true);
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Edit the metadata of your video files (Simulated).</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>}
                {!isLoading && !showExplanation && (
                    <div className="space-y-4">
                        {!file ? (
                            <FileUploader onFileSelected={handleFileSelect} acceptedTypes="video/mp4,video/webm" label="Upload Video File (MP4, WebM)" />
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <p className="font-semibold">Editing: {file.name}</p>
                                <input value={metadata.title} onChange={e => setMetadata({...metadata, title: e.target.value})} placeholder="Title" className="input-style w-full"/>
                                <input value={metadata.artist} onChange={e => setMetadata({...metadata, artist: e.target.value})} placeholder="Artist / Author" className="input-style w-full"/>
                                <input value={metadata.album} onChange={e => setMetadata({...metadata, album: e.target.value})} placeholder="Album / Series" className="input-style w-full"/>
                                <button onClick={handleSaveAttempt} className="w-full btn-primary text-lg">Save Metadata</button>
                            </div>
                        )}
                    </div>
                )}
                {showExplanation && (
                    <div className="p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
                        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical Limitation</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                            <p>While reading some video metadata is possible in a browser, writing or editing it requires re-writing the entire file container (a process called "muxing").</p>
                            <p>This is a complex operation that usually requires specialized server-side tools like FFmpeg. It is not a feature that can be reliably performed directly in a web browser, especially for large video files.</p>
                        </div>
                        <button onClick={() => { setFile(null); setShowExplanation(false); }} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">OK</button>
                    </div>
                )}
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
