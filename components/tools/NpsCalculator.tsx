import React, { useState, useMemo } from 'react';

export const NpsCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [monthly, setMonthly] = useState(10000);
    const [age, setAge] = useState(30);
    const [rate, setRate] = useState(10);

    const { corpus, invested, gains } = useMemo(() => {
        const n = (60 - age) * 12;
        const i = rate / 100 / 12;
        const P = monthly;
        const M = P * ((Math.pow(1 + i, n) - 1) / i);
        const inv = P * n;
        const g = M - inv;
        return { corpus: M, invested: inv, gains: g };
    }, [monthly, age, rate]);
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your pension wealth with the National Pension System.</p>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <label>Monthly Investment: ₹{monthly.toLocaleString()}</label><input type="range" min="1000" max="50000" step="1000" value={monthly} onChange={e => setMonthly(Number(e.target.value))} />
                    <label>Your Current Age: {age}</label><input type="range" min="18" max="59" value={age} onChange={e => setAge(Number(e.target.value))} />
                    <label>Expected Return Rate: {rate}%</label><input type="range" min="6" max="15" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} />
                </div>
                 <div className="space-y-4 text-center">
                    <div className="result-card bg-indigo-100"><p>Total Pension Wealth at 60</p><p className="value text-indigo-700 text-4xl">₹{Math.round(corpus).toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Amount Invested</p><p className="value">₹{Math.round(invested).toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Gains</p><p className="value text-emerald-600">₹{Math.round(gains).toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );
};
