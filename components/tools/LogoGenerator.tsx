import React, { useState } from 'react';
import { generateLogo } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Minimalist', 'Bold', 'Vintage', 'Futuristic', 'Elegant'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="logo-loader mx-auto">
            <div className="shape"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Designing your logo...</p>
    </div>
);

export const LogoGenerator: React.FC = () => {
    const [brandName, setBrandName] = useState('');
    const [keywords, setKeywords] = useState('');
    const [style, setStyle] = useState<string>(styles[0]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!brandName.trim() || !keywords.trim()) {
            setError("Please provide a brand name and some keywords.");
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const imageBase64 = await generateLogo(brandName, keywords, style);
            if (imageBase64) {
                setGeneratedImage(`data:image/jpeg;base64,${imageBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try a different prompt.");
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
        link.download = `logo-${brandName.replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Logo Generator 🪪</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a unique logo icon for your brand in seconds.</p>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="brandName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">1. Brand Name</label>
                    <input
                        id="brandName"
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g., Nova Coffee"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                        disabled={isLoading}
                    />
                </div>
                 <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">2. Keywords (what your brand is about)</label>
                    <input
                        id="keywords"
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g., coffee bean, morning, energy"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">3. Choose a style</label>
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
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !brandName.trim() || !keywords.trim()}
                    className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 transform hover:scale-105"
                >
                  Generate Logo
                </button>
            </div>
            
            <div className="mt-8 min-h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                {isLoading ? (
                    <Loader />
                ) : generatedImage ? (
                    <div className="text-center animate-fade-in">
                        <div className="p-4 bg-white rounded-lg shadow-inner">
                            <img src={generatedImage} alt="Generated logo" className="max-w-full max-h-[256px] object-contain"/>
                        </div>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                        <p className="mt-4 text-lg">Your generated logo will appear here.</p>
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
            .logo-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .shape {
                width: 100%;
                height: 100%;
                border: 5px solid #6366f1; /* indigo-500 */
                animation: morph-shape 4s infinite linear;
            }
             .dark .shape {
                border-color: #818cf8; /* indigo-400 */
             }

            @keyframes morph-shape {
                0%, 100% {
                    border-radius: 50%; /* Circle */
                    transform: rotate(0deg);
                }
                25% {
                    border-radius: 0%; /* Square */
                    transform: rotate(90deg);
                }
                50% {
                    border-radius: 0%; /* Square */
                    transform: rotate(180deg) scale(0.8);
                }
                75% {
                    border-radius: 50% 50% 0 50%; /* Triangle-ish */
                    transform: rotate(270deg) scale(1.1);
                }
            }
        `}
        </style>
        </>
    );
};