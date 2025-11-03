

import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value, decimals = 2 }: { value: number, decimals?: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const frameRef = useRef<number>();

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
                // FIX: Pass the function reference `animate` instead of calling `animate()`.
                frameId = requestAnimationFrame(animate);
            }
        };
        // FIX: Pass the function reference `animate` instead of calling `animate()`.
        frameId = requestAnimationFrame(animate);

        return () => {
            // FIX: Use frameId in cleanup function to avoid stale closure issues
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [value]);

    return <span>{currentValue.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
};


export const GstCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [amount, setAmount] = useState('1000');
    const [gstRate, setGstRate] = useState(18);
    const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');

    const { baseAmount, gstAmount, totalAmount } = useMemo(() => {
        const numAmount = parseFloat(amount) || 0;
        if (numAmount === 0) return { baseAmount: 0, gstAmount: 0, totalAmount: 0 };

        if (type === 'exclusive') {
            const gst = numAmount * (gstRate / 100);
            const total = numAmount + gst;
            return { baseAmount: numAmount, gstAmount: gst, totalAmount: total };
        } else { // inclusive
            const base = numAmount / (1 + (gstRate / 100));
            const gst = numAmount - base;
            return { baseAmount: base, gstAmount: gst, totalAmount: numAmount };
        }
    }, [amount, gstRate, type]);
    
    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate Goods and Services Tax for your transactions.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
                {/* Inputs */}
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Calculation Type</label>
                        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setType('exclusive')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${type === 'exclusive' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>Add GST (Exclusive)</button>
                            <button onClick={() => setType('inclusive')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${type === 'inclusive' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>Extract GST (Inclusive)</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{type === 'exclusive' ? 'Base Amount' : 'Total Amount'}</label>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">₹</span>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pl-8 text-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GST Rate</label>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[5, 12, 18, 28].map(rate => (
                                <button key={rate} onClick={() => setGstRate(rate)} className={`py-3 rounded-lg font-semibold transition-colors ${gstRate === rate ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>
                                    {rate}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Base Amount</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">₹ <AnimatedNumber value={baseAmount} /></span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">GST ({gstRate}%)</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">₹ <AnimatedNumber value={gstAmount} /></span>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-lg">
                        <span className="font-bold text-indigo-800 dark:text-indigo-200">Total Amount</span>
                        <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">₹ <AnimatedNumber value={totalAmount} /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};
