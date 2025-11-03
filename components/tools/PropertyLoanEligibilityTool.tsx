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

export const PropertyLoanEligibilityTool: React.FC<{ title: string }> = ({ title }) => {
    const [propertyValue, setPropertyValue] = useState(8000000);
    const [monthlyIncome, setMonthlyIncome] = useState(120000);

    const eligibleAmount = useMemo(() => {
        // LTV is typically capped at 75-80% for Loan Against Property. We'll use 75%.
        const ltvCap = propertyValue * 0.75;
        
        // Max EMI is usually 50% of income
        const maxEmi = monthlyIncome * 0.5;
        // Assume a 15-year tenure at 9.5% for this calculation
        const months = 15 * 12;
        const monthlyRate = 9.5 / 12 / 100;
        const incomeCap = (maxEmi * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months));

        return Math.floor(Math.min(ltvCap, incomeCap) / 10000) * 10000;
    }, [propertyValue, monthlyIncome]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check your eligibility for a loan against your property.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Market Value of Property: <span className="font-bold text-indigo-600">₹{propertyValue.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="2000000" max="100000000" step="100000" value={propertyValue} onChange={e => setPropertyValue(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Your Gross Monthly Income: <span className="font-bold text-indigo-600">₹{monthlyIncome.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="30000" max="1000000" step="5000" value={monthlyIncome} onChange={e => setMonthlyIncome(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center text-center">
                    <p className="text-lg text-slate-500">You may be eligible for a loan up to</p>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={eligibleAmount} /></p>
                    <p className="text-xs text-slate-400 mt-4">*Based on a standard LTV of 75% and DTI of 50%. Actual eligibility depends on bank policies.</p>
                </div>
            </div>
        </div>
    );
};
