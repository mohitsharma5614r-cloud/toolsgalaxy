
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
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);
            
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
    }, [value]);

    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};


// FIX: Add title prop to component.
export const EmiCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(10); // in years
    
    const [result, setResult] = useState({
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
    });

    useEffect(() => {
        const principal = amount;
        const monthlyRate = rate / 12 / 100;
        const months = tenure * 12;

        if (principal > 0 && monthlyRate > 0 && months > 0) {
            const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = emi * months;
            const totalInterest = totalPayment - principal;

            setResult({
                emi: Math.round(emi),
                totalInterest: Math.round(totalInterest),
                totalPayment: Math.round(totalPayment),
            });
        } else {
            setResult({ emi: 0, totalInterest: 0, totalPayment: 0 });
        }
    }, [amount, rate, tenure]);

    const principalPercent = (amount / result.totalPayment) * 100;

    return (
        <div className="max-w-6xl mx-auto">
            <style>{`
                /* Custom styles for range inputs */
                input[type=range] {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 4px;
                    background: #e2e8f0; /* slate-200 */
                }
                .dark input[type=range] {
                    background: #334155; /* slate-700 */
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #4f46e5; /* indigo-600 */
                    cursor: pointer;
                    border: 3px solid #fff;
                    box-shadow: 0 0 5px rgba(0,0,0,0.2);
                }
                .dark input[type=range]::-webkit-slider-thumb {
                     border-color: #1e293b; /* slate-800 */
                }
                input[type=range]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    border: 3px solid #fff;
                }
                .dark input[type=range]::-moz-range-thumb {
                     border-color: #1e293b;
                }
                
                 @keyframes draw-pie {
                    to { --p: ${principalPercent}; }
                }
                .pie-chart {
                    animation: draw-pie 1s forwards;
                }
            `}</style>
             <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your Equated Monthly Installment for loans.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold text-slate-700 dark:text-slate-300">Loan Amount</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-lg">
                                ₹ {amount.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <input type="range" min="10000" max="10000000" step="10000" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold text-slate-700 dark:text-slate-300">Interest Rate (p.a.)</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-lg">
                                {rate.toFixed(1)} %
                            </span>
                        </div>
                        <input type="range" min="1" max="20" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold text-slate-700 dark:text-slate-300">Loan Tenure (Years)</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-lg">
                                {tenure} {tenure > 1 ? 'Years' : 'Year'}
                            </span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-6 text-center">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="text-lg text-slate-500 dark:text-slate-400">Monthly EMI</h3>
                         <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                             ₹ <AnimatedNumber value={result.emi} />
                         </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h3 className="text-sm text-slate-500 dark:text-slate-400">Total Interest</h3>
                             <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                                 ₹ <AnimatedNumber value={result.totalInterest} />
                             </p>
                        </div>
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h3 className="text-sm text-slate-500 dark:text-slate-400">Total Payment</h3>
                             <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                                 ₹ <AnimatedNumber value={result.totalPayment} />
                             </p>
                        </div>
                    </div>
                    
                    {result.totalPayment > 0 && (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div 
                                className="pie-chart relative w-32 h-32 rounded-full"
                                style={{
                                    '--p': 0, // initial value
                                    '--b': '16px', // border width
                                    '--c1': '#4f46e5', // principal color (indigo-600)
                                    '--c2': '#a5b4fc', // interest color (indigo-300)
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
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Principal Amount</span>
                                    <span className="text-slate-500 dark:text-slate-400">(₹ {amount.toLocaleString('en-IN')})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Total Interest</span>
                                     <span className="text-slate-500 dark:text-slate-400">(₹ {result.totalInterest.toLocaleString('en-IN')})</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
