import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="noise-loader mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Processing noise...</p>
        <style>{`
            .noise-loader {
                width: 80px; height: 80px; position: relative;
                background-image: radial-gradient(#9ca3af 1px, transparent 1px);
                background-size: 5px 5px;
                animation: noise-anim 0.2s infinite;
            }
            .dark .noise-loader {
                background-image: radial-gradient(#475569 1px, transparent 1px);
            }
            @keyframes noise-anim { 0% {transform:translate(0,0)} 25% {transform:translate(2px,2px)} 50% {transform:translate(-2px,-2px)} 75% {transform:translate(-2px,2px)} 100% {transform:translate(2px,-2px)} }
        `}</style>
    </div>
);

export const NoiseAdderRemover: React.FC<{ title: string }> = ({ title }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [mode, setMode] = useState<'add' | 'remove'>('add');
    const [amount, setAmount] = useState(25); // 0-100 for add, 0-5 for remove
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
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            if (mode === 'add') {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const noise = (Math.random() - 0.5) * amount;
                    data[i] += noise;
                    data[i + 1] += noise;
                    data[i + 2] += noise;
                }
                ctx.putImageData(imageData, 0, 0);
            } else { // remove (simple blur)
                ctx.filter = `blur(${amount / 5}px)`;
                ctx.drawImage(canvas, 0, 0);
                ctx.filter = 'none'; // Reset filter
            }

            setProcessedImage(canvas.toDataURL());
            setIsLoading(false);
        }, 200);
    }, [imageSrc, mode, amount]);

    useEffect(() => {
        if (imageSrc) applyEffect();
    }, [imageSrc, mode, amount, applyEffect]);
    
    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `processed-image.png`;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add grainy noise for a vintage look or apply a blur to reduce it.</p>
            </div>
            {!imageSrc ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="space-y-6">
                    <div className="min-h-[300px] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                        {isLoading ? <Loader /> : <img src={processedImage || ''} className="max-w-full h-auto rounded-md" />}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setMode('add')} className={`flex-1 py-2 rounded-md ${mode === 'add' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>Add Noise</button>
                            <button onClick={() => setMode('remove')} className={`flex-1 py-2 rounded-md ${mode === 'remove' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>Reduce Noise (Blur)</button>
                        </div>
                        <div>
                            <label>Amount: {amount}</label>
                            <input type="range" min="0" max={mode === 'add' ? 100 : 5} step="1" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1" />
                        </div>
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
