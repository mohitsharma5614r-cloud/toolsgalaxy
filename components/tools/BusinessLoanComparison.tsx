

import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);

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
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    // FIX: Removed `currentValue` from dependency array to prevent infinite re-renders.
    }, [value]);

    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};


interface LoanDetails {
    emi: number;
    totalInterest: number;
    totalPayment: number;
}

const calculateLoan = (amount: number, rate: number, tenure: number, fee: number): LoanDetails => {
    const principal = amount;
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
        return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPaymentWithInterest = emi * months;
    const totalInterest = totalPaymentWithInterest - principal;
    const processingFee = (principal * fee) / 100;
    const totalPayment = totalPaymentWithInterest + processingFee;

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
    };
};

export const BusinessLoanComparison: React.FC<{ title: string }> = ({ title }) => {
    const [loanAmount, setLoanAmount] = useState(2500000);
    const [loanA, setLoanA] = useState({ rate: 10.5, tenure: 5, fee: 1 });
    const [loanB, setLoanB] = useState({ rate: 11, tenure: 5, fee: 0.5 });
    
    const resultsA = useMemo(() => calculateLoan(loanAmount, loanA.rate, loanA.tenure, loanA.fee), [loanAmount, loanA]);
    const resultsB = useMemo(() => calculateLoan(loanAmount, loanB.rate, loanB.tenure, loanB.fee), [loanAmount, loanB]);

    const betterOption = resultsA.totalPayment < resultsB.totalPayment ? 'A' : 'B';

    return (
        <div className="max-w-7xl mx-auto">
             <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare business loan offers to find the best option.</p>
            </div>
            
             <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                 <div className="flex justify-between items-center mb-2">
                     <label className="font-semibold text-lg text-slate-700 dark:text-slate-300">Loan Amount</label>
                     <span className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-xl">
                         ₹ {loanAmount.toLocaleString('en-IN')}
                     </span>
                 </div>
                 <input type="range" min="100000" max="20000000" step="100000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Loan A */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 relative">
                    {betterOption === 'A' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-400 text-emerald-900 font-bold text-sm rounded-full">Best Option</div>}
                    <h2 className="text-2xl font-bold text-center">Loan A</h2>
                    <div>
                        <label>Interest Rate: {loanA.rate}%</label>
                        <input type="range" min="7" max="18" step="0.1" value={loanA.rate} onChange={e => setLoanA({...loanA, rate: Number(e.target.value)})} />
                    </div>
                     <div>
                        <label>Tenure (Years): {loanA.tenure}</label>
                        <input type="range" min="1" max="10" value={loanA.tenure} onChange={e => setLoanA({...loanA, tenure: Number(e.target.value)})} />
                    </div>
                     <div>
                        <label>Processing Fee: {loanA.fee}%</label>
                        <input type="range" min="0" max="3" step="0.25" value={loanA.fee} onChange={e => setLoanA({...loanA, fee: Number(e.target.value)})} />
                    </div>
                     <div className="pt-4 border-t text-center">
                         <p className="text-sm text-slate-500">Total Payment</p>
                         <p className="text-3xl font-bold text-red-500">₹ <AnimatedNumber value={resultsA.totalPayment} /></p>
                    </div>
                </div>
                 {/* Loan B */}
                 <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 relative">
                    {betterOption === 'B' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-400 text-emerald-900 font-bold text-sm rounded-full">Best Option</div>}
                    <h2 className="text-2xl font-bold text-center">Loan B</h2>
                     <div>
                        <label>Interest Rate: {loanB.rate}%</label>
                        <input type="range" min="7" max="18" step="0.1" value={loanB.rate} onChange={e => setLoanB({...loanB, rate: Number(e.target.value)})} />
                    </div>
                     <div>
                        <label>Tenure (Years): {loanB.tenure}</label>
                        <input type="range" min="1" max="10" value={loanB.tenure} onChange={e => setLoanB({...loanB, tenure: Number(e.target.value)})} />
                    </div>
                     <div>
                        <label>Processing Fee: {loanB.fee}%</label>
                        <input type="range" min="0" max="3" step="0.25" value={loanB.fee} onChange={e => setLoanB({...loanB, fee: Number(e.target.value)})} />
                    </div>
                     <div className="pt-4 border-t text-center">
                         <p className="text-sm text-slate-500">Total Payment</p>
                         <p className="text-3xl font-bold text-red-500">₹ <AnimatedNumber value={resultsB.totalPayment} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
