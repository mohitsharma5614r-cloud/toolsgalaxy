import React, { useState, useMemo } from 'react';

export const HomeLoanBalanceTransferBenefitTool: React.FC<{ title: string }> = ({ title }) => {
    const [outstanding, setOutstanding] = useState(4000000);
    const [existingRate, setExistingRate] = useState(9.5);
    const [remainingTenure, setRemainingTenure] = useState(15);
    const [newRate, setNewRate] = useState(8.5);

    const { oldEmi, newEmi, monthlySaving, totalSaving } = useMemo(() => {
        const P = outstanding;
        const n = remainingTenure * 12;
        
        const old_r = existingRate / 12 / 100;
        const old_emi = (P * old_r * Math.pow(1 + old_r, n)) / (Math.pow(1 + old_r, n) - 1);
        
        const new_r = newRate / 12 / 100;
        const new_emi = (P * new_r * Math.pow(1 + new_r, n)) / (Math.pow(1 + new_r, n) - 1);

        const monthly = old_emi - new_emi;
        const total = monthly * n;

        return { oldEmi: old_emi, newEmi: new_emi, monthlySaving: monthly, totalSaving: total };

    }, [outstanding, existingRate, remainingTenure, newRate]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your potential savings from transferring your home loan.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold">Existing Loan Details</h2>
                    <div><label>Outstanding Amount: ₹{outstanding.toLocaleString()}</label><input type="range" min="1000000" max="20000000" step="100000" value={outstanding} onChange={e => setOutstanding(Number(e.target.value))} /></div>
                    <div><label>Existing Rate: {existingRate}%</label><input type="range" min="7" max="15" step="0.1" value={existingRate} onChange={e => setExistingRate(Number(e.target.value))} /></div>
                    <div><label>Remaining Tenure (Yrs): {remainingTenure}</label><input type="range" min="1" max="30" value={remainingTenure} onChange={e => setRemainingTenure(Number(e.target.value))} /></div>
                </div>
                 <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                     <h2 className="text-xl font-bold">New Loan Offer</h2>
                     <div><label>New Interest Rate: {newRate}%</label><input type="range" min="6" max="12" step="0.1" value={newRate} onChange={e => setNewRate(Number(e.target.value))} /></div>
                     <div className="mt-8 space-y-4">
                        <div className="result-card"><p>New Monthly EMI</p><p className="value text-indigo-500">₹{Math.round(newEmi).toLocaleString()}</p></div>
                         <div className="result-card bg-emerald-100"><p>Total Savings</p><p className="value text-emerald-700">₹{Math.round(totalSaving).toLocaleString()}</p></div>
                     </div>
                </div>
            </div>
        </div>
    );
};
