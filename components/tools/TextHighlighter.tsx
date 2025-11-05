import React, { useState, useMemo } from 'react';
import { highlightText } from '../../services/geminiService';
import { Toast } from '../Toast';

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105"
            disabled={!textToCopy}
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
            {copied ? 'Copied!' : 'Copy Highlights'}
        </button>
    );
};

// Function to escape special regex characters
const escapeRegex = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const TextHighlighter: React.FC = () => {
    const [rawText, setRawText] = useState('');
    const [highlightedSentences, setHighlightedSentences] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleHighlight = async () => {
        if (!rawText.trim()) {
            setError("Please paste some text to highlight.");
            return;
        }
        setIsLoading(true);
        setHighlightedSentences([]);
        setError(null);

        try {
            const result = await highlightText(rawText);
            setHighlightedSentences(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to highlight text.");
        } finally {
            setIsLoading(false);
        }
    };

    const highlightedContent = useMemo(() => {
        if (!rawText || highlightedSentences.length === 0) {
            return <p>{rawText}</p>;
        }

        const escapedSentences = highlightedSentences.map(escapeRegex);
        const regex = new RegExp(`(${escapedSentences.join('|')})`, 'gi');
        
        const parts = rawText.split(regex).filter(part => part);

        return parts.map((part, index) => {
             const isHighlighted = highlightedSentences.some(sentence => sentence.toLowerCase() === part.toLowerCase());
             if (isHighlighted) {
                return <mark key={index} className="bg-yellow-300 dark:bg-yellow-500/70 text-slate-900 dark:text-slate-900 rounded px-1 py-0.5">{part}</mark>;
             }
             return <span key={index}>{part}</span>;
        });

    }, [rawText, highlightedSentences]);
    
    const formatHighlightsForCopy = (): string => {
        return highlightedSentences.map(s => `- ${s}`).join('\n');
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Text Highlighter</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Automatically find and highlight the key points in your text.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                         <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">1. Your Text</h2>
                        <textarea
                            rows={15}
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste your article, notes, or any text you want to analyze..."
                            className="w-full flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <button 
                            onClick={handleHighlight} 
                            disabled={isLoading || !rawText.trim()}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                            {isLoading ? 'Analyzing...' : 'Highlight Key Points'}
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">2. Highlighted Result</h2>
                        <div className="min-h-[400px] bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
                            {isLoading ? (
                                <div className="m-auto text-center">
                                    <div className="highlighter-loader mx-auto">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                        <div className="line"></div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding key points...</p>
                                </div>
                            ) : highlightedSentences.length > 0 ? (
                                <div className="flex-grow flex flex-col justify-between animate-fade-in">
                                    <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left leading-relaxed">
                                        {highlightedContent}
                                    </div>
                                    <div className="mt-6 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <CopyButton textToCopy={formatHighlightsForCopy()} />
                                    </div>
                                </div>
                            ) : (
                                <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><path d="m15 5 3 3"/></svg>
                                    <p className="mt-4 text-lg">Your highlighted text will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
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
                .highlighter-loader {
                    width: 80px;
                    height: 60px;
                    position: relative;
                }
                .highlighter-loader .line {
                    width: 100%;
                    height: 8px;
                    background-color: #e2e8f0; /* slate-200 */
                    border-radius: 4px;
                    position: absolute;
                }
                .dark .highlighter-loader .line {
                    background-color: #475569; /* slate-600 */
                }
                .highlighter-loader .line:nth-child(1) { top: 0; }
                .highlighter-loader .line:nth-child(2) { top: 25px; }
                .highlighter-loader .line:nth-child(3) { top: 50px; }
                .highlighter-loader .highlighter {
                    width: 0;
                    height: 12px;
                    background-color: rgba(253, 224, 71, 0.7); /* yellow-300 */
                    border-radius: 6px;
                    position: absolute;
                    top: -2px;
                    animation: highlight-anim 2.5s infinite linear;
                }
                @keyframes highlight-anim {
                    0% { top: -2px; left: 0; width: 0; }
                    15% { width: 100%; }
                    25% { left: auto; right: 0; width: 0; }
                    33% { top: 23px; right: 0; width: 0; }
                    48% { width: 100%; }
                    58% { right: auto; left: 0; width: 0; }
                    66% { top: 48px; left: 0; width: 0; }
                    81% { width: 100%; }
                    91% { left: auto; right: 0; width: 0; }
                    100% { top: 48px; right: 0; width: 0; }
                }
            `}</style>
        </>
    );
};
