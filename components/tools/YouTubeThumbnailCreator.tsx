import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';
import { generateThumbnailOrBanner } from '../../services/geminiService';

const Loader: React.FC = () => (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
        <div className="aperture-loader mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="blade" style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${i * 0.05}s` }}></div>
            ))}
        </div>
        <style>{`
            .aperture-loader { width: 100px; height: 100px; position: relative; }
            .blade { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; clip-path: polygon(50% 0%, 60% 0, 50% 50%, 40% 0); animation: aperture-close 1.5s infinite ease-in-out; }
            @keyframes aperture-close { 0%, 100% { transform: scale(1.5) rotate(var(--angle, 0deg)); opacity: 0; } 50% { transform: scale(1) rotate(var(--angle, 0deg)); opacity: 1; } }
        `}</style>
    </div>
);

export const YouTubeThumbnailCreator: React.FC<{ title: string }> = ({ title }) => {
    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
    const [headline, setHeadline] = useState({ text: 'YOUR HEADLINE', color: '#FFFFFF', size: 90, y: 500 });
    const [subheading, setSubheading] = useState({ text: 'Catchy Subheading', color: '#facc15', size: 50, y: 620 });
    const [bgPrompt, setBgPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1280;
        canvas.height = 720;
        
        // Background color
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Background image
        if (bgImage) {
            const hRatio = canvas.width / bgImage.width;
            const vRatio = canvas.height / bgImage.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShiftX = (canvas.width - bgImage.width * ratio) / 2;
            const centerShiftY = (canvas.height - bgImage.height * ratio) / 2;
            ctx.drawImage(bgImage, centerShiftX, centerShiftY, bgImage.width * ratio, bgImage.height * ratio);
        }

        // Text rendering
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Headline
        ctx.fillStyle = headline.color;
        ctx.font = `bold ${headline.size}px 'Poppins', sans-serif`;
        ctx.fillText(headline.text.toUpperCase(), canvas.width / 2, headline.y);

        // Subheading
        ctx.fillStyle = subheading.color;
        ctx.font = `600 ${subheading.size}px 'Poppins', sans-serif`;
        ctx.fillText(subheading.text, canvas.width / 2, subheading.y);

    }, [bgImage, headline, subheading]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    const handleBgUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => setBgImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleGenerateBg = async () => {
        if (!bgPrompt) return;
        setIsLoading(true);
        setError(null);
        try {
            const imageBase64 = await generateThumbnailOrBanner(bgPrompt, '16:9');
            if (imageBase64) {
                const img = new Image();
                img.onload = () => setBgImage(img);
                img.src = `data:image/jpeg;base64,${imageBase64}`;
            } else {
                throw new Error("AI failed to generate a background.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'youtube-thumbnail.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Design a custom thumbnail for your videos.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                            <h3 className="font-bold mb-2">Background</h3>
                            <ImageUploader onImageUpload={handleBgUpload} />
                             <div className="mt-4">
                                <p className="text-sm text-center mb-2">Or generate with AI:</p>
                                <div className="flex gap-2">
                                <input value={bgPrompt} onChange={e => setBgPrompt(e.target.value)} placeholder="e.g., abstract neon lights" className="input-style flex-grow"/>
                                <button onClick={handleGenerateBg} className="btn-secondary">Go</button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                            <h3 className="font-bold mb-2">Text</h3>
                            <input value={headline.text} onChange={e => setHeadline(h => ({...h, text: e.target.value}))} className="input-style w-full font-bold"/>
                            <div className="flex gap-2 items-center"><input type="color" value={headline.color} onChange={e => setHeadline(h => ({...h, color: e.target.value}))} /><input type="range" min="50" max="150" value={headline.size} onChange={e => setHeadline(h => ({...h, size: Number(e.target.value)}))} /></div>
                            <input value={subheading.text} onChange={e => setSubheading(s => ({...s, text: e.target.value}))} className="input-style w-full"/>
                            <div className="flex gap-2 items-center"><input type="color" value={subheading.color} onChange={e => setSubheading(s => ({...s, color: e.target.value}))} /><input type="range" min="20" max="100" value={subheading.size} onChange={e => setSubheading(s => ({...s, size: Number(e.target.value)}))} /></div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="relative aspect-video w-full">
                            {isLoading && <Loader />}
                            <canvas ref={canvasRef} className="w-full h-auto rounded-lg shadow-lg" />
                        </div>
                         <button onClick={handleDownload} className="mt-4 w-full btn-primary text-lg">Download Thumbnail (JPG)</button>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-secondary { background: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
            `}</style>
        </>
    );
};
