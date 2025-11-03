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

// Templates for bios and captions
const bioTemplates = [
    "Just a {name} who's really into {hobby}. Probably thinking about {hobby} right now.",
    "{hobby} enthusiast. Fueled by caffeine and passion.",
    "Professional {hobby}-er. Ask me anything about it!",
    "Making the world a better place, one {hobby} session at a time.",
    "Serial {hobby} practitioner. Spreading good vibes and {hobby} tips.",
    "On a mission to master {hobby}. Join the journey.",
];

const captionTemplates = [
    "Another day, another {hobby} adventure. ✨",
    "In my element. # {hobby}",
    "Warning: May spontaneously start talking about {hobby}.",
    "Just doing my {hobby} thing. You wouldn't understand.",
    "This is what happiness looks like. ({hobby})",
    "Eat. Sleep. {hobby}. Repeat.",
];

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const AiBioCaptionMaker: React.FC = () => {
    const [name, setName] = useState('');
    const [hobby, setHobby] = useState('');
    const [result, setResult] = useState<{ bio: string; caption: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateContent = () => {
        if (!name.trim() || !hobby.trim()) return;

        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const combinedInput = `${name.toLowerCase().trim()}-${hobby.toLowerCase().trim()}`;
            const hash = stringToHash(combinedInput);
            
            const bio = bioTemplates[hash % bioTemplates.length]
                .replace(/{name}/g, name.trim())
                .replace(/{hobby}/g, hobby.trim());
            
            const caption = captionTemplates[hash % captionTemplates.length]
                .replace(/{hobby}/g, hobby.trim());

            setResult({ bio, caption });
            setIsLoading(false);
        }, 2000); // Simulate AI thinking time
    };
    
    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Bio & Caption Maker ✍️</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate witty bios and captions for your social media.</p>
            </div>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="your-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">Your Name</label>
                    <input
                        id="your-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Taylor"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="Your Name"
                    />
                </div>
                 <div>
                    <label htmlFor="your-hobby" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">An Interest or Hobby</label>
                    <input
                        id="your-hobby"
                        type="text"
                        value={hobby}
                        onChange={(e) => setHobby(e.target.value)}
                        placeholder="e.g., Reading Books"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="An Interest or Hobby"
                    />
                </div>
            </div>
            
            <button
                onClick={generateContent}
                disabled={isLoading || !name.trim() || !hobby.trim()}
                className="mt-8 w-full flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Brewing Witty Content...
                </>
              ) : (
                'Generate'
              )}
            </button>

            {result && !isLoading && (
                 <div className="mt-8 space-y-4 text-left animate-fade-in">
                    <div className="relative p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">Generated Bio:</h3>
                         <p className="text-slate-700 dark:text-slate-300 pr-16">{result.bio}</p>
                         <CopyButton textToCopy={result.bio} />
                    </div>
                     <div className="relative p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">Generated Caption:</h3>
                         <p className="text-slate-700 dark:text-slate-300 pr-16">{result.caption}</p>
                         <CopyButton textToCopy={result.caption} />
                    </div>
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
