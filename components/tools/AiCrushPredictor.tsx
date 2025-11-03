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
    if (percentage < 20) return "Hmm, the stars aren't perfectly aligned. But hey, opposites attract, right?";
    if (percentage < 40) return "There's a spark! It might be worth exploring this connection.";
    if (percentage < 60) return "A decent chance! The cosmic vibes are looking favorable.";
    if (percentage < 80) return "Wow, strong connection detected! This could be something special.";
    if (percentage < 95) return "It's a match made in the digital heavens! The algorithm is cheering for you.";
    return "Soulmate alert! The cosmic connection is off the charts! 🚀";
};

export const AiCrushPredictor: React.FC = () => {
    const [yourName, setYourName] = useState('');
    const [crushName, setCrushName] = useState('');
    const [result, setResult] = useState<{ percentage: number; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const calculateCompatibility = () => {
        if (!yourName.trim() || !crushName.trim()) return;

        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const combinedNames = (yourName.toLowerCase() + crushName.toLowerCase()).split('').sort().join('');
            const hash = stringToHash(combinedNames);
            
            // Generate a "random" but deterministic percentage based on the hash
            const percentage = (Math.abs(hash) % 80) + 21; // Skew results to be more fun (21-100)
            const message = getCompatibilityMessage(percentage);

            setResult({ percentage, message });
            setIsLoading(false);
        }, 2000); // Simulate AI thinking time
    };
    
    // A nice animated progress bar for the result
    const ProgressBar = ({ percentage }: { percentage: number }) => {
        const [width, setWidth] = useState(0);

        useEffect(() => {
            // Animate the bar filling up
            const timer = setTimeout(() => setWidth(percentage), 100);
            return () => clearTimeout(timer);
        }, [percentage]);
        
        const getColor = (p: number) => {
             if (p < 40) return 'bg-rose-500';
             if (p < 70) return 'bg-amber-500';
             return 'bg-emerald-500';
        }

        return (
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8 overflow-hidden border border-slate-300 dark:border-slate-600">
                <div 
                    className={`h-full rounded-full ${getColor(percentage)} transition-all duration-1000 ease-out flex items-center justify-center text-white font-bold text-sm shadow-inner`}
                    style={{ width: `${width}%` }}
                >
                    {percentage > 10 ? `${percentage}%` : ''}
                </div>
            </div>
        );
    };


    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Crush Predictor 💘</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter your names to calculate your cosmic connection!</p>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="your-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Your Name</label>
                    <input
                        id="your-name"
                        type="text"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        placeholder="e.g., Alex"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="crush-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Your Crush's Name</label>
                    <input
                        id="crush-name"
                        type="text"
                        value={crushName}
                        onChange={(e) => setCrushName(e.target.value)}
                        placeholder="e.g., Jamie"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
            </div>
            
            <button
                onClick={calculateCompatibility}
                disabled={isLoading || !yourName.trim() || !crushName.trim()}
                className="mt-8 w-full flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Cosmic Connection...
                </>
              ) : (
                'Calculate Compatibility'
              )}
            </button>

            {result && !isLoading && (
                 <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                    <h3 className="text-xl font-bold text-indigo-500 dark:text-indigo-400 mb-4">Compatibility Result:</h3>
                    <ProgressBar percentage={result.percentage} />
                    <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg">{result.message}</p>
                 </div>
            )}
             <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                `}
            </style>
        </div>
    );
};