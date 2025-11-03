import React, { useState, useMemo } from 'react';

const tdsRates = {
    'Salary': { threshold: 250000, rate: 10, note: "Taxed as per income tax slabs. 10% is an estimate." },
    'Interest on Securities': { threshold: 10000, rate: 10, note: "" },
    'Dividends': { threshold: 5000, rate: 10, note: "" },
    'Rent (Plant & Machinery)': { threshold: 240000, rate: 2, note: "" },
    'Rent (Land/Building)': { threshold: 240000, rate: 10, note: "" },
    'Professional Fees (Sec 194J)': { threshold: 30000, rate: 10, note: "" },
    'Payment to Contractors (Sec 194C)': { threshold: 30000, rate: 1, note: "1% for Individuals/HUF, 2% for others." },
};
type IncomeType = keyof typeof tdsRates;

export const TdsCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [incomeType, setIncomeType] = useState<IncomeType>('Salary');
    const [amount, setAmount] = useState('500000');
    
    const { tds, note, isApplicable } = useMemo(() => {
        const numAmount = parseFloat(amount) || 0;
        const rule = tdsRates[incomeType];

        if (numAmount < rule.threshold) {
            return { tds: 0, note: "TDS not applicable as amount is below threshold.", isApplicable: false };
        }
        
        const calculatedTds = numAmount * (rule.rate / 100);
        return { tds: calculatedTds, note: rule.note, isApplicable: true };

    }, [incomeType, amount]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate Tax Deducted at Source on various types of income.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label-style">Nature of Payment</label>
                        <select value={incomeType} onChange={e => setIncomeType(e.target.value as IncomeType)} className="input-style w-full">
                            {Object.keys(tdsRates).map(type => <option key={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label-style">Total Amount Paid (per year)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">₹</span>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full input-style pl-8"/>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t text-center space-y-4">
                    <p className="text-lg text-slate-500 dark:text-slate-400">Estimated TDS Amount</p>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{Math.round(tds).toLocaleString('en-IN')}</p>
                    <p className={`text-sm font-semibold ${isApplicable ? 'text-emerald-500' : 'text-yellow-500'}`}>{isApplicable ? `TDS @ ${tdsRates[incomeType].rate}% is applicable.` : 'TDS may not be applicable.'}</p>
                    {note && <p className="text-xs text-slate-400">{note}</p>}
                </div>
            </div>
        </div>
    );
};
