import React, { useState } from 'react';

const storyStarters = [
    "The last thing I saw before the ship vanished was the captain's hat, floating on the water.",
    "It wasn't the biggest secret in the world, but it was mine, and it was about to be discovered.",
    "The old bookstore smelled of dust, magic, and a hint of ozone, which was unusual even for this part of town.",
    "The robot woke up with a memory that wasn't its own: a child's laughter in a field of sunflowers.",
    "Detective Miller stared at the perfectly clean crime scene; not a drop of blood, not a single clue, except for the lingering scent of cinnamon.",
    "It all started with a mysterious map delivered by a raven with unusually intelligent eyes.",
    "The first rule of time travel is to not talk about time travel, which is why Maria was in so much trouble.",
    "The quiet hum of the spaceship was the only sound, until a faint, rhythmic tapping started on the outside of the hull.",
    "The antique music box played a tune no one had ever heard before, and with the last note, the rain began to fall upwards.",
    "Everyone is born with a clock on their wrist counting down to the moment they meet their soulmate. Mine had just stopped.",
    "The village had only one rule: never, ever, go into the Whispering Woods after dark. Tonight, I had no choice.",
    "The potion was supposed to grant good luck, but a mischievous pixie had swapped the labels.",
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="typewriter-loader mx-auto">
            <div className="paper">
                <div className="text-line"></div>
            </div>
            <div className="typewriter-body">
                <div className="key"></div>
                <div className="key"></div>
                <div className="key"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing the first line...</p>
    </div>
);

export const RandomStoryStarter: React.FC = () => {
    const [starter, setStarter] = useState<string>('Click the button for a story idea!');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateStarter = () => {
        setIsLoading(true);
        setCopied(false);
        setTimeout(() => {
            let newStarter = starter;
            // Ensure a new starter is generated
            while (newStarter === starter) {
                newStarter = storyStarters[Math.floor(Math.random() * storyStarters.length)];
            }
            setStarter(newStarter);
            setIsLoading(false);
        }, 2000); // Animation duration
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(starter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Random Story Starter ✍️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get a random first line to spark your imagination.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center font-serif text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{starter}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={generateStarter}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate New Starter'}
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        {copied ? 'Copied!' : 'Copy'}
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

                .typewriter-loader {
                    width: 100px;
                    height: 80px;
                    position: relative;
                }
                .paper {
                    width: 70px;
                    height: 80px;
                    background: #f1f5f9;
                    border: 2px solid #cbd5e1;
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: paper-feed 2s infinite ease-out;
                }
                .dark .paper { background: #1e293b; border-color: #475569; }
                .text-line {
                    width: 80%;
                    height: 5px;
                    background: #9ca3af;
                    margin: 10px auto 0;
                    position: relative;
                }
                .text-line::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background: #334155;
                    animation: type-line 2s infinite ease-out;
                }
                .dark .text-line::after { background: #cbd5e1; }
                
                .typewriter-body {
                    width: 100%;
                    height: 40px;
                    background: #9ca3af;
                    border-radius: 8px 8px 0 0;
                    position: absolute;
                    bottom: 0;
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                    padding-top: 5px;
                }
                .dark .typewriter-body { background: #475569; }
                .key {
                    width: 10px;
                    height: 15px;
                    background: #64748b;
                    border-radius: 2px;
                    animation: press-key 2s infinite;
                }
                .dark .key { background: #94a3b8; }
                .key:nth-child(2) { animation-delay: 0.2s; }
                .key:nth-child(3) { animation-delay: 0.4s; }

                @keyframes paper-feed {
                    0%, 100% { height: 0; bottom: 30px; }
                    20%, 80% { height: 80px; bottom: 30px; }
                }
                @keyframes type-line {
                    20% { width: 0; }
                    70% { width: 100%; }
                    80%, 100% { width: 100%; }
                }
                @keyframes press-key {
                    0%, 20%, 80%, 100% { transform: translateY(0); }
                    30%, 70% { transform: translateY(3px); }
                }

            `}</style>
        </>
    );
};