
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
    }, [value]);
    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

// Loader
const Loader = () => (
    <div className="house-loader mx-auto">
        <div className="family">👨‍👩‍👧‍👦</div>
        <div className="roof"></div>
    </div>
);

export const TermInsuranceNeedEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [annualIncome, setAnnualIncome] = useState(1000000);
    const [liabilities, setLiabilities] = useState(5000000);
    const [investments, setInvestments] = useState(1500000);

    const estimatedCover = useMemo(() => {
        // Simplified rule: (15 * Annual Income) + Liabilities - Investments
        const cover = (annualIncome * 15) + liabilities - investments;
        return Math.max(0, cover); // Ensure cover is not negative
    }, [annualIncome, liabilities, investments]);

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .house-loader { width: 120px; height: 100px; position: relative; }
                .family { font-size: 50px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
                .roof { width: 100%; height: 50px; background: #6366f1; position: absolute; top: 0; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform-origin: top center; animation: cover-house 2s forwards ease-out; }
                .dark .roof { background: #818cf8; }
                @keyframes cover-house { from { transform: translateY(-50px) scale(0.5); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate the term insurance coverage you need to protect your family.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="label-style">Your Annual Income: <span className="font-bold text-indigo-600">₹{annualIncome.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="300000" max="10000000" step="100000" value={annualIncome} onChange={e => setAnnualIncome(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Total Liabilities (Loans): <span className="font-bold text-indigo-600">₹{liabilities.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="50000000" step="100000" value={liabilities} onChange={e => setLiabilities(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Existing Investments & Savings: <span className="font-bold text-indigo-600">₹{investments.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="20000000" step="100000" value={investments} onChange={e => setInvestments(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <Loader />
                    <div className="mt-8">
                        <p className="text-lg text-slate-500 dark:text-slate-400">Estimated Term Insurance Cover</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={estimatedCover} /></p>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">*Based on a simplified formula to cover income loss and liabilities. Consult a financial advisor for precise needs.</p>
                </div>
            </div>
        </div>
    );
};
