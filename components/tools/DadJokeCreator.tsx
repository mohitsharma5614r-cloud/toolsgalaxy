import React, { useState } from 'react';

const jokes = [
    "I'm afraid for the calendar. Its days are numbered.",
    "My wife said I should do lunges to stay in shape. That would be a big step forward.",
    "Why do fathers take an extra pair of socks when they go golfing? In case they get a hole in one!",
    "Singing in the shower is fun until you get soap in your mouth. Then it's a soap opera.",
    "What do you call a fish wearing a bowtie? Sofishticated.",
    "How do you follow Will Smith in the snow? You follow the fresh prints.",
    "If April showers bring May flowers, what do May flowers bring? Pilgrims.",
    "I thought the dryer was shrinking my clothes. Turns out it was the refrigerator all along.",
    "What do you call a factory that makes okay products? A satisfactory.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "What did the zero say to the eight? Nice belt!",
    "I don't trust stairs. They're always up to something.",
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="drum-loader mx-auto">
            <div className="cymbal-stand"></div>
            <div className="cymbal"></div>
            <div className="drum">
                <div className="drum-top"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Ba Dum Tss...</p>
    </div>
);

export const DadJokeCreator: React.FC = () => {
    const [joke, setJoke] = useState<string>('Ready for a classic dad joke? Hit the button!');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateJoke = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newJoke = joke;
            // Make sure we get a new joke
            while (newJoke === joke) {
                newJoke = jokes[Math.floor(Math.random() * jokes.length)];
            }
            setJoke(newJoke);
            setIsLoading(false);
        }, 1500); // Animation duration
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
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Dad Joke Creator 👨‍🦳</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get ready to groan. The best (or worst) dad jokes are here.</p>
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
                        onClick={generateJoke}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Tell Me A Joke'}
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
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .drum-loader {
                    width: 120px;
                    height: 80px;
                    position: relative;
                }
                .drum {
                    width: 60px;
                    height: 40px;
                    background: #ca8a04; /* amber-600 */
                    border: 3px solid #78350f; /* amber-900 */
                    border-radius: 50% / 20px;
                    position: absolute;
                    bottom: 0;
                    left: 10px;
                }
                .dark .drum {
                    background: #d97706; /* amber-500 */
                    border: 3px solid #fde68a; /* amber-200 */
                }
                .drum-top {
                    width: 60px;
                    height: 15px;
                    background: #f1f5f9;
                    border-radius: 50% / 8px;
                    position: absolute;
                    top: -2px;
                    left: -3px; /* account for border */
                    border: 3px solid #9ca3af;
                    animation: drum-hit 1.5s infinite ease-in-out;
                }
                .dark .drum-top {
                    background: #e2e8f0;
                    border-color: #f1f5f9;
                }
                .cymbal {
                    width: 50px;
                    height: 8px;
                    background: #f59e0b;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 40px;
                    right: 0;
                    transform-origin: bottom;
                    animation: cymbal-hit 1.5s infinite ease-in-out;
                }
                .dark .cymbal {
                    background: #fcd34d;
                }
                .cymbal-stand {
                    width: 4px;
                    height: 45px;
                    background: #9ca3af;
                    position: absolute;
                    bottom: 0;
                    right: 23px;
                }
                .dark .cymbal-stand {
                    background: #d1d5db;
                }
                @keyframes drum-hit {
                    0%, 100% { transform: scale(1); }
                    10% { transform: scale(0.95); }
                    20% { transform: scale(1); }
                }
                @keyframes cymbal-hit {
                    0%, 40%, 100% { transform: rotate(0); }
                    50% { transform: rotate(-10deg); }
                    60% { transform: rotate(10deg); }
                    70% { transform: rotate(-5deg); }
                    80% { transform: rotate(5deg); }
                }

            `}</style>
        </>
    );
};
