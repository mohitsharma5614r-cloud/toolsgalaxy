
import React, { useState, useEffect, useRef } from 'react';

// Fun, deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Loader component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="iq-loader mx-auto">
            <div className="brain">🧠</div>
            <div className="scan-line"></div>
            <div className="number n1">101</div>
            <div className="number n2">42</div>
            <div className="number n3">160</div>
            <div className="number n4">99</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Performing Complex Neurological Analysis...</p>
    </div>
);

// Animated number component
const AnimatedNumber = ({ target }: { target: number }) => {
    const [current, setCurrent] = useState(0);

    // FIX: Corrected the useEffect hook for requestAnimationFrame to prevent infinite loops and ensure proper animation.
    useEffect(() => {
        const start = current;
        const end = target;
        const duration = 1000; // 1 second animation
        let startTime: number | null = null;
        let frameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease-out function
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);
            const value = Math.floor(start + (end - start) * easeOutPercentage);
            setCurrent(value);

            if (progress < duration) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    // FIX: Removed `current` from dependency array to prevent infinite re-renders.
    }, [target]);

    return <span className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{current}</span>;
};


// FIX: Add title prop to component.
export const IQCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [name, setName] = useState('');
    const [iqScore, setIqScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const calculateIQ = () => {
        if (!name.trim()) return;

        setIsLoading(true);
        setShowResult(false);
        setIqScore(null);

        setTimeout(() => {
            const hash = stringToHash(name.toLowerCase());
            // Generate a fun, high IQ score between 130 and 179
            const score = 130 + (hash % 50);
            setIqScore(score);
            setIsLoading(false);
            setShowResult(true);
        }, 2500);
    };
    
    const handleReset = () => {
        setName('');
        setIqScore(null);
        setShowResult(false);
    }

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    {/* FIX: Use title prop for the heading. */}
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} (For Fun 😅)</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter your name to reveal your "scientifically-calculated" genius-level IQ score.</p>
                </div>
                
                {!showResult ? (
                    <div className="space-y-4">
                        <label htmlFor="name-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your First Name</label>
                        <input
                            id="name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Albert"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={calculateIQ}
                            disabled={isLoading || !name.trim()}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                        >
                            {isLoading ? 'Calculating...' : 'Calculate My IQ'}
                        </button>
                    </div>
                ) : null}


                <div className="min-h-[200px] mt-6 flex flex-col items-center justify-center">
                    {isLoading ? (
                        <Loader />
                    ) : showResult && iqScore !== null ? (
                        <div className="animate-fade-in text-center space-y-4 w-full">
                             <p className="text-lg text-slate-500 dark:text-slate-400">Congratulations, {name}! Your IQ is:</p>
                             <AnimatedNumber target={iqScore} />
                             <p className="text-sm text-slate-400">(Disclaimer: This is for entertainment only. You are a genius regardless.)</p>
                             <button onClick={handleReset} className="mt-4 px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">
                                Try Again
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .iq-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .brain {
                    font-size: 80px;
                    line-height: 1;
                    text-align: center;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: brain-pulse-iq 2s infinite ease-in-out;
                }
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: #6366f1;
                    box-shadow: 0 0 8px #6366f1;
                    animation: scan-iq 2.5s infinite ease-in-out;
                }
                .dark .scan-line { background: #818cf8; box-shadow: 0 0 8px #818cf8; }
                
                .number {
                    position: absolute;
                    font-size: 14px;
                    font-weight: bold;
                    color: #a5b4fc;
                    opacity: 0;
                    animation: pop-num 2.5s infinite;
                }
                .n1 { top: 0; left: 10%; animation-delay: 0s; }
                .n2 { top: 30%; right: 0; animation-delay: 0.6s; }
                .n3 { bottom: 20%; left: 0; animation-delay: 1.2s; }
                .n4 { bottom: 0; right: 20%; animation-delay: 1.8s; }


                @keyframes brain-pulse-iq {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                }

                @keyframes scan-iq {
                    0%, 100% { top: 10%; }
                    50% { top: 90%; }
                }
                
                @keyframes pop-num {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    20% { opacity: 1; transform: scale(1.2); }
                    40%, 100% { opacity: 0; }
                }
            `}</style>
        </>
    );
};