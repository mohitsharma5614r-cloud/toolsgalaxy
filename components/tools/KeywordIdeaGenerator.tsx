import React, { useState } from 'react';
import { generateKeywordIdeas, KeywordResult } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="keyword-loader mx-auto">
            <div className="magnifying-glass"></div>
            <div className="text-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Searching for keywords...</p>
        <style>{`
            .keyword-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .magnifying-glass {
                width: 50px;
                height: 50px;
                border: 6px solid #6366f1;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 0;
                animation: scan 2.5s infinite ease-in-out;
            }
            .dark .magnifying-glass { border-color: #818cf8; }
            .magnifying-glass::after {
                content: '';
                position: absolute;
                width: 8px;
                height: 25px;
                background-color: #6366f1;
                bottom: -20px;
                right: -10px;
                transform: rotate(-45deg);
            }
            .dark .magnifying-glass::after { background-color: #818cf8; }

            .text-line {
                position: absolute;
                width: 80%;
                height: 6px;
                background-color: #cbd5e1;
                border-radius: 3px;
                bottom: 10px;
                left: 10%;
            }
            .dark .text-line { background-color: #475569; }

            @keyframes scan {
                0%, 100% { transform: translate(0, 0) rotate(0); }
                25% { transform: translate(40px, 0) rotate(20deg); }
                50% { transform: translate(50px, 40px) rotate(-10deg); }
                75% { transform: translate(10px, 50px) rotate(30deg); }
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

export const KeywordIdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState<KeywordResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }
        setIsLoading(true);
        setKeywords(null);
        setError(null);

        try {
            const result = await generateKeywordIdeas(topic);
            setKeywords(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate keywords.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Keyword Idea Generator 🔍</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Discover new keywords for your content and SEO.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Main Topic or Keyword</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., home gardening, digital cameras"
                            className="flex-grow w-full input-style"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md"
                        >
                            {isLoading ? 'Generating...' : 'Find Keywords'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : keywords ? (
                        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            <KeywordList title="Long-Tail" keywords={keywords.longTail} />
                            <KeywordList title="Related" keywords={keywords.related} />
                            <KeywordList title="Questions" keywords={keywords.questions} />
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p className="text-lg">Your keyword ideas will appear here.</p>
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

const KeywordList: React.FC<{ title: string, keywords: string[] }> = ({ title, keywords }) => (
    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">{title}</h3>
            <CopyButton textToCopy={keywords.join('\n')} />
        </div>
        <ul className="space-y-2">
            {keywords.map((kw, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-400">{kw}</li>)}
        </ul>
    </div>
);
