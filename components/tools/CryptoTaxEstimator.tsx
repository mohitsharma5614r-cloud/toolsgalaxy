
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
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
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            
            setCurrentValue(startValue + (value - startValue) * easeOut);

            if (progress < duration) {
                frameId = requestAnimationFrame(animate);
            }
        };
        frameId = requestAnimationFrame(animate);
        return () => { if(frameId) cancelAnimationFrame(frameId); };
    // FIX: Removed `currentValue` from the dependency array to prevent an infinite re-render loop.
    }, [value]);

    return <span>{value < 0 ? '-' : ''}₹{Math.abs(Math.round(currentValue)).toLocaleString('en-IN')}</span>;
};


export const CryptoTaxEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [totalInvestment, setTotalInvestment] = useState('');
    const [totalSale, setTotalSale] = useState('');
    
    const { profit, tax } = useMemo(() => {
        const investment = parseFloat(totalInvestment) || 0;
        const sale = parseFloat(totalSale) || 0;
        
        if (investment <= 0 || sale <= 0) {
            return { profit: 0, tax: 0 };
        }

        const p = sale - investment;
        
        // As per Indian law, 30% tax on profit, no loss set-off
        const t = p > 0 ? p * 0.30 : 0;

        return {
            profit: p,
            tax: t,
        };
    }, [totalInvestment, totalSale]);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} (India)</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate your tax liability from cryptocurrency transactions.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div><label className="label-style">Total Investment (₹)</label><input type="number" value={totalInvestment} onChange={e => setTotalInvestment(e.target.value)} className="input-style"/></div>
                    <div><label className="label-style">Total Sale Value (₹)</label><input type="number" value={totalSale} onChange={e => setTotalSale(e.target.value)} className="input-style"/></div>
                    <div className="text-xs text-slate-400 pt-4 border-t">
                        *Note: Simplified calculation based on 30% flat tax on gains as per Indian tax laws. No loss set-off is considered. Consult a tax professional for accurate advice.
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-4 animate-fade-in">
                     <div className={`result-card ${profit >= 0 ? 'bg-emerald-100/50 dark:bg-emerald-900/50' : 'bg-red-100/50 dark:bg-red-900/50'}`}>
                        <p className="result-label">Net Profit / Loss</p>
                        <p className={`text-4xl font-extrabold ${profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}><AnimatedNumber value={profit} /></p>
                    </div>
                     <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Estimated Tax (30% on Profit)</p>
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={tax} /></p>
                    </div>
                </div>
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .result-card { background: #fff; border-radius: 0.75rem; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                .dark .result-card { background: #1e293b; }
                .result-label { font-size: 0.875rem; color: #64748b; font-weight: 600; }
                .dark .result-label { color: #94a3b8; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};
