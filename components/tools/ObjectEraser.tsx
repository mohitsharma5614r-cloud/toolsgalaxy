import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { eraseObjectInImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';
import { ImageComparisonSlider } from '../ImageComparisonSlider';

// Loader component with an erasing animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="eraser-loader mx-auto">
            <div className="photo-bg"></div>
            <div className="eraser-brush"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Erasing object...</p>
        <style>{`
            .eraser-loader {
                width: 100px;
                height: 75px;
                position: relative;
                overflow: hidden;
            }
            .photo-bg {
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #a5b4fc, #f472b6);
                border-radius: 8px;
            }
            .eraser-brush {
                position: absolute;
                top: 50%;
                left: -20px;
                width: 30px;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
                transform: translateY(-50%) rotate(15deg);
                animation: erase-anim 2s infinite ease-in-out;
            }
            @keyframes erase-anim {
                0% { left: -30px; }
                100% { left: 100px; }
            }
        `}</style>
    </div>
);

type Point = { x: number; y: number };

// Main Component
export const ObjectEraser: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string } | null>(null);
    const [erasedImage, setErasedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [brushSize, setBrushSize] = useState(30);
    const [paths, setPaths] = useState<Point[][]>([]);

    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const isDrawing = useRef(false);
    const currentPath = useRef<Point[]>([]);

    const handleImageUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            setOriginalImage({ file, url });
        };
        reader.readAsDataURL(file);
    }, []);

    const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement): Point => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };
    
    const drawImage = useCallback(() => {
        if (!originalImage || !imageCanvasRef.current || !imageRef.current?.complete) return;
        const canvas = imageCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = imageRef.current.naturalWidth;
        canvas.height = imageRef.current.naturalHeight;
        ctx.drawImage(imageRef.current, 0, 0);
    }, [originalImage]);

    const drawMask = useCallback(() => {
        const canvas = drawingCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (imageCanvasRef.current) {
            canvas.width = imageCanvasRef.current.width;
            canvas.height = imageCanvasRef.current.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const allPaths = [...paths];
        if (isDrawing.current && currentPath.current.length > 0) {
            allPaths.push(currentPath.current);
        }

        allPaths.forEach(path => {
            if (path.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            path.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();
        });
    }, [paths, brushSize]);

    useEffect(() => {
        imageRef.current = new Image();
        imageRef.current.onload = drawImage;
    }, [drawImage]);

    useEffect(() => {
        if (originalImage?.url && imageRef.current) {
            imageRef.current.src = originalImage.url;
        }
    }, [originalImage]);

    useEffect(() => {
        drawMask();
    }, [drawMask]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawingCanvasRef.current) return;
        isDrawing.current = true;
        const point = getCanvasPoint(e, drawingCanvasRef.current);
        currentPath.current = [point];
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current || !drawingCanvasRef.current) return;
        e.preventDefault();
        const point = getCanvasPoint(e, drawingCanvasRef.current);
        currentPath.current.push(point);
        drawMask();
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        if (currentPath.current.length > 1) {
            setPaths(prev => [...prev, currentPath.current]);
        }
        currentPath.current = [];
    };
    
    const handleUndo = () => setPaths(prev => prev.slice(0, -1));
    const handleClear = () => setPaths([]);

    const handleErase = async () => {
        if (!originalImage || paths.length === 0) {
            setError("Please draw a mask over the object you want to remove.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setErasedImage(null);

        try {
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = imageCanvasRef.current!.width;
            maskCanvas.height = imageCanvasRef.current!.height;
            const maskCtx = maskCanvas.getContext('2d')!;
            maskCtx.fillStyle = 'black';
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            maskCtx.strokeStyle = 'white';
            maskCtx.lineWidth = brushSize;
            maskCtx.lineCap = 'round';
            maskCtx.lineJoin = 'round';
            paths.forEach(path => {
                if(path.length < 2) return;
                maskCtx.beginPath();
                maskCtx.moveTo(path[0].x, path[0].y);
                path.slice(1).forEach(point => maskCtx.lineTo(point.x, point.y));
                maskCtx.stroke();
            });
            
            const maskBase64 = maskCanvas.toDataURL('image/png').split(',')[1];
            
            const { base64, mimeType } = await fileToBase64(originalImage.file);
            const generatedImageBase64 = await eraseObjectInImage(base64, mimeType, maskBase64);

            if (generatedImageBase64) {
                setErasedImage(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try again.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="max-w-4xl mx-auto"><div className="min-h-[400px] flex items-center justify-center"><Loader /></div></div>;
    }
    
    if (erasedImage && originalImage) {
         return (
            <div className="max-w-4xl mx-auto space-y-6">
                <ImageComparisonSlider beforeImageUrl={originalImage.url} afterImageUrl={erasedImage} />
                <div className="flex justify-center gap-4">
                    <button onClick={() => { setOriginalImage(null); setErasedImage(null); setPaths([]); }} className="btn-secondary">Start Over</button>
                    <a href={erasedImage} download={`erased-${originalImage.file.name}`} className="btn-primary">Download</a>
                </div>
                 <style>{`
                    .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; }
                    .btn-primary:hover { background-color: #4338ca; }
                    .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; }
                    .btn-secondary:hover { background-color: #475569; }
                 `}</style>
            </div>
         );
    }

    if (originalImage) {
        return (
            <>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="relative w-full max-w-full mx-auto" style={{ aspectRatio: `${imageRef.current?.naturalWidth || 16}/${imageRef.current?.naturalHeight || 9}` }}>
                    <canvas ref={imageCanvasRef} className="absolute top-0 left-0 w-full h-full rounded-lg" />
                    <canvas
                        ref={drawingCanvasRef}
                        className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
                 <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <p className="text-center font-semibold">1. Paint over the object you want to remove</p>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Brush Size</label>
                        <input type="range" min="10" max="100" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-full" />
                    </div>
                     <div className="flex justify-center gap-4">
                        <button onClick={handleUndo} disabled={paths.length === 0} className="btn-secondary">Undo</button>
                        <button onClick={handleClear} disabled={paths.length === 0} className="btn-secondary">Clear</button>
                    </div>
                </div>
                 <button onClick={handleErase} disabled={paths.length === 0} className="w-full btn-primary text-lg">
                    2. Erase Object
                </button>
            </div>
            <Toast message={error} onClose={() => setError(null)} />
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; }
                .btn-primary:hover { background-color: #4338ca; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; }
                .btn-secondary:hover { background-color: #475569; }
                .btn-secondary:disabled { background-color: #d1d5db; color: #6b7280; cursor: not-allowed; }
                .touch-none { touch-action: none; }
             `}</style>
            </>
        );
    }
    
    return (
        <>
            <div className="max-w-2xl mx-auto">
                 <ImageUploader onImageUpload={handleImageUpload} />
            </div>
             {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};