import React, { useState, useMemo } from 'react';

export const LuxuryTaxCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [amount, setAmount] = useState(500000);
    const [taxRate, setTaxRate] = useState(28); // Example rate

    const { tax, total } = useMemo(() => {
        const t = amount * (taxRate / 100);
        return { tax: t, total: amount + t };
    }, [amount, taxRate]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 💎</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the luxury tax applicable on various goods and services.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                <div>
                    <label>Item Value: ₹{amount.toLocaleString()}</label>
                    <input type="range" min="100000" max="5000000" step="50000" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                </div>
                <div>
                    <label>Luxury Tax Rate: {taxRate}%</label>
                    <input type="range" min="5" max="40" step="1" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="result-card"><p>Tax Amount</p><p className="value text-red-600">₹{Math.round(tax).toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Price</p><p className="value text-indigo-600 text-2xl">₹{Math.round(total).toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );
};
