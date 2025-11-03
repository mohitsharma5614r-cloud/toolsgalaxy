
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

export const RecurringDepositCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [monthly, setMonthly] = useState(5000);
    const [rate, setRate] = useState(7.0);
    const [months, setMonths] = useState(60);

    const { maturityValue, totalInvested, totalInterest } = useMemo(() => {
        // M = P * [((1+i)^n - 1)/i]
        const P = monthly;
        const n = months;
        const r = rate / 100 / 4; // quarterly rate
        const M = P * ((Math.pow(1 + r, n/3) - 1) / r); // simplified for quarterly compounding over n months
        // This is a common but simplified RD formula. A more accurate one is complex.
        // A = P * n + P * n(n+1)/2 * r/12
        const invested = P * n;
        const accurate_interest = invested * (n + 1) * rate / 2400;
        const accurate_maturity = invested + accurate_interest;

        return { maturityValue: accurate_maturity, totalInvested: invested, totalInterest: accurate_interest };
    }, [monthly, rate, months]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} (RD)</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the maturity amount of your Recurring Deposit.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Monthly Deposit: <span className="font-bold text-indigo-600">₹{monthly.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="500" max="100000" step="500" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Annual Interest Rate: <span className="font-bold text-indigo-600">{rate}%</span></label>
                        <input type="range" min="1" max="12" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Tenure (Months): <span className="font-bold text-indigo-600">{months}</span></label>
                        <input type="range" min="6" max="120" value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="space-y-4 text-center">
                    <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Maturity Value</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={maturityValue} /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="result-card"><p className="result-label">Total Invested</p><p className="result-value text-xl">₹ <AnimatedNumber value={totalInvested} /></p></div>
                        <div className="result-card"><p className="result-label">Total Interest</p><p className="result-value text-xl text-emerald-500">₹ <AnimatedNumber value={totalInterest} /></p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
