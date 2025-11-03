
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

export const SavingsGrowthCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [initial, setInitial] = useState(50000);
    const [monthly, setMonthly] = useState(10000);
    const [rate, setRate] = useState(8);
    const [years, setYears] = useState(10);

    const { futureValue, totalInvested, totalGains } = useMemo(() => {
        const P = initial;
        const PMT = monthly;
        const r = rate / 100 / 12; // monthly rate
        const n = years * 12; // number of months

        const fv = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
        const invested = P + (PMT * n);
        const gains = fv - invested;
        
        return { futureValue: fv, totalInvested: invested, totalGains: gains };
    }, [initial, monthly, rate, years]);
    
    const investedPercent = futureValue > 0 ? (totalInvested / futureValue) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visualize the growth of your savings with compound interest.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Initial Savings: <span className="font-bold text-indigo-600">₹{initial.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="1000000" step="10000" value={initial} onChange={e => setInitial(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Monthly Contribution: <span className="font-bold text-indigo-600">₹{monthly.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="100000" step="1000" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Annual Interest Rate: <span className="font-bold text-indigo-600">{rate}%</span></label>
                        <input type="range" min="1" max="20" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Investment Period (Years): <span className="font-bold text-indigo-600">{years}</span></label>
                        <input type="range" min="1" max="50" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="space-y-4 text-center">
                    <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Future Value of Savings</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={futureValue} /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="result-card"><p className="result-label">Total Invested</p><p className="result-value text-xl">₹ <AnimatedNumber value={totalInvested} /></p></div>
                        <div className="result-card"><p className="result-label">Total Gains</p><p className="result-value text-xl text-emerald-500">₹ <AnimatedNumber value={totalGains} /></p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
