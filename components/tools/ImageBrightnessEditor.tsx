import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="brightness-loader mx-auto">
            <div className="sun"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Applying brightness...</p>
        <style>{`
            .brightness-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .sun {
                width: 40px;
                height: 40px;
                background-color: #f59e0b; /* amber-500 */
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: sun-pulse 2s infinite ease-in-out;
            }
            .sun::before, .sun::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid #f59e0b;
                border-radius: 50%;
                opacity: 0;
                animation: sun-ray 2s infinite ease-in-out;
            }
            .sun::after {
                animation-delay: 1s;
            }
            @keyframes sun-pulse {
                0%, 100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 10px #f59e0b; }
                50% { transform: translate(-50%,-50%) scale(1.1); box-shadow: 0 0 20px #fde047; }
            }
            @keyframes sun-ray {
                0% { width: 40px; height: 40px; opacity: 1; }
                100% { width: 80px; height: 80px; opacity: 0; }
            }
        `}</style>
    </div>
);

export const ImageBrightnessEditor: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100); // Percentage
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const handleImageUpload = (file: File) => {
        setOriginalFile(file);
        setProcessedImage(null);
        setBrightness(100);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                imageRef.current.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    };

    const applyFilter = useCallback(() => {
        if (!originalFile || !imageRef.current.src) return;
        setIsLoading(true);

        // Debounce or use a small timeout to avoid lagging on slider drag
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

            ctx.filter = `brightness(${brightness}%)`;
            ctx.drawImage(img, 0, 0);

            setProcessedImage(canvas.toDataURL());
            setIsLoading(false);
        }, 50);
    }, [originalFile, brightness]);

    useEffect(() => {
        if (originalFile) {
            imageRef.current.onload = applyFilter;
        }
    }, [originalFile, applyFilter]);
    
    useEffect(() => {
        if(originalFile) {
            applyFilter();
        }
    }, [brightness, originalFile, applyFilter]);


    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `brightness-${originalFile?.name || 'image'}.png`;
        link.click();
    };

    const handleReset = () => {
        setOriginalFile(null);
        setProcessedImage(null);
        setBrightness(100);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Image Brightness Editor</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Adjust the brightness of your images with a simple slider.</p>
            </div>

            {!originalFile ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Adjust Brightness</h2>
                             <div className="flex items-center gap-4">
                                <span className="text-lg">☀️</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={brightness}
                                    onChange={e => setBrightness(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-2xl">☀️</span>
                             </div>
                             <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Brightness: {brightness}%</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleDownload} className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">
                                Download
                            </button>
                             <button onClick={handleReset} className="w-full px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md">
                                Change Image
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="min-h-[300px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            {isLoading ? <Loader /> : processedImage ? (
                                <img src={processedImage} alt="Processed with brightness adjusted" className="max-w-full h-auto rounded-md shadow-md" />
                            ) : null}
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
