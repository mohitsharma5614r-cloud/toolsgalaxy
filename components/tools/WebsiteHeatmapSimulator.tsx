import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="eye-scanner-loader mx-auto">
            <div className="eye-outline">
                <div className="pupil"></div>
            </div>
            <div className="scan-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Simulating user attention...</p>
        <style>{`
            .eye-scanner-loader {
                width: 120px;
                height: 80px;
                position: relative;
            }
            .eye-outline {
                width: 100%;
                height: 100%;
                border: 4px solid #9ca3af; /* slate-400 */
                border-radius: 50%;
                position: relative;
            }
            .dark .eye-outline { border-color: #64748b; }
            .pupil {
                width: 30px;
                height: 30px;
                background: #6366f1;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .scan-line {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 3px;
                height: 100%;
                background: #ef4444;
                animation: scan-eye 2s infinite linear;
            }
            @keyframes scan-eye {
                from { transform: translateX(-50%) scaleY(0); transform-origin: top; }
                to { transform: translateX(-50%) scaleY(1); transform-origin: top; }
            }
        `}</style>
    </div>
);

// Deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

export const WebsiteHeatmapSimulator: React.FC<{ title: string }> = ({ title }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateHeatmap = useCallback((file: File) => {
        setIsLoading(true);
        setError(null);
        setHeatmapUrl(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) {
                    setIsLoading(false);
                    return;
                }
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setIsLoading(false);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                // Draw base image
                ctx.drawImage(img, 0, 0);

                // Define potential hotspot areas
                const hotspots = [
                    { x: 0.5, y: 0.2, intensity: 0.8 }, // Headline
                    { x: 0.8, y: 0.3, intensity: 0.7 }, // CTA button
                    { x: 0.3, y: 0.5, intensity: 0.6 }, // Image
                    { x: 0.5, y: 0.6, intensity: 0.5 }, // Body text
                    { x: 0.2, y: 0.15, intensity: 0.4 }, // Logo
                ];
                
                const hash = stringToHash(file.name);

                hotspots.forEach((spot, i) => {
                    const radius = (spot.intensity * (canvas.width / 4)) * (1 + (hash % (i+1)) / 10 - 0.2); // vary size slightly
                    const x = spot.x * canvas.width + ((hash % 100) - 50); // vary position slightly
                    const y = spot.y * canvas.height + ((hash % 80) - 40);

                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
                    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.2)');
                    gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                });

                setHeatmapUrl(canvas.toDataURL());
                setIsLoading(false);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);
    
    const handleImageUpload = (file: File) => {
        setImageFile(file);
        generateHeatmap(file);
    };

    const handleReset = () => {
        setImageFile(null);
        setHeatmapUrl(null);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload a screenshot to simulate a user attention heatmap.</p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     heatmapUrl ? (
                        <div className="space-y-4 animate-fade-in">
                            <img src={heatmapUrl} alt="Heatmap simulation" className="w-full h-auto rounded-lg shadow-md" />
                             <div className="text-center">
                                <button onClick={handleReset} className="btn-primary">Analyze Another Image</button>
                            </div>
                        </div>
                     ) : (
                        <ImageUploader onImageUpload={handleImageUpload} />
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                 .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};