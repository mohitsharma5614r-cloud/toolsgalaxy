import React, { useState } from 'react';
import { generateBrandNames } from '../../services/geminiService';
import { Toast } from '../Toast';

const vibes = ['Modern', 'Classic', 'Playful', 'Luxurious', 'Minimalist', 'Bold'];

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


export const BrandNameFinder: React.FC = () => {
    const [industry, setIndustry] = useState('');
    const [vibe, setVibe] = useState(vibes[0]);
    const [names, setNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!industry.trim()) {
            setError("Please enter an industry or some keywords.");
            return;
        }
        setIsLoading(true);
        setNames([]);
        setError(null);

        try {
            const result = await generateBrandNames(industry, vibe);
            setNames(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate brand names.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Brand Name Finder</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Discover the perfect name for your next big idea.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry / Keywords</label>
                        <input
                            id="industry"
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="e.g., Sustainable coffee, Tech startup"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="vibe" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Desired Vibe</label>
                        <select
                            id="vibe"
                            value={vibe}
                            onChange={(e) => setVibe(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                            {vibes.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !industry.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Find Names'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto text-center">
                           <div className="name-loader">
                                <div className="char">N</div>
                                <div className="char">A</div>
                                <div className="char">M</div>
                                <div className="char">E</div>
                                <div className="char">S</div>
                            </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Brainstorming names...</p>
                        </div>
                    ) : names.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {names.map((name, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{name}</p>
                                    <CopyButton textToCopy={name} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <p className="mt-4 text-lg">Your generated brand names will appear here.</p>
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
                .name-loader {
                    display: flex;
                    gap: 8px;
                    perspective: 400px;
                }
                .name-loader .char {
                    width: 40px;
                    height: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: white;
                    background-color: #6366f1; /* indigo-500 */
                    border-radius: 6px;
                    animation: flip-char 2.5s infinite;
                }
                .dark .name-loader .char {
                    background-color: #818cf8; /* indigo-400 */
                }
                .name-loader .char:nth-child(1) { animation-delay: 0s; }
                .name-loader .char:nth-child(2) { animation-delay: 0.1s; }
                .name-loader .char:nth-child(3) { animation-delay: 0.2s; }
                .name-loader .char:nth-child(4) { animation-delay: 0.3s; }
                .name-loader .char:nth-child(5) { animation-delay: 0.4s; }
                @keyframes flip-char {
                    0%, 100% {
                        transform: rotateX(0deg);
                    }
                    50% {
                        transform: rotateX(180deg);
                        background-color: #a5b4fc; /* indigo-300 */
                    }
                }
            `}</style>
        </>
    );
};