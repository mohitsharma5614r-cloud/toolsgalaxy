import React, { useState } from 'react';
import { generateTaglines } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Professional', 'Creative', 'Bold', 'Inspirational', 'Witty', 'Elegant'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="tagline-loader mx-auto">
            <div className="tag-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
            </div>
            <div className="sparkle sp1"></div>
            <div className="sparkle sp2"></div>
            <div className="sparkle sp3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Crafting your tagline...</p>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const TaglineMaker: React.FC = () => {
    const [brandInfo, setBrandInfo] = useState('');
    const [style, setStyle] = useState(styles[0]); // Default to 'Professional'
    const [taglines, setTaglines] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!brandInfo.trim()) {
            setError("Please enter your brand name or description.");
            return;
        }
        setIsLoading(true);
        setTaglines([]);
        setError(null);

        try {
            const result = await generateTaglines(brandInfo, style);
            setTaglines(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate taglines.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Tagline Maker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a memorable tagline for your brand in seconds.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="brandInfo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand Name or Description</label>
                        <input
                            id="brandInfo"
                            type="text"
                            value={brandInfo}
                            onChange={(e) => setBrandInfo(e.target.value)}
                            placeholder="e.g., TechFlow - AI-powered productivity tools"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tagline Style</label>
                         <div className="flex flex-wrap gap-2">
                            {styles.map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setStyle(s)} 
                                    className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${
                                        style === s 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !brandInfo.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Taglines'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : taglines.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {taglines.map((tagline, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{tagline}</p>
                                    <CopyButton textToCopy={tagline} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                <line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>
                            <p className="mt-4 text-lg">Your memorable taglines will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                
                .tagline-loader {
                    position: relative;
                    width: 80px;
                    height: 80px;
                }
                .tag-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: tag-swing 2s ease-in-out infinite;
                }
                .tag-icon svg {
                    color: #6366f1;
                    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
                }
                .dark .tag-icon svg {
                    color: #818cf8;
                }
                .sparkle {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: #f59e0b;
                    border-radius: 50%;
                    opacity: 0;
                }
                .sp1 { animation: sparkle-animation 2s infinite; animation-delay: 0s; top: 15%; left: 20%; }
                .sp2 { animation: sparkle-animation 2s infinite; animation-delay: 0.7s; top: 70%; left: 75%; }
                .sp3 { animation: sparkle-animation 2s infinite; animation-delay: 1.4s; top: 40%; right: 10%; }

                @keyframes tag-swing {
                    0%, 100% { transform: translate(-50%, -50%) rotate(-5deg); }
                    50% { transform: translate(-50%, -50%) rotate(5deg); }
                }
                @keyframes sparkle-animation {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
            `}</style>
        </>
    );
};
