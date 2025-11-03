import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="glitch-loader mx-auto">
            <div className="glitch-text" data-text="LOADING">LOADING</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Applying glitch effect...</p>
        <style>{`
            .glitch-loader { width: 120px; height: 60px; }
            .glitch-text {
                font-size: 2rem; font-weight: bold; position: relative;
                animation: glitch-anim 1.5s infinite;
            }
            .glitch-text::before, .glitch-text::after {
                content: attr(data-text);
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: #1e293b; /* dark:bg-slate-800 */
                overflow: hidden;
            }
            .dark .glitch-text::before, .dark .glitch-text::after { background: #f1f5f9; }
            .glitch-text::before {
                left: 2px;
                text-shadow: -2px 0 #f87171; /* red-400 */
                animation: glitch-anim-2 1.5s infinite;
            }
            .glitch-text::after {
                left: -2px;
                text-shadow: -2px 0 #60a5fa; /* blue-400 */
                animation: glitch-anim-3 1.5s infinite;
            }
            @keyframes glitch-anim { 0%,100% {transform:skewX(0)} 25% {transform:skewX(10deg)} 50% {transform:skewX(-10deg)} 75% {transform:skewX(5deg)} }
            @keyframes glitch-anim-2 { 0%,100% {clip-path:inset(50% 0 30% 0)} 25% {clip-path:inset(10% 0 80% 0)} 50% {clip-path:inset(90% 0 5% 0)} 75% {clip-path:inset(40% 0 40% 0)} }
            @keyframes glitch-anim-3 { 0%,100% {clip-path:inset(70% 0 10% 0)} 25% {clip-path:inset(20% 0 50% 0)} 50% {clip-path:inset(5% 0 90% 0)} 75% {clip-path:inset(60% 0 20% 0)} }
        `}</style>
    </div>
);

export const GlitchEffectCreator: React.FC<{ title: string }> = ({ title }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [glitchedImage, setGlitchedImage] = useState<string | null>(null);
    const [intensity, setIntensity] = useState(10);
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

    const applyGlitch = useCallback(() => {
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

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // RGB Shift
            for (let i = 0; i < data.length; i += 4) {
                const shift = Math.floor(Math.random() * intensity) * 4;
                data[i] = data[i + shift];
                data[i + 2] = data[i - shift + 2];
            }
            ctx.putImageData(imageData, 0, 0);
            
            // Scan Lines & block displacement
            for (let y = 0; y < canvas.height; y++) {
                if (Math.random() < intensity / 100) {
                    const blockHeight = Math.floor(Math.random() * (intensity / 2)) + 1;
                    const blockShift = (Math.random() - 0.5) * intensity;
                    const blockData = ctx.getImageData(0, y, canvas.width, blockHeight);
                    ctx.clearRect(0, y, canvas.width, blockHeight);
                    ctx.putImageData(blockData, blockShift, y);
                }
            }

            setGlitchedImage(canvas.toDataURL('image/jpeg', 0.9));
            setIsLoading(false);
        }, 300);
    }, [imageSrc, intensity]);

    useEffect(() => {
        if (imageSrc) applyGlitch();
    }, [imageSrc, intensity, applyGlitch]);

    const handleDownload = () => {
        if (!glitchedImage) return;
        const link = document.createElement('a');
        link.href = glitchedImage;
        link.download = `glitched-image.jpg`;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add a cool, retro glitch effect to your photos.</p>
            </div>

            {!imageSrc ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <div className="space-y-6">
                    <div className="min-h-[300px] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                        {isLoading ? <Loader /> : <img src={glitchedImage || ''} className="max-w-full h-auto rounded-md" />}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <label>Intensity: {intensity}</label>
                        <input type="range" min="1" max="40" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full mt-1" />
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
