import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="contrast-loader mx-auto">
            <div className="half left"></div>
            <div className="half right"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Adjusting contrast...</p>
        <style>{`
            .contrast-loader {
                width: 80px;
                height: 80px;
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                animation: spin-loader 2s infinite linear;
            }
            .half {
                position: absolute;
                width: 50%;
                height: 100%;
            }
            .half.left {
                left: 0;
                background-color: #f1f5f9; /* slate-100 */
                animation: left-fill 2s infinite ease-in-out;
            }
            .half.right {
                right: 0;
                background-color: #0f172a; /* slate-900 */
                animation: right-fill 2s infinite ease-in-out;
            }
            .dark .half.left { background-color: #475569; }
            .dark .half.right { background-color: #e2e8f0; }

            @keyframes spin-loader {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes left-fill {
                0%, 100% { background-color: #f1f5f9; }
                50% { background-color: #0f172a; }
            }
            .dark @keyframes left-fill {
                0%, 100% { background-color: #475569; }
                50% { background-color: #e2e8f0; }
            }
            @keyframes right-fill {
                0%, 100% { background-color: #0f172a; }
                50% { background-color: #f1f5f9; }
            }
             .dark @keyframes right-fill {
                0%, 100% { background-color: #e2e8f0; }
                50% { background-color: #475569; }
            }
        `}</style>
    </div>
);

export const ImageContrastEditor: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [contrast, setContrast] = useState(100); // Percentage
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const handleImageUpload = (file: File) => {
        setOriginalFile(file);
        setProcessedImage(null);
        setContrast(100);
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

            ctx.filter = `contrast(${contrast}%)`;
            ctx.drawImage(img, 0, 0);

            setProcessedImage(canvas.toDataURL());
            setIsLoading(false);
        }, 50);
    }, [originalFile, contrast]);

    useEffect(() => {
        if (originalFile) {
            imageRef.current.onload = applyFilter;
        }
    }, [originalFile, applyFilter]);
    
    useEffect(() => {
        if(originalFile) {
            applyFilter();
        }
    }, [contrast, originalFile, applyFilter]);


    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `contrast-${originalFile?.name || 'image'}.png`;
        link.click();
    };

    const handleReset = () => {
        setOriginalFile(null);
        setProcessedImage(null);
        setContrast(100);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Image Contrast Editor</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Modify the contrast for more dramatic photos.</p>
            </div>

            {!originalFile ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Adjust Contrast</h2>
                             <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/></svg>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={contrast}
                                    onChange={e => setContrast(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                             <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Contrast: {contrast}%</p>
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
                                <img src={processedImage} alt="Processed with contrast adjusted" className="max-w-full h-auto rounded-md shadow-md" />
                            ) : null}
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
