import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

export const ImageHistogramViewer: React.FC<{ title: string }> = ({ title }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const histogramRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());

    const drawHistogram = useCallback(() => {
        if (!imageSrc) return;

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
        
        const rHist = new Array(256).fill(0);
        const gHist = new Array(256).fill(0);
        const bHist = new Array(256).fill(0);

        for (let i = 0; i < data.length; i += 4) {
            rHist[data[i]]++;
            gHist[data[i + 1]]++;
            bHist[data[i + 2]]++;
        }
        
        const histCanvas = histogramRef.current;
        if (!histCanvas) return;
        const histCtx = histCanvas.getContext('2d');
        if (!histCtx) return;

        histCanvas.width = 512;
        histCanvas.height = 200;
        histCtx.clearRect(0,0, histCanvas.width, histCanvas.height);
        
        const plot = (hist: number[], color: string) => {
            const max = Math.max(...hist);
            histCtx.beginPath();
            histCtx.strokeStyle = color;
            histCtx.lineWidth = 2;
            histCtx.globalCompositeOperation = 'lighter';
            for(let i=0; i<256; i++) {
                const x = (i / 255) * histCanvas.width;
                const y = histCanvas.height - (hist[i] / max) * histCanvas.height;
                if(i === 0) histCtx.moveTo(x,y);
                else histCtx.lineTo(x,y);
            }
            histCtx.stroke();
        };

        plot(rHist, 'rgba(255, 0, 0, 0.7)');
        plot(gHist, 'rgba(0, 255, 0, 0.7)');
        plot(bHist, 'rgba(0, 0, 255, 0.7)');
        histCtx.globalCompositeOperation = 'source-over';

    }, [imageSrc]);

    useEffect(() => {
        imageRef.current.onload = drawHistogram;
    }, [drawHistogram]);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const url = e.target?.result as string;
            setImageSrc(url);
            imageRef.current.src = url;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Analyze the color distribution of your image.</p>
            </div>

            <ImageUploader onImageUpload={handleImageUpload} />

            {imageSrc && (
                <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold text-center mb-4">Color Histogram</h2>
                    <canvas ref={histogramRef} className="w-full h-auto bg-slate-100 dark:bg-slate-900 rounded-md" />
                </div>
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};
