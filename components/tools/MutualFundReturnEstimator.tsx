

import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);

    // FIX: Corrected useEffect to prevent infinite loop and properly handle animation frames.
    useEffect(() => {
        let frameId: number;
        const startValue = currentValue;
        const duration = 750;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 4);
            
            setCurrentValue(startValue + (value - startValue) * easeOutPercentage);

            if (progress < duration) {
                // FIX: Pass the 'animate' callback to requestAnimationFrame.
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        
        return () => { if(frameId) cancelAnimationFrame(frameId) };
    // FIX: Removed `currentValue` from dependency array to prevent infinite re-renders.
    }, [value]);

    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};


type InvestmentType = 'SIP' | 'Lumpsum';

export const MutualFundReturnEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [type, setType] = useState<InvestmentType>('SIP');
    const [investmentAmount, setInvestmentAmount] = useState(10000); // Monthly for SIP, Total for Lumpsum
    const [returnRate, setReturnRate] = useState(12);
    const [timePeriod, setTimePeriod] = useState(15); // in years
    
    const { totalValue, investedAmount, estimatedReturns } = useMemo(() => {
        const i = (returnRate / 100) / (type === 'SIP' ? 12 : 1);
        const n = timePeriod * (type === 'SIP' ? 12 : 1);
        const P = investmentAmount;

        let M = 0;
        let invested = 0;

        if (P > 0 && i > 0 && n > 0) {
            if (type === 'SIP') {
                M = P * ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i);
                invested = P * n;
            } else { // Lumpsum
                M = P * Math.pow(1 + (returnRate/100), timePeriod);
                invested = P;
            }
        }
        
        const returns = M - invested;
        return {
            totalValue: Math.round(M),
            investedAmount: Math.round(invested),
            estimatedReturns: Math.round(returns)
        };

    }, [investmentAmount, returnRate, timePeriod, type]);

    useEffect(() => {
        // Adjust default amount when switching types for better UX
        if (type === 'SIP') {
            setInvestmentAmount(10000);
        } else {
            setInvestmentAmount(100000);
        }
    }, [type]);

    const investedPercent = totalValue > 0 ? (investedAmount / totalValue) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto">
            <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                
                @property --p {
                    syntax: '<number>';
                    inherits: true;
                    initial-value: 0;
                }
                @keyframes draw-pie { to { --p: ${investedPercent}; } }
                .pie-chart {
                    animation: draw-pie 1s 1 ease-out forwards;
                }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate potential returns from your mutual fund investments.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                        <button onClick={() => setType('SIP')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${type === 'SIP' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>SIP</button>
                        <button onClick={() => setType('Lumpsum')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${type === 'Lumpsum' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>Lumpsum</button>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">{type === 'SIP' ? 'Monthly Investment' : 'Total Investment'}</label>
                            <span className="input-display">₹ {investmentAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min={type === 'SIP' ? 500 : 10000} max={type === 'SIP' ? 100000 : 5000000} step={type === 'SIP' ? 500 : 10000} value={investmentAmount} onChange={e => setInvestmentAmount(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Expected Return Rate (p.a.)</label>
                            <span className="input-display">{returnRate.toFixed(1)} %</span>
                        </div>
                        <input type="range" min="1" max="30" step="0.5" value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Investment Period (Years)</label>
                            <span className="input-display">{timePeriod} Years</span>
                        </div>
                        <input type="range" min="1" max="40" step="1" value={timePeriod} onChange={e => setTimePeriod(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-6 text-center">
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                         <h3 className="text-lg text-slate-500 dark:text-slate-400">Total Value</h3>
                         <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                             ₹ <AnimatedNumber value={totalValue} />
                         </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                             <h3 className="text-sm text-slate-500">Invested Amount</h3>
                             <p className="text-2xl font-bold mt-1">₹ <AnimatedNumber value={investedAmount} /></p>
                        </div>
                         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                             <h3 className="text-sm text-slate-500">Estimated Returns</h3>
                             <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹ <AnimatedNumber value={estimatedReturns} /></p>
                        </div>
                    </div>
                    
                    {totalValue > 0 && (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div 
                                className="pie-chart relative w-32 h-32 rounded-full"
                                style={{ '--p': 0, '--c1': '#4f46e5', '--c2': '#10b981', background: `conic-gradient(var(--c1) calc(var(--p) * 1%), var(--c2) 0)` } as React.CSSProperties}
                            >
                            </div>
                            <div className="text-sm text-left space-y-2">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4f46e5]"></div><span className="font-semibold">Invested Amount</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div><span className="font-semibold">Estimated Returns</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
