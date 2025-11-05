import React, { useState } from 'react';
import { summarizeArticle } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="funnel-loader mx-auto">
            <div className="funnel-top"></div>
            <div className="funnel-neck"></div>
            <div className="funnel-drop"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Distilling key points...</p>
        <style>{`
            .funnel-loader {
                width: 80px;
                height: 100px;
                position: relative;
            }
            .funnel-top {
                width: 100%;
                height: 30px;
                border: 5px solid #6366f1;
                border-bottom: none;
                border-radius: 10px 10px 0 0;
            }
            .dark .funnel-top { border-color: #818cf8; }
            .funnel-neck {
                width: 30px;
                height: 40px;
                border-left: 5px solid #6366f1;
                border-right: 5px solid #6366f1;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 30px;
            }
            .dark .funnel-neck { border-color: #818cf8; }
            .funnel-neck::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(#a5b4fc, transparent);
                animation: flow-down 2s infinite linear;
            }
            .funnel-drop {
                width: 8px;
                height: 8px;
                background-color: #4f46e5;
                border-radius: 50%;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                animation: drop-drip 2s infinite;
            }
            .dark .funnel-drop { background-color: #a5b4fc; }

            @keyframes flow-down {
                from { transform: translateY(-100%); }
                to { transform: translateY(100%); }
            }
            @keyframes drop-drip {
                0%, 50% { opacity: 0; }
                60% { opacity: 1; }
                100% { bottom: -20px; opacity: 0; }
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
            {copied ? 'Copied!' : 'Copy Summary'}
        </button>
    );
};

export const ArticleSummarizer: React.FC = () => {
    const [articleText, setArticleText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!articleText.trim()) {
            setError("Please paste an article to summarize.");
            return;
        }
        setIsLoading(true);
        setSummary('');
        setError(null);

        try {
            const result = await summarizeArticle(articleText);
            setSummary(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to summarize the article.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Article Summarizer 📚</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Summarize long articles into key points instantly.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paste your article here</label>
                        <textarea
                            rows={15}
                            value={articleText}
                            onChange={(e) => setArticleText(e.target.value)}
                            placeholder="Paste the full text of the article you want to summarize..."
                            className="w-full input-style"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !articleText.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Summarizing...' : 'Summarize Article'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : summary ? (
                        <div className="w-full animate-fade-in text-center">
                            <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left" dangerouslySetInnerHTML={{ __html: summary.replace(/•/g, '<li>').replace(/\n/g, '<br/>') }} />
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={summary} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your summary will appear here.</p>
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
