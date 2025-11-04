
import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { generateFutureFace } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="hud-scanner-loader mx-auto">
            <div className="face-silhouette"></div>
            <div className="scan-line"></div>
            <div className="grid-line h1"></div>
            <div className="grid-line h2"></div>
            <div className="grid-line v1"></div>
            <div className="grid-line v2"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Scanning biometrics...</p>
    </div>
);

export const FutureFaceGenerator: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [futureImageUrl, setFutureImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setOriginalFile(file);
        setFutureImageUrl(null);
        setError(null);
        setIsLoading(true);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const generatedImageBase64 = await generateFutureFace(base64, mimeType);
            if (generatedImageBase64) {
                setFutureImageUrl(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI failed to generate a futuristic image. Please try another photo.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setOriginalFile(null); // Reset on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReset = () => {
        setOriginalFile(null);
        setFutureImageUrl(null);
        setError(null);
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!futureImageUrl) return;
        const link = document.createElement('a');
        link.href = futureImageUrl;
        link.download = `future-face-${Date.now()}.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Future Face Generator 🔮</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A fun generator to predict your future look in a cyberpunk world.</p>
                </div>

                {!originalFile && !isLoading ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : futureImageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <img src={futureImageUrl} alt="Generated future face" className="rounded-lg shadow-lg mx-auto max-w-full h-auto max-h-[70vh]" />
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">
                                        Download Image
                                    </button>
                                    <button onClick={handleReset} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">
                                        Try Another
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .hud-scanner-loader {
                    width: 120px;
                    height: 120px;
                    position: relative;
                    border: 2px solid #4f46e5;
                    border-radius: 50%;
                }
                .face-silhouette {
                    width: 60px;
                    height: 80px;
                    border: 2px solid #818cf8;
                    border-radius: 50% 50% 20px 20px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                .face-silhouette::before {
                    content: '';
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border: 2px solid #818cf8;
                    border-radius: 50%;
                    top: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: #c7d2fe;
                    box-shadow: 0 0 5px #c7d2fe;
                    animation: scan 2s infinite ease-in-out;
                }
                .grid-line {
                    position: absolute;
                    background: rgba(129, 140, 248, 0.3);
                    box-shadow: 0 0 3px rgba(129, 140, 248, 0.5);
                    animation: flicker 2s infinite;
                }
                .grid-line.h1 { top: 25%; left: 0; width: 100%; height: 1px; }
                .grid-line.h2 { top: 75%; left: 0; width: 100%; height: 1px; animation-delay: 0.5s; }
                .grid-line.v1 { left: 25%; top: 0; height: 100%; width: 1px; animation-delay: 0.2s; }
                .grid-line.v2 { left: 75%; top: 0; height: 100%; width: 1px; animation-delay: 0.7s; }

                @keyframes scan {
                    0%, 100% { top: 5%; }
                    50% { top: 95%; }
                }
                @keyframes flicker {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

            `}</style>
        </>
    );
};
