

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
        
        return () => { if (frameId) cancelAnimationFrame(frameId) };
    // FIX: Removed `currentValue` from dependency array to prevent infinite re-renders.
    }, [value]);

    return <span>{value < 0 ? '-' : ''}₹{Math.abs(Math.round(currentValue)).toLocaleString('en-IN')}</span>;
};


type AssetType = 'Equity' | 'Debt Funds' | 'Property' | 'Gold';

const TAX_RULES = {
    'Equity': { longTermMonths: 12, stcgRate: 0.15, ltcgRate: 0.10, ltcgExemption: 100000 },
    'Debt Funds': { longTermMonths: 36, stcgRate: 0.30, ltcgRate: 0.20, ltcgExemption: 0 }, // Simplified slab rate as 30%
    'Property': { longTermMonths: 24, stcgRate: 0.30, ltcgRate: 0.20, ltcgExemption: 0 }, // Simplified
    'Gold': { longTermMonths: 36, stcgRate: 0.30, ltcgRate: 0.20, ltcgExemption: 0 }, // Simplified
};


export const CapitalGainsTaxCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [assetType, setAssetType] = useState<AssetType>('Equity');
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [buyDate, setBuyDate] = useState('');
    const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
    
    const { holdingPeriod, gainType, totalGain, taxRate, tax } = useMemo(() => {
        const buyP = parseFloat(buyPrice) || 0;
        const sellP = parseFloat(sellPrice) || 0;
        const buyD = new Date(buyDate);
        const sellD = new Date(sellDate);

        if (buyP <= 0 || sellP <= 0 || !buyDate || !sellDate || sellD <= buyD) {
            return { holdingPeriod: 'N/A', gainType: 'N/A', totalGain: 0, taxRate: 'N/A', tax: 0 };
        }

        const gain = sellP - buyP;

        const monthsHeld = (sellD.getFullYear() - buyD.getFullYear()) * 12 + (sellD.getMonth() - buyD.getMonth());
        const daysHeld = Math.floor((sellD.getTime() - buyD.getTime()) / (1000 * 3600 * 24));
        const yearsHeld = Math.floor(daysHeld / 365);
        const remainingDays = daysHeld % 365;

        const hpText = `${yearsHeld}y ${Math.floor(remainingDays / 30)}m ${remainingDays % 30}d`;
        
        const rules = TAX_RULES[assetType];
        const isLongTerm = monthsHeld >= rules.longTermMonths;
        const gType = isLongTerm ? 'Long-Term' : 'Short-Term';
        
        let tRate = isLongTerm ? rules.ltcgRate : rules.stcgRate;
        let taxableGain = 0;
        let finalTax = 0;

        if (gain > 0) {
            taxableGain = isLongTerm ? Math.max(0, gain - rules.ltcgExemption) : gain;
            finalTax = taxableGain * tRate;
        }

        return {
            holdingPeriod: hpText,
            gainType: gType,
            totalGain: gain,
            taxRate: `${tRate * 100}%`,
            tax: finalTax,
        };

    }, [assetType, buyPrice, sellPrice, buyDate, sellDate]);

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate long-term and short-term capital gains tax on investments.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Asset Type</label>
                        <select value={assetType} onChange={e => setAssetType(e.target.value as AssetType)} className="input-style w-full">
                            {Object.keys(TAX_RULES).map(type => <option key={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="label-style">Buy Price</label><input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="e.g., 500000" className="input-style"/></div>
                        <div><label className="label-style">Sell Price</label><input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="e.g., 700000" className="input-style"/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="label-style">Buy Date</label><input type="date" value={buyDate} onChange={e => setBuyDate(e.target.value)} className="input-style"/></div>
                        <div><label className="label-style">Sell Date</label><input type="date" value={sellDate} onChange={e => setSellDate(e.target.value)} className="input-style"/></div>
                    </div>
                    <div className="text-xs text-slate-400 pt-4 border-t">
                        *Note: Simplified calculation. Does not include indexation benefits, cess or surcharges. Consult a financial advisor for accurate calculations.
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-4 animate-fade-in">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="result-card"><p className="result-label">Holding Period</p><p className="result-value text-xl">{holdingPeriod}</p></div>
                        <div className="result-card"><p className="result-label">Gain Type</p><p className={`result-value text-xl font-bold ${gainType === 'Long-Term' ? 'text-emerald-500' : 'text-orange-500'}`}>{gainType}</p></div>
                    </div>
                     <div className={`result-card ${totalGain >= 0 ? 'bg-emerald-100/50 dark:bg-emerald-900/50' : 'bg-red-100/50 dark:bg-red-900/50'}`}>
                        <p className="result-label">Total Gain / Loss</p>
                        <p className={`text-4xl font-extrabold ${totalGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}><AnimatedNumber value={totalGain} /></p>
                    </div>
                     <div className="result-card"><p className="result-label">Tax Rate Applied</p><p className="result-value text-2xl font-bold">{taxRate}</p></div>
                     <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Estimated Tax</p>
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={tax} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
