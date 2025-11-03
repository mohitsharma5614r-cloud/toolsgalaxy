import React from 'react';
import { ImageCropper } from '../ImageCropper'; // We can't reuse this due to circle crop. Re-implementing.
import { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

const Loader: React.FC = () => (
    <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
        <div className="pfp-loader mx-auto"></div>
        <style>{`
            .pfp-loader {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 5px solid #4f46e5;
                border-top-color: transparent;
                animation: spin 1s linear infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
    </div>
);


export const DiscordPfpMaker: React.FC<{ title: string }> = ({ title }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [borderColor, setBorderColor] = useState('#5865F2'); // Discord blurple
  const [borderWidth, setBorderWidth] = useState(8);

  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startDragPos = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const drawCanvas = useCallback((canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    if (!ctx || !img.src) return;

    canvas.width = size;
    canvas.height = size;
    
    ctx.clearRect(0, 0, size, size);

    // Image Transformations
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-size / 2, -size / 2);
    ctx.translate(offset.x, offset.y);

    const hRatio = size / img.width;
    const vRatio = size / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (size - img.width * ratio) / 2;
    const centerShiftY = (size - img.height * ratio) / 2;
    ctx.drawImage(img, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
    ctx.restore();

    // Clipping and Border
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size - borderWidth) / 2, 0, Math.PI * 2);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.clip(); // Clip everything drawn after this

    // Re-draw the transformed image inside the clipped circle
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-size / 2, -size / 2);
    ctx.translate(offset.x, offset.y);
    ctx.drawImage(img, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
    ctx.restore();

    ctx.restore();

  }, [zoom, offset, borderColor, borderWidth]);

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      drawCanvas(canvasRef.current, 400);
    }
  }, [imageSrc, drawCanvas]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      imageRef.current.src = url;
      imageRef.current.onload = () => {
        setImageSrc(url);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startDragPos.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startDragPos.current.x,
      y: e.clientY - startDragPos.current.y,
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
        const downloadCanvas = document.createElement('canvas');
        drawCanvas(downloadCanvas, 512); // Higher res for download
        const link = document.createElement('a');
        link.href = downloadCanvas.toDataURL('image/png');
        link.download = `discord-pfp.png`;
        link.click();
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a perfect circular profile picture for Discord.</p>
        </div>
        {!imageSrc ? (
            <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <div>
                        <label>Zoom ({Math.round(zoom * 100)}%)</label>
                        <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full mt-1" />
                    </div>
                    <div>
                        <label>Border Width ({borderWidth}px)</label>
                        <input type="range" min="0" max="20" value={borderWidth} onChange={e => setBorderWidth(parseInt(e.target.value))} className="w-full mt-1" />
                    </div>
                    <div>
                        <label>Border Color</label>
                        <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-full h-10 p-1 border rounded-md cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div
                        className="relative w-full max-w-sm mx-auto aspect-square"
                        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                    >
                        {isLoading && <Loader />}
                        <canvas ref={canvasRef} className={`w-full h-auto rounded-full shadow-lg cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} />
                    </div>
                     <div className="flex gap-4">
                        <button onClick={() => setImageSrc(null)} className="btn-secondary">Change Image</button>
                        <button onClick={handleDownload} className="btn-primary">Download</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
