import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { removeImageBackground } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="remover-loader mx-auto">
            <svg viewBox="0 0 100 100">
                <defs>
                    <pattern id="checkerboard" patternUnits="userSpaceOnUse" width="20" height="20">
                        <rect width="10" height="10" x="0" y="0" fill="#cbd5e1" />
                        <rect width="10" height="10" x="10" y="10" fill="#cbd5e1" />
                    </pattern>
                    <clipPath id="wipe-clip">
                        <rect className="wipe-rect" x="-100" y="0" width="100" height="100" />
                    </clipPath>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill="#e2e8f0" />
                <rect x="0" y="0" width="100" height="100" fill="url(#checkerboard)" clipPath="url(#wipe-clip)" />
                <path d="M50,25 C40,25 35,35 35,45 C35,60 50,75 50,75 C50,75 65,60 65,45 C65,35 60,25 50,25 Z" fill="#94a3b8" />
                <circle cx="50" cy="32" r="8" fill="#94a3b8" />
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Removing background...</p>
    </div>
);


export const BackgroundRemover: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRemoveBackground = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const generatedImageBase64 = await removeImageBackground(base64, mimeType);
            
            if (generatedImageBase64) {
                setResultImage(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try a different one.");
            }
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleImageUpload = (file: File) => {
        setOriginalImage(file);
        handleRemoveBackground(file);
    };
    
    const handleReset = () => {
        setOriginalImage(null);
        setResultImage(null);
        setError(null);
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'background-removed.png';
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Background Remover</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Automatically erase the background from any image with one click.</p>
                </div>

                {!resultImage && !isLoading && (
                    <ImageUploader onImageUpload={handleImageUpload} />
                )}
                
                {(isLoading || resultImage) && (
                     <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? <Loader /> : resultImage ? (
                            <div className="text-center animate-fade-in">
                                <div className="checkerboard-bg p-4 inline-block rounded-md">
                                    <img src={resultImage} alt="Result with background removed" className="max-w-full h-auto max-h-[60vh] rounded-md shadow-lg" />
                                </div>
                                 <div className="mt-6 flex flex-wrap justify-center gap-4">
                                    <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                        Download PNG
                                    </button>
                                     <button onClick={handleReset} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                        Remove Another
                                    </button>
                                 </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .checkerboard-bg {
                    background-image:
                        linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                }
                .dark .checkerboard-bg {
                     background-image:
                        linear-gradient(45deg, #334155 25%, transparent 25%),
                        linear-gradient(-45deg, #334155 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #334155 75%),
                        linear-gradient(-45deg, transparent 75%, #334155 75%);
                }
                
                .remover-loader svg {
                    width: 100px;
                    height: 100px;
                }
                .dark .remover-loader rect[fill="#e2e8f0"] { fill: #1e293b; }
                .dark .remover-loader rect[fill="#cbd5e1"] { fill: #475569; }
                .dark .remover-loader path, .dark .remover-loader circle { fill: #64748b; }
                
                .wipe-rect {
                    animation: wipe-animation 2.5s infinite ease-in-out;
                }

                @keyframes wipe-animation {
                    0% {
                        transform: translateX(-100%);
                    }
                    50%, 100% {
                        transform: translateX(100%);
                    }
                }

            `}</style>
        </>
    );
};
