import React, { useState, useRef, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="pixel-loader mx-auto">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="pixel-dot"></div>)}
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Pixelating your image...</p>
    </div>
);

export const PixelArtMaker: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [pixelatedImage, setPixelatedImage] = useState<string | null>(null);
    const [pixelSize, setPixelSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(new Image());

    const handleImageUpload = (file: File) => {
        setOriginalImage(file);
        setPixelatedImage(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                imageRef.current.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    };

    const pixelate = () => {
        if (!originalImage) return;
        setIsLoading(true);
        setPixelatedImage(null);

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

            // Calculate aspect ratio
            const aspectRatio = img.width / img.height;
            let canvasWidth = 500;
            let canvasHeight = 500 / aspectRatio;
            if (canvasHeight > 500) {
                canvasHeight = 500;
                canvasWidth = 500 * aspectRatio;
            }
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // 1. Create a small temporary canvas
            const tempCanvas = document.createElement('canvas');
            const w = canvas.width / pixelSize;
            const h = canvas.height / pixelSize;
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d')!;

            // 2. Draw the image scaled down on the temporary canvas
            tempCtx.drawImage(img, 0, 0, w, h);
            
            // 3. Scale the temporary canvas back up on the main canvas with smoothing disabled
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
            
            setPixelatedImage(canvas.toDataURL('image/png'));
            setIsLoading(false);
        }, 500); // Short delay for loader visibility
    };
    
    useEffect(() => {
        if (originalImage) {
            pixelate();
        }
    }, [pixelSize, originalImage]);


    const handleDownload = () => {
        if (!pixelatedImage) return;
        const link = document.createElement('a');
        link.href = pixelatedImage;
        link.download = `pixel-art-${Date.now()}.png`;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Pixel Art Maker</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert your photos into retro 8-bit style pixel art.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">1. Upload Image</h2>
                        <ImageUploader onImageUpload={handleImageUpload} />
                    </div>
                    {originalImage && (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">2. Adjust Pixel Size</h2>
                             <div className="flex items-center gap-4">
                                <span className="text-sm">Less</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    value={pixelSize}
                                    onChange={e => setPixelSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-sm">More</span>
                             </div>
                             <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Pixel Size: {pixelSize}</p>
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">3. Your Pixel Art</h2>
                    <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? <Loader /> : pixelatedImage ? (
                            <div className="text-center animate-fade-in">
                                <img src={pixelatedImage} alt="Pixelated result" className="max-w-full h-auto rounded-md shadow-md" style={{ imageRendering: 'pixelated' }} />
                                <button onClick={handleDownload} className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                    Download
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 dark:text-slate-400">
                                <p>Upload an image to get started!</p>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .pixel-loader {
                    width: 60px;
                    height: 60px;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 5px;
                }
                .pixel-dot {
                    width: 100%;
                    height: 100%;
                    background-color: #a5b4fc;
                    border-radius: 3px;
                    animation: fill-pixel 1.5s infinite;
                }
                .dark .pixel-dot { background-color: #6366f1; }

                .pixel-dot:nth-child(1) { animation-delay: 0.1s; }
                .pixel-dot:nth-child(2) { animation-delay: 0.4s; }
                .pixel-dot:nth-child(3) { animation-delay: 0.2s; }
                .pixel-dot:nth-child(4) { animation-delay: 0.5s; }
                .pixel-dot:nth-child(5) { animation-delay: 0.3s; }
                .pixel-dot:nth-child(6) { animation-delay: 0.6s; }
                .pixel-dot:nth-child(7) { animation-delay: 0.4s; }
                .pixel-dot:nth-child(8) { animation-delay: 0.1s; }
                .pixel-dot:nth-child(9) { animation-delay: 0.5s; }

                @keyframes fill-pixel {
                    0%, 100% {
                        transform: scale(0.5);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};
