import React, { useState } from 'react';
import { generateBookTitles } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="book-loader mx-auto">
            <div className="book">
                <div className="book__pg-shadow"></div>
                <div className="book__pg"></div>
                <div className="book__pg book__pg--2"></div>
                <div className="book__pg book__pg--3"></div>
                <div className="book__pg book__pg--4"></div>
                <div className="book__pg book__pg--5"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Flipping through ideas...</p>
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
                transform-origin: 0% 50%;
                animation: page-flip 2.5s infinite;
                background: linear-gradient(to right, rgba(0,0,0,0) 80%, rgba(0,0,0,0.1) 100%);
            }
            .book__pg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: var(--book-color);
                border: 2px solid var(--book-cover-color);
                border-radius: 0 5px 5px 0;
                transform-style: preserve-3d;
                transform-origin: 0% 50%;
                animation: page-flip 2.5s infinite;
            }
            .book__pg--2 { animation-delay: 0.1s; }
            .book__pg--3 { animation-delay: 0.2s; }
            .book__pg--4 { animation-delay: 0.3s; }
            .book__pg--5 { animation-delay: 0.4s; }
            @keyframes page-flip {
                0%, 10% { transform: rotateY(0deg); }
                50% { transform: rotateY(-180deg); }
                100% { transform: rotateY(-180deg); }
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
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const BookTitleGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic or genre.");
            return;
        }
        setIsLoading(true);
        setTitles([]);
        setError(null);

        try {
            const result = await generateBookTitles(topic);
            setTitles(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate titles.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Book Title Generator 📖</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find the perfect title for your book.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Book Topic, Genre, or Keywords</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., a fantasy epic about dragons, a sci-fi mystery"
                            className="flex-grow w-full input-style"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all disabled:bg-slate-400"
                        >
                            {isLoading ? 'Generating...' : 'Generate Titles'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : titles.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {titles.map((title, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</p>
                                    <CopyButton textToCopy={title} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <p className="text-lg">Your book title ideas will appear here.</p>
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
