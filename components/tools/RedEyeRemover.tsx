import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="red-eye-loader mx-auto">
            <div className="eye-bg">
                <div className="pupil"></div>
            </div>
            <div className="scan-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Scanning for red eyes...</p>
        <style>{`
            .red-eye-loader {
                width: 100px;
                height: 60px;
                position: relative;
            }
            .eye-bg {
                width: 100%;
                height: 100%;
                background-color: #f1f5f9; /* slate-100 */
                border: 3px solid #64748b; /* slate-500 */
                border-radius: 50% / 80%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .dark .eye-bg {
                background-color: #334155; /* slate-700 */
                border-color: #94a3b8; /* slate-400 */
            }
            .pupil {
                width: 25px;
                height: 25px;
                background-color: #ef4444; /* red-500 */
                border-radius: 50%;
                animation: fix-red-eye 2.5s infinite ease-in-out;
            }
            .scan-line {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 3px;
                background: #ef4444;
                box-shadow: 0 0 8px #ef4444;
                animation: scan-eye 2.5s infinite linear;
            }

            @keyframes fix-red-eye {
                0%, 40% { background-color: #ef4444; } /* red-500 */
                60%, 100% { background-color: #1e293b; } /* slate-800 */
            }
            @keyframes scan-eye {
                from { left: 0; }
                to { left: 100%; }
            }
        `}</style>
    </div>
);

export const RedEyeRemover: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const removeRedEye = useCallback(() => {
        if (!originalFile || !imageRef.current.src) return;
        setIsLoading(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const img = imageRef.current;
            if (!canvas) { setIsLoading(false); return; }
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) { setIsLoading(false); return; }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // --- SIMULATED RED EYE REMOVAL ---
            // This is a simplified simulation and not a real CV algorithm.
            // It scans for pixels that are "very red" and darkens/desaturates them.
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Check for a strong red component and weaker green/blue
                if (r > 150 && g < 80 && b < 80) {
                    const avg = (r + g + b) / 3;
                    data[i] = avg * 0.5; // Darken
                    data[i + 1] = avg * 0.5;
                    data[i + 2] = avg * 0.5;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            setProcessedImage(canvas.toDataURL());
            setIsLoading(false);
        }, 2500); // Simulate processing time for animation
    }, [originalFile]);

    const handleImageUpload = (file: File) => {
        setOriginalFile(file);
        setProcessedImage(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                imageRef.current.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    };

     useEffect(() => {
        if (originalFile) {
            imageRef.current.onload = removeRedEye;
        }
    }, [originalFile, removeRedEye]);


    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `redeye-fixed-${originalFile?.name || 'image'}.png`;
        link.click();
    };

    const handleReset = () => {
        setOriginalFile(null);
        setProcessedImage(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Red Eye Remover</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Automatically detect and fix red eyes in photos.</p>
            </div>

            {!originalFile && !isLoading ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                     {isLoading ? (
                        <div className="min-h-[300px] flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : processedImage ? (
                        <div className="animate-fade-in text-center space-y-6">
                             <img src={processedImage} alt="Processed with red eye removal" className="max-w-full h-auto rounded-md shadow-md mx-auto" />
                             <div className="flex flex-wrap justify-center gap-4">
                                <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">
                                    Download Fixed Photo
                                </button>
                                <button onClick={handleReset} className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md">
                                    Try Another
                                </button>
                            </div>
                        </div>
                    ) : null}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )}
        </div>
    );
};
