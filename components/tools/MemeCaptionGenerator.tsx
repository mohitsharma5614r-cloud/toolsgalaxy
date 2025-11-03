
import React, { useState } from 'react';

const captions = [
    "Me trying to explain the plot of a movie I saw once.",
    "When you realize your 'quick question' wasn't quick.",
    "That feeling when you find money in your pocket you forgot about.",
    "Trying to look busy at work when the boss walks by.",
    "My brain cells during an exam.",
    "When you open the fridge for the 10th time hoping new food has appeared.",
    "Sent 'on my way' but haven't even gotten out of bed yet.",
    "How I look at my food when it's coming to the table at a restaurant.",
    "Me after one (1) minor inconvenience.",
    "Checking your bank account after a long weekend.",
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="caption-loader mx-auto">
            <div className="thinking-face">🤔</div>
            <div className="lightbulb">💡</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating a viral caption...</p>
    </div>
);

export const MemeCaptionGenerator: React.FC = () => {
    const [caption, setCaption] = useState<string>('Click the button to get a meme-worthy caption!');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateCaption = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newCaption = caption;
            // Ensure a new caption is generated
            while (newCaption === caption) {
                newCaption = captions[Math.floor(Math.random() * captions.length)];
            }
            setCaption(newCaption);
            setIsLoading(false);
        }, 1800); // Animation duration
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Meme Caption Generator 😂</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate funny captions for popular meme templates.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{caption}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateCaption}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Caption'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy Caption'}
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

                .caption-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }
                .thinking-face {
                    font-size: 80px;
                    line-height: 1;
                    animation: think-bob 1.8s infinite ease-in-out;
                }
                .lightbulb {
                    font-size: 40px;
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    opacity: 0;
                    animation: idea-pop 1.8s infinite ease-out;
                }
                
                @keyframes think-bob {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    25% { transform: translateY(-5px) rotate(-3deg); }
                    75% { transform: translateY(0) rotate(3deg); }
                }

                @keyframes idea-pop {
                    0%, 30% { opacity: 0; transform: translateY(10px) scale(0.5); }
                    50% { opacity: 1; transform: translateY(-10px) scale(1.2); }
                    70%, 100% { opacity: 0; transform: translateY(-20px) scale(0.5); }
                }
            `}</style>
        </>
    );
};
