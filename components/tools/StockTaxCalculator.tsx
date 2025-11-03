
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
                frameId = requestAnimationFrame(animate);
            }
        };
        frameId = requestAnimationFrame(animate);
        return () => { if(frameId) cancelAnimationFrame(frameId); };
    // FIX: Removed `currentValue` from dependency array to prevent infinite re-renders.
    }, [value]);

    return <span>{value < 0 ? '-' : ''}₹{Math.abs(Math.round(currentValue)).toLocaleString('en-IN')}</span>;
};

type HoldingPeriod = 'short' | 'long';

export const StockTaxCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [buyPrice, setBuyPrice] = useState('100');
    const [sellPrice, setSellPrice] = useState('150');
    const [quantity, setQuantity] = useState('100');
    const [period, setPeriod] = useState<HoldingPeriod>('short');
    
    const { totalInvestment, totalSale, profit, taxableGain, tax } = useMemo(() => {
        const buy = parseFloat(buyPrice) || 0;
        const sell = parseFloat(sellPrice) || 0;
        const qty = parseInt(quantity) || 0;

        if (buy <= 0 || sell <= 0 || qty <= 0) {
            return { totalInvestment: 0, totalSale: 0, profit: 0, taxableGain: 0, tax: 0 };
        }

        const investment = buy * qty;
        const saleValue = sell * qty;
        const p = saleValue - investment;
        
        let tg = 0;
        let t = 0;

        if (p > 0) { // Tax only on profit
            if (period === 'short') {
                // STCG: 15% on the entire gain
                tg = p;
                t = tg * 0.15;
            } else {
                // LTCG: 10% on gains over ₹1,00,000
                tg = Math.max(0, p - 100000);
                t = tg * 0.10;
            }
        }

        return {
            totalInvestment: investment,
            totalSale: saleValue,
            profit: p,
            taxableGain: tg,
            tax: t,
        };
    }, [buyPrice, sellPrice, quantity, period]);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate short-term & long-term capital gains tax on stocks.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="label-style">Buy Price (per share)</label><input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} className="input-style"/></div>
                        <div><label className="label-style">Sell Price (per share)</label><input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} className="input-style"/></div>
                    </div>
                    <div><label className="label-style">Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="input-style"/></div>
                    <div>
                        <label className="label-style">Holding Period</label>
                         <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setPeriod('short')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${period === 'short' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>Short-Term (&lt; 1 Year)</button>
                            <button onClick={() => setPeriod('long')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${period === 'long' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>Long-Term (&gt; 1 Year)</button>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 pt-4 border-t">
                        *Note: Simplified calculation as per Indian tax laws. STCG taxed at 15%. LTCG taxed at 10% on gains over ₹1 lakh. Does not include cess or surcharges. Consult a financial advisor.
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="result-card"><p className="result-label">Total Investment</p><p className="result-value"><AnimatedNumber value={totalInvestment} /></p></div>
                        <div className="result-card"><p className="result-label">Total Sale Value</p><p className="result-value"><AnimatedNumber value={totalSale} /></p></div>
                    </div>
                     <div className={`result-card ${profit >= 0 ? 'bg-emerald-100/50 dark:bg-emerald-900/50' : 'bg-red-100/50 dark:bg-red-900/50'}`}>
                        <p className="result-label">Total Profit / Loss</p>
                        <p className={`text-4xl font-extrabold ${profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}><AnimatedNumber value={profit} /></p>
                    </div>
                     <div className="result-card"><p className="result-label">Taxable Gain</p><p className="result-value"><AnimatedNumber value={taxableGain} /></p></div>
                     <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Estimated Tax</p>
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={tax} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
