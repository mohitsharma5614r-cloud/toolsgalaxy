import React, { useState } from 'react';
import { generateTweetIdeas } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="bird-loader mx-auto">
            <svg viewBox="0 0 50 50">
                <path className="bird-body" d="M10,25 Q25,10 40,25 Q25,40 10,25 Z" />
                <path className="bird-wing" d="M20,25 Q25,15 30,25 L25,30 Z" />
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating tweet ideas...</p>
        <style>{`
            .bird-loader { width: 80px; height: 80px; }
            .bird-body { fill: #818cf8; } .dark .bird-body { fill: #a5b4fc; }
            .bird-wing { fill: #6366f1; transform-origin: 22px 25px; animation: flap 0.4s infinite alternate; }
            .dark .bird-wing { fill: #818cf8; }
            @keyframes flap { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
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

export const TweetIdeaMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }
        setIsLoading(true);
        setIdeas([]);
        setError(null);

        try {
            const result = await generateTweetIdeas(topic);
            setIdeas(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate ideas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Tweet Idea Maker 🐦</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Never run out of ideas for what to tweet.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Topic or Keywords</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., productivity hacks, frontend development"
                            className="flex-grow w-full input-style"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md"
                        >
                            {isLoading ? 'Generating...' : 'Generate Ideas'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : ideas.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {ideas.map((idea, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-md text-slate-800 dark:text-slate-200 pr-4">{idea}</p>
                                    <CopyButton textToCopy={idea} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p className="text-lg">Your tweet ideas will appear here.</p>
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
