import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="aperture-loader mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="blade" style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${i * 0.05}s` }}></div>
            ))}
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Perfecting your shot...</p>
        <style>{`
            .aperture-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .blade {
                position: absolute;
                top: 0; left: 0;
                width: 100%;
                height: 100%;
                background: #4f46e5; /* indigo-600 */
                clip-path: polygon(50% 0%, 60% 0, 50% 50%, 40% 0);
                animation: aperture-close 1.5s infinite ease-in-out;
            }
            .dark .blade { background: #818cf8; }

            @keyframes aperture-close {
                0%, 100% { transform: scale(1.5) rotate(var(--angle)); opacity: 0; }
                50% { transform: scale(1) rotate(var(--angle)); opacity: 1; }
            }
        `}</style>
    </div>
);

type Shape = 'circle' | 'square';
type Filter = 'none' | 'grayscale(100%)' | 'sepia(100%)' | 'saturate(2)';

const CANVAS_PREVIEW_SIZE = 400;
const CANVAS_DOWNLOAD_SIZE = 1024;

export const ProfilePictureMaker: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [shape, setShape] = useState<Shape>('circle');
    const [borderColor, setBorderColor] = useState('#ffffff');
    const [borderWidth, setBorderWidth] = useState(8);
    const [filter, setFilter] = useState<Filter>('none');
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const drawCanvas = useCallback((canvas: HTMLCanvasElement, size: number) => {
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;
        if (!ctx || !img.src) return;

        canvas.width = size;
        canvas.height = size;
        
        ctx.clearRect(0, 0, size, size);

        ctx.save();
        
        // 1. Clipping Path
        ctx.beginPath();
        if (shape === 'circle') {
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        } else {
            ctx.rect(0, 0, size, size);
        }
        ctx.clip();
        
        // 2. Image Transformations & Drawing
        ctx.translate(size / 2, size / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-size / 2, -size / 2);

        ctx.filter = filter;

        const hRatio = size / img.width;
        const vRatio = size / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (size - img.width * ratio) / 2;
        const centerShiftY = (size - img.height * ratio) / 2;

        ctx.drawImage(img, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        
        ctx.restore();

        // 3. Border
        if (borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.beginPath();
            if (shape === 'circle') {
                ctx.arc(size / 2, size / 2, (size - borderWidth) / 2, 0, Math.PI * 2);
            } else {
                ctx.rect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);
            }
            ctx.stroke();
        }

    }, [zoom, rotation, shape, borderColor, borderWidth, filter]);

    useEffect(() => {
        if (imageSrc && canvasRef.current) {
            drawCanvas(canvasRef.current, CANVAS_PREVIEW_SIZE);
        }
    }, [imageSrc, drawCanvas]);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            imageRef.current.src = url;
            imageRef.current.onload = () => {
                setImageSrc(url);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        setIsLoading(true);
        setTimeout(() => {
            const downloadCanvas = document.createElement('canvas');
            drawCanvas(downloadCanvas, CANVAS_DOWNLOAD_SIZE);
            const link = document.createElement('a');
            link.download = `profile-picture-${Date.now()}.png`;
            link.href = downloadCanvas.toDataURL('image/png');
            link.click();
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Profile Picture Maker</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Design the perfect profile picture with borders and filters.</p>
            </div>

            {!imageSrc ? (
                 <div className="max-w-2xl mx-auto"><ImageUploader onImageUpload={handleImageUpload} /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Controls Panel */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                        {/* Control groups */}
                        <div>
                            <label className="label-style">Shape</label>
                            <div className="flex gap-2">
                                <button onClick={() => setShape('circle')} className={`btn-toggle ${shape === 'circle' ? 'btn-selected' : ''}`}>Circle</button>
                                <button onClick={() => setShape('square')} className={`btn-toggle ${shape === 'square' ? 'btn-selected' : ''}`}>Square</button>
                            </div>
                        </div>
                        <div>
                            <label className="label-style">Zoom ({Math.round(zoom * 100)}%)</label>
                            <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full range-style" />
                        </div>
                         <div>
                            <label className="label-style">Rotate ({rotation}°)</label>
                            <input type="range" min="-180" max="180" value={rotation} onChange={e => setRotation(parseInt(e.target.value))} className="w-full range-style" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label-style">Border Width</label>
                                <input type="range" min="0" max="20" value={borderWidth} onChange={e => setBorderWidth(parseInt(e.target.value))} className="w-full range-style" />
                            </div>
                            <div>
                                <label className="label-style">Border Color</label>
                                <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-full h-10 p-1 border border-slate-300 dark:border-slate-600 rounded-md cursor-pointer bg-white dark:bg-slate-700" />
                            </div>
                        </div>
                        <div>
                            <label className="label-style">Filter</label>
                            <div className="flex gap-2">
                                <button onClick={() => setFilter('none')} className={`btn-toggle ${filter === 'none' ? 'btn-selected' : ''}`}>None</button>
                                <button onClick={() => setFilter('grayscale(100%)')} className={`btn-toggle ${filter === 'grayscale(100%)' ? 'btn-selected' : ''}`}>Grayscale</button>
                                <button onClick={() => setFilter('sepia(100%)')} className={`btn-toggle ${filter === 'sepia(100%)' ? 'btn-selected' : ''}`}>Sepia</button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-4">
                        <div className="relative aspect-square max-w-md mx-auto flex items-center justify-center">
                            {isLoading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30"><Loader /></div>}
                            <canvas ref={canvasRef} width={CANVAS_PREVIEW_SIZE} height={CANVAS_PREVIEW_SIZE} className="max-w-full h-auto rounded-lg shadow-lg" />
                        </div>
                         <div className="flex justify-center gap-4">
                             <button onClick={handleDownload} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">Download (1024px)</button>
                             <button onClick={() => setImageSrc(null)} className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md">Reset</button>
                         </div>
                    </div>
                </div>
            )}
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #475569; }
                .dark .label-style { color: #94a3b8; }
                .btn-toggle { flex: 1; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; background-color: #e2e8f0; color: #334155; }
                .dark .btn-toggle { background-color: #334155; color: #e2e8f0; }
                .btn-selected { background-color: #4f46e5; color: white; }
                .range-style { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark .range-style { background: #334155; }
                .range-style::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; }
            `}</style>
        </div>
    );
};
