import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { removeWatermark } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';
import { ImageComparisonSlider } from '../ImageComparisonSlider';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="remover-loader mx-auto">
            <svg viewBox="0 0 100 100">
                <defs>
                    <pattern id="checkerboard-loader" patternUnits="userSpaceOnUse" width="10" height="10">
                        <rect width="5" height="5" x="0" y="0" fill="#94a3b8" />
                        <rect width="5" height="5" x="5" y="5" fill="#94a3b8" />
                        <rect width="5" height="5" x="5" y="0" fill="#cbd5e1" />
                        <rect width="5" height="5" x="0" y="5" fill="#cbd5e1" />
                    </pattern>
                    <mask id="wipe-mask">
                        <rect x="0" y="0" width="100" height="100" fill="white" />
                        <rect className="wipe-rect" x="0" y="0" width="100" height="100" fill="black" />
                    </mask>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill="url(#checkerboard-loader)" />
                <g mask="url(#wipe-mask)">
                    <rect x="0" y="0" width="100" height="100" fill="#e2e8f0" />
                    <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#9ca3af" transform="rotate(-20 50 50)">WATERMARK</text>
                </g>
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Removing watermark...</p>
        <style>{`
            .dark .remover-loader rect[fill="#e2e8f0"] { fill: #1e293b; }
            .dark .remover-loader rect[fill="#cbd5e1"] { fill: #475569; }
            .dark .remover-loader rect[fill="#94a3b8"] { fill: #64748b; }
            .dark .remover-loader text { fill: #475569; }
            
            .wipe-rect {
                animation: wipe-animation 2.5s infinite ease-in-out;
            }

            @keyframes wipe-animation {
                0% { transform: translateX(-100%); }
                50%, 100% { transform: translateX(100%); }
            }
        `}</style>
    </div>
);

export const WatermarkRemover: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string } | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcessing = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setProcessedImage(null);

        const reader = new FileReader();
        reader.onload = (e) => setOriginalImage({ file, url: e.target?.result as string });
        reader.readAsDataURL(file);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const generatedImageBase64 = await removeWatermark(base64, mimeType);
            
            if (generatedImageBase64) {
                setProcessedImage(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try a different one.");
            }
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setOriginalImage(null);
        setProcessedImage(null);
        setError(null);
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `watermark-removed.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Watermark Remover</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Clean up images by intelligently removing watermarks with AI.</p>
                </div>

                {!originalImage && !isLoading && (
                    <ImageUploader onImageUpload={handleProcessing} />
                )}
                
                {(isLoading || processedImage) && (
                     <div className="space-y-6">
                        {isLoading ? (
                             <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <Loader />
                             </div>
                        ) : originalImage && processedImage ? (
                            <div className="animate-fade-in space-y-6">
                                <ImageComparisonSlider
                                    beforeImageUrl={originalImage.url}
                                    afterImageUrl={processedImage}
                                />
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button onClick={handleDownload} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                        Download Clean Image
                                    </button>
                                     <button onClick={handleReset} className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
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
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </>
    );
};