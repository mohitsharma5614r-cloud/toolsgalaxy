import React, { useState } from 'react';

// Data for advice
const adviceList = [
    "Listen more than you speak. You might learn something.",
    "Don't be afraid to ask for help. It's a sign of strength, not weakness.",
    "Read a book on a topic you know nothing about. Expand your horizons.",
    "Spend time in nature. It's cheaper than therapy and twice as effective.",
    "Always be learning. Curiosity is the engine of achievement.",
    "Forgive others, not because they deserve forgiveness, but because you deserve peace.",
    "You can't pour from an empty cup. Take care of yourself first.",
    "It's okay to say 'no'. Protect your time and energy.",
    "Don't compare your chapter 1 to someone else's chapter 20.",
    "If it costs you your peace of mind, it's too expensive.",
    "Celebrate your small wins. They're the stepping stones to big successes.",
    "The best time to plant a tree was 20 years ago. The second best time is now."
];

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="owl-loader mx-auto">
            <div className="owl-body">
                <div className="owl-eye left"></div>
                <div className="owl-eye right"></div>
                <div className="owl-beak"></div>
            </div>
            <div className="branch"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Consulting the wise owl...</p>
    </div>
);

// Main Component
export const LifeAdviceGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [advice, setAdvice] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateAdvice = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newAdvice = advice;
            // Ensure a new piece of advice is generated
            while (newAdvice === advice) {
                newAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];
            }
            setAdvice(newAdvice);
            setIsLoading(false);
        }, 1800); // Animation duration
    };

    const handleCopy = () => {
        if (!advice) return;
        navigator.clipboard.writeText(advice);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🦉</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get some words of wisdom to guide your day.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : advice ? (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{advice}"
                        </p>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">Click the button to get some advice!</p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateAdvice}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Get Advice'}
                    </button>
                    {advice && !isLoading && (
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

                .owl-loader {
                    width: 80px;
                    height: 100px;
                    position: relative;
                }
                .owl-body {
                    width: 100%;
                    height: 80px;
                    background: #a1887f; /* Brownish */
                    border-radius: 50% 50% 20% 20%;
                    position: absolute;
                    bottom: 0;
                    animation: owl-bob 2.5s infinite ease-in-out;
                }
                .dark .owl-body { background: #bcaaa4; }
                .owl-eye {
                    width: 25px;
                    height: 25px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 20px;
                    border: 3px solid #5d4037;
                }
                .owl-eye.left { left: 12px; }
                .owl-eye.right { right: 12px; }
                .owl-eye::before {
                    content: '';
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #3e2723;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: blink 2.5s infinite;
                }
                .owl-beak {
                    position: absolute;
                    top: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 10px 8px 0 8px;
                    border-color: #ff9800 transparent transparent transparent;
                }
                .branch {
                    width: 120px;
                    height: 12px;
                    background: #795548;
                    border-radius: 6px;
                    position: absolute;
                    bottom: -6px;
                    left: -20px;
                    border: 3px solid #4e342e;
                }
                
                @keyframes owl-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes blink {
                    0%, 90%, 100% { transform: translate(-50%, -50%) scaleY(1); }
                    95% { transform: translate(-50%, -50%) scaleY(0); }
                }
            `}</style>
        </>
    );
};