import React, { useState } from 'react';
import { generateWallpaper } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Abstract', 'Nature', 'Sci-Fi', 'Anime', 'Minimalist', 'Vibrant'];
const ratios = [
    { label: 'Desktop', value: '16:9' },
    { label: 'Phone', value: '9:16' },
    { label: 'Tablet', value: '4:3' },
    { label: 'Square', value: '1:1' },
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="wallpaper-loader mx-auto">
            <div className="flow f1"></div>
            <div className="flow f2"></div>
            <div className="flow f3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Creating your wallpaper...</p>
    </div>
);

export const WallpaperMaker: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState<string>(styles[0]);
    const [aspectRatio, setAspectRatio] = useState<string>(ratios[0].value);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please describe the wallpaper you want to create.");
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        const fullPrompt = `${style} style wallpaper of ${prompt}.`;

        try {
            const imageBase64 = await generateWallpaper(fullPrompt, aspectRatio);
            if (imageBase64) {
                setGeneratedImage(`data:image/jpeg;base64,${imageBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try a different idea.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `wallpaper-${prompt.replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Wallpaper Maker 🎨</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create custom wallpapers for your devices with AI.</p>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">1. Describe your wallpaper</label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., a calming lo-fi anime scene of a room at night"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">2. Choose a style</label>
                    <div className="flex flex-wrap gap-2">
                        {styles.map(s => (
                            <button
                                key={s}
                                onClick={() => setStyle(s)}
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${style === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">3. Select a format</label>
                    <div className="flex flex-wrap gap-2">
                        {ratios.map(r => (
                            <button
                                key={r.value}
                                onClick={() => setAspectRatio(r.value)}
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${aspectRatio === r.value ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                {r.label} ({r.value})
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 transform hover:scale-105"
                >
                  Generate Wallpaper
                </button>
            </div>
            
            <div className="mt-8 min-h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                {isLoading ? (
                    <Loader />
                ) : generatedImage ? (
                    <div className="text-center animate-fade-in">
                        <img src={generatedImage} alt="Generated wallpaper" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"/>
                        <button 
                            onClick={handleDownload}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                        >
                            Download
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400">
                         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <p className="mt-4 text-lg">Your custom wallpaper will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        {error && <Toast message={error} onClose={() => setError(null)} />}
        <style>
        {`
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
            .wallpaper-loader {
                width: 100px;
                height: 100px;
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid #6366f1;
            }
            .flow {
                position: absolute;
                width: 150%;
                height: 150%;
                background: linear-gradient(#818cf8, #c084fc);
                border-radius: 40%;
                animation: flow-anim 4s infinite linear;
            }
            .flow.f1 {
                top: -25%;
                left: -25%;
            }
             .flow.f2 {
                top: -25%;
                left: -25%;
                animation-delay: -1s;
                background: linear-gradient(#a5b4fc, #f472b6);
            }
             .flow.f3 {
                top: -25%;
                left: -25%;
                animation-delay: -2s;
                background: linear-gradient(#60a5fa, #34d399);
            }

            @keyframes flow-anim {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        `}
        </style>
        </>
    );
};
