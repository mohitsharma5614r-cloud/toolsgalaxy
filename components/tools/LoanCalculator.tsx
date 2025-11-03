

import React, { useState, useEffect, useMemo, useRef } from 'react';

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

interface AmortizationData {
    month: number;
    principal: number;
    interest: number;
    balance: number;
}

// FIX: Add title prop to component.
export const LoanCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [amount, setAmount] = useState(1000000);
    const [rate, setRate] = useState(9.0);
    const [tenure, setTenure] = useState(15); // in years

    const { emi, totalInterest, totalPayment, amortizationSchedule } = useMemo(() => {
        const principal = amount;
        const monthlyRate = rate / 12 / 100;
        const months = tenure * 12;

        if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
            return { emi: 0, totalInterest: 0, totalPayment: 0, amortizationSchedule: [] };
        }

        const calculatedEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const calculatedTotalPayment = calculatedEmi * months;
        const calculatedTotalInterest = calculatedTotalPayment - principal;
        
        // Generate amortization schedule
        const schedule: AmortizationData[] = [];
        let balance = principal;
        for (let i = 1; i <= months; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = calculatedEmi - interestPayment;
            balance -= principalPayment;
            schedule.push({
                month: i,
                principal: Math.round(principalPayment),
                interest: Math.round(interestPayment),
                balance: Math.round(balance),
            });
        }
        
        return {
            emi: Math.round(calculatedEmi),
            totalInterest: Math.round(calculatedTotalInterest),
            totalPayment: Math.round(calculatedTotalPayment),
            amortizationSchedule: schedule,
        };
    }, [amount, rate, tenure]);

    const principalPercent = totalPayment > 0 ? (amount / totalPayment) * 100 : 0;
    
    return (
        <div className="max-w-7xl mx-auto printable-area">
            <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                
                @keyframes draw-pie { to { --p: ${principalPercent}; } }
                .pie-chart { animation: draw-pie 1s forwards; }
                
                @media print {
                  body { background-color: white !important; }
                  .no-print { display: none !important; }
                  .printable-area { margin: 0; padding: 0; width: 100%; max-width: 100%; }
                  .printable-content { box-shadow: none !important; border: none !important; color: black !important; }
                  .printable-content * { color: black !important; border-color: #ccc !important; background-color: transparent !important; }
                  .printable-content th, .printable-content td { padding: 4px 2px !important; font-size: 9px; }
                }
            `}</style>
             <div className="text-center mb-10 no-print">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate loan payments and see the full amortization schedule.</p>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Side: Controls & Summary */}
                <div className="lg:col-span-2 space-y-6 no-print">
                     <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-semibold">Loan Amount</label>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">
                                    ₹ {amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <input type="range" min="10000" max="20000000" step="10000" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                        </div>
                         <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-semibold">Interest Rate (p.a.)</label>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">
                                    {rate.toFixed(1)} %
                                </span>
                            </div>
                            <input type="range" min="1" max="20" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} />
                        </div>
                         <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-semibold">Loan Tenure (Years)</label>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">
                                    {tenure} {tenure > 1 ? 'Years' : 'Year'}
                                </span>
                            </div>
                            <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(Number(e.target.value))} />
                        </div>
                    </div>
                    {totalPayment > 0 && (
                         <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-6">
                            <div 
                                className="pie-chart relative w-36 h-36 rounded-full"
                                style={{
                                    '--p': 0, '--b': '16px', '--c1': '#4f46e5', '--c2': '#a5b4fc',
                                    background: `conic-gradient(var(--c1) calc(var(--p) * 1%), var(--c2) 0)`,
                                } as React.CSSProperties}
                            >
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-indigo-800 dark:text-indigo-200">
                                    {Math.round(principalPercent)}%
                                </div>
                            </div>
                            <div className="text-sm text-left space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                    <span>Principal: ₹ {amount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
                                    <span>Interest: ₹ {totalInterest.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Amortization Schedule */}
                <div className="lg:col-span-3">
                     <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow border">
                             <h3 className="text-sm text-slate-500">Monthly EMI</h3>
                             <p className="text-xl font-bold">₹ <AnimatedNumber value={emi} /></p>
                        </div>
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow border">
                             <h3 className="text-sm text-slate-500">Total Interest</h3>
                             <p className="text-xl font-bold">₹ <AnimatedNumber value={totalInterest} /></p>
                        </div>
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow border">
                             <h3 className="text-sm text-slate-500">Total Payment</h3>
                             <p className="text-xl font-bold">₹ <AnimatedNumber value={totalPayment} /></p>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 printable-content">
                        <h2 className="text-xl font-bold mb-4 text-center">Amortization Schedule</h2>
                        <div className="max-h-[500px] overflow-y-auto relative">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
                                    <tr>
                                        <th scope="col" className="p-3">Month</th>
                                        <th scope="col" className="p-3 text-right">Principal</th>
                                        <th scope="col" className="p-3 text-right">Interest</th>
                                        <th scope="col" className="p-3 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amortizationSchedule.map((row) => (
                                        <tr key={row.month} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="p-3">{row.month}</td>
                                            <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">₹{row.principal.toLocaleString('en-IN')}</td>
                                            <td className="p-3 text-right text-red-500 dark:text-red-400">₹{row.interest.toLocaleString('en-IN')}</td>
                                            <td className="p-3 text-right font-semibold">₹{row.balance > 0 ? row.balance.toLocaleString('en-IN') : 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};