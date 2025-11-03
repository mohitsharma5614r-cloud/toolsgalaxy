import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Loader component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="compress-loader mx-auto">
            <div className="arrow top-arrow">→</div>
            <div className="arrow left-arrow">↓</div>
            <div className="file-icon">📄</div>
            <div className="arrow right-arrow">↑</div>
            <div className="arrow bottom-arrow">←</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Compressing image...</p>
    </div>
);

export const ImageCompressor: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(0.7);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const handleImageUpload = (file: File) => {
        setOriginalFile(file);
        setOriginalSize(file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                imageRef.current.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    };

    const compressImage = useCallback(() => {
        if (!originalFile) return;
        setIsLoading(true);

        // Use a short timeout to ensure the loader is visible
        setTimeout(() => {
            const canvas = canvasRef.current;
            const img = imageRef.current;
            if (!canvas || !img.src) {
                setIsLoading(false);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsLoading(false);
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const compressedDataUrl = canvas.toDataURL(originalFile.type, quality);
            setCompressedImage(compressedDataUrl);

            // Calculate compressed size from base64 string
            const base64 = compressedDataUrl.split(',')[1];
            const byteLength = (base64.length * 3 / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
            setCompressedSize(byteLength);
            setIsLoading(false);
        }, 300);
    }, [originalFile, quality]);

    useEffect(() => {
        // Trigger compression when image or quality changes
        if (imageRef.current.src) {
            imageRef.current.onload = () => {
                compressImage();
            };
        }
    }, [compressImage, originalFile, quality]);

    const handleDownload = () => {
        if (!compressedImage) return;
        const link = document.createElement('a');
        link.href = compressedImage;
        const extension = originalFile?.type.split('/')[1] || 'jpg';
        link.download = `compressed-${Date.now()}.${extension}`;
        link.click();
    };
    
    const savings = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Image Compressor</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Reduce image file size while balancing quality.</p>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">1. Upload Image</h2>
                        <ImageUploader onImageUpload={handleImageUpload} />
                    </div>
                    {originalFile && (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">2. Adjust Quality</h2>
                             <div className="flex items-center gap-4">
                                <span className="text-sm">Low</span>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={quality}
                                    onChange={e => setQuality(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-sm">High</span>
                             </div>
                             <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Quality: {Math.round(quality * 100)}%</p>
                        </div>
                    )}
                </div>

                <div>
                     <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">3. Compressed Result</h2>
                    <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? <Loader /> : compressedImage ? (
                            <div className="text-center animate-fade-in w-full">
                                <img src={compressedImage} alt="Compressed result" className="max-w-full h-auto max-h-[50vh] rounded-md shadow-md mx-auto" />
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Original</div>
                                        <div className="text-lg font-semibold">{formatBytes(originalSize)}</div>
                                    </div>
                                    <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Compressed</div>
                                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(compressedSize)}</div>
                                    </div>
                                     <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Savings</div>
                                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{savings.toFixed(1)}%</div>
                                    </div>
                                </div>
                                <button onClick={handleDownload} className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                    Download Image
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 dark:text-slate-400">
                                <p>Upload an image to start compressing!</p>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                </div>
            </div>
            <style>{`
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .compress-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .file-icon {
                    font-size: 50px;
                    animation: squeeze 2s infinite ease-in-out;
                }
                .arrow {
                    position: absolute;
                    font-size: 24px;
                    color: #6366f1; /* indigo-500 */
                    animation: push 2s infinite ease-in-out;
                }
                .dark .arrow { color: #818cf8; }
                .top-arrow { top: 0; transform: rotate(90deg); }
                .left-arrow { left: 0; }
                .right-arrow { right: 0; }
                .bottom-arrow { bottom: 0; transform: rotate(90deg); }

                @keyframes squeeze {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(0.8); }
                }
                @keyframes push {
                    0%, 100% { transform: scale(1) rotate(var(--rot, 0deg)); opacity: 0; }
                    25% { transform: scale(1.2) rotate(var(--rot, 0deg)); opacity: 1; }
                    50% { transform: scale(1) rotate(var(--rot, 0deg)); opacity: 0; }
                }
                .top-arrow { --rot: 90deg; animation-name: push-y; }
                .left-arrow { --rot: 0deg; animation-name: push-x; }
                .right-arrow { --rot: 180deg; animation-name: push-x-rev; }
                .bottom-arrow { --rot: -90deg; animation-name: push-y-rev; }
                
                @keyframes push-y {
                    0%, 100% { top: 0; opacity: 0; } 25% { top: 15px; opacity: 1; } 50%, 100% { top: 25px; opacity: 0; }
                }
                @keyframes push-x {
                    0%, 100% { left: 0; opacity: 0; } 25% { left: 15px; opacity: 1; } 50%, 100% { left: 25px; opacity: 0; }
                }
                @keyframes push-x-rev {
                    0%, 100% { right: 0; opacity: 0; } 25% { right: 15px; opacity: 1; } 50%, 100% { right: 25px; opacity: 0; }
                }
                @keyframes push-y-rev {
                    0%, 100% { bottom: 0; opacity: 0; } 25% { bottom: 15px; opacity: 1; } 50%, 100% { bottom: 25px; opacity: 0; }
                }
            `}</style>
        </div>
    );
};