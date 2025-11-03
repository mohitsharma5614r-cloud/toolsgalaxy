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

// Name parts for generation
const prefixes = ['Captain', 'Professor', 'Sir', 'Madam', 'Agent', 'Doctor', 'General', 'Major', 'Count', 'Duchess'];
const middles = ['Fluffy', 'Wiggle', 'Snuggle', 'Bubble', 'Cuddle', 'Pounce', 'Nibble', 'Zoomie', 'Fuzzy', 'Sparkle'];
const suffixes = ['bottom', 'muffin', 'snout', 'paws', 'whiskers', 'pants', 'beak', 'fin', 'tail', 'nugget'];

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
            {copied ? 'Copied!' : 'Copy Name'}
        </button>
    );
};

export const AiPetNameGenerator: React.FC = () => {
    const [petType, setPetType] = useState('');
    const [personality, setPersonality] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateName = () => {
        if (!petType.trim() || !personality.trim()) return;

        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const combinedInput = `${petType.toLowerCase().trim()}-${personality.toLowerCase().trim()}`;
            const hash = stringToHash(combinedInput);
            
            let name;
            const nameType = hash % 3;
            if (nameType === 0) { // Prefix + Middle
                name = `${prefixes[hash % prefixes.length]} ${middles[hash % middles.length]}`;
            } else if (nameType === 1) { // Middle + Suffix
                name = `${middles[hash % middles.length]}${suffixes[hash % suffixes.length]}`;
            } else { // Full Name
                name = `${prefixes[hash % prefixes.length]} ${middles[hash % middles.length]}${suffixes[hash % suffixes.length]}`;
            }

            setResult(name);
            setIsLoading(false);
        }, 2500); // Simulate AI thinking time
    };
    
    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Pet Name Generator 🐾</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find the perfect, unique name for your new best friend.</p>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="pet-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Type of Pet</label>
                    <input
                        id="pet-type"
                        type="text"
                        value={petType}
                        onChange={(e) => setPetType(e.target.value)}
                        placeholder="e.g., Dog, Cat, Parrot"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="Type of Pet"
                    />
                </div>
                 <div>
                    <label htmlFor="pet-personality" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Pet's Personality (one word)</label>
                    <input
                        id="pet-personality"
                        type="text"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        placeholder="e.g., Playful, Sleepy, Grumpy"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="Pet's Personality"
                    />
                </div>
            </div>
            
            <button
                onClick={generateName}
                disabled={isLoading || !petType.trim() || !personality.trim()}
                className="mt-8 w-full flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Generate Name
            </button>
            
            <div className="min-h-[160px] flex items-center justify-center mt-6">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <div className="paw-loader">
                            <svg className="paw" viewBox="0 0 249 209.32">
                                <path d="M134.6,96.54c-7.38-5.3-15.34-11.23-22.18-18.23-14.77-15.1-18.39-36.25-9.3-53.18,8.47-15.82,26.1-24.3,43.3-21.43,17.18,2.87,31,14.53,36.87,30.82,6.17,17.1-1.3,35.48-15.33,47.33-6.52,5.46-13.4,10.2-20.52,14.47Z"/>
                                <path d="M222.68,88.75c-6.26-12.72-17.41-22.3-30.88-25.26-13.46-2.95-27.56.36-38.3,9.41-4.83,4.07-9.52,8.34-14.5,12.29,11.3,8.3,24.63,14.11,35.65,23.32,15.38,12.86,21.5,32.74,15.11,50.1-6.4,17.37-22.75,28.1-40.89,28.16-18.14.06-34.91-9.9-42.23-26.6-4.87-11.1-4.72-24.12.18-35.05,5.65-12.6,14.53-23.1,25.56-31.18"/>
                                <path d="M129.58,162.1c-4.34,11.45-1.1,24.5,8.11,33.09,9.21,8.59,22.25,12.33,34.8,9.75,12.55-2.58,22.78-10.74,27.75-22.13,4.97-11.39,4.4-24.61-1.21-35.53-5.61-10.92-15.42-19.1-26.93-22.56-11.51-3.46-24.06-1.79-34.42,4.52"/>
                                <path d="M5.4,88.75c6.26-12.72,17.41-22.3,30.88-25.26,13.46-2.95,27.56.36,38.3,9.41,4.83,4.07,9.52,8.34,14.5,12.29-11.3,8.3-24.63,14.11-35.65,23.32C38.05,121.37,31.93,141.25,38.32,158.62c6.4,17.37,22.75,28.1,40.89,28.16,18.14.06,34.91-9.9,42.23-26.6,4.87-11.1,4.72-24.12-.18-35.05-5.65-12.6-14.53-23.1-25.56-31.18"/>
                            </svg>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Consulting the Animal Kingdom...</p>
                    </div>
                )}
                
                {result && !isLoading && (
                    <div className="text-center animate-fade-in">
                        <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">Your Pet's Perfect Name is:</p>
                        <p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 break-all">{result}</p>
                        <div className="mt-8">
                            <CopyButton textToCopy={result} />
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .paw-loader {
                    width: 100px;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .paw {
                    width: 80px;
                    height: 80px;
                    fill: #94a3b8; /* slate-400 */
                }
                .dark .paw {
                    fill: #64748b; /* slate-500 */
                }
                .paw path {
                    fill-opacity: 0;
                    animation: paw-fade-in 2.5s ease-in-out infinite;
                }
                .paw path:nth-child(1) { animation-delay: 0s; }
                .paw path:nth-child(2) { animation-delay: 0.25s; }
                .paw path:nth-child(3) { animation-delay: 0.5s; }
                .paw path:nth-child(4) { animation-delay: 0.75s; }

                @keyframes paw-fade-in {
                    0% { fill-opacity: 0; transform: translateY(10px); }
                    20% { fill-opacity: 1; transform: translateY(0); }
                    80% { fill-opacity: 1; transform: translateY(0); }
                    100% { fill-opacity: 0; transform: translateY(-10px); }
                }
                `}
            </style>
        </div>
    );
};
