import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { cartoonifyImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

// Loader can be copied from CartoonFaceGenerator
const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="pencil-loader" width="120" height="120" viewBox="0 0 120 120">
            <g className="pencil-group">
                <path className="pencil-body" d="M90,20 L110,40 L60,90 L40,70 Z" />
                <path className="pencil-tip" d="M40,70 L50,80 L60,90 Z" />
            </g>
            <g className="sketch-lines">
                <path className="sketch-line" d="M20,60 Q40,40 60,60 T100,60" />
                <path className="sketch-line" d="M30,80 Q60,100 90,80" />
            </g>
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Cartoonifying your photo... 🎨</p>
    </div>
);

export const CartoonifyTool: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [cartoonImageUrl, setCartoonImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setOriginalFile(file);
        setCartoonImageUrl(null);
        setError(null);
        setIsLoading(true);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const generatedImageBase64 = await cartoonifyImage(base64, mimeType); // Use new function
            if (generatedImageBase64) {
                setCartoonImageUrl(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI failed to generate a cartoon. Please try another image.");
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
        setCartoonImageUrl(null);
        setError(null);
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!cartoonImageUrl) return;
        const link = document.createElement('a');
        link.href = cartoonImageUrl;
        link.download = `cartoon-${Date.now()}.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Cartoonify Tool</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Turn your photos into cartoon-like images.</p>
                </div>

                {!originalFile && !isLoading ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : cartoonImageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <img src={cartoonImageUrl} alt="Generated cartoon" className="rounded-lg shadow-lg mx-auto max-w-full h-auto max-h-[70vh]" />
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">
                                        Download Cartoon
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

                .pencil-loader { stroke: #6366f1; } .dark .pencil-loader { stroke: #818cf8; }
                .pencil-body { fill: #a5b4fc; } .dark .pencil-body { fill: #4f46e5; }
                .pencil-tip { fill: #334155; } .dark .pencil-tip { fill: #cbd5e1; }

                .sketch-line {
                    stroke-width: 3;
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    fill: none;
                    animation: draw-sketch 2.5s infinite;
                }
                .sketch-line:nth-child(2) { animation-delay: 0.5s; }

                .pencil-group {
                    animation: move-pencil 2.5s infinite;
                }

                @keyframes draw-sketch {
                    to { stroke-dashoffset: 0; }
                }

                @keyframes move-pencil {
                    0%, 100% { transform: translate(0, 10px) rotate(-30deg); }
                    50% { transform: translate(80px, 80px) rotate(-30deg); }
                }
            `}</style>
        </>
    );
};