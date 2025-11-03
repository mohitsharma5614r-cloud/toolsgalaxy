import React, { useState, useMemo } from 'react';

const categories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

export const AnnualExpenseBreakdownTool: React.FC<{ title: string }> = ({ title }) => {
    const [expenses, setExpenses] = useState<{ [key: string]: number }>({ Housing: 240000, Food: 120000, Transport: 60000 });

    // FIX: Add explicit types to the reduce function's callback parameters to resolve type errors.
    const totalExpenses = useMemo(() => Object.values(expenses).reduce((sum: number, val: number) => sum + (val || 0), 0), [expenses]);
    
    const updateExpense = (category: string, amount: string) => {
        setExpenses({ ...expenses, [category]: Number(amount) || 0 });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Break down your annual expenses into categories for better financial planning.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold mb-2">Enter Annual Expenses</h2>
                    {categories.map(cat => (
                        <div key={cat} className="flex items-center justify-between">
                            <label className="font-semibold">{cat}</label>
                            <input type="number" value={expenses[cat] || ''} onChange={e => updateExpense(cat, e.target.value)} className="input-style w-40" placeholder="₹ Amount"/>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center">
                    <h2 className="text-xl font-bold mb-4">Total Annual Expenses: ₹{totalExpenses.toLocaleString()}</h2>
                    <div className="space-y-2">
                        {Object.entries(expenses).map(([cat, amount]) => {
                            if(amount === 0 || !amount) return null;
                            const percentage = totalExpenses > 0 ? (Number(amount) / totalExpenses) * 100 : 0;
                            return (
                                <div key={cat}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{cat}</span>
                                        <span>{percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-4">
                                        <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
