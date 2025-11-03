import React, { useState, useMemo, useEffect } from 'react';

// Simplified PPP index relative to USA = 100
const pppData = {
    'USA': { ppp: 100, currency: 'USD' },
    'India': { ppp: 28, currency: 'INR' },
    'UK': { ppp: 75, currency: 'GBP' },
    'Germany': { ppp: 80, currency: 'EUR' },
    'Japan': { ppp: 85, currency: 'JPY' },
    'Australia': { ppp: 90, currency: 'AUD' },
    'Canada': { ppp: 88, currency: 'CAD' },
    'Switzerland': { ppp: 120, currency: 'CHF' },
};
type Country = keyof typeof pppData;

export const InternationalSalaryConverter: React.FC<{ title: string }> = ({ title }) => {
    const [amount, setAmount] = useState('60000');
    const [fromCountry, setFromCountry] = useState<Country>('USA');
    const [toCountry, setToCountry] = useState<Country>('India');
    
    const convertedSalary = useMemo(() => {
        const numAmount = parseFloat(amount) || 0;
        const fromPPP = pppData[fromCountry].ppp;
        const toPPP = pppData[toCountry].ppp;
        
        return (numAmount / fromPPP) * toPPP;
    }, [amount, fromCountry, toCountry]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare salaries between countries using Purchasing Power Parity (PPP).</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                     <div className="md:col-span-2">
                        <label className="label-style">Salary Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-style text-xl"/>
                    </div>
                    <div>
                        <label className="label-style">From Country</label>
                        <select value={fromCountry} onChange={e => setFromCountry(e.target.value as Country)} className="input-style w-full">
                            {Object.keys(pppData).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="text-center text-2xl font-bold">↓</div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                     <div className="md:col-span-2 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-slate-500">Equivalent Salary with Local Purchasing Power</p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {pppData[toCountry].currency} {convertedSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div>
                        <label className="label-style">To Country</label>
                        <select value={toCountry} onChange={e => setToCountry(e.target.value as Country)} className="input-style w-full">
                            {Object.keys(pppData).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <p className="text-xs text-slate-400 pt-4 border-t">
                    *This is a simplified calculation using a basic PPP index and does not account for exchange rates, taxes, or specific local costs. For informational purposes only.
                </p>
            </div>
        </div>
    );
};
