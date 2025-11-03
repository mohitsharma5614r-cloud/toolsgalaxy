
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value, prefix = '' }: { value: number; prefix?: string }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Corrected useEffect to prevent infinite loop and properly handle animation frames.
    useEffect(() => {
        let frameId: number;
        const startValue = currentValue;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            setCurrentValue(startValue + (value - startValue) * easeOut);
            if (progress < duration) { frameId = requestAnimationFrame(animate); }
        };
        frameId = requestAnimationFrame(animate);
        return () => { if(frameId) cancelAnimationFrame(frameId); };
    // FIX: Removed `currentValue` from the dependency array to prevent infinite re-renders.
    }, [value]);
    return <span>{prefix}{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

// Loader
const Loader = () => (
    <div className="shrinking-coin-loader mx-auto">
        <div className="coin">₹</div>
    </div>
);

export const InflationImpactCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [initialAmount, setInitialAmount] = useState(100000);
    const [inflationRate, setInflationRate] = useState(7);
    const [years, setYears] = useState(10);

    const { futureValue, purchasingPower } = useMemo(() => {
        const rate = inflationRate / 100;
        const fv = initialAmount * Math.pow(1 + rate, years);
        const pp = initialAmount / Math.pow(1 + rate, years);
        return { futureValue: fv, purchasingPower: pp };
    }, [initialAmount, inflationRate, years]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .shrinking-coin-loader { width: 80px; height: 80px; position: relative; }
                .coin { font-size: 60px; color: #facc15; font-weight: bold; text-align: center; line-height: 80px; animation: shrink 2s infinite ease-in-out; }
                @keyframes shrink { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.5); opacity: 0.7; } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">See how inflation affects the value of your money over time.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Current Amount: <span className="font-bold text-indigo-600">₹{initialAmount.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="10000" max="10000000" step="10000" value={initialAmount} onChange={e => setInitialAmount(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Annual Inflation Rate: <span className="font-bold text-indigo-600">{inflationRate}%</span></label>
                        <input type="range" min="1" max="15" step="0.5" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Number of Years: <span className="font-bold text-indigo-600">{years}</span></label>
                        <input type="range" min="1" max="50" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center text-center">
                    <Loader />
                    <div className="mt-6 w-full space-y-4">
                         <div className="result-card bg-slate-100 dark:bg-slate-700/50">
                            <p className="result-label">Future Cost of Same Item</p>
                            <p className="text-3xl font-bold text-red-500">₹ <AnimatedNumber value={futureValue} /></p>
                        </div>
                        <div className="result-card bg-slate-100 dark:bg-slate-700/50">
                            <p className="result-label">Future Purchasing Power of ₹{initialAmount.toLocaleString()}</p>
                            <p className="text-3xl font-bold text-emerald-500">₹ <AnimatedNumber value={purchasingPower} /></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
