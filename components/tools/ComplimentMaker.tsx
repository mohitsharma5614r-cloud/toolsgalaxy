import React, { useState } from 'react';

// Data for compliments
const compliments = [
    "You're an awesome friend.",
    "{name}, you're a true gift to the people in your life.",
    "You have a contagious and inspiring passion for the things you do.",
    "You're a great listener.",
    "Your perspective is refreshing.",
    "{name}, the world is a better place because you're in it.",
    "You have the best ideas.",
    "You're more helpful than you realize.",
    "You have a natural talent for making people smile.",
    "{name}, your kindness is a balm to all who encounter it.",
    "You're so thoughtful and considerate.",
    "Your positive energy is infectious.",
];

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="compliment-loader mx-auto">
            <div className="heart">❤️</div>
            <div className="sparkle s1">✨</div>
            <div className="sparkle s2">✨</div>
            <div className="sparkle s3">✨</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating a kind word...</p>
    </div>
);

// Main Component
export const ComplimentMaker: React.FC<{ title: string }> = ({ title }) => {
    const [name, setName] = useState('');
    const [compliment, setCompliment] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateCompliment = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newCompliment = compliment;
            // Ensure a new compliment is generated
            while (newCompliment === compliment) {
                newCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            }
            
            if (name.trim()) {
                newCompliment = newCompliment.replace('{name}', name.trim());
            } else {
                // If the template requires a name but none is given, find another one.
                if (newCompliment.includes('{name}')) {
                    const noNameCompliments = compliments.filter(c => !c.includes('{name}'));
                    newCompliment = noNameCompliments[Math.floor(Math.random() * noNameCompliments.length)];
                }
            }

            setCompliment(newCompliment);
            setIsLoading(false);
        }, 1800); // Animation duration
    };

    const handleCopy = () => {
        if (!compliment) return;
        navigator.clipboard.writeText(compliment);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 😊</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a kind compliment to brighten someone's day.</p>
                </div>

                 <div className="space-y-4 mb-6">
                    <label htmlFor="name-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Who is this for? (Optional)</label>
                    <input
                        id="name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., a friend, Mom, yourself..."
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                
                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : compliment ? (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{compliment}"
                        </p>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">Click the button to get a compliment!</p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateCompliment}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Compliment'}
                    </button>
                    {compliment && !isLoading && (
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

                .compliment-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }
                .heart {
                    font-size: 80px;
                    line-height: 1;
                    text-align: center;
                    animation: heart-beat 1.2s infinite ease-in-out;
                }
                @keyframes heart-beat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .sparkle {
                    position: absolute;
                    font-size: 24px;
                    opacity: 0;
                    animation: pop-sparkle 1.8s infinite;
                }
                .s1 { top: -10px; left: 10px; animation-delay: 0s; }
                .s2 { top: 20px; right: -15px; animation-delay: 0.6s; }
                .s3 { bottom: -5px; left: 20px; animation-delay: 1.2s; }
                
                @keyframes pop-sparkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    33% { opacity: 1; transform: scale(1.2); }
                    66%, 100% { opacity: 0; transform: scale(0.5); }
                }
            `}</style>
        </>
    );
};