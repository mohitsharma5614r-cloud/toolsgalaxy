import React, { useState, useMemo } from 'react';

interface Expense {
    id: number;
    name: string;
    amount: number;
    category: string;
}

const categories = ['Marketing', 'Salaries', 'Rent', 'Software', 'Travel', 'Other'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="piggy-bank-loader mx-auto">
            <div className="piggy-body">
                <div className="piggy-ear"></div>
                <div className="piggy-snout"></div>
            </div>
            <div className="coin">₹</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Adding your expense...</p>
        <style>{`
            .piggy-bank-loader { width: 120px; height: 100px; position: relative; }
            .piggy-body { width: 100px; height: 70px; background: #f472b6; border-radius: 50% / 60% 60% 40% 40%; position: absolute; bottom: 0; left: 10px; }
            .piggy-ear { width: 20px; height: 20px; background: #f472b6; border-radius: 50%; position: absolute; top: -5px; left: 10px; }
            .piggy-snout { width: 30px; height: 25px; background: #f9a8d4; border-radius: 50%; position: absolute; top: 20px; right: -20px; }
            .coin { font-size: 24px; color: #facc15; font-weight: bold; position: absolute; top: 0; left: 50%; transform: translateX(-50%); opacity: 0; animation: drop-coin 1.5s infinite; }
            @keyframes drop-coin { 0% { top: -20px; opacity: 1; } 50% { top: 10px; opacity: 1; } 51% { opacity: 0; } 100% { opacity: 0; } }
        `}</style>
    </div>
);

const PieChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff'];
    
    let cumulativePercent = 0;
    const gradients = data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const gradient = `${colors[index % colors.length]} ${cumulativePercent}% ${cumulativePercent + percent}%`;
        cumulativePercent += percent;
        return gradient;
    });

    return (
        <div className="w-48 h-48 rounded-full" style={{ background: `conic-gradient(${gradients.join(', ')})` }}></div>
    );
};

export const ExpenseTrackerTool: React.FC<{ title: string }> = ({ title }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]);
    
    const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
    const breakdown = useMemo(() => {
        const categoryTotals: { [key: string]: number } = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    }, [expenses]);
    
    const addExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && Number(amount) > 0) {
            const newExpense: Expense = { id: Date.now(), name, amount: Number(amount), category };
            setExpenses([newExpense, ...expenses]);
            setName('');
            setAmount('');
        }
    };

    return (
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Track and categorize your business expenses simply.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                     <h2 className="text-xl font-bold">Add Expense</h2>
                     <form onSubmit={addExpense} className="space-y-4">
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Expense Name" className="input-style w-full" />
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="input-style w-full" />
                        <select value={category} onChange={e => setCategory(e.target.value)} className="input-style w-full">
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <button type="submit" className="btn-primary w-full">Add Expense</button>
                     </form>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 mt-4 border-t pt-4">
                        {expenses.map(exp => (
                            <div key={exp.id} className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                                <span>{exp.name} ({exp.category})</span>
                                <span className="font-semibold">₹{exp.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center">
                    <h2 className="text-xl font-bold">Expense Breakdown</h2>
                    <p className="text-4xl font-bold my-4">Total: ₹{totalExpenses.toLocaleString()}</p>
                    {breakdown.length > 0 ? (
                         <div className="flex flex-col items-center gap-4">
                            <PieChart data={breakdown} />
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs justify-center">
                                {breakdown.map((item, i) => (
                                     <span key={item.name} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff'][i % 6]}}></div>
                                        {item.name}
                                     </span>
                                ))}
                            </div>
                         </div>
                    ) : (
                        <p className="text-slate-400">Add expenses to see the breakdown.</p>
                    )}
                </div>
            </div>
        </div>
    );
};