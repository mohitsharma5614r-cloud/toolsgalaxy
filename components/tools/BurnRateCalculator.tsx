import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const frameRef = useRef<number>();

    // FIX: Removed `currentValue` from dependency array to prevent an infinite re-render loop.
    useEffect(() => {
        const startValue = currentValue;
        const duration = 750; // ms
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 4);
            
            const nextValue = startValue + (value - startValue) * easeOutPercentage;
            setCurrentValue(nextValue);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [value]);

    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

// Loader component with burning money animation
const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center">
        <div className="burn-loader">
            <div className="flame"></div>
            <div className="note">₹</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Calculating...</p>
        <style>{`
            .burn-loader {
                width: 60px;
                height: 80px;
                position: relative;
            }
            .note {
                width: 100%;
                height: 50px;
                background: #86efac; /* green-300 */
                border: 2px solid #166534; /* green-800 */
                border-radius: 4px;
                position: absolute;
                bottom: 0;
                color: #14532d; /* green-900 */
                font-size: 30px;
                font-weight: bold;
                text-align: center;
                line-height: 50px;
                animation: burn 2s infinite ease-in-out;
            }
            .flame {
                position: absolute;
                bottom: 45px;
                left: 50%;
                width: 30px;
                height: 40px;
                background-color: #f97316; /* orange-500 */
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                transform: translateX(-50%) scale(0);
                animation: flame-up 2s infinite ease-in-out;
            }
            @keyframes burn {
                0% { height: 50px; }
                100% { height: 0px; }
            }
            @keyframes flame-up {
                0%, 100% { transform: translateX(-50%) scale(0); }
                50% { transform: translateX(-50%) scale(1); }
            }
        `}</style>
    </div>
);

// Main Component
export const BurnRateCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [cash, setCash] = useState(5000000);
    const [revenue, setRevenue] = useState(100000);
    const [expenses, setExpenses] = useState(400000);
    const [isLoading, setIsLoading] = useState(true); // Start with loading animation for effect
    const [result, setResult] = useState({ netBurn: 0, runway: 0 });
    
    // Simulate initial calculation
    useEffect(() => {
        const timer = setTimeout(() => {
             const burn = expenses - revenue;
             const run = burn > 0 ? cash / burn : Infinity;
             setResult({ netBurn: burn, runway: run });
             setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Recalculate on input change
    useEffect(() => {
        if(isLoading) return; // Don't recalculate during initial load
        const burn = expenses - revenue;
        const run = burn > 0 ? cash / burn : Infinity;
        setResult({ netBurn: burn, runway: run });
    }, [cash, revenue, expenses, isLoading]);

    const { netBurn, runway } = result;
    const isProfit = netBurn <= 0;
    const runwayText = isFinite(runway) ? `${runway.toFixed(1)} months` : "Infinite 🔥";

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                /* Custom styles for range inputs */
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; /* slate-200 */ }
                .dark input[type=range] { background: #334155; /* slate-700 */ }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; /* indigo-600 */ cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate how quickly your company is spending its capital.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Starting Cash Balance</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {cash.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="100000" max="50000000" step="100000" value={cash} onChange={e => setCash(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Monthly Revenue</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {revenue.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max="10000000" step="10000" value={revenue} onChange={e => setRevenue(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Monthly Expenses</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {expenses.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max="10000000" step="10000" value={expenses} onChange={e => setExpenses(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                <div className="min-h-[350px] flex flex-col justify-center">
                    {isLoading ? <Loader /> : (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className={`p-6 rounded-xl shadow-lg border ${isProfit ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-700' : 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-700'}`}>
                                <h3 className={`text-lg font-semibold ${isProfit ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                                {isProfit ? 'Net Monthly Profit' : 'Net Monthly Burn'}
                                </h3>
                                <p className={`text-5xl font-extrabold mt-1 ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ₹ <AnimatedNumber value={Math.abs(netBurn)} />
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Cash Runway</h3>
                                <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                                    {runwayText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};