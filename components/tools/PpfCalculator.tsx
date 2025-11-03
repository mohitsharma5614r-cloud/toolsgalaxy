import React, { useState, useMemo } from 'react';

export const PpfCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [yearly, setYearly] = useState(150000);
    const [rate] = useState(7.1); // Current PPF rate
    const [years, setYears] = useState(15);

    const { maturity, invested, interest } = useMemo(() => {
        let balance = 0;
        for (let i = 0; i < years; i++) {
            balance = (balance + yearly) * (1 + rate / 100);
        }
        const inv = yearly * years;
        const int = balance - inv;
        return { maturity: balance, invested: inv, interest: int };
    }, [yearly, rate, years]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the maturity amount of your Public Provident Fund.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <label>Yearly Investment: ₹{yearly.toLocaleString()}</label><input type="range" min="500" max="150000" step="500" value={yearly} onChange={e => setYearly(Number(e.target.value))} />
                    <label>Interest Rate: {rate}% (current rate)</label>
                    <label>Period (Years): {years}</label><input type="range" min="15" max="50" step="5" value={years} onChange={e => setYears(Number(e.target.value))} />
                </div>
                <div className="space-y-4 text-center">
                    <div className="result-card bg-indigo-100"><p>Maturity Value</p><p className="value text-indigo-700 text-4xl">₹{Math.round(maturity).toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Investment</p><p className="value">₹{invested.toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Interest</p><p className="value text-emerald-600">₹{Math.round(interest).toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );
};
