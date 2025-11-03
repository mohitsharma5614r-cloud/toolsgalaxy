import React, { useState } from 'react';

const jokes = [
    "Dark humor is like food. Not everyone gets it.",
    "My grief counselor died the other day. He was so good at his job, I don't even care.",
    "The doctor gave me one year to live, so I shot him. The judge gave me 20 years. Problem solved.",
    "My wife told me she'll slam my head on the keyboard if I don't get off the computer. I'm not too worried, I think she's jokinlkjhfakljn m,.nb,aj...",
    "Why don't cannibals eat clowns? Because they taste funny.",
    "I have a joke about trickle-down economics. But 99% of you will never get it.",
    "I visited my new friend in his apartment. He told me to make myself at home. So I threw him out. I hate having visitors.",
    "What's red and bad for your teeth? A brick.",
    "My girlfriend’s dog died, so I tried to cheer her up by getting her an identical one. It just made her more upset. She screamed, 'What am I supposed to do with two dead dogs?'",
    "Why did the man miss the funeral? He wasn't a mourning person.",
];

const Loader: React.FC = () => (
    <div className="candle-loader">
        <div className="candle">
            <div className="flame"></div>
            <div className="wax"></div>
        </div>
        <div className="smoke"></div>
    </div>
);

export const DarkHumorGenerator: React.FC = () => {
    const [joke, setJoke] = useState<string>('Click the button to generate a joke... if you dare.');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateJoke = () => {
        setIsLoading(true);
        setTimeout(() => {
            let newJoke = joke;
            // Make sure we get a new joke
            while (newJoke === joke) {
                newJoke = jokes[Math.floor(Math.random() * jokes.length)];
            }
            setJoke(newJoke);
            setIsLoading(false);
        }, 2000); // Animation duration
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
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Dark Humor Generator 🕶️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Warning: For those with a specific taste in humor.</p>
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
                        {isLoading ? 'Generating...' : 'Generate Another'}
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

                .candle-loader {
                    width: 50px;
                    height: 100px;
                    position: relative;
                }
                .candle {
                    width: 100%;
                    height: 100%;
                }
                .wax {
                    width: 100%;
                    height: 100%;
                    background: #f1f5f9; /* slate-100 */
                    border-radius: 8px;
                    border: 3px solid #94a3b8; /* slate-400 */
                }
                .dark .wax {
                    background: #334155; /* slate-700 */
                    border-color: #64748b; /* slate-500 */
                }
                .flame {
                    width: 16px;
                    height: 32px;
                    background: #f59e0b; /* amber-500 */
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform-origin: 50% 100%;
                    transform: translateX(-50%);
                    animation: flicker 1.5s infinite, extinguish 2s forwards;
                }
                .smoke {
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    width: 4px;
                    height: 10px;
                    background: #94a3b8;
                    border-radius: 50%;
                    opacity: 0;
                    animation: puff-smoke 2s forwards;
                }
                
                @keyframes flicker {
                    0%, 100% { transform: translateX(-50%) scaleY(1) rotate(0.5deg); }
                    50% { transform: translateX(-50%) scaleY(1.05) rotate(-0.5deg); }
                }

                @keyframes extinguish {
                    0%, 90% { opacity: 1; }
                    100% { opacity: 0; transform: translateX(-50%) scale(0); }
                }
                
                @keyframes puff-smoke {
                    90% { transform: translate(-50%, 0) scale(1); opacity: 0; }
                    100% { transform: translate(-50%, -20px) scale(3); opacity: 0.8; }
                }
            `}</style>
        </>
    );
};
