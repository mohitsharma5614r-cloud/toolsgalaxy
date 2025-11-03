import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="converter-loader mx-auto">
            <div className="icon-text t-png">PNG</div>
            <div className="icon-text t-jpg">JPG</div>
            <div className="icon-text t-webp">WEBP</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Converting image...</p>
    </div>
);

type TargetFormat = 'png' | 'jpeg' | 'webp';

export const ConvertImage: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [convertedImage, setConvertedImage] = useState<{ url: string; size: number; format: string; } | null>(null);
    const [targetFormat, setTargetFormat] = useState<TargetFormat>('png');
    const [jpgQuality, setJpgQuality] = useState(0.8);
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const handleImageUpload = (file: File) => {
        setOriginalFile(file);
        setConvertedImage(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            imageRef.current.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const convertImage = useCallback(() => {
        if (!originalFile || !imageRef.current.src) return;
        setIsLoading(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const img = imageRef.current;
            if (!canvas) {
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
            
            // For formats that don't support transparency, draw a white background first
            if (targetFormat === 'jpeg') {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);

            const mimeType = `image/${targetFormat}`;
            const dataUrl = canvas.toDataURL(mimeType, targetFormat === 'jpeg' ? jpgQuality : undefined);
            
            const base64 = dataUrl.split(',')[1];
            const byteLength = (base64.length * 3 / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);

            setConvertedImage({ url: dataUrl, size: byteLength, format: targetFormat.toUpperCase() });
            setIsLoading(false);
        }, 300);
    }, [originalFile, targetFormat, jpgQuality]);

    useEffect(() => {
        if (originalFile) {
            imageRef.current.onload = convertImage;
        }
    }, [originalFile, convertImage]);

    useEffect(() => {
        if (originalFile) {
            convertImage();
        }
    }, [targetFormat, jpgQuality, originalFile, convertImage]);

    const handleDownload = () => {
        if (!convertedImage) return;
        const link = document.createElement('a');
        link.href = convertedImage.url;
        link.download = `converted-${Date.now()}.${convertedImage.format.toLowerCase()}`;
        link.click();
    };

    const handleReset = () => {
        setOriginalFile(null);
        setConvertedImage(null);
    };

    const savings = originalFile && convertedImage ? ((originalFile.size - convertedImage.size) / originalFile.size) * 100 : 0;
    
    return (
        <div className="max-w-7xl mx-auto">
            <style>{`
                /* Loader Animation */
                .converter-loader { width: 100px; height: 100px; position: relative; border-radius: 50%; border: 4px solid #a5b4fc; }
                .dark .converter-loader { border-color: #4f46e5; }
                .icon-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; font-weight: bold; color: #4f46e5; opacity: 0; animation: format-cycle 4.5s infinite ease-in-out; }
                .dark .icon-text { color: #a5b4fc; }
                .icon-text.t-jpg { animation-delay: 1.5s; }
                .icon-text.t-webp { animation-delay: 3s; }
                @keyframes format-cycle {
                    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    15%, 33% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    48%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                }

                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>

            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Image Converter</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert your images to PNG, JPG, or WebP with ease.</p>
            </div>

            {!originalFile ? (
                <div className="max-w-2xl mx-auto">
                     <ImageUploader onImageUpload={handleImageUpload} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">1. Choose Format</h2>
                            <div className="flex gap-2">
                                {(['png', 'jpeg', 'webp'] as TargetFormat[]).map(format => (
                                    <button
                                        key={format}
                                        onClick={() => setTargetFormat(format)}
                                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${targetFormat === format ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}
                                    >
                                        {format.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            {targetFormat === 'jpeg' && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">JPG Quality: {Math.round(jpgQuality * 100)}%</label>
                                    <input type="range" min="0.1" max="1" step="0.05" value={jpgQuality} onChange={e => setJpgQuality(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">2. Download</h2>
                              <div className="flex flex-col gap-4">
                                <button onClick={handleDownload} disabled={isLoading || !convertedImage} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400">
                                    Download Image
                                </button>
                                <button onClick={handleReset} className="w-full px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md">
                                    Convert Another
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Result */}
                    <div>
                         <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Result</h2>
                         <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            {isLoading ? <Loader /> : convertedImage ? (
                                <div className="text-center animate-fade-in w-full">
                                    <img src={convertedImage.url} alt="Converted result" className="max-w-full h-auto max-h-[40vh] rounded-md shadow-md mx-auto" />
                                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                                        <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                                            <div className="font-bold text-slate-500 dark:text-slate-400">Original</div>
                                            <div className="font-semibold">{formatBytes(originalFile.size)}</div>
                                        </div>
                                        <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                                            <div className="font-bold text-slate-500 dark:text-slate-400">Converted</div>
                                            <div className="font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(convertedImage.size)}</div>
                                        </div>
                                         <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700">
                                            <div className="font-bold text-slate-500 dark:text-slate-400">Savings</div>
                                            <div className={`font-semibold ${savings > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{savings.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                         </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};
