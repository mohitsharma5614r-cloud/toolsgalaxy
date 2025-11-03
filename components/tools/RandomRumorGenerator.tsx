import React, { useState } from 'react';

const rumorTemplates = [
    "I heard that {keyword} can speak fluent squirrel.",
    "Did you know {keyword} is secretly training a flock of pigeons to be their personal spies?",
    "Someone told me that {keyword} only eats food that is the color blue on Tuesdays.",
    "The rumor is that {keyword} has a collection of over 500 rubber ducks.",
    "Apparently, {keyword} once won a staring contest with a statue.",
    "I have it on good authority that {keyword} is the world champion of rock-paper-scissors.",
    "Whispers say that {keyword} has a secret map that leads to a lifetime supply of socks.",
    "Don't tell anyone, but {keyword} actually invented a new dance move called 'The Confused Flamingo'.",
    "Sources claim {keyword} can predict the weather with 100% accuracy, but only for yesterday.",
    "It's been said that {keyword} once parallel parked a bus... with a unicycle."
];

const defaultKeywords = [
    "The principal",
    "My neighbor",
    "A mysterious stranger",
    "The town mayor",
    "That one quiet person in accounting"
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="rumor-loader mx-auto">
            <div className="folder">
                <div className="folder-tab"></div>
                <div className="folder-front"></div>
            </div>
            <div className="stamp">
                <span className="stamp-text">GENERATING...</span>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Checking sources...</p>
    </div>
);

export const RandomRumorGenerator: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [rumor, setRumor] = useState<string>('Click the button to generate a silly rumor!');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateRumor = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newRumor = rumor;
            // Ensure a new rumor is generated
            while (newRumor === rumor) {
                const template = rumorTemplates[Math.floor(Math.random() * rumorTemplates.length)];
                const finalKeyword = keyword.trim() || defaultKeywords[Math.floor(Math.random() * defaultKeywords.length)];
                newRumor = template.replace(/{keyword}/g, finalKeyword);
            }
            setRumor(newRumor);
            setIsLoading(false);
        }, 2000); // Animation duration
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(rumor);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Random Rumor Generator 🤫</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a silly, harmless rumor for fun.</p>
                </div>

                 <div className="space-y-4 mb-8">
                    <label htmlFor="keyword-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter a Name or Keyword (Optional)</label>
                    <input
                        id="keyword-input"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g., The Teacher, Bob, My Dog"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{rumor}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateRumor}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Rumor'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy Rumor'}
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

                .rumor-loader {
                    width: 120px;
                    height: 90px;
                    position: relative;
                }
                .folder {
                    width: 100%;
                    height: 100%;
                }
                .folder-tab {
                    width: 40px;
                    height: 12px;
                    background: #f59e0b; /* amber-500 */
                    border-radius: 4px 4px 0 0;
                    position: absolute;
                    top: -12px;
                    left: 10px;
                }
                .folder-front {
                    width: 100%;
                    height: 100%;
                    background: #fbbf24; /* amber-400 */
                    border-radius: 8px;
                    position: absolute;
                    z-index: 1;
                }
                .dark .folder-tab { background: #d97706; }
                .dark .folder-front { background: #f59e0b; }

                .stamp {
                    width: 90px;
                    height: 90px;
                    border: 5px solid #dc2626; /* red-600 */
                    color: #dc2626;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(2) rotate(15deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    z-index: 2;
                    opacity: 0;
                    animation: stamp-it 2s forwards;
                }
                .dark .stamp { border-color: #f87171; color: #f87171; }
                .stamp-text {
                    display: inline-block;
                    border: 2px solid #dc2626;
                    padding: 2px;
                    border-radius: 50%;
                }
                 .dark .stamp-text { border-color: #f87171; }
                
                @keyframes stamp-it {
                    0% { transform: translate(-50%, -150%) scale(2) rotate(15deg); opacity: 1; }
                    20% { transform: translate(-50%, -50%) scale(1) rotate(15deg); opacity: 1; }
                    30% { transform: translate(-50%, -50%) scale(1.1) rotate(15deg); }
                    40%, 100% { transform: translate(-50%, -50%) scale(1) rotate(15deg); opacity: 1; }
                }
            `}</style>
        </>
    );
};
