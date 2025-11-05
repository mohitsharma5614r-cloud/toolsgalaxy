import React, { useState } from 'react';
import { expandEssay } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="expand-loader mx-auto">
            <span className="char c1">E</span>
            <span className="char c2">X</span>
            <span className="char c3">P</span>
            <span className="char c4">A</span>
            <span className="char c5">N</span>
            <span className="char c6">D</span>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Expanding your ideas...</p>
        <style>{`
            .expand-loader {
                width: 120px;
                height: 40px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .char {
                font-size: 24px;
                font-weight: bold;
                color: #6366f1; /* indigo-500 */
                animation: expand-chars 2.5s infinite ease-in-out;
            }
            .dark .char { color: #818cf8; }
            .c1 { animation-delay: 0s; }
            .c2 { animation-delay: 0.1s; }
            .c3 { animation-delay: 0.2s; }
            .c4 { animation-delay: 0.3s; }
            .c5 { animation-delay: 0.4s; }
            .c6 { animation-delay: 0.5s; }

            @keyframes expand-chars {
                0%, 100% { transform: scale(1); letter-spacing: 2px; }
                50% { transform: scale(1.1); letter-spacing: 8px; }
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
            {copied ? 'Copied!' : 'Copy Essay'}
        </button>
    );
};

export const EssayExpander: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [expandedText, setExpandedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError("Please enter some points to expand.");
            return;
        }
        setIsLoading(true);
        setExpandedText('');
        setError(null);

        try {
            const result = await expandEssay(inputText);
            setExpandedText(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to expand the text.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Essay Expander 📝</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Expand on short sentences or bullet points to create longer essays.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Sentences or Bullet Points</label>
                        <textarea
                            rows={5}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="- AI is changing the world.\n- It has pros and cons.\n- The future is uncertain."
                            className="w-full input-style"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !inputText.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Expanding...' : 'Expand Essay'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : expandedText ? (
                        <div className="w-full animate-fade-in text-center">
                            <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left whitespace-pre-wrap">
                                {expandedText}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={expandedText} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your expanded essay will appear here.</p>
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
