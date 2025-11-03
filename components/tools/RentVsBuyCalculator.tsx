import React, { useState, useMemo } from 'react';

export const RentVsBuyCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [monthlyRent, setMonthlyRent] = useState(25000);
    const [propertyPrice, setPropertyPrice] = useState(8000000);
    const [downPayment, setDownPayment] = useState(1600000);
    const [loanInterest, setLoanInterest] = useState(8.5);
    const [loanTenure, setLoanTenure] = useState(20);
    const [maintenance, setMaintenance] = useState(4000);

    const { monthlyEmi, totalBuyCost, totalRentCost, buyIsCheaper } = useMemo(() => {
        const principal = propertyPrice - downPayment;
        const monthlyRate = loanInterest / 12 / 100;
        const months = loanTenure * 12;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const monthlyBuy = emi + maintenance;
        const totalBuy = monthlyBuy * months;
        const totalRent = monthlyRent * months;
        return { monthlyEmi: emi, totalBuyCost: totalBuy, totalRentCost: totalRent, buyIsCheaper: totalBuy < totalRent };
    }, [monthlyRent, propertyPrice, downPayment, loanInterest, loanTenure, maintenance]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare the financial implications of renting versus buying a home.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold mb-4">Buying Details</h2>
                    <label>Property Price: ₹{propertyPrice.toLocaleString()}</label><input type="range" min="2000000" max="50000000" step="100000" value={propertyPrice} onChange={e => setPropertyPrice(Number(e.target.value))} />
                    <label>Down Payment: ₹{downPayment.toLocaleString()}</label><input type="range" min="0" max={propertyPrice} step="50000" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
                    <label>Loan Interest: {loanInterest}%</label><input type="range" min="6" max="15" step="0.1" value={loanInterest} onChange={e => setLoanInterest(Number(e.target.value))} />
                    <label>Loan Tenure: {loanTenure} years</label><input type="range" min="5" max="30" value={loanTenure} onChange={e => setLoanTenure(Number(e.target.value))} />
                </div>
                 <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                     <h2 className="text-xl font-bold mb-4">Renting Details</h2>
                     <label>Monthly Rent: ₹{monthlyRent.toLocaleString()}</label><input type="range" min="5000" max="150000" step="1000" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} />
                     <label>Monthly Maintenance (if buying): ₹{maintenance.toLocaleString()}</label><input type="range" min="0" max="20000" step="500" value={maintenance} onChange={e => setMaintenance(Number(e.target.value))} />
                </div>
            </div>
            <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center">
                 <h2 className="text-2xl font-bold mb-4">Comparison over {loanTenure} years</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="result-card"><p>Monthly Cost (Buy)</p><p className="value">₹{Math.round(monthlyEmi + maintenance).toLocaleString()}</p></div>
                    <div className="result-card"><p>Monthly Cost (Rent)</p><p className="value">₹{monthlyRent.toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Cost (Buy)</p><p className="value">₹{Math.round(totalBuyCost).toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Cost (Rent)</p><p className="value">₹{Math.round(totalRentCost).toLocaleString()}</p></div>
                 </div>
                 <div className={`mt-6 p-4 rounded-lg font-bold text-xl ${buyIsCheaper ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {buyIsCheaper ? 'Buying is cheaper in the long run!' : 'Renting is cheaper over this period!'}
                 </div>
            </div>
        </div>
    );
};
