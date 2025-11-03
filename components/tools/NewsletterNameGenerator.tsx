import React, { useState } from 'react';
import { generateNewsletterNames } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="newspaper-loader mx-auto">
            <div className="roller r1"></div>
            <div className="paper">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className="roller r2"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Going to Press...</p>
        <style>{`
            .newspaper-loader {
                width: 120px;
                height: 80px;
                position: relative;
            }
            .roller {
                width: 100%;
                height: 20px;
                background: #64748b;
                border-radius: 4px;
                position: absolute;
                animation: spin-roller 1s linear infinite;
            }
            .dark .roller { background: #94a3b8; }
            .roller.r1 { top: 0; }
            .roller.r2 { bottom: 0; }
            .paper {
                position: absolute;
                top: 100%;
                left: 10%;
                width: 80%;
                height: 100px;
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                animation: print-paper 2s linear infinite;
                padding: 5px;
                box-sizing: border-box;
            }
            .dark .paper { background: #1e293b; border-color: #334155; }
            .paper .line {
                height: 4px;
                background: #cbd5e1;
                margin-top: 8px;
                border-radius: 2px;
            }
            .dark .paper .line { background: #475569; }
            .paper .line:nth-child(2) { width: 90%; }
            .paper .line:nth-child(3) { width: 95%; }

            @keyframes spin-roller {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes print-paper {
                0% { top: 100%; }
                100% { top: -100%; }
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

export const NewsletterNameGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your newsletter.");
            return;
        }
        setIsLoading(true);
        setNames([]);
        setError(null);

        try {
            const result = await generateNewsletterNames(topic);
            setNames(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate names.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Newsletter Name Generator 📬</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate creative names for your newsletter.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Newsletter Topic or Niche</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., weekly tech news, sustainable living tips"
                            className="flex-grow w-full input-style"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all disabled:bg-slate-400"
                        >
                            {isLoading ? 'Generating...' : 'Generate Names'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
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
                            <p className="text-lg">Your newsletter name ideas will appear here.</p>
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
