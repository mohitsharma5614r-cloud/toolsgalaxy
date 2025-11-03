import React, { useState, useMemo } from 'react';

const taxRegimes = {
    'New Regime': [
        { upTo: 300000, rate: 0 },
        { upTo: 600000, rate: 5 },
        { upTo: 900000, rate: 10 },
        { upTo: 1200000, rate: 15 },
        { upTo: 1500000, rate: 20 },
        { upTo: Infinity, rate: 30 },
    ],
    'Old Regime': [ // For individuals < 60 years
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 5 },
        { upTo: 1000000, rate: 20 },
        { upTo: Infinity, rate: 30 },
    ],
};

type Regime = keyof typeof taxRegimes;

export const IncomeTaxBracketChecker: React.FC<{ title: string }> = ({ title }) => {
    const [income, setIncome] = useState(1200000);
    const [regime, setRegime] = useState<Regime>('New Regime');

    const { tax, effectiveRate, slab } = useMemo(() => {
        let taxableIncome = income;
        let calculatedTax = 0;
        let lastSlab = 0;
        let currentSlab = { upTo: 0, rate: 0 };

        for (const s of taxRegimes[regime]) {
            if (taxableIncome > lastSlab) {
                const taxableInSlab = Math.min(taxableIncome - lastSlab, s.upTo - lastSlab);
                calculatedTax += taxableInSlab * (s.rate / 100);
            }
            if(taxableIncome <= s.upTo) {
                currentSlab = s;
                break;
            }
            lastSlab = s.upTo;
        }

        // Rebate under 87A for New Regime (income <= 7L) and Old Regime (income <= 5L)
        if ((regime === 'New Regime' && income <= 700000) || (regime === 'Old Regime' && income <= 500000)) {
            calculatedTax = 0;
        }

        const eRate = (calculatedTax / income) * 100 || 0;
        
        return { tax: calculatedTax, effectiveRate: eRate, slab: currentSlab };

    }, [income, regime]);
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check which tax slab you fall under (as per FY 2023-24).</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-8">
                 <div>
                    <label className="label-style">Your Annual Taxable Income: <span className="font-bold text-indigo-600">₹{income.toLocaleString('en-IN')}</span></label>
                    <input type="range" min="100000" max="5000000" step="10000" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full range-style" />
                </div>
                 <div>
                    <label className="label-style">Tax Regime</label>
                    <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                        <button onClick={() => setRegime('New Regime')} className={`flex-1 btn-toggle ${regime === 'New Regime' ? 'btn-toggle-active' : ''}`}>New Regime</button>
                        <button onClick={() => setRegime('Old Regime')} className={`flex-1 btn-toggle ${regime === 'Old Regime' ? 'btn-toggle-active' : ''}`}>Old Regime</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                    <div className="result-card"><p className="result-label">Highest Tax Slab</p><p className="result-value text-3xl">{slab.rate}%</p></div>
                    <div className="result-card"><p className="result-label">Effective Tax Rate</p><p className="result-value text-3xl">{effectiveRate.toFixed(2)}%</p></div>
                     <div className="md:col-span-2 result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">Estimated Income Tax</p>
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">₹{Math.round(tax).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
