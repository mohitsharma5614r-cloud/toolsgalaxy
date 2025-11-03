

import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const frameRef = useRef<number>();

    // FIX: Corrected useEffect to prevent infinite loop and properly handle animation frames.
    useEffect(() => {
        let frameId: number;
        const startValue = currentValue;
        const duration = 750; // ms
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 4);
            
            const nextValue = startValue + (value - startValue) * easeOutPercentage;
            setCurrentValue(nextValue);

            if (progress < duration) {
                if (frameRef.current) cancelAnimationFrame(frameRef.current);
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [value]);

    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};


// FIX: Add title prop to component.
export const HomeLoanAffordabilityTool: React.FC<{ title: string }> = ({ title }) => {
    const [monthlyIncome, setMonthlyIncome] = useState(100000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(25000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [loanTenure, setLoanTenure] = useState(20); // years
    const [downPayment, setDownPayment] = useState(500000);

    const { maxEmi, maxLoanAmount, affordableHomeValue, dtiRatio } = useMemo(() => {
        const disposableIncome = monthlyIncome - monthlyExpenses;
        // Lenders typically cap EMIs at 50% of net income
        const calculatedMaxEmi = disposableIncome * 0.5;

        if (calculatedMaxEmi <= 0) {
            return { maxEmi: 0, maxLoanAmount: 0, affordableHomeValue: downPayment, dtiRatio: 0 };
        }
        
        const monthlyRate = interestRate / 12 / 100;
        const months = loanTenure * 12;

        const calculatedMaxLoanAmount = (calculatedMaxEmi * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months));
        const calculatedHomeValue = calculatedMaxLoanAmount + downPayment;
        const calculatedDti = ((calculatedMaxEmi + monthlyExpenses) / monthlyIncome) * 100;


        return {
            maxEmi: Math.round(calculatedMaxEmi),
            maxLoanAmount: Math.round(calculatedMaxLoanAmount),
            affordableHomeValue: Math.round(calculatedHomeValue),
            dtiRatio: calculatedDti
        };
    }, [monthlyIncome, monthlyExpenses, interestRate, loanTenure, downPayment]);

    return (
        <div className="max-w-6xl mx-auto">
            <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
            `}</style>
             <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Determine how much home loan you can comfortably afford.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Gross Monthly Income</label>
                            <span className="input-display">₹ {monthlyIncome.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="20000" max="1000000" step="5000" value={monthlyIncome} onChange={e => setMonthlyIncome(Number(e.target.value))} />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Monthly Expenses (incl. EMIs)</label>
                            <span className="input-display">₹ {monthlyExpenses.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max="500000" step="2500" value={monthlyExpenses} onChange={e => setMonthlyExpenses(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Interest Rate (p.a.)</label>
                            <span className="input-display">{interestRate.toFixed(1)} %</span>
                        </div>
                        <input type="range" min="6" max="15" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Loan Tenure (Years)</label>
                            <span className="input-display">{loanTenure} Years</span>
                        </div>
                        <input type="range" min="5" max="30" step="1" value={loanTenure} onChange={e => setLoanTenure(Number(e.target.value))} />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Down Payment</label>
                            <span className="input-display">₹ {downPayment.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max="5000000" step="50000" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-6 text-center">
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="text-lg text-slate-500 dark:text-slate-400">You can afford a home worth</h3>
                         <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                             ₹ <AnimatedNumber value={affordableHomeValue} />
                         </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                             <h3 className="text-sm text-slate-500">Max Loan Amount</h3>
                             <p className="text-3xl font-bold mt-1">₹ <AnimatedNumber value={maxLoanAmount} /></p>
                        </div>
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                             <h3 className="text-sm text-slate-500">Max EMI</h3>
                             <p className="text-3xl font-bold mt-1">₹ <AnimatedNumber value={maxEmi} /></p>
                        </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                         <h3 className="text-sm text-slate-500 mb-2">Debt-to-Income Ratio (DTI)</h3>
                         <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                             <div 
                                className={`h-4 rounded-full transition-all duration-500 ${dtiRatio <= 50 ? 'bg-emerald-500' : dtiRatio <= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${Math.min(dtiRatio, 100)}%`}}
                            ></div>
                         </div>
                         <p className="text-xl font-bold mt-2">{dtiRatio.toFixed(1)}%</p>
                         <p className="text-xs text-slate-400 mt-1">(Lenders prefer DTI below 50%)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};