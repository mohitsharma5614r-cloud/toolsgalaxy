import React, { useState, useMemo } from 'react';

const categories = {
    'Electronics': { duty: 10, gst: 18 },
    'Clothing & Textiles': { duty: 10, gst: 12 },
    'Books': { duty: 0, gst: 0 },
    'Toys': { duty: 20, gst: 18 },
    'Car Parts': { duty: 15, gst: 28 },
};
type Category = keyof typeof categories;

export const ImportCustomDutyCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [value, setValue] = useState(50000);
    const [category, setCategory] = useState<Category>('Electronics');

    const { duty, gst, total } = useMemo(() => {
        const rule = categories[category];
        const d = value * (rule.duty / 100);
        const assessableValue = value + d;
        const g = assessableValue * (rule.gst / 100);
        const t = d + g;
        return { duty: d, gst: g, total: t };
    }, [value, category]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the customs duty on imported goods.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label>Assessable Value of Goods: ₹{value.toLocaleString()}</label>
                        <input type="range" min="1000" max="500000" step="1000" value={value} onChange={e => setValue(Number(e.target.value))} />
                    </div>
                    <div>
                        <label>Goods Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as Category)} className="input-style w-full">
                            {Object.keys(categories).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t text-center space-y-4">
                     <div className="result-card"><p>Basic Customs Duty ({categories[category].duty}%)</p><p className="value">₹{duty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
                     <div className="result-card"><p>IGST ({categories[category].gst}%)</p><p className="value">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
                     <div className="result-card bg-red-100"><p>Total Import Duty</p><p className="value text-red-700">₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
                </div>
            </div>
        </div>
    );
};
