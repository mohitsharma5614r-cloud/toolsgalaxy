import React, { useState } from 'react';
import { generateTattooDesign } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Minimalist', 'Geometric', 'Watercolor', 'Tribal', 'Neo-Traditional', 'Dotwork'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="tattoo-gun-loader mx-auto">
            <div className="gun-body"></div>
            <div className="needle"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Inking your idea...</p>
    </div>
);


export const TattooDesignIdeaGenerator: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [style, setStyle] = useState<string>(styles[0]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea.trim()) {
            setError("Please describe your tattoo idea.");
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const imageBase64 = await generateTattooDesign(idea, style);
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
        link.download = `tattoo-design-${idea.replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Tattoo Design Idea Generator 🖋️</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get creative AI-generated ideas for your next tattoo.</p>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="idea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Describe your tattoo idea</label>
                    <textarea
                        id="idea"
                        rows={2}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g., a wolf howling at a geometric moon"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Choose a style</label>
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
                    disabled={isLoading || !idea.trim()}
                    className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 transform hover:scale-105"
                >
                  Generate Design
                </button>
            </div>
            
            <div className="mt-8 min-h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                {isLoading ? (
                    <Loader />
                ) : generatedImage ? (
                    <div className="text-center animate-fade-in">
                        <img src={generatedImage} alt="Generated tattoo design" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg bg-white"/>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M20.42 10.18L12.71 2.47a1.5 1.5 0 0 0-2.12 0L2.88 10.18"/><path d="M18.82 17.18a1.5 1.5 0 0 0 2.12 0l-7.71-7.71a1.5 1.5 0 0 0-2.12 0l-7.71 7.71a1.5 1.5 0 0 0 2.12 2.12L12 11.83l6.82 6.82a1.5 1.5 0 0 0 1.5-1.5z"/></svg>
                        <p className="mt-4 text-lg">Your tattoo design will appear here.</p>
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
            .tattoo-gun-loader {
                width: 100px;
                height: 100px;
                position: relative;
                transform: rotate(-45deg);
            }
            .gun-body {
                width: 60px;
                height: 25px;
                background: #475569; /* slate-600 */
                border-radius: 5px;
                position: absolute;
                top: 30px;
                left: 10px;
            }
            .gun-body::before, .gun-body::after {
                content: '';
                position: absolute;
                background: #475569; /* slate-600 */
            }
            .gun-body::before {
                width: 15px;
                height: 40px;
                right: 5px;
                top: -30px;
                border-radius: 5px;
            }
            .gun-body::after {
                width: 10px;
                height: 10px;
                top: -20px;
                right: -10px;
                border-radius: 50%;
            }
            .needle {
                width: 4px;
                height: 50px;
                background: #9ca3af; /* slate-400 */
                position: absolute;
                left: 0;
                top: 30px;
                transform-origin: 50% 0;
                animation: buzz 0.1s infinite linear;
            }
            .dark .gun-body, .dark .gun-body::before, .dark .gun-body::after {
                background: #94a3b8; /* slate-400 */
            }
            .dark .needle {
                background: #e2e8f0; /* slate-200 */
            }
            @keyframes buzz {
                0% { transform: translateY(0); }
                50% { transform: translateY(2px); }
                100% { transform: translateY(0); }
            }
        `}
        </style>
        </>
    );
};
