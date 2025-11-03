
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Removed `currentValue` from dependency array to prevent infinite loop.
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
        return () => cancelAnimationFrame(frameId);
    // FIX: Removed `currentValue` from the dependency array to prevent an infinite re-render loop.
    }, [value]);
    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

export const FixedDepositCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(7.5);
    const [years, setYears] = useState(5);

    const { maturityValue, totalInterest } = useMemo(() => {
        // A = P(1 + r/n)^(nt)
        const P = principal;
        const r = rate / 100;
        const n = 4; // Compounded quarterly
        const t = years;
        const A = P * Math.pow(1 + r / n, n * t);
        const interest = A - P;
        return { maturityValue: A, totalInterest: interest };
    }, [principal, rate, years]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} (FD)</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the maturity amount and interest earned on your FD.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Principal Amount: <span className="font-bold text-indigo-600">₹{principal.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="5000" max="10000000" step="5000" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Annual Interest Rate: <span className="font-bold text-indigo-600">{rate}%</span></label>
                        <input type="range" min="1" max="12" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Tenure (Years): <span className="font-bold text-indigo-600">{years}</span></label>
                        <input type="range" min="1" max="20" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="space-y-4 text-center">
                    <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Maturity Value</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={maturityValue} /></p>
                    </div>
                     <div className="result-card">
                        <p className="result-label">Total Interest Earned</p>
                        <p className="result-value text-3xl text-emerald-500">₹ <AnimatedNumber value={totalInterest} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
