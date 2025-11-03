import React, { useState, useCallback } from 'react';
import { generateDailyChallenge, DailyChallenge } from '../../services/geminiService';
import { Toast } from '../Toast';

const categories = [
    { name: 'Creative', emoji: '🎨' },
    { name: 'Fitness', emoji: '💪' },
    { name: 'Productivity', emoji: '🚀' },
    { name: 'Self-Care', emoji: '🧘' },
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="gift-box-loader mx-auto">
            <div className="lid"></div>
            <div className="box"></div>
            <div className="ribbon"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Unwrapping your challenge...</p>
    </div>
);

export const DailyChallengeGenerator: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [challengeKey, setChallengeKey] = useState(0);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateDailyChallenge(selectedCategory);
            setChallenge(result);
            setChallengeKey(key => key + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate a challenge.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory]);

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Daily Challenge Generator 🎁</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Pick a category and get a unique challenge for your day.</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="block text-lg font-semibold text-center text-slate-700 dark:text-slate-300 mb-4">1. Choose a category</label>
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    disabled={isLoading}
                                    className={`px-5 py-2 text-base font-semibold rounded-full transition-all duration-200 ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                >
                                    {cat.emoji} {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Get My Challenge'}
                    </button>

                    <div className="min-h-[150px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <Loader />
                        ) : challenge ? (
                            <div key={challengeKey} className="text-center animate-fade-in space-y-3">
                                <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase">{selectedCategory} Challenge</p>
                                <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                                    "{challenge.challenge}"
                                </p>
                            </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400">Your challenge awaits!</p>
                        )}
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .gift-box-loader {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    animation: shake-box 0.8s infinite cubic-bezier(.36,.07,.19,.97);
                }
                .box {
                    width: 100%;
                    height: 60px;
                    background-color: #818cf8; /* indigo-400 */
                    position: absolute;
                    bottom: 0;
                    border-radius: 4px;
                }
                .lid {
                    width: 88px;
                    height: 20px;
                    background-color: #6366f1; /* indigo-600 */
                    position: absolute;
                    top: 0;
                    left: -4px;
                    border-radius: 4px;
                    animation: lift-lid 1.5s 1s infinite;
                }
                .ribbon {
                    width: 16px;
                    height: 100%;
                    background-color: #ef4444; /* red-500 */
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .ribbon::before, .ribbon::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: #ef4444;
                }
                .ribbon::before {
                    width: 110%;
                    height: 16px;
                    top: 2px;
                    left: -5%;
                }

                @keyframes shake-box {
                    0%, 100% { transform: translateX(0) rotate(0); }
                    25% { transform: translateX(-5px) rotate(-3deg); }
                    50% { transform: translateX(5px) rotate(3deg); }
                    75% { transform: translateX(-2px) rotate(-1deg); }
                }
                
                /* This is a simplified animation for the reveal */
                /* A true reveal would need state change */
                @keyframes lift-lid {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
                }

            `}</style>
        </>
    );
};
