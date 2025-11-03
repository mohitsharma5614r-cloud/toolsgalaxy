
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Remove currentValue from dependency array to prevent infinite loop
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
const Loader: React.FC = () => (
    <div className="shield-loader mx-auto">
        <div className="shield">🛡️</div>
        <div className="family">👨‍👩‍👧‍👦</div>
    </div>
);

export const InsuranceCoverageSuggestor: React.FC<{ title: string }> = ({ title }) => {
    const [annualIncome, setAnnualIncome] = useState(800000);
    const [dependents, setDependents] = useState(3);
    const [liabilities, setLiabilities] = useState(2000000);

    const suggestedCover = useMemo(() => {
        // Simplified rule: 15x annual income + total liabilities
        return (annualIncome * 15) + liabilities;
    }, [annualIncome, dependents, liabilities]);

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .shield-loader { width: 100px; height: 120px; position: relative; }
                .shield { font-size: 120px; line-height: 1; color: #6366f1; position: absolute; z-index: 2; animation: shield-pulse 1.5s infinite ease-in-out; }
                .family { font-size: 50px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
                @keyframes shield-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get a quick estimate for your ideal life insurance coverage.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="label-style">Annual Income: <span className="font-bold text-indigo-600">₹{annualIncome.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="300000" max="5000000" step="50000" value={annualIncome} onChange={e => setAnnualIncome(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Number of Dependents: <span className="font-bold text-indigo-600">{dependents}</span></label>
                        <input type="range" min="0" max="10" value={dependents} onChange={e => setDependents(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Outstanding Loans/Liabilities: <span className="font-bold text-indigo-600">₹{liabilities.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="20000000" step="100000" value={liabilities} onChange={e => setLiabilities(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <Loader />
                    <div className="mt-8">
                        <p className="text-lg text-slate-500 dark:text-slate-400">Suggested Life Insurance Cover</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={suggestedCover} /></p>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">*Based on a common financial planning rule (15x income + liabilities). This is an estimate for planning purposes.</p>
                </div>
            </div>
        </div>
    );
};
