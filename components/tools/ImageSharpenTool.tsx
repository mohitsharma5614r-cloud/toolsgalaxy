import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="sharpen-loader mx-auto">
            <div className="blur-layer"></div>
            <div className="sharp-layer"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Enhancing details...</p>
        <style>{`
            .sharpen-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .blur-layer, .sharp-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text x="50%" y="50%" font-size="60" text-anchor="middle" dy=".3em">A</text></svg>');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .blur-layer {
                filter: blur(4px);
                opacity: 1;
                animation: fade-out-blur 2s infinite ease-in-out;
            }
            .sharp-layer {
                opacity: 0;
                animation: fade-in-sharp 2s infinite ease-in-out;
            }

            @keyframes fade-out-blur {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            @keyframes fade-in-sharp {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
        `}</style>
    </div>
);

export const ImageSharpenTool: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [sharpenAmount, setSharpenAmount] = useState(1); // 0 to 3
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const handleImageUpload = (file: File) => {
        setOriginalFile(file);
        setProcessedImage(null);
        setSharpenAmount(1);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                imageRef.current.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    };
    
    // Applying sharpen via SVG filter as canvas does not have a native sharpen filter.
    // This is a common workaround.
    const applyFilter = useCallback(() => {
        if (!originalFile || !imageRef.current.src) return;
        setIsLoading(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const img = imageRef.current;
            if (!canvas || !img.src) { setIsLoading(false); return; }
            const ctx = canvas.getContext('2d');
            if (!ctx) { setIsLoading(false); return; }

            canvas.width = img.width;
            canvas.height = img.height;
            
            // The SVG filter creates a sharpened version of the image
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
                    <filter id="sharpen">
                        <feGaussianBlur stdDeviation="${sharpenAmount}" result="blurred" />
                        <feComposite in="SourceGraphic" in2="blurred" operator="arithmetic" k1="1" k2="-${sharpenAmount * 0.5}" k3="0" k4="0" />
                    </filter>
                    <image href="${img.src}" width="100%" height="100%" filter="url(#sharpen)" />
                </svg>
            `;
            
            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const sharpImage = new Image();
            sharpImage.onload = () => {
                ctx.drawImage(sharpImage, 0, 0);
                setProcessedImage(canvas.toDataURL());
                URL.revokeObjectURL(url);
                setIsLoading(false);
            };
            sharpImage.src = url;
        }, 50);
    }, [originalFile, sharpenAmount]);

    useEffect(() => {
        if (originalFile) {
            imageRef.current.onload = applyFilter;
        }
    }, [originalFile, applyFilter]);
    
    useEffect(() => {
        if(originalFile) {
            applyFilter();
        }
    }, [sharpenAmount, originalFile, applyFilter]);


    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `sharpened-${originalFile?.name || 'image'}.png`;
        link.click();
    };

    const handleReset = () => {
        setOriginalFile(null);
        setProcessedImage(null);
        setSharpenAmount(1);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Image Sharpen Tool</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enhance the details and sharpness of an image.</p>
            </div>

            {!originalFile ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Adjust Sharpness</h2>
                             <div className="flex items-center gap-4">
                                <span className="text-sm">Soft</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="0.1"
                                    value={sharpenAmount}
                                    onChange={e => setSharpenAmount(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-sm">Sharp</span>
                             </div>
                             <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Amount: {Math.round(sharpenAmount * 100 / 3)}%</p>
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
                                <img src={processedImage} alt="Processed with sharpening" className="max-w-full h-auto rounded-md shadow-md" />
                            ) : null}
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
