import React, { useState, useMemo } from 'react';

interface BudgetItem {
    id: number;
    name: string;
    amount: number;
    type: 'income' | 'expense';
}

export const PersonalBudgetPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [items, setItems] = useState<BudgetItem[]>([]);
    const [newItem, setNewItem] = useState({ name: '', amount: '', type: 'expense' as 'expense' | 'income' });

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const income = items.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
        const expenses = items.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
    }, [items]);

    const addItem = () => {
        if (newItem.name.trim() && Number(newItem.amount) > 0) {
            setItems([...items, { ...newItem, id: Date.now(), amount: Number(newItem.amount) }]);
            setNewItem({ name: '', amount: '', type: 'expense' });
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create and manage your personal monthly budget.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                     <h2 className="text-xl font-bold mb-4">Add Item</h2>
                     <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Item Name" className="input-style w-full"/>
                     <input type="number" value={newItem.amount} onChange={e => setNewItem({...newItem, amount: e.target.value})} placeholder="Amount" className="input-style w-full"/>
                     <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as any})} className="input-style w-full">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                     </select>
                     <button onClick={addItem} className="btn-primary w-full">Add</button>
                </div>
                <div className="md:col-span-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div className="result-card bg-emerald-100"><p>Income</p><p className="value text-emerald-700">₹{totalIncome.toLocaleString()}</p></div>
                        <div className="result-card bg-red-100"><p>Expenses</p><p className="value text-red-700">₹{totalExpenses.toLocaleString()}</p></div>
                        <div className="result-card bg-indigo-100"><p>Balance</p><p className="value text-indigo-700">₹{balance.toLocaleString()}</p></div>
                    </div>
                    <div className="space-y-2">
                        {items.map(item => (
                            <div key={item.id} className={`flex justify-between p-2 rounded ${item.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <span>{item.name}</span>
                                <span>₹{item.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
