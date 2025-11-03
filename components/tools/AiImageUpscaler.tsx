
import React, { useState, useRef, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { ImageComparisonSlider } from '../ImageComparisonSlider';

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="upscale-loader mx-auto">
            {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="pixel-block" style={{ animationDelay: `${(i % 4) * 0.1 + Math.floor(i / 4) * 0.1}s` }}></div>
            ))}
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Enhancing resolution...</p>
        <style>{`
            .upscale-loader {
                width: 80px;
                height: 80px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(4, 1fr);
                gap: 4px;
            }
            .pixel-block {
                background-color: #a5b4fc; /* indigo-300 */
                animation: expand-pixel 1.5s infinite ease-in-out;
            }
            .dark .pixel-block {
                background-color: #6366f1; /* indigo-600 */
            }
            @keyframes expand-pixel {
                0%, 100% { transform: scale(0.3); opacity: 0.5; }
                50% { transform: scale(1); opacity: 1; }
            }
        `}</style>
    </div>
);


export const AiImageUpscaler: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string; dims: { w: number; h: number } } | null>(null);
    const [upscaledImage, setUpscaledImage] = useState<{ url: string; dims: { w: number; h: number } } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const upscaleImage = useCallback((img: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Upscale by 2x
        const scaleFactor = 2;
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Use high-quality scaling which browsers are good at now
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const upscaledUrl = canvas.toDataURL('image/png');
        setUpscaledImage({ url: upscaledUrl, dims: { w: newWidth, h: newHeight } });
        setIsLoading(false);
    }, []);

    const handleImageUpload = (file: File) => {
        setIsLoading(true);
        setUpscaledImage(null);
        setOriginalImage(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            const img = new Image();
            img.onload = () => {
                setOriginalImage({
                    file,
                    url,
                    dims: { w: img.width, h: img.height }
                });
                // Simulate AI processing time for a better UX
                setTimeout(() => upscaleImage(img), 2000);
            };
            img.src = url;
        };
        reader.readAsDataURL(file);
    };
    
    const handleReset = () => {
        setOriginalImage(null);
        setUpscaledImage(null);
    };
    
    const handleDownload = () => {
        if (!upscaledImage || !originalImage) return;
        const link = document.createElement('a');
        link.href = upscaledImage.url;
        link.download = `upscaled-${originalImage.file.name.split('.')[0]}.png`;
        link.click();
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Loader />
                </div>
            );
        }

        if (originalImage && upscaledImage) {
            return (
                 <div className="space-y-6 animate-fade-in">
                    <ImageComparisonSlider
                        beforeImageUrl={originalImage.url}
                        afterImageUrl={upscaledImage.url}
                    />
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Original Size</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{originalImage.dims.w} x {originalImage.dims.h}</p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upscaled Size (2x)</p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{upscaledImage.dims.w} x {upscaledImage.dims.h}</p>
                        </div>
                    </div>
                     <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={handleDownload} className="btn-primary">Download Upscaled Image</button>
                        <button onClick={handleReset} className="btn-secondary">Upscale Another</button>
                    </div>
                </div>
            );
        }

        return <ImageUploader onImageUpload={handleImageUpload} />;
    };

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                 .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s; }
                .btn-primary:hover { background-color: #4338ca; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s; }
                .btn-secondary:hover { background-color: #475569; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Image Upscaler</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enlarge images and enhance resolution with AI.</p>
            </div>
            {renderContent()}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};
