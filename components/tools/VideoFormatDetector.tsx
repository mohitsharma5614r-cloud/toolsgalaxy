
import React, { useState, useCallback } from 'react';
import { FileUploader } from '../FileUploader';
import { Toast } from '../Toast';

interface VideoInfo {
    name: string;
    type: string;
    size: string;
    duration: string;
    width: number;
    height: number;
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export const VideoFormatDetector: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        setVideoInfo(null);
        setError(null);
        try {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                setVideoInfo({
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: formatBytes(selectedFile.size),
                    duration: formatDuration(video.duration),
                    width: video.videoWidth,
                    height: video.videoHeight,
                });
            };
            video.onerror = () => {
                setError("Could not read video metadata. The file may be corrupted.");
            };
            video.src = URL.createObjectURL(selectedFile);
        } catch (e) {
            setError("An error occurred while processing the file.");
        }
    }, []);
    
    const handleReset = () => {
        setFile(null);
        setVideoInfo(null);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Identify the format, resolution, and codecs of a video file.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? (
                    <FileUploader onFileSelected={handleFileSelect} acceptedTypes="video/*" label="Upload a Video File" />
                ) : videoInfo ? (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-bold text-center">Video Properties</h2>
                        <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-2">
                            <div className="info-row"><span className="info-label">File Name:</span> <span className="info-value truncate">{videoInfo.name}</span></div>
                            <div className="info-row"><span className="info-label">File Type:</span> <span className="info-value">{videoInfo.type}</span></div>
                            <div className="info-row"><span className="info-label">Size:</span> <span className="info-value">{videoInfo.size}</span></div>
                            <div className="info-row"><span className="info-label">Duration:</span> <span className="info-value">{videoInfo.duration}</span></div>
                            <div className="info-row"><span className="info-label">Resolution:</span> <span className="info-value">{videoInfo.width} x {videoInfo.height}</span></div>
                        </div>
                        <button onClick={handleReset} className="w-full btn-primary">Check Another Video</button>
                    </div>
                ) : (
                     <div className="min-h-[250px] flex items-center justify-center">
                        <p>Processing...</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .info-row { display: flex; justify-content: space-between; font-size: 0.875rem; }
                .info-label { font-weight: 600; color: #64748b; }
                .dark .info-label { color: #94a3b8; }
                .info-value { font-family: monospace; }
            `}</style>
        </div>
    );
};
