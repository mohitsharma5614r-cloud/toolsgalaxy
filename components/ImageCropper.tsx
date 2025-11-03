import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';

interface ImageCropperProps {
  title: string;
  description: string;
  aspectRatio: number; // width / height
  outputWidth: number;
}

// Loader component for cropping
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="crop-loader mx-auto">
            <div className="crop-frame"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your image...</p>
        <style>{`
            .crop-loader { width: 100px; height: 100px; position: relative; border: 3px solid #cbd5e1; border-radius: 4px; }
            .dark .crop-loader { border-color: #475569; }
            .crop-frame { position: absolute; border: 3px solid #4f46e5; animation: crop-anim 2s infinite ease-in-out; }
            @keyframes crop-anim { 0%,100%{top:0;left:0;right:0;bottom:0} 50%{top:20px;left:20px;right:20px;bottom:20px} }
        `}</style>
    </div>
);

export const ImageCropper: React.FC<ImageCropperProps> = ({ title, description, aspectRatio, outputWidth }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startDragPos = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img.src) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to preview size but maintain aspect ratio
    const previewWidth = Math.min(600, window.innerWidth - 60);
    canvas.width = previewWidth;
    canvas.height = previewWidth / aspectRatio;

    // Clear canvas
    ctx.fillStyle = '#e2e8f0'; // slate-200
    if (document.documentElement.classList.contains('dark')) {
      ctx.fillStyle = '#1e293b'; // slate-800
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled image dimensions to fit canvas
    const imgAspectRatio = img.width / img.height;
    let drawWidth, drawHeight;

    if (imgAspectRatio > aspectRatio) {
        drawHeight = canvas.height * zoom;
        drawWidth = drawHeight * imgAspectRatio;
    } else {
        drawWidth = canvas.width * zoom;
        drawHeight = drawWidth / imgAspectRatio;
    }

    // Clamp offsets to keep image within bounds
    const maxOffsetX = Math.max(0, (drawWidth - canvas.width) / 2);
    const maxOffsetY = Math.max(0, (drawHeight - canvas.height) / 2);
    const clampedX = Math.max(-maxOffsetX, Math.min(offset.x, maxOffsetX));
    const clampedY = Math.max(-maxOffsetY, Math.min(offset.y, maxOffsetY));

    const drawX = (canvas.width - drawWidth) / 2 + clampedX;
    const drawY = (canvas.height - drawHeight) / 2 + clampedY;
    
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

  }, [zoom, offset, aspectRatio]);

  useEffect(() => {
    if (imageSrc) {
      drawCanvas();
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
      const img = imageRef.current;
      const ctx = downloadCanvas.getContext('2d');
      if (!ctx) {
          setIsLoading(false);
          return;
      }
      
      downloadCanvas.width = outputWidth;
      downloadCanvas.height = outputWidth / aspectRatio;

      const imgAspectRatio = img.width / img.height;
      let drawWidth, drawHeight;

      if (imgAspectRatio > aspectRatio) {
          drawHeight = downloadCanvas.height * zoom;
          drawWidth = drawHeight * imgAspectRatio;
      } else {
          drawWidth = downloadCanvas.width * zoom;
          drawHeight = drawWidth / imgAspectRatio;
      }

      const drawX = (downloadCanvas.width - drawWidth) / 2 + offset.x;
      const drawY = (downloadCanvas.height - drawHeight) / 2 + offset.y;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      const link = document.createElement('a');
      link.href = downloadCanvas.toDataURL('image/jpeg', 0.9);
      link.download = `cropped-image.jpg`;
      link.click();
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{description}</p>
      </div>

      {!imageSrc ? (
        <ImageUploader onImageUpload={handleImageUpload} />
      ) : (
        <div className="space-y-6">
          <div className="relative w-full max-w-full mx-auto" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {isLoading && <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center"><Loader/></div>}
            <canvas ref={canvasRef} className={`w-full h-auto rounded-lg shadow-lg cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`} />
          </div>
          
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
            <label className="text-sm font-medium">Zoom ({Math.round(zoom * 100)}%)</label>
            <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full mt-1" />
          </div>

          <div className="flex gap-4">
            <button onClick={() => setImageSrc(null)} className="w-full px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md">Change Image</button>
            <button onClick={handleDownload} className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">Download</button>
          </div>
        </div>
      )}
    </div>
  );
};
