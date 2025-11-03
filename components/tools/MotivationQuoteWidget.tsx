import React, { useState, useEffect, useCallback } from 'react';
import { generateQuote, Quote } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="sparkle-loader mx-auto">
            <div className="spark s1"></div>
            <div className="spark s2"></div>
            <div className="spark s3"></div>
            <div className="spark s4"></div>
            <div className="spark s5"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding some inspiration...</p>
    </div>
);

export const MotivationQuoteWidget: React.FC = () => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [quoteKey, setQuoteKey] = useState(0);

    const fetchQuote = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newQuote = await generateQuote();
            setQuote(newQuote);
            setQuoteKey(key => key + 1); // Trigger fade-in animation
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch a new quote.");
            setQuote({ quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);

    const handleCopy = () => {
        if (!quote) return;
        navigator.clipboard.writeText(`"${quote.quote}" - ${quote.author}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Motivation Quote Widget ✨</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your daily dose of AI-powered inspiration.</p>
                </div>

                <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading && !quote ? (
                        <Loader />
                    ) : quote ? (
                        <div key={quoteKey} className="text-center animate-fade-in space-y-4">
                            <blockquote className="text-2xl italic font-serif text-slate-800 dark:text-slate-100">
                                "{quote.quote}"
                            </blockquote>
                            <cite className="block text-right not-italic text-slate-500 dark:text-slate-400">
                                — {quote.author}
                            </cite>
                        </div>
                    ) : (
                        <p className="text-slate-500">No quote available.</p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={fetchQuote}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? 'animate-spin' : ''}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        {isLoading ? 'Loading...' : 'New Quote'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={!quote}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@1,400&display=swap');
                
                .font-serif {
                    font-family: 'Merriweather', serif;
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .sparkle-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }

                .spark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 6px;
                    height: 6px;
                    background-color: #818cf8; /* indigo-400 */
                    border-radius: 50%;
                    animation: sparkle 2s infinite;
                }
                .dark .spark {
                     background-color: #a5b4fc; /* indigo-300 */
                }

                .spark.s1 { animation-delay: 0s; }
                .spark.s2 { animation-delay: 0.2s; }
                .spark.s3 { animation-delay: 0.4s; }
                .spark.s4 { animation-delay: 0.6s; }
                .spark.s5 { animation-delay: 0.8s; }

                @keyframes sparkle {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg) translateX(0) scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) rotate(180deg) translateX(40px) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg) translateX(0) scale(0);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};