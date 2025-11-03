import React, { useState } from 'react';

const scenarios = [
    "What if humans could photosynthesize like plants?",
    "What if gravity was a choice you could turn on or off?",
    "What if every animal could talk for just one hour a day?",
    "What if you woke up with a new, random superpower every morning?",
    "What if the internet suddenly disappeared for a week?",
    "What if you could live in any fictional world, but you couldn't come back?",
    "What if everyone's dreams were broadcast live for others to see?",
    "What if you found a notebook that made anything you write in it come true?",
    "What if rain was made of paint, with different colors every day?",
    "What if you could perfectly understand the 'language' of machines and computers?",
    "What if people's hair changed color based on their emotions?",
    "What if you could trade your skills with someone else for a day?"
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="what-if-loader mx-auto">
            <div className="brain">🧠</div>
            <div className="question-mark q1">?</div>
            <div className="question-mark q2">?</div>
            <div className="question-mark q3">?</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Pondering the possibilities...</p>
    </div>
);

export const WhatIfScenarioGenerator: React.FC = () => {
    const [scenario, setScenario] = useState<string>('Click the button for a thought-provoking scenario!');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateScenario = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newScenario = scenario;
            // Ensure a new scenario is generated
            while (newScenario === scenario) {
                newScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            }
            setScenario(newScenario);
            setIsLoading(false);
        }, 2000); // Animation duration
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(scenario);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">“What If?” Scenario Generator 🤯</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate interesting 'what if' questions to spark your imagination.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{scenario}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateScenario}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Scenario'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy'}
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

                .what-if-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }
                .brain {
                    font-size: 80px;
                    line-height: 1;
                    animation: brain-pulse 2s infinite ease-in-out;
                }
                .question-mark {
                    position: absolute;
                    font-size: 30px;
                    font-weight: bold;
                    color: #818cf8; /* indigo-400 */
                    opacity: 0;
                    animation: pop-q 2s infinite;
                }
                .q1 { top: -10px; left: 10px; animation-delay: 0s; }
                .q2 { top: 20px; right: -15px; animation-delay: 0.5s; }
                .q3 { bottom: 0; left: -10px; animation-delay: 1s; }
                
                @keyframes brain-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes pop-q {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    25% { opacity: 1; transform: scale(1.2); }
                    50%, 100% { opacity: 0; transform: scale(0.5) translateY(-20px); }
                }
            `}</style>
        </>
    );
};