import React, { useState } from 'react';

const affirmations = [
    "I am capable of achieving great things.",
    "I choose to be happy and to love myself today.",
    "My potential to succeed is infinite.",
    "I am growing and learning every day.",
    "I have the power to create the life I desire.",
    "I am resilient and can overcome any challenge.",
    "I radiate positivity and attract good things.",
    "I am worthy of love, happiness, and success.",
    "I trust in my abilities and my journey.",
    "Every day is a new opportunity to shine.",
    "I am grateful for all that I have.",
    "I release all doubts and embrace my inner strength."
];

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="sunrise-loader mx-auto">
            <div className="sun"></div>
            <div className="horizon"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your affirmation...</p>
    </div>
);

// Main Component
export const DailyAffirmationGenerator: React.FC = () => {
    const [affirmation, setAffirmation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateAffirmation = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newAffirmation = affirmation;
            // Ensure a new affirmation is generated
            while (newAffirmation === affirmation) {
                newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
            }
            setAffirmation(newAffirmation);
            setIsLoading(false);
        }, 1800); // Animation duration
    };

    const handleCopy = () => {
        if (!affirmation) return;
        navigator.clipboard.writeText(affirmation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Daily Affirmation Generator ☀️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get a positive affirmation for your day.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : affirmation ? (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{affirmation}"
                        </p>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">Click the button to get started!</p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateAffirmation}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Get New Affirmation'}
                    </button>
                    {affirmation && !isLoading && (
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
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

                .sunrise-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                    overflow: hidden;
                }
                .sun {
                    width: 50px;
                    height: 50px;
                    background: #f59e0b; /* amber-500 */
                    border-radius: 50%;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: rise 1.8s infinite ease-in;
                    box-shadow: 0 0 20px #fde047;
                }
                .horizon {
                    width: 100%;
                    height: 3px;
                    background: #6366f1; /* indigo-500 */
                    position: absolute;
                    bottom: 25px;
                    left: 0;
                }
                
                @keyframes rise {
                    0% {
                        transform: translate(-50%, 30px);
                    }
                    100% {
                        transform: translate(-50%, -50px);
                    }
                }
            `}</style>
        </>
    );
};