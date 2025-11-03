

import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value, prefix = '', decimals = 2 }: { value: number, prefix?: string, decimals?: number }) => {
    const [currentValue, setCurrentValue] = useState(0);

    // FIX: Corrected useEffect to prevent infinite loop and properly handle animation frames.
    useEffect(() => {
        let frameId: number;
        const startValue = currentValue;
        const duration = 500;
        let startTime: number | null = null;
    
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            
            setCurrentValue(startValue + (value - startValue) * easeOut);

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

    return <span>{prefix}{currentValue.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
};


// FIX: Add title prop to component.
export const IntradayBreakevenCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [buyPrice, setBuyPrice] = useState('100');
    const [quantity, setQuantity] = useState('100');
    const [brokerage, setBrokerage] = useState('0.05'); // Percentage

    const { breakevenPoint, totalCharges } = useMemo(() => {
        const buy = parseFloat(buyPrice) || 0;
        const qty = parseInt(quantity) || 0;
        const brok = parseFloat(brokerage) / 100 || 0;
        
        if (buy <= 0 || qty <= 0) {
            return { breakevenPoint: 0, totalCharges: 0 };
        }

        const turnover = buy * qty * 2; // Buy + Sell turnover

        // Standard Indian intraday charges (approximate)
        const brokerageFee = Math.min(turnover * brok, 40); // Capped at Rs. 20 per leg
        const stt = (buy * qty) * 0.00025; // STT is only on the sell side for intraday
        const transactionCharge = turnover * 0.0000345;
        const sebiCharge = turnover * 0.000001;
        const totalChargesBeforeGst = brokerageFee + stt + transactionCharge + sebiCharge;
        const gst = (brokerageFee + transactionCharge + sebiCharge) * 0.18;
        const allCharges = totalChargesBeforeGst + gst;

        const breakEven = (buy * qty + allCharges) / qty;

        return {
            breakevenPoint: breakEven,
            totalCharges: allCharges
        };
    }, [buyPrice, quantity, brokerage]);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the breakeven point for your trades, including all charges.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div><label className="label-style">Buy Price (per share)</label><input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} className="input-style"/></div>
                    <div><label className="label-style">Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="input-style"/></div>
                    <div><label className="label-style">Brokerage (%)</label><input type="number" step="0.01" value={brokerage} onChange={e => setBrokerage(e.target.value)} className="input-style"/></div>
                     <div className="text-xs text-slate-400 pt-4 border-t">
                        *Charges are approximate and based on standard rates (NSE: STT 0.025%, Transaction 0.00345%, GST 18%, SEBI 0.0001%).
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-4 animate-fade-in">
                     <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Breakeven Sell Price</p>
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={breakevenPoint} prefix="₹ " /></p>
                    </div>
                     <div className="result-card">
                        <p className="result-label">Total Charges & Taxes</p>
                        <p className="result-value text-2xl"><AnimatedNumber value={totalCharges} prefix="₹ " /></p>
                    </div>
                </div>
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .result-card { background: #fff; border-radius: 0.75rem; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
                .dark .result-card { background: #1e293b; }
                .result-label { font-size: 0.875rem; color: #64748b; font-weight: 600; }
                .dark .result-label { color: #94a3b8; }
                .result-value { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
                .dark .result-value { color: #f1f5f9; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};
