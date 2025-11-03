import React, { useState } from 'react';

const roasts = [
    "I'd agree with you but then we'd both be wrong.",
    "You're the reason the gene pool needs a lifeguard.",
    "If I wanted to kill myself, I would climb your ego and jump to your IQ.",
    "You have your entire life to be an idiot. Why not take today off?",
    "I'm not saying you're stupid, I'm just saying you have bad luck when it comes to thinking.",
    "Remember that time you said that cool thing? Yeah, me neither.",
    "If you were any less intelligent, you'd have to be watered twice a week.",
    "Mirrors can't talk. Lucky for you, they can't laugh either.",
    "You're not the dumbest person in the world, but you'd better hope they don't die.",
    "I'd call you a tool, but even they serve a purpose.",
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="fire-loader mx-auto">
            <div className="flame f1"></div>
            <div className="flame f2"></div>
            <div className="flame f3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Cooking up a roast...</p>
    </div>
);

export const RoastMeGenerator: React.FC = () => {
    const [roast, setRoast] = useState<string>('Click the button to get roasted.');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateRoast = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newRoast = roast;
            // Make sure we get a new roast
            while (newRoast === roast) {
                newRoast = roasts[Math.floor(Math.random() * roasts.length)];
            }
            setRoast(newRoast);
            setIsLoading(false);
        }, 2000); // Animation duration
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(roast);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Roast Me Generator 🔥</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Don't take it personally. Or do. I don't care.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{roast}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateRoast}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Roasting...' : 'Roast Me'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy Roast'}
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

                .fire-loader {
                    width: 80px;
                    height: 100px;
                    position: relative;
                }
                .flame {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 40px;
                    height: 100px;
                    background-color: #fb923c; /* orange-400 */
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    transform-origin: 50% 100%;
                    animation: move-flame 2s infinite ease-in-out;
                }
                .flame.f1 {
                    transform: translateX(-50%) scale(1);
                    background-color: #f87171; /* red-400 */
                    animation-delay: 0s;
                }
                .flame.f2 {
                    transform: translateX(-50%) scale(0.7);
                    background-color: #fbbf24; /* amber-400 */
                    animation-delay: 0.5s;
                }
                .flame.f3 {
                    transform: translateX(-50%) scale(0.4);
                    background-color: #fef08a; /* yellow-200 */
                    animation-delay: 1s;
                }
                
                @keyframes move-flame {
                    0%, 100% {
                        transform: translateX(-50%) scaleY(1) rotate(1deg);
                    }
                    50% {
                        transform: translateX(-50%) scaleY(1.1) rotate(-1deg);
                    }
                }
            `}</style>
        </>
    );
};