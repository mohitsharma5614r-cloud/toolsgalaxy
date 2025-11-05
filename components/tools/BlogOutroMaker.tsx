import React, { useState } from 'react';
import { generateBlogOutro } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="book-loader mx-auto">
            <div className="book">
                <div className="book__pg-shadow"></div>
                <div className="book__pg"></div>
                <div className="book__pg book__pg--2"></div>
                <div className="book__pg book__pg--3"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Crafting a strong conclusion...</p>
        <style>{`
            .book-loader {
                --book-color: #a5b4fc;
                --book-cover-color: #6366f1;
            }
            .dark .book-loader {
                --book-color: #4338ca;
                --book-cover-color: #818cf8;
            }
            .book {
                position: relative;
                width: 80px;
                height: 55px;
                perspective: 1000px;
            }
            .book__pg-shadow {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transform-origin: 100% 50%;
                animation: page-close 2.5s infinite;
                background: linear-gradient(to left, rgba(0,0,0,0) 80%, rgba(0,0,0,0.1) 100%);
            }
            .book__pg {
                position: absolute;
                right: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: var(--book-color);
                border: 2px solid var(--book-cover-color);
                border-radius: 5px 0 0 5px;
                transform-style: preserve-3d;
                transform-origin: 100% 50%;
                animation: page-close 2.5s infinite;
            }
            .book__pg--2 { animation-delay: 0.1s; }
            .book__pg--3 { animation-delay: 0.2s; }

            @keyframes page-close {
                0%, 10% { transform: rotateY(0deg); }
                50% { transform: rotateY(180deg); }
                100% { transform: rotateY(180deg); }
            }
        `}</style>
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
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md"
        >
            {copied ? 'Copied!' : 'Copy Outro'}
        </button>
    );
};

export const BlogOutroMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [summary, setSummary] = useState('');
    const [outro, setOutro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim() || !summary.trim()) {
            setError("Please fill out both topic and summary fields.");
            return;
        }
        setIsLoading(true);
        setOutro('');
        setError(null);

        try {
            const result = await generateBlogOutro(topic, summary);
            setOutro(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate the conclusion.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Blog Outro Maker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Craft compelling conclusions for your articles.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blog Post Topic</label>
                        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The Future of AI in Daily Life" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Summary of Main Points (1-2 sentences)</label>
                        <textarea
                            rows={3}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="e.g., We discussed how AI is impacting healthcare and transportation, and considered the ethical implications."
                            className="w-full input-style"
                        />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !topic.trim() || !summary.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                        {isLoading ? 'Generating...' : 'Generate Outro'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : outro ? (
                        <div className="w-full animate-fade-in text-center">
                            <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left whitespace-pre-wrap">
                                {outro}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={outro} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p className="text-lg">Your blog conclusion will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
