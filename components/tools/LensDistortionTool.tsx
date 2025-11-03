import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

// ... (Loader can be reused or a new one created)

export const LensDistortionTool: React.FC<{ title: string }> = ({ title }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [distortedImage, setDistortedImage] = useState<string | null>(null);
    const [strength, setStrength] = useState(0.5); // 0 to 1
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

    const applyDistortion = useCallback(() => {
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
            
            const w = canvas.width;
            const h = canvas.height;
            const centerX = w / 2;
            const centerY = h / 2;
            
            // Create a temporary canvas with the original image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img, 0, 0, w, h);
            const srcData = tempCtx.getImageData(0, 0, w, h).data;
            
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const dx = x - centerX;
                    const dy = y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const r = dist / Math.sqrt(centerX*centerX + centerY*centerY);
                    
                    const theta = Math.atan2(dy, dx);
                    const newR = r * (1 - strength * (r - 1));
                    
                    const srcX = centerX + newR * Math.cos(theta) * centerX;
                    const srcY = centerY + newR * Math.sin(theta) * centerY;
                    
                    const i = (Math.floor(y) * w + Math.floor(x)) * 4;
                    
                    if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
                        const srcI = (Math.floor(srcY) * w + Math.floor(srcX)) * 4;
                        data[i] = srcData[srcI];
                        data[i + 1] = srcData[srcI + 1];
                        data[i + 2] = srcData[srcI + 2];
                        data[i + 3] = srcData[srcI + 3];
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setDistortedImage(canvas.toDataURL());
            setIsLoading(false);
        }, 200);
    }, [imageSrc, strength]);

    useEffect(() => {
        if (imageSrc) applyDistortion();
    }, [imageSrc, strength, applyDistortion]);

    const handleDownload = () => {
        if (!distortedImage) return;
        const link = document.createElement('a');
        link.href = distortedImage;
        link.download = `distorted-image.png`;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Simulate fisheye and other lens distortions on your image.</p>
            </div>
            {!imageSrc ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="space-y-6">
                    <div className="min-h-[300px] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                        {isLoading ? <p>Loading...</p> : <img src={distortedImage || ''} className="max-w-full h-auto rounded-md" />}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <label>Distortion Strength: {Math.round(strength * 100)}%</label>
                        <input type="range" min="0" max="1" step="0.01" value={strength} onChange={e => setStrength(parseFloat(e.target.value))} className="w-full mt-1" />
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
