import React, { useState, useMemo } from 'react';

export const GoldInvestmentReturnCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [grams, setGrams] = useState(50);
    const [buyPrice, setBuyPrice] = useState(6500);
    const [sellPrice, setSellPrice] = useState(7200);

    const { investment, saleValue, profit, returnPercent } = useMemo(() => {
        const inv = grams * buyPrice;
        const sale = grams * sellPrice;
        const p = sale - inv;
        const ret = (p / inv) * 100;
        return { investment: inv, saleValue: sale, profit: p, returnPercent: ret };
    }, [grams, buyPrice, sellPrice]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the returns on your investment in gold.</p>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <label>Gold Quantity (grams): {grams}</label><input type="range" min="1" max="1000" value={grams} onChange={e => setGrams(Number(e.target.value))} />
                    <label>Buy Price (per gram): ₹{buyPrice.toLocaleString()}</label><input type="range" min="4000" max="10000" step="50" value={buyPrice} onChange={e => setBuyPrice(Number(e.target.value))} />
                    <label>Sell Price (per gram): ₹{sellPrice.toLocaleString()}</label><input type="range" min="4000" max="10000" step="50" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} />
                </div>
                <div className="space-y-4 text-center">
                    <div className="result-card"><p>Total Investment</p><p className="value">₹{investment.toLocaleString()}</p></div>
                    <div className="result-card"><p>Total Sale Value</p><p className="value">₹{saleValue.toLocaleString()}</p></div>
                    <div className={`result-card ${profit > 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        <p>Profit/Loss</p>
                        <p className={`value text-3xl ${profit > 0 ? 'text-emerald-700' : 'text-red-700'}`}>₹{profit.toLocaleString()}</p>
                    </div>
                     <div className={`result-card ${profit > 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        <p>Return Percentage</p>
                        <p className={`value text-3xl ${profit > 0 ? 'text-emerald-700' : 'text-red-700'}`}>{returnPercent.toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
