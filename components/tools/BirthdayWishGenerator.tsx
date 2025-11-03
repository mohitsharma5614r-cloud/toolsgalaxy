import React, { useState } from 'react';

// Templates for wishes
const templates = {
    Funny: {
        Friend: "Happy birthday to my partner in crime! May your day be as fun and chaotic as our best memories. Don't do anything I wouldn't do!",
        Mom: "Happy birthday, Mom! Thanks for your good looks and even better sense of humor. I get it from you, obviously.",
        Dad: "Happy birthday, Dad! Thanks for teaching me all the important things, like how to master the perfect bad joke.",
        Brother: "Happy birthday to my brother, who's still not as cool as me. But you're getting there. Maybe next year!",
        Sister: "Happy birthday to my sister! I was going to get you a great gift, but then I remembered you have me.",
        Partner: "Happy birthday! I love you more than pizza, and that's saying a lot. Let's get old and weird together."
    },
    Sweet: {
        Friend: "Happy birthday to one of the kindest souls I know. Wishing you a day filled with love, laughter, and everything that makes you happy.",
        Mom: "Happy birthday to the best Mom in the world. Thank you for everything. Wishing you a day as wonderful as you are.",
        Dad: "Happy birthday, Dad. Thank you for your endless support and wisdom. Hope you have a fantastic day.",
        Brother: "Happy birthday, brother! So glad I get to go through life with you by my side. Have the best day.",
        Sister: "Happy birthday to my amazing sister and best friend. Wishing you all the happiness in the world today and always.",
        Partner: "Happy birthday to my favorite person. Every day with you is a gift. I love you more than words can say."
    },
    Adventurous: {
        Friend: "Happy birthday, my fellow adventurer! May your next trip around the sun be your most exciting one yet. Here's to more explorations!",
        Mom: "Happy birthday to the coolest Mom! May your year be filled with new adventures and exciting journeys. Let's plan one soon!",
        Dad: "Happy birthday, Dad! Here's to another year of adventures, big and small. Let's make some new memories.",
        Brother: "Happy birthday, bro! Hope your year is full of epic adventures and new challenges. Let's conquer them together.",
        Sister: "Happy birthday to my adventurous sister! May you always find new trails to blaze and new mountains to climb.",
        Partner: "Happy birthday to my greatest adventure. I can't wait to see where our journey takes us this year. I love you!"
    }
};

type Personality = 'Funny' | 'Sweet' | 'Adventurous';
type Recipient = 'Friend' | 'Mom' | 'Dad' | 'Brother' | 'Sister' | 'Partner';

// Loader component with a birthday cake animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="cake-loader mx-auto">
            <div className="candle c1"><div className="flame"></div></div>
            <div className="candle c2"><div className="flame"></div></div>
            <div className="candle c3"><div className="flame"></div></div>
            <div className="icing"></div>
            <div className="cake-body"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Making a wish...</p>
    </div>
);

export const BirthdayWishGenerator: React.FC = () => {
    const [recipient, setRecipient] = useState<Recipient>('Friend');
    const [personality, setPersonality] = useState<Personality>('Funny');
    const [wish, setWish] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateWish = () => {
        setIsLoading(true);
        setCopied(false);
        setWish(null);
        setTimeout(() => {
            const generatedWish = templates[personality][recipient];
            setWish(generatedWish);
            setIsLoading(false);
        }, 2500); // Animation duration
    };

    const handleCopy = () => {
        if (!wish) return;
        navigator.clipboard.writeText(wish);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Birthday Wish Generator 🎂</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create heartfelt and fun birthday wishes in seconds.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Who is it for?</label>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(templates.Funny) as Recipient[]).map(r => (
                                <button key={r} onClick={() => setRecipient(r)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${recipient === r ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What's their personality?</label>
                        <div className="flex flex-wrap gap-2">
                             {(Object.keys(templates) as Personality[]).map(p => (
                                <button key={p} onClick={() => setPersonality(p)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${personality === p ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{p}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={generateWish}
                        disabled={isLoading}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Generating...' : 'Generate Wish'}
                    </button>
                </div>
                
                <div className="min-h-[150px] mt-8 flex flex-col items-center justify-center">
                    {isLoading ? (
                        <Loader />
                    ) : wish ? (
                        <div className="w-full animate-fade-in text-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="text-xl italic text-slate-800 dark:text-slate-100">
                                "{wish}"
                            </p>
                             <button
                                onClick={handleCopy}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md text-sm"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    ) : null}
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

                .cake-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .cake-body {
                    width: 100%;
                    height: 60px;
                    background: #f0abfc; /* fuchsia-300 */
                    position: absolute;
                    bottom: 0;
                    border-radius: 8px;
                }
                .icing {
                    width: 100%;
                    height: 20px;
                    background: #f9a8d4; /* pink-300 */
                    position: absolute;
                    bottom: 60px;
                    border-radius: 50% 50% 0 0 / 10px 10px 0 0;
                }
                .candle {
                    width: 8px;
                    height: 25px;
                    background: #fef08a; /* yellow-200 */
                    position: absolute;
                    top: 15px;
                }
                .candle.c1 { left: 20%; }
                .candle.c2 { left: 46%; }
                .candle.c3 { left: 72%; }
                
                .flame {
                    width: 8px;
                    height: 12px;
                    background: #f59e0b; /* amber-500 */
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    position: absolute;
                    top: -12px;
                    opacity: 0;
                    animation: light-up 2.5s infinite;
                }
                .c1 .flame { animation-delay: 0.5s; }
                .c2 .flame { animation-delay: 1s; }
                .c3 .flame { animation-delay: 1.5s; }
                
                @keyframes light-up {
                    0%, 20% { opacity: 0; transform: scaleY(0); }
                    30% { opacity: 1; transform: scaleY(1); }
                    80% { opacity: 1; transform: scaleY(1); }
                    90%, 100% { opacity: 0; transform: scaleY(0); }
                }
            `}</style>
        </>
    );
};