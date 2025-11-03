import React, { useState } from 'react';
import { generateJoke } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="laughing-loader mx-auto">
            <div className="emoji">😆</div>
            <div className="ha ha1">Ha!</div>
            <div className="ha ha2">Ha!</div>
            <div className="ha ha3">Ha!</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Thinking of a zinger...</p>
    </div>
);

export const JokeGenerator: React.FC = () => {
    const [joke, setJoke] = useState<string>('Click the button to get a random joke!');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setCopied(false);
        setError(null);
        try {
            const newJoke = await generateJoke();
            setJoke(newJoke);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't fetch a joke right now.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(joke);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Joke Generator 🤣</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get a random joke from AI to lighten the mood.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{joke}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Tell Me a Joke'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy Joke'}
                    </button>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .laughing-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }
                .emoji {
                    font-size: 80px;
                    line-height: 1;
                    animation: shake-laugh 0.6s infinite;
                }
                .ha {
                    position: absolute;
                    font-weight: bold;
                    color: #818cf8; /* indigo-400 */
                    opacity: 0;
                    animation: pop-ha 1.8s infinite;
                }
                .ha.ha1 {
                    top: -10px;
                    left: 0;
                    animation-delay: 0s;
                }
                .ha.ha2 {
                    top: 10px;
                    right: -10px;
                    animation-delay: 0.6s;
                }
                .ha.ha3 {
                    bottom: -5px;
                    left: 10px;
                    animation-delay: 1.2s;
                }
                
                @keyframes shake-laugh {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(5deg); }
                    75% { transform: rotate(-5deg); }
                }

                @keyframes pop-ha {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    20% { opacity: 1; transform: scale(1.2); }
                    33% { opacity: 0; transform: scale(1.5); }
                }
            `}</style>
        </>
    );
};
