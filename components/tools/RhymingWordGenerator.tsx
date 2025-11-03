import React, { useState } from 'react';
import { generateRhymingWords } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="letter-loader mx-auto">
            <span className="l l1">R</span>
            <span className="l l2">H</span>
            <span className="l l3">Y</span>
            <span className="l l4">M</span>
            <span className="l l5">E</span>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding rhymes...</p>
        <style>{`
            .letter-loader {
                display: flex;
                gap: 8px;
            }
            .l {
                font-size: 2rem;
                font-weight: bold;
                color: #6366f1; /* indigo-500 */
                animation: bounce-letter 1.5s infinite;
            }
            .dark .l { color: #818cf8; }
            .l1 { animation-delay: 0s; }
            .l2 { animation-delay: 0.1s; }
            .l3 { animation-delay: 0.2s; }
            .l4 { animation-delay: 0.3s; }
            .l5 { animation-delay: 0.4s; }

            @keyframes bounce-letter {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
        `}</style>
    </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const RhymingWordGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [word, setWord] = useState('');
    const [rhymes, setRhymes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!word.trim()) {
            setError("Please enter a word to find rhymes for.");
            return;
        }
        setIsLoading(true);
        setRhymes([]);
        setError(null);

        try {
            const result = await generateRhymingWords(word);
            setRhymes(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate rhymes.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find words that rhyme for your poems, songs, or raps.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label className="block text-sm font-medium">Word to rhyme with</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="e.g., time, bright, flow"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md"
                        >
                            {isLoading ? 'Finding...' : 'Find Rhymes'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : rhymes.length > 0 ? (
                        <div className="w-full animate-fade-in">
                            <h2 className="text-xl font-bold mb-4">Words that rhyme with "{word}"</h2>
                            <div className="flex flex-wrap gap-3">
                                {rhymes.map((rhyme, index) => (
                                    <span key={index} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full font-semibold shadow-sm border border-slate-200 dark:border-slate-700">
                                        {rhyme}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p>Your rhyming words will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </>
    );
};
