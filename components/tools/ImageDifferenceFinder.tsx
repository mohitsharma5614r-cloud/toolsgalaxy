import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';

export const ImageDifferenceFinder: React.FC<{ title: string }> = ({ title }) => {
    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [diffImage, setDiffImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const findDifference = useCallback(() => {
        if (!image1 || !image2) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img1 = new Image();
        const img2 = new Image();

        let loaded = 0;
        const onBothLoaded = () => {
            canvas.width = Math.max(img1.width, img2.width);
            canvas.height = Math.max(img1.height, img2.height);

            ctx.drawImage(img1, 0, 0);
            ctx.globalCompositeOperation = 'difference';
            ctx.drawImage(img2, 0, 0);
            
            // Optional: Invert to make differences stand out more, or apply a color filter
            
            setDiffImage(canvas.toDataURL());
        };
        
        img1.onload = () => { loaded++; if(loaded === 2) onBothLoaded(); };
        img2.onload = () => { loaded++; if(loaded === 2) onBothLoaded(); };
        
        img1.src = image1;
        img2.src = image2;
    }, [image1, image2]);

    useEffect(() => {
        findDifference();
    }, [findDifference]);

    const handleImage1Upload = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => setImage1(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleImage2Upload = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => setImage2(e.target?.result as string);
        reader.readAsDataURL(file);
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find the visual differences between two images.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <ImageUploader onImageUpload={handleImage1Upload} />
                <ImageUploader onImageUpload={handleImage2Upload} />
            </div>

            {diffImage && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold text-center mb-4">Difference</h2>
                    <img src={diffImage} className="max-w-full h-auto mx-auto rounded-md" />
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )}
        </div>
    );
};
