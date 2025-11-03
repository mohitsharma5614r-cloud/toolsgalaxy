import React, { useState, useEffect } from 'react';

// A simple hash function to make the calculation seem more complex and deterministic
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const getCompatibilityMessage = (percentage: number): string => {
    if (percentage < 40) return "You're like fire and ice, but somehow it works. An interestingly explosive duo!";
    if (percentage < 60) return "A solid friendship! You balance each other out like peanut butter and jelly.";
    if (percentage < 80) return "Dynamic Duo Alert! You two are partners in crime and masters of fun.";
    if (percentage < 95) return "Basically the same person in two different bodies. Telepathic connection, right?";
    return "Cosmic soulmates! Your friendship is written in the stars and algorithmically confirmed. 🌟";
};

export const AiFriendCompatibility: React.FC = () => {
    const [friendOne, setFriendOne] = useState('');
    const [friendTwo, setFriendTwo] = useState('');
    const [result, setResult] = useState<{ percentage: number; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const calculateCompatibility = () => {
        if (!friendOne.trim() || !friendTwo.trim()) return;

        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            // Sort names to ensure the result is the same regardless of input order
            const sortedNames = [friendOne.toLowerCase().trim(), friendTwo.toLowerCase().trim()].sort();
            const combinedNames = sortedNames.join('-');
            const hash = stringToHash(combinedNames);
            
            // Generate a "random" but deterministic percentage (30-100)
            const percentage = (Math.abs(hash) % 71) + 30; 
            const message = getCompatibilityMessage(percentage);

            setResult({ percentage, message });
            setIsLoading(false);
        }, 2500); // Simulate AI thinking time
    };
    
    const ProgressBar = ({ percentage }: { percentage: number }) => {
        const [width, setWidth] = useState(0);

        useEffect(() => {
            const timer = setTimeout(() => setWidth(percentage), 100);
            return () => clearTimeout(timer);
        }, [percentage]);
        
        const getColor = (p: number) => {
             if (p < 50) return 'bg-amber-500';
             if (p < 80) return 'bg-sky-500';
             return 'bg-emerald-500';
        }

        return (
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8 overflow-hidden border border-slate-300 dark:border-slate-600">
                <div 
                    className={`h-full rounded-full ${getColor(percentage)} transition-all duration-1000 ease-out flex items-center justify-center text-white font-bold text-sm shadow-inner`}
                    style={{ width: `${width}%` }}
                >
                   {percentage > 10 ? `${percentage}% Compatible` : ''}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Friend Compatibility 🤝</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Discover the algorithmic truth behind your friendship!</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="friend-one" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Friend One's Name</label>
                    <input
                        id="friend-one"
                        type="text"
                        value={friendOne}
                        onChange={(e) => setFriendOne(e.target.value)}
                        placeholder="e.g., Alex"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="friend-two" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Friend Two's Name</label>
                    <input
                        id="friend-two"
                        type="text"
                        value={friendTwo}
                        onChange={(e) => setFriendTwo(e.target.value)}
                        placeholder="e.g., Jamie"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
            </div>
            
            <button
                onClick={calculateCompatibility}
                disabled={isLoading || !friendOne.trim() || !friendTwo.trim()}
                className="mt-8 w-full flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Calculate Compatibility
            </button>
            
            <div className="min-h-[160px] flex flex-col items-center justify-center mt-6">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <div className="high-five-loader">
                            <div className="hand left-hand">✋</div>
                            <div className="hand right-hand">✋</div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Analyzing Friendship Dynamics...</p>
                    </div>
                )}

                {result && !isLoading && (
                    <div className="w-full p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <h3 className="text-xl font-bold text-indigo-500 dark:text-indigo-400 mb-4">Friendship Analysis Complete:</h3>
                        <ProgressBar percentage={result.percentage} />
                        <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg">{result.message}</p>
                    </div>
                )}
            </div>

             <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .high-five-loader {
                    position: relative;
                    width: 120px;
                    height: 60px;
                    margin-bottom: 1rem;
                }

                .high-five-loader .hand {
                    position: absolute;
                    font-size: 40px;
                    animation-duration: 2.5s;
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                }

                .high-five-loader .left-hand {
                    animation-name: high-five-left;
                }

                .high-five-loader .right-hand {
                    transform: scaleX(-1);
                    animation-name: high-five-right;
                }

                @keyframes high-five-left {
                    0%, 100% { left: 0; transform: rotate(0deg); }
                    25% { left: calc(50% - 22px); transform: rotate(-20deg); }
                    50% { left: calc(50% - 22px); transform: rotate(10deg) scale(1.2); }
                    75% { left: 0; transform: rotate(0deg); }
                }

                @keyframes high-five-right {
                    0%, 100% { right: 0; transform: scaleX(-1) rotate(0deg); }
                    25% { right: calc(50% - 22px); transform: scaleX(-1) rotate(-20deg); }
                    50% { right: calc(50% - 22px); transform: scaleX(-1) rotate(10deg) scale(1.2); }
                    75% { right: 0; transform: scaleX(-1) rotate(0deg); }
                }
                `}
            </style>
        </div>
    );
};
