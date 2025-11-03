import React, { useState } from 'react';

const headlineTemplates = [
    "BREAKING: {keyword} Discovered to be Secretly a Trio of Raccoons in a Trench Coat.",
    "Scientists Baffled as {keyword} Accidentally Proves Einstein Wrong with a Toaster.",
    "Local {keyword} Wins Lottery, Spends Entire Fortune on a Single, Giant Gummy Bear.",
    "In a Shocking Turn of Events, {keyword} Declares War on Pigeons, Citing 'Disrespect'.",
    "{keyword} Claims to Have Taught a Goldfish to Bark; Neighbors are Skeptical.",
    "World Stunned as {keyword} Replaces All Local Statues with Garden Gnomes.",
    "New Study Finds That Thinking About {keyword} Increases Your IQ by 3 Points.",
    "BREAKING NEWS: {keyword} Announces Plan to Replace the Moon with a Giant Disco Ball.",
    "After an Unfortunate Baking Incident, {keyword} is Now Legally Classified as a Cake.",
    "EXCLUSIVE: {keyword} Admits to Being a Time Traveler from Last Tuesday."
];

const defaultKeywords = [
    "Florida Man",
    "A Local Cat",
    "Scientists",
    "A Surprising Study",
    "Anonymous Billionaire"
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="newspaper-loader mx-auto">
            <div className="roller r1"></div>
            <div className="paper">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className="roller r2"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Going to Press...</p>
    </div>
);

export const FakeNewsHeadlineCreator: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [headline, setHeadline] = useState<string>('Click the button to generate a headline!');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateHeadline = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newHeadline = headline;
            // Ensure we get a new headline
            while (newHeadline === headline) {
                const template = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
                const finalKeyword = keyword.trim() || defaultKeywords[Math.floor(Math.random() * defaultKeywords.length)];
                newHeadline = template.replace(/{keyword}/g, finalKeyword);
            }
            setHeadline(newHeadline);
            setIsLoading(false);
        }, 2000); // Animation duration
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(headline);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Fake News Headline Creator 🗞️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create funny, fake news headlines for your next meme.</p>
                </div>

                 <div className="space-y-4 mb-8">
                    <label htmlFor="keyword-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter a Keyword (Optional)</label>
                    <input
                        id="keyword-input"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g., My Cat, The President, A Potato"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{headline}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateHeadline}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Headline'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy Headline'}
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

                .newspaper-loader {
                    width: 120px;
                    height: 80px;
                    position: relative;
                }
                .roller {
                    width: 100%;
                    height: 20px;
                    background: #64748b;
                    border-radius: 4px;
                    position: absolute;
                    animation: spin-roller 1s linear infinite;
                }
                .dark .roller { background: #94a3b8; }
                .roller.r1 { top: 0; }
                .roller.r2 { bottom: 0; }
                
                .paper {
                    position: absolute;
                    top: 100%;
                    left: 10%;
                    width: 80%;
                    height: 100px;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    animation: print-paper 2s linear infinite;
                    padding: 5px;
                    box-sizing: border-box;
                }
                .dark .paper { background: #1e293b; border-color: #334155; }
                .paper .line {
                    height: 4px;
                    background: #cbd5e1;
                    margin-top: 8px;
                    border-radius: 2px;
                }
                .dark .paper .line { background: #475569; }
                .paper .line:nth-child(2) { width: 90%; }
                .paper .line:nth-child(3) { width: 95%; }

                @keyframes spin-roller {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes print-paper {
                    0% { top: 100%; }
                    100% { top: -100%; }
                }
            `}</style>
        </>
    );
};