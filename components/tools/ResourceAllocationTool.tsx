import React, { useState, useMemo } from 'react';

interface Resource {
    id: number;
    name: string;
    value: number;
    color: string;
}

const colors = ['#4f46e5', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const PieChart: React.FC<{ data: Resource[] }> = ({ data }) => {
    let cumulativePercent = 0;
    const gradients = data.map((item) => {
        const gradient = `${item.color} ${cumulativePercent}% ${cumulativePercent + item.value}%`;
        cumulativePercent += item.value;
        return gradient;
    });

    return (
        <div className="w-56 h-56 rounded-full transition-all duration-300" style={{ background: `conic-gradient(${gradients.join(', ')})` }}></div>
    );
};

export const ResourceAllocationTool: React.FC<{ title: string }> = ({ title }) => {
    const [resources, setResources] = useState<Resource[]>([
        { id: 1, name: 'Project A', value: 40, color: colors[0] },
        { id: 2, name: 'Project B', value: 30, color: colors[1] },
        { id: 3, name: 'Admin Tasks', value: 20, color: colors[2] },
        { id: 4, name: 'Meetings', value: 10, color: colors[3] },
    ]);
    const [newResourceName, setNewResourceName] = useState('');

    const handleAllocationChange = (id: number, newValue: number) => {
        setResources(prev => {
            const newItems = [...prev];
            const changedItem = newItems.find(item => item.id === id);
            if (!changedItem) return prev;

            const oldValue = changedItem.value;
            const diff = newValue - oldValue;
            changedItem.value = newValue;
            
            const total = newItems.reduce((sum, item) => sum + item.value, 0);

            // If we exceed 100, reduce other sliders proportionally
            if (total > 100) {
                const othersTotal = total - newValue;
                const reductionFactor = (othersTotal - diff) / othersTotal;
                newItems.forEach(item => {
                    if (item.id !== id) {
                        item.value *= reductionFactor;
                    }
                });
            }
            
            // Normalize to exactly 100
            const finalTotal = newItems.reduce((sum, item) => sum + item.value, 0);
            const normalizationFactor = 100 / finalTotal;
            return newItems.map(item => ({ ...item, value: Math.round(item.value * normalizationFactor) }));
        });
    };
    
    const addResource = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newResourceName.trim()) return;
        const newResource = { id: Date.now(), name: newResourceName, value: 0, color: colors[resources.length % colors.length] };
        setResources([...resources, newResource]);
        setNewResourceName('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan how to allocate your time, money, or team resources.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Resource Allocation</h2>
                    {resources.map(res => (
                        <div key={res.id}>
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: res.color}}></div>{res.name}</span>
                                <span>{res.value}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={res.value} onChange={e => handleAllocationChange(res.id, Number(e.target.value))} className="w-full" />
                        </div>
                    ))}
                     <form onSubmit={addResource} className="flex gap-2 pt-4 border-t">
                        <input value={newResourceName} onChange={e => setNewResourceName(e.target.value)} placeholder="Add new item..." className="input-style flex-grow" />
                        <button type="submit" className="btn-primary">+</button>
                    </form>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center">
                    <PieChart data={resources} />
                    <p className="mt-4 font-bold text-xl">Total: 100%</p>
                </div>
            </div>
        </div>
    );
};
