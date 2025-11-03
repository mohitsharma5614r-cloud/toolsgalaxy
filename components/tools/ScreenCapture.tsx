
import React, { useState, useRef, useCallback } from 'react';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="capture-loader mx-auto">
            <div className="shutter"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Preparing capture...</p>
        <style>{`
            .capture-loader {
                width: 100px; height: 100px;
                position: relative;
                border: 6px solid #6366f1;
                border-radius: 50%;
            }
            .dark .capture-loader { border-color: #818cf8; }
            .shutter {
                width: 100%; height: 100%;
                border-radius: 50%;
                background: #4f46e5;
                transform: scale(0);
                animation: shutter-snap 1.5s infinite cubic-bezier(0.76, 0, 0.24, 1);
            }
            .dark .shutter { background: #a5b4fc; }
            @keyframes shutter-snap {
                0%, 100% { transform: scale(0); }
                50% { transform: scale(1); }
                51%, 99% { opacity: 1; }
                100% { opacity: 0; }
            }
        `}</style>
    </div>
);

export const ScreenCapture: React.FC<{ title: string }> = ({ title }) => {
    const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const handleCapture = async () => {
        setIsLoading(true);
        setError(null);
        setScreenshotUrl(null);
        stopStream();

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" } as any,
                audio: false,
            });
            streamRef.current = stream;

            // When user stops sharing, the 'ended' event fires
            // FIX: Replaced non-standard 'oninactive' with standard 'onended'
            stream.getVideoTracks()[0].onended = () => {
                 stopStream();
                 setIsLoading(false);
            };
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
                // We need a short delay to ensure the first frame is rendered
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        setScreenshotUrl(canvas.toDataURL('image/png'));
                    } else {
                        setError("Could not create canvas context.");
                    }
                    stopStream();
                    setIsLoading(false);
                }, 300); // A small delay to render the frame
            };
        } catch (err) {
            console.error("Error capturing screen:", err);
            setError("Could not capture screen. You may have denied permission.");
            setIsLoading(false);
            stopStream();
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Take a high-resolution screenshot of your screen or a specific window.</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center space-y-6">
                    {isLoading ? (
                        <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                    ) : screenshotUrl ? (
                        <div className="animate-fade-in space-y-4">
                             <h2 className="text-2xl font-bold">Screenshot Captured!</h2>
                            <img src={screenshotUrl} alt="Screen capture" className="max-w-full h-auto rounded-lg shadow-md mx-auto border-2 border-slate-200 dark:border-slate-700" />
                            <div className="flex gap-4 justify-center">
                                <a href={screenshotUrl} download="screenshot.png" className="btn-primary">Download PNG</a>
                                <button onClick={() => setScreenshotUrl(null)} className="btn-secondary">Capture Another</button>
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center min-h-[250px] space-y-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <button onClick={handleCapture} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg text-lg">
                                Take Screenshot
                            </button>
                             <p className="text-xs text-slate-400 max-w-sm mx-auto">Your browser will ask you to select a screen, window, or tab to share. The image is generated locally and never uploaded.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};