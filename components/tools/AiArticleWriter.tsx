
import React, { useState } from 'react';
import { generateArticle } from '../../services/geminiService';
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
            {copied ? 'Copied!' : 'Copy Article'}
        </button>
    );
};

// FIX: Add title prop to component to resolve error from App.tsx.
export const AiArticleWriter: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [article, setArticle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }
        setIsLoading(true);
        setArticle('');
        setError(null);

        try {
            const generatedText = await generateArticle(topic);
            setArticle(generatedText);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred while generating the article.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const clearError = () => setError(null);

    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 📝</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter a topic and let our AI craft a unique article for you.</p>
            </div>
            
            <div className="space-y-4">
                 <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Article Topic</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                            placeholder="e.g., The Future of Renewable Energy"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            aria-label="Article Topic"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 min-h-[300px] bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-full text-center m-auto">
                        <div className="typing-loader">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Crafting your article...</p>
                    </div>
                ) : article ? (
                    <>
                        <div className="max-w-none whitespace-pre-wrap text-left text-slate-800 dark:text-slate-200 leading-relaxed">
                            {article}
                        </div>
                        <div className="mt-6 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                            <CopyButton textToCopy={article} />
                        </div>
                    </>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        <p className="mt-4 text-lg">Your generated article will appear here.</p>
                    </div>
                )}
            </div>
             
        </div>
        {error && <Toast message={error} onClose={clearError} />}
        <style>
        {`
            .prose {
                line-height: 1.7;
            }
            .typing-loader {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .typing-loader .dot {
                width: 12px;
                height: 12px;
                background-color: #6366f1; /* indigo-500 */
                border-radius: 50%;
                margin: 0 4px;
                animation: typing-animation 1.4s infinite;
            }
            .dark .typing-loader .dot {
                background-color: #818cf8; /* indigo-400 */
            }
            .typing-loader .dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-loader .dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typing-animation {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1.0);
                }
            }
        `}
        </style>
        </>
    );
};
