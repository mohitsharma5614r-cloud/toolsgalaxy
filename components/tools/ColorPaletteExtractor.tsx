import React, { useState } from 'react';
import { ImageUploader } from '../ImageUploader';

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');

const getPalette = (img: HTMLImageElement): string[] => {
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 100;
    const scale = MAX_WIDTH / img.width;
    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    const colorCounts: { [key: string]: { count: number; r: number; g: number; b: number } } = {};
    const R_BUCKET_SIZE = 40;
    const G_BUCKET_SIZE = 40;
    const B_BUCKET_SIZE = 40;

    for (let i = 0; i < imageData.length; i += 4) {
        const [r, g, b] = [imageData[i], imageData[i+1], imageData[i+2]];
        
        // Create a bucket key by reducing color depth
        const key = `${Math.floor(r / R_BUCKET_SIZE)}-${Math.floor(g / G_BUCKET_SIZE)}-${Math.floor(b / B_BUCKET_SIZE)}`;
        
        if (!colorCounts[key]) {
            colorCounts[key] = { count: 0, r: 0, g: 0, b: 0 };
        }
        
        colorCounts[key].count++;
        colorCounts[key].r += r;
        colorCounts[key].g += g;
        colorCounts[key].b += b;
    }

    const sortedColors = Object.values(colorCounts).sort((a, b) => b.count - a.count);
    
    return sortedColors.slice(0, 5).map(color => {
        const avgR = Math.round(color.r / color.count);
        const avgG = Math.round(color.g / color.count);
        const avgB = Math.round(color.b / color.count);
        return rgbToHex(avgR, avgG, avgB);
    });
};

// FIX: Add title prop to component.
export const ColorPaletteExtractor: React.FC<{ title: string }> = ({ title }) => {
    const [palette, setPalette] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const extractedPalette = getPalette(img);
                setPalette(extractedPalette);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        setImageFile(file);
    };

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload an image to automatically generate a color palette.</p>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} />
            {palette.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Generated Palette</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {palette.map((color) => (
                            <div key={color} className="flex flex-col items-center group">
                                <button
                                    onClick={() => copyToClipboard(color)}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-lg transition-transform duration-200 hover:scale-110 border-2 border-transparent group-hover:border-indigo-500"
                                    style={{ backgroundColor: color }}
                                    aria-label={`Copy color ${color}`}
                                />
                                <span className="mt-3 text-sm font-mono p-1 px-2 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300">
                                    {copiedColor === color ? 'Copied!' : color}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};