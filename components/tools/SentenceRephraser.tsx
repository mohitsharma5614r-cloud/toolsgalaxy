import React, { useState } from 'react';
import { rephraseSentence } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Formal', 'Casual', 'Confident', 'More Concise', 'More Descriptive'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="rewrite-loader mx-auto">
            <div className="arrow a1">→</div>
            <div className="arrow a2">←</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Rephrasing your sentence...</p>
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

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const SentenceRephraser: React.FC<{ title: string }> = ({ title }) => {
    const [original, setOriginal] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!original.trim()) {
            setError("Please enter a sentence to rephrase.");
            return;
        }
        setIsLoading(true);
        setSuggestions([]);
        setError(null);

        try {
            const result = await rephraseSentence(original, tone);
            setSuggestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to rephrase the sentence.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Rephrase your sentences to improve clarity and style.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Your Sentence</label>
                        <textarea
                            rows={4}
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                            placeholder="Enter the sentence you want to improve..."
                            className="w-full input-style"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Desired Tone</label>
                         <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !original.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg"
                    >
                        {isLoading ? 'Rephrasing...' : 'Rephrase Sentence'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : suggestions.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            <h2 className="text-xl font-bold mb-2">Suggestions:</h2>
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-md text-slate-800 dark:text-slate-200 pr-4">{suggestion}</p>
                                    <CopyButton textToCopy={suggestion} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p>Your rephrased sentences will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`.input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; } .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }`}</style>
        </>
    );
};
