import React, { useState } from 'react';
import { generateBlogIntro } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="writing-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="pen-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="pen-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="writing-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Writing an engaging intro...</p>
        <style>{`
            .dark .pen-body { fill: #cbd5e1; }
            .dark .pen-nib { fill: #0f172a; }
            .dark .writing-line { stroke: #818cf8; }

            .writing-line {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-line 1.5s 0.5s forwards;
            }

            .pen-body, .pen-nib {
                animation: move-pen 2s forwards;
            }

            @keyframes draw-line {
                to { stroke-dashoffset: 0; }
            }

            @keyframes move-pen {
                0% { transform: translate(-20px, 20px) rotate(15deg); }
                25% { transform: translate(0, 0) rotate(15deg); }
                100% { transform: translate(80px, 0) rotate(15deg); }
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
            {copied ? 'Copied!' : 'Copy Intro'}
        </button>
    );
};

export const BlogIntroMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [intro, setIntro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a blog topic.");
            return;
        }
        setIsLoading(true);
        setIntro('');
        setError(null);

        try {
            const result = await generateBlogIntro(topic);
            setIntro(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate the intro.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Blog Intro Maker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Write engaging introductions for your blog posts.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Blog Post Topic</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., The benefits of remote work"
                            className="flex-grow w-full input-style"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md"
                        >
                            {isLoading ? 'Generating...' : 'Generate Intro'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : intro ? (
                        <div className="w-full animate-fade-in text-center">
                            <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left whitespace-pre-wrap">
                                {intro}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={intro} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p className="text-lg">Your blog intro will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
