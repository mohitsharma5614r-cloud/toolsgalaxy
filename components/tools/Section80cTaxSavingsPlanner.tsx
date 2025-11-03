import React, { useState, useMemo } from 'react';

const MAX_80C_LIMIT = 150000;

export const Section80cTaxSavingsPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [investments, setInvestments] = useState([
        { name: 'EPF/VPF', amount: 50000 },
        { name: 'Life Insurance Premium', amount: 15000 },
        { name: 'ELSS Mutual Funds', amount: 25000 },
    ]);
    const [newItem, setNewItem] = useState({ name: '', amount: '' });

    const totalInvested = useMemo(() => {
        return investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    }, [investments]);

    const utilized = Math.min(totalInvested, MAX_80C_LIMIT);
    const remaining = MAX_80C_LIMIT - utilized;
    const progress = (utilized / MAX_80C_LIMIT) * 100;

    const addItem = () => {
        if (newItem.name.trim() && Number(newItem.amount) > 0) {
            setInvestments([...investments, { ...newItem, amount: Number(newItem.amount) }]);
            setNewItem({ name: '', amount: '' });
        }
    };
    
    const removeItem = (index: number) => {
        setInvestments(investments.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your tax-saving investments under the ₹1,50,000 limit.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold mb-4">Your 80C Investments</h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {investments.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                                <span className="font-semibold">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono">₹{item.amount.toLocaleString()}</span>
                                    <button onClick={() => removeItem(index)} className="text-red-500 font-bold">&times;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                        <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Investment Name" className="input-style flex-grow"/>
                        <input type="number" value={newItem.amount} onChange={e => setNewItem({...newItem, amount: e.target.value})} placeholder="Amount" className="input-style w-28"/>
                        <button onClick={addItem} className="btn-primary px-4">+</button>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center text-center">
                     <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-slate-200 dark:text-slate-700" strokeWidth="16" stroke="currentColor" fill="transparent" r="72" cx="96" cy="96" />
                            <circle className="text-indigo-600" strokeWidth="16" strokeDasharray={452} strokeDashoffset={452 - (progress / 100) * 452} strokeLinecap="round" stroke="currentColor" fill="transparent" r="72" cx="96" cy="96" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{Math.round(progress)}%</span>
                            <span className="text-sm">Utilized</span>
                        </div>
                    </div>
                    <div className="w-full mt-6 space-y-3">
                        <div className="result-item"><span className="font-semibold">Utilized Amount:</span> <span className="value-item">₹{utilized.toLocaleString()}</span></div>
                        <div className="result-item"><span className="font-semibold">Remaining Limit:</span> <span className="value-item text-emerald-500">₹{remaining.toLocaleString()}</span></div>
                        <div className="result-item"><span className="font-semibold">Max Limit:</span> <span className="value-item">₹{MAX_80C_LIMIT.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
