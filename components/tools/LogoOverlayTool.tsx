
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-white">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4">Downloading...</p>
        </div>
    </div>
);

type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const LogoOverlayTool: React.FC<{ title: string }> = ({ title }) => {
    const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);
    const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

    const [logoSize, setLogoSize] = useState(0.2); // as a factor of main image width
    const [logoOpacity, setLogoOpacity] = useState(1);
    const [logoPosition, setLogoPosition] = useState<Position>('bottom-right');
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCanvas = useCallback((canvas: HTMLCanvasElement, outputSize?: number) => {
        const ctx = canvas.getContext('2d');
        if (!ctx || !mainImage) return;

        const scale = outputSize ? outputSize / mainImage.width : 1;
        
        canvas.width = mainImage.width * scale;
        canvas.height = mainImage.height * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mainImage, 0, 0, canvas.width, canvas.height);

        if (logoImage) {
            const logoWidth = canvas.width * logoSize;
            const logoHeight = logoImage.height * (logoWidth / logoImage.width);
            const margin = canvas.width * 0.02; // 2% margin

            let x = 0, y = 0;
            const [vPos, hPos] = logoPosition.split('-');

            // Vertical position
            if (vPos === 'top') y = margin;
            if (vPos === 'middle') y = (canvas.height - logoHeight) / 2;
            if (vPos === 'bottom') y = canvas.height - logoHeight - margin;

            // Horizontal position
            if (hPos === 'left') x = margin;
            if (hPos === 'center') x = (canvas.width - logoWidth) / 2;
            if (hPos === 'right') x = canvas.width - logoWidth - margin;

            ctx.globalAlpha = logoOpacity;
            ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
            ctx.globalAlpha = 1.0;
        }
    }, [mainImage, logoImage, logoSize, logoOpacity, logoPosition]);

    useEffect(() => {
        if (canvasRef.current) {
            drawCanvas(canvasRef.current);
        }
    }, [drawCanvas]);
    
    const handleMainImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => setMainImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleLogoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => setLogoImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        setIsLoading(true);
        setTimeout(() => {
            const downloadCanvas = document.createElement('canvas');
            drawCanvas(downloadCanvas, mainImage?.width || 1920); // Use original width or default
            const link = document.createElement('a');
            link.download = `watermarked-image.jpg`;
            link.href = downloadCanvas.toDataURL('image/jpeg', 0.9);
            link.click();
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add a watermark or logo to your images with ease.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h3 className="font-bold mb-2 text-indigo-600">1. Main Image</h3>
                        <ImageUploader onImageUpload={handleMainImageUpload} />
                    </div>
                    {mainImage && (
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                            <h3 className="font-bold mb-2 text-indigo-600">2. Logo Image</h3>
                            <ImageUploader onImageUpload={handleLogoUpload} />
                        </div>
                    )}
                     {mainImage && logoImage && (
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                            <h3 className="font-bold text-indigo-600">3. Adjustments</h3>
                            <div>
                                <label>Size ({Math.round(logoSize * 100)}%)</label>
                                <input type="range" min="0.05" max="1" step="0.01" value={logoSize} onChange={e => setLogoSize(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <label>Opacity ({Math.round(logoOpacity * 100)}%)</label>
                                <input type="range" min="0" max="1" step="0.05" value={logoOpacity} onChange={e => setLogoOpacity(Number(e.target.value))} className="w-full" />
                            </div>
                             <div>
                                <label className="mb-2 block">Position</label>
                                <div className="grid grid-cols-3 gap-1">
                                    {(['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map(pos => (
                                        <button key={pos} onClick={() => setLogoPosition(pos)} className={`h-10 border-2 rounded ${logoPosition === pos ? 'bg-indigo-600 border-indigo-700' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="lg:col-span-2">
                    <div className="relative p-4 bg-slate-200 dark:bg-slate-900/50 rounded-xl flex items-center justify-center min-h-[400px]">
                         {isLoading && <Loader/>}
                         {mainImage ? (
                            <canvas ref={canvasRef} className="max-w-full h-auto rounded-md shadow-lg" />
                         ) : (
                            <p className="text-slate-500">Upload a main image to begin</p>
                         )}
                    </div>
                     {mainImage && logoImage && (
                        <div className="mt-4 flex gap-4">
                            <button onClick={() => { setMainImage(null); setLogoImage(null); }} className="w-full py-3 bg-slate-500 text-white font-semibold rounded-lg">Reset</button>
                            <button onClick={handleDownload} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg">Download Image</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
