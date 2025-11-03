import React, { useState, useMemo } from 'react';

interface Milestone {
    id: number;
    text: string;
    completed: boolean;
}
type Category = 'Product' | 'Marketing' | 'Sales';
type Timeframe = '3 Months' | '6 Months' | '1 Year';

const initialData: Record<Timeframe, Record<Category, Milestone[]>> = {
    '3 Months': {
        Product: [{ id: 1, text: 'Launch MVP', completed: false }],
        Marketing: [{ id: 2, text: 'Get first 100 users', completed: false }],
        Sales: [],
    },
    '6 Months': {
        Product: [{ id: 3, text: 'Implement user feedback features', completed: false }],
        Marketing: [],
        Sales: [{ id: 4, text: 'Secure first paying customer', completed: false }],
    },
    '1 Year': {
        Product: [],
        Marketing: [{ id: 5, text: 'Reach 10,000 monthly active users', completed: false }],
        Sales: [{ id: 6, text: 'Achieve $10,000 MRR', completed: false }],
    },
};

const CategorySection: React.FC<{
    title: Category;
    milestones: Milestone[];
    onAdd: (text: string) => void;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}> = ({ title, milestones, onAdd, onToggle, onDelete }) => {
    const [newText, setNewText] = useState('');
    const progress = useMemo(() => {
        if (milestones.length === 0) return 0;
        return (milestones.filter(m => m.completed).length / milestones.length) * 100;
    }, [milestones]);

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-3">{title}</h3>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
                {milestones.map(m => (
                    <div key={m.id} className="flex items-center gap-2 group">
                        <input type="checkbox" checked={m.completed} onChange={() => onToggle(m.id)} className="h-4 w-4 rounded" />
                        <span className={`flex-grow text-sm ${m.completed ? 'line-through text-slate-400' : ''}`}>{m.text}</span>
                        <button onClick={() => onDelete(m.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100">✕</button>
                    </div>
                ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); onAdd(newText); setNewText(''); }} className="flex gap-2 mt-3 pt-3 border-t">
                <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="Add new milestone..." className="input-style text-sm flex-grow" />
                <button type="submit" className="btn-secondary text-sm">+</button>
            </form>
        </div>
    );
};

export const StartupGrowthPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [data, setData] = useState(initialData);
    const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('3 Months');

    const handleAdd = (timeframe: Timeframe, category: Category, text: string) => {
        const newMilestone = { id: Date.now(), text, completed: false };
        setData(prev => ({
            ...prev,
            [timeframe]: { ...prev[timeframe], [category]: [...prev[timeframe][category], newMilestone] }
        }));
    };
    
    const handleToggle = (timeframe: Timeframe, category: Category, id: number) => {
        setData(prev => ({
            ...prev,
            [timeframe]: { ...prev[timeframe], [category]: prev[timeframe][category].map(m => m.id === id ? {...m, completed: !m.completed} : m) }
        }));
    };

    const handleDelete = (timeframe: Timeframe, category: Category, id: number) => {
         setData(prev => ({
            ...prev,
            [timeframe]: { ...prev[timeframe], [category]: prev[timeframe][category].filter(m => m.id !== id) }
        }));
    };


    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan key milestones and metrics for your startup's growth.</p>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 mb-6">
                {(['3 Months', '6 Months', '1 Year'] as Timeframe[]).map(tf => (
                    <button key={tf} onClick={() => setActiveTimeframe(tf)} className={`flex-1 py-2 rounded-md font-semibold ${activeTimeframe === tf ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>{tf}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['Product', 'Marketing', 'Sales'] as Category[]).map(cat => (
                    <CategorySection 
                        key={cat}
                        title={cat}
                        milestones={data[activeTimeframe][cat]}
                        onAdd={(text) => handleAdd(activeTimeframe, cat, text)}
                        onToggle={(id) => handleToggle(activeTimeframe, cat, id)}
                        onDelete={(id) => handleDelete(activeTimeframe, cat, id)}
                    />
                ))}
            </div>
        </div>
    );
};
