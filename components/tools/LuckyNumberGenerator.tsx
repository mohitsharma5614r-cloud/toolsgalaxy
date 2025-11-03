import React, { useState } from 'react';

// Deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="clover-loader mx-auto">
            <div className="leaf"></div>
            <div className="leaf"></div>
            <div className="leaf"></div>
            <div className="leaf"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Consulting the cosmos...</p>
    </div>
);

// Main Component
export const LuckyNumberGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [keyword, setKeyword] = useState('');
    const [numbers, setNumbers] = useState<{ main: number[], mega: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateNumbers = () => {
        if (!keyword.trim()) {
            setNumbers(null);
            return;
        }

        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            const hash = stringToHash(keyword.toLowerCase());
            const mainNumbers = new Set<number>();
            const mainRange = 60;
            const megaRange = 25;
            let seed = hash;

            while (mainNumbers.size < 6) {
                // Simple pseudo-random number generator (LCG)
                seed = (seed * 1664525 + 1013904223) % 4294967296;
                const num = (seed % mainRange) + 1;
                mainNumbers.add(num);
            }

            const megaNumber = (hash % megaRange) + 1;

            setNumbers({
                main: Array.from(mainNumbers).sort((a, b) => a - b),
                mega: megaNumber
            });
            setIsLoading(false);
        }, 1800); // Animation duration
    };

    const handleCopy = () => {
        if (!numbers) return;
        const textToCopy = `Main: ${numbers.main.join(', ')} - Mega: ${numbers.mega}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🍀</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate your lucky numbers for the day.</p>
                </div>

                <div className="space-y-4 mb-6">
                    <label htmlFor="keyword-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter a name or a lucky charm</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="keyword-input"
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateNumbers()}
                            placeholder="e.g., Jane, Dreams, Clover..."
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                         <button
                            onClick={generateNumbers}
                            disabled={isLoading || !keyword.trim()}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all disabled:bg-slate-400"
                        >
                            {isLoading ? 'Generating...' : 'Get Numbers'}
                        </button>
                    </div>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : numbers ? (
                        <div className="animate-fade-in text-center">
                            <div className="flex flex-wrap justify-center items-center gap-4">
                                {numbers.main.map(num => (
                                    <div key={num} className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">{num}</div>
                                ))}
                                 <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-red-300 dark:ring-red-700">{numbers.mega}</div>
                            </div>
                             <button onClick={handleCopy} className="mt-6 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg shadow-md">
                                {copied ? 'Copied!' : 'Copy Numbers'}
                            </button>
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">Your lucky numbers will appear here!</p>
                    )}
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

                .clover-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                    animation: spin-clover 2.5s infinite linear;
                }
                .leaf {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background: #22c55e; /* emerald-500 */
                    border-radius: 0 100% 100% 100%;
                }
                .leaf:nth-child(1) { top: 0; left: 0; transform: rotate(45deg); }
                .leaf:nth-child(2) { top: 0; right: 0; transform: rotate(135deg); }
                .leaf:nth-child(3) { bottom: 0; right: 0; transform: rotate(225deg); }
                .leaf:nth-child(4) { bottom: 0; left: 0; transform: rotate(315deg); }
                
                @keyframes spin-clover {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};