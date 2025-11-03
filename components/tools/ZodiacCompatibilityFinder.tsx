import React, { useState, useEffect, useCallback } from 'react';

// Data for Zodiac Signs
const zodiacSigns = [
    { name: 'Aries', symbol: '♈', element: 'Fire' },
    { name: 'Taurus', symbol: '♉', element: 'Earth' },
    { name: 'Gemini', symbol: '♊', element: 'Air' },
    { name: 'Cancer', symbol: '♋', element: 'Water' },
    { name: 'Leo', symbol: '♌', element: 'Fire' },
    { name: 'Virgo', symbol: '♍', element: 'Earth' },
    { name: 'Libra', symbol: '♎', element: 'Air' },
    { name: 'Scorpio', symbol: '♏', element: 'Water' },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire' },
    { name: 'Capricorn', symbol: '♑', element: 'Earth' },
    { name: 'Aquarius', symbol: '♒', element: 'Air' },
    { name: 'Pisces', symbol: '♓', element: 'Water' },
];

type Sign = typeof zodiacSigns[0];

// Fun, deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Get compatibility message based on score
const getCompatibilityMessage = (score: number, sign1: Sign, sign2: Sign): string => {
    const isSameElement = sign1.element === sign2.element;
    if (score > 95 && isSameElement) return "A cosmic connection! You're practically celestial soulmates, operating on the same wavelength.";
    if (score > 85) return "A powerful match! Your energies align beautifully, creating a strong and dynamic bond.";
    if (score > 70) return "Great potential! There's a natural harmony here, with plenty of room to grow together.";
    if (score > 55) return "An interesting pair! You have your differences, but they make for a compelling and educational relationship.";
    return "An odd couple, for sure! It might take some work, but opposites can attract in the most surprising ways.";
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

// Result Gauge Component
const CompatibilityGauge = ({ score }: { score: number }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const circumference = 2 * Math.PI * 52;
    const offset = circumference * (1 - displayScore / 100);

    useEffect(() => {
        let frameId: number;
        let start = 0;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / 1500, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setDisplayScore(start + (score - start) * easeOut);
            if (progress < 1500) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [score]);
    
    const getColor = (s: number) => {
        if (s < 60) return 'text-orange-500';
        if (s < 80) return 'text-sky-500';
        return 'text-emerald-500';
    }

    return (
        <div className="relative inline-flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
                <circle className="text-slate-200 dark:text-slate-700" strokeWidth="12" stroke="currentColor" fill="transparent" r="52" cx="80" cy="80" />
                <circle
                    className={`${getColor(score)} transition-colors duration-500`}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                    strokeLinecap="round" stroke="currentColor" fill="transparent" r="52" cx="80" cy="80"
                />
            </svg>
            <span className={`absolute text-4xl font-bold ${getColor(score)}`}>{Math.round(displayScore)}%</span>
        </div>
    );
};


// Main Component
export const ZodiacCompatibilityFinder: React.FC<{ title: string }> = ({ title }) => {
    const [sign1, setSign1] = useState<Sign | null>(null);
    const [sign2, setSign2] = useState<Sign | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ score: number; message: string } | null>(null);

    const handleSignSelect = (sign: Sign) => {
        if (result) {
            handleReset();
            setSign1(sign);
            return;
        }

        if (!sign1) {
            setSign1(sign);
        } else if (!sign2 && sign.name !== sign1.name) {
            setSign2(sign);
        } else {
            // If both are selected, reset and start over with the new sign
            setSign1(sign);
            setSign2(null);
        }
    };

    const handleCalculate = useCallback(() => {
        if (!sign1 || !sign2) return;
        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            // Deterministic algorithm
            const sortedNames = [sign1.name, sign2.name].sort().join('');
            const hash = stringToHash(sortedNames);
            const score = 40 + (hash % 61); // Score between 40% and 100%
            const message = getCompatibilityMessage(score, sign1, sign2);
            setResult({ score, message });
            setIsLoading(false);
        }, 2000);
    }, [sign1, sign2]);

    const handleReset = () => {
        setSign1(null);
        setSign2(null);
        setResult(null);
    };

    useEffect(() => {
        if (sign1 && sign2) {
            handleCalculate();
        }
    }, [sign1, sign2, handleCalculate]);

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 💫</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Select two signs to see if your stars align!</p>
                </div>

                {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> : 
                 result && sign1 && sign2 ? (
                    <div className="text-center animate-fade-in space-y-6">
                        <div className="flex justify-center items-center gap-4">
                            <div className="text-center">
                                <div className="text-5xl">{sign1.symbol}</div>
                                <div className="font-bold">{sign1.name}</div>
                            </div>
                            <div className="text-4xl text-red-400">❤️</div>
                            <div className="text-center">
                                <div className="text-5xl">{sign2.symbol}</div>
                                <div className="font-bold">{sign2.name}</div>
                            </div>
                        </div>
                        <CompatibilityGauge score={result.score} />
                        <p className="text-lg italic text-slate-600 dark:text-slate-300 max-w-md mx-auto">{result.message}</p>
                        <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">Check Another Pair</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center font-semibold text-lg">
                            <p>Select your signs</p>
                            <div className="flex justify-center items-center gap-4 mt-2">
                                <span className={`p-2 border-2 rounded-md ${sign1 ? 'border-indigo-500' : 'border-dashed'}`}>{sign1 ? `${sign1.symbol} ${sign1.name}` : '?'}</span>
                                <span>+</span>
                                <span className={`p-2 border-2 rounded-md ${sign2 ? 'border-indigo-500' : 'border-dashed'}`}>{sign2 ? `${sign2.symbol} ${sign2.name}` : '?'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {zodiacSigns.map(sign => (
                                <button
                                    key={sign.name}
                                    onClick={() => handleSignSelect(sign)}
                                    className={`p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 
                                    ${sign1?.name === sign.name || sign2?.name === sign.name ? 'bg-indigo-600 text-white border-indigo-700 scale-105' : 'bg-slate-100 dark:bg-slate-700 border-transparent hover:border-indigo-400'}`}
                                >
                                    <span className="text-3xl">{sign.symbol}</span>
                                    <span className="text-xs font-semibold">{sign.name}</span>
                                </button>
                            ))}
                        </div>
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