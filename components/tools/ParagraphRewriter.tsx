import React, { useState } from 'react';
import { rewriteParagraph } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="rewrite-loader mx-auto">
            <div className="arrow a1">→</div>
            <div className="arrow a2">←</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Rephrasing your text...</p>
        <style>{`
            .rewrite-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .arrow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                font-size: 80px;
                line-height: 80px;
                color: #6366f1; /* indigo-500 */
                animation: spin 2s infinite linear;
            }
            .dark .arrow { color: #818cf8; }
            .arrow.a2 {
                animation-direction: reverse;
                animation-delay: -1s;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
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
            {copied ? 'Copied!' : 'Copy Text'}
        </button>
    );
};

export const ParagraphRewriter: React.FC = () => {
    const [originalText, setOriginalText] = useState('');
    const [rewrittenText, setRewrittenText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!originalText.trim()) {
            setError("Please enter a paragraph to rewrite.");
            return;
        }
        setIsLoading(true);
        setRewrittenText('');
        setError(null);

        try {
            const result = await rewriteParagraph(originalText);
            setRewrittenText(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to rewrite the paragraph.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Paragraph Rewriter ✍️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Rephrase paragraphs to improve clarity and style.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Paragraph</label>
                        <textarea
                            rows={8}
                            value={originalText}
                            onChange={(e) => setOriginalText(e.target.value)}
                            placeholder="Paste the paragraph you want to improve..."
                            className="w-full input-style"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !originalText.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Rewriting...' : 'Rewrite Paragraph'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : rewrittenText ? (
                        <div className="w-full animate-fade-in text-center">
                            <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left">
                                {rewrittenText}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={rewrittenText} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your rewritten paragraph will appear here.</p>
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
