import React, { useState } from 'react';

// Deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const moods = [
    { mood: 'Joyful', emoji: '😄', color: 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700' },
    { mood: 'Creative', emoji: '🎨', color: 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' },
    { mood: 'Adventurous', emoji: '🧭', color: 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700' },
    { mood: 'Focused', emoji: '🎯', color: 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700' },
    { mood: 'Relaxed', emoji: '😌', color: 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700' },
    { mood: 'Energetic', emoji: '⚡️', color: 'bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700' },
    { mood: 'Contemplative', emoji: '🤔', color: 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600' },
    { mood: 'Mischievous', emoji: '😈', color: 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700' },
];

export const AiMoodDetector: React.FC = () => {
    const [name, setName] = useState('');
    const [result, setResult] = useState<{ mood: string; emoji: string; color: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const detectMood = () => {
        if (!name.trim()) return;

        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const hash = stringToHash(name.toLowerCase().trim());
            const selectedMood = moods[hash % moods.length];
            setResult(selectedMood);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Mood Detector 😊</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter your name and let our AI analyze your emotional aura.</p>
            </div>
            
            <div className="space-y-4">
                 <div>
                    <label htmlFor="your-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Your Name</label>
                    <input
                        id="your-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What's your name?"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="Your Name"
                    />
                </div>
            </div>
            
            <button
                onClick={detectMood}
                disabled={isLoading || !name.trim()}
                className="mt-6 w-full flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Emotional Aura...
                </>
              ) : (
                'Detect My Mood'
              )}
            </button>

            {result && !isLoading && (
                 <div className={`mt-8 p-6 rounded-lg border animate-fade-in text-center ${result.color}`}>
                    <div className="text-7xl mb-4">{result.emoji}</div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Your Current Mood:</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{result.mood}</p>
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
