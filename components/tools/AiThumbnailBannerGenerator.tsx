
import React, { useState } from 'react';
import { generateThumbnailOrBanner } from '../../services/geminiService';
import { Toast } from '../Toast';

const aspectRatios = [
    { label: '16:9', value: '16:9', name: 'Thumbnail' },
    { label: '1:1', value: '1:1', name: 'Square' },
    { label: '9:16', value: '9:16', name: 'Story' },
    { label: '4:3', value: '4:3', name: 'Standard' },
];

// FIX: Add title prop to component to resolve error from App.tsx.
export const AiThumbnailBannerGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<string>(aspectRatios[0].value);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate an image.");
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const imageBase64 = await generateThumbnailOrBanner(prompt, aspectRatio);
            if (imageBase64) {
                setGeneratedImage(`data:image/jpeg;base64,${imageBase64}`);
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'generated-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearError = () => setError(null);

    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🖼️</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create stunning visuals for your content with a simple text prompt.</p>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Description</label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A vibrant, futuristic cityscape at sunset for a tech podcast"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Aspect Ratio</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {aspectRatios.map(ratio => (
                            <button
                                key={ratio.value}
                                onClick={() => setAspectRatio(ratio.value)}
                                disabled={isLoading}
                                className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${aspectRatio === ratio.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-indigo-500'}`}
                            >
                                <span className="block">{ratio.name}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-400">{ratio.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  Generate Image
                </button>
            </div>
            
            <div className="mt-8 min-h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                {isLoading ? (
                    <div className="text-center">
                        <div className="image-loader">
                            <div className="layer"></div>
                            <div className="layer"></div>
                            <div className="layer"></div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Designing your visual...</p>
                    </div>
                ) : generatedImage ? (
                    <div className="text-center animate-fade-in">
                        <img src={generatedImage} alt="Generated thumbnail or banner" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"/>
                        <button 
                            onClick={handleDownload}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <p className="mt-4 text-lg">Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        {error && <Toast message={error} onClose={clearError} />}
        <style>
        {`
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
            .image-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .image-loader .layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 3px solid #6366f1; /* indigo-500 */
                border-radius: 12px;
                animation: layer-anim 2.4s infinite ease-in-out;
            }
            .dark .image-loader .layer {
                border-color: #818cf8; /* indigo-400 */
            }
            .image-loader .layer:nth-child(2) {
                animation-delay: 0.8s;
            }
            .image-loader .layer:nth-child(3) {
                animation-delay: 1.6s;
            }
            @keyframes layer-anim {
                0% {
                    transform: scale(0.5);
                    opacity: 0;
                }
                25% {
                    transform: scale(1);
                    opacity: 1;
                }
                75% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.2);
                    opacity: 0;
                }
            }
        `}
        </style>
        </>
    );
};
