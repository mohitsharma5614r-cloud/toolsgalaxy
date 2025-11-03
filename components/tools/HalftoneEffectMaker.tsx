import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

// ... (Loader can be reused or a new one created)

export const HalftoneEffectMaker: React.FC<{ title: string }> = ({ title }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [halftoneImage, setHalftoneImage] = useState<string | null>(null);
    const [dotSize, setDotSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageRef.current.src = e.target?.result as string;
            imageRef.current.onload = () => setImageSrc(imageRef.current.src);
        };
        reader.readAsDataURL(file);
    };

    const applyEffect = useCallback(() => {
        if (!imageSrc) return;
        setIsLoading(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const img = imageRef.current;
            if (!canvas || !img.src) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : 'white';
            ctx.fillRect(0,0, canvas.width, canvas.height);

            for (let y = 0; y < canvas.height; y += dotSize) {
                for (let x = 0; x < canvas.width; x += dotSize) {
                    let r = 0, g = 0, b = 0, count = 0;
                    for (let i = 0; i < dotSize; i++) {
                        for (let j = 0; j < dotSize; j++) {
                           if(x+j < canvas.width && y+i < canvas.height) {
                               const index = ((y + i) * canvas.width + (x + j)) * 4;
                                r += data[index];
                                g += data[index + 1];
                                b += data[index + 2];
                                count++;
                           }
                        }
                    }
                    const avgR = r/count; const avgG = g/count; const avgB = b/count;
                    const brightness = (0.299*avgR + 0.587*avgG + 0.114*avgB) / 255;
                    const radius = (1-brightness) * (dotSize/2);
                    
                    ctx.beginPath();
                    ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'white' : 'black';
                    ctx.arc(x + dotSize/2, y + dotSize/2, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            setHalftoneImage(canvas.toDataURL());
            setIsLoading(false);
        }, 200);
    }, [imageSrc, dotSize]);

    useEffect(() => {
        if (imageSrc) applyEffect();
    }, [imageSrc, dotSize, applyEffect]);

    const handleDownload = () => {
        if (!halftoneImage) return;
        const link = document.createElement('a');
        link.href = halftoneImage;
        link.download = `halftone-image.png`;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a comic-book style halftone pattern from your image.</p>
            </div>
            {!imageSrc ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="space-y-6">
                    <div className="min-h-[300px] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                        {isLoading ? <p>Loading...</p> : <img src={halftoneImage || ''} className="max-w-full h-auto rounded-md" />}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                     <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <label>Dot Size: {dotSize}</label>
                        <input type="range" min="3" max="30" value={dotSize} onChange={e => setDotSize(Number(e.target.value))} className="w-full mt-1" />
                    </div>
                     <div className="flex gap-4">
                        <button onClick={() => setImageSrc(null)} className="w-full py-3 bg-slate-500 text-white font-semibold rounded-lg">Change Image</button>
                        <button onClick={handleDownload} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg">Download</button>
                    </div>
                </div>
            )}
        </div>
    );
};
