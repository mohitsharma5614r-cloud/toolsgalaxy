import React, { useState, useCallback } from 'react';

// Zodiac Signs Data
const zodiacSigns = [
    { name: 'Aries', symbol: '♈', date: 'Mar 21 - Apr 19' },
    { name: 'Taurus', symbol: '♉', date: 'Apr 20 - May 20' },
    { name: 'Gemini', symbol: '♊', date: 'May 21 - Jun 20' },
    { name: 'Cancer', symbol: '♋', date: 'Jun 21 - Jul 22' },
    { name: 'Leo', symbol: '♌', date: 'Jul 23 - Aug 22' },
    { name: 'Virgo', symbol: '♍', date: 'Aug 23 - Sep 22' },
    { name: 'Libra', symbol: '♎', date: 'Sep 23 - Oct 22' },
    { name: 'Scorpio', symbol: '♏', date: 'Oct 23 - Nov 21' },
    { name: 'Sagittarius', symbol: '♐', date: 'Nov 22 - Dec 21' },
    { name: 'Capricorn', symbol: '♑', date: 'Dec 22 - Jan 19' },
    { name: 'Aquarius', symbol: '♒', date: 'Jan 20 - Feb 18' },
    { name: 'Pisces', symbol: '♓', date: 'Feb 19 - Mar 20' },
];

type Sign = typeof zodiacSigns[0];

// Horoscope templates
const templates = {
    mood: [
        'You\'ll feel a surge of creative energy.',
        'A calm and contemplative mood will wash over you.',
        'Expect a burst of social energy today.',
        'Focus on introspection and personal growth.',
        'You might feel more adventurous than usual.',
    ],
    love: [
        'Communication is key in your relationships today.',
        'A surprising romantic encounter could be on the horizon.',
        'Focus on self-love; it attracts the right kind of energy.',
        'Reconnecting with an old friend could bring joy.',
        'Your charm is at an all-time high.',
    ],
    career: [
        'A new opportunity at work may present itself.',
        'Collaboration will lead to success in your projects.',
        'Your hard work is about to pay off in a significant way.',
        'Take the lead on a project; your vision is clear.',
        'It\'s a good day for networking and making connections.',
    ],
    advice: [
        'Trust your intuition.',
        'Don\'t be afraid to step out of your comfort zone.',
        'Patience will be your greatest ally today.',
        'Listen more than you speak for a surprising revelation.',
        'Embrace change, even if it feels uncomfortable at first.',
    ],
};

// Deterministic hash based on sign and day of the year
const getDailyHash = (signName: string): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const str = `${signName}-${dayOfYear}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash);
};

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="zodiac-loader mx-auto">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Reading the stars...</p>
    </div>
);

// Main Component
export const HoroscopeGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [selectedSign, setSelectedSign] = useState<Sign | null>(null);
    const [horoscope, setHoroscope] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateHoroscope = useCallback((sign: Sign) => {
        setIsLoading(true);
        setSelectedSign(sign);
        setHoroscope(null);

        setTimeout(() => {
            const hash = getDailyHash(sign.name);
            const mood = templates.mood[hash % templates.mood.length];
            const love = templates.love[hash % templates.love.length];
            const career = templates.career[hash % templates.career.length];
            const advice = templates.advice[hash % templates.advice.length];

            const fullHoroscope = `${mood} ${love} ${career} A word of advice: ${advice}`;
            setHoroscope(fullHoroscope);
            setIsLoading(false);
        }, 2000);
    }, []);

    const handleReset = () => {
        setSelectedSign(null);
        setHoroscope(null);
        setCopied(false);
    };
    
    const handleCopy = () => {
        if (!horoscope) return;
        navigator.clipboard.writeText(horoscope);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} ✨</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Select your sign to get your daily horoscope.</p>
                </div>

                {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> : 
                 horoscope && selectedSign ? (
                    <div className="text-center animate-fade-in space-y-6">
                        <div className="flex justify-center items-center gap-4">
                            <div className="text-7xl text-indigo-400">{selectedSign.symbol}</div>
                            <div>
                                <h2 className="text-4xl font-bold">{selectedSign.name}</h2>
                                <p className="text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                        <p className="text-lg italic text-slate-600 dark:text-slate-300 max-w-md mx-auto">{horoscope}</p>
                        <div className="flex justify-center gap-4">
                             <button onClick={handleReset} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">
                                Back to Signs
                            </button>
                             <button onClick={handleCopy} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {zodiacSigns.map(sign => (
                            <button
                                key={sign.name}
                                onClick={() => generateHoroscope(sign)}
                                className="p-3 flex flex-col items-center justify-center rounded-lg border-2 border-transparent bg-slate-100 dark:bg-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all duration-200 aspect-square"
                            >
                                <span className="text-4xl">{sign.symbol}</span>
                                <span className="text-xs font-semibold mt-1">{sign.name}</span>
                                <span className="text-xs text-slate-400">{sign.date}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                .zodiac-loader { width: 100px; height: 100px; position: relative; }
                .ring {
                    position: absolute;
                    border: 4px solid transparent;
                    border-radius: 50%;
                    animation: spin-zodiac 4s infinite linear;
                }
                .ring.r1 { top: 0; left: 0; width: 100%; height: 100%; border-top-color: #6366f1; }
                .ring.r2 { top: 15%; left: 15%; width: 70%; height: 70%; border-right-color: #818cf8; animation-direction: reverse; animation-duration: 3s; }
                .ring.r3 { top: 30%; left: 30%; width: 40%; height: 40%; border-bottom-color: #a5b4fc; animation-duration: 2s; }
                @keyframes spin-zodiac { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
};