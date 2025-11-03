import React, { useState, useMemo } from 'react';

const channels = [
    { name: 'SEO', color: '#4f46e5' },
    { name: 'PPC Ads', color: '#10b981' },
    { name: 'Social Media', color: '#3b82f6' },
    { name: 'Content Marketing', color: '#f59e0b' },
    { name: 'Email Marketing', color: '#ef4444' },
];

const PieChart: React.FC<{ data: { name: string, value: number, color: string }[] }> = ({ data }) => {
    let cumulativePercent = 0;
    const gradients = data.map((item) => {
        const gradient = `${item.color} ${cumulativePercent}% ${cumulativePercent + item.value}%`;
        cumulativePercent += item.value;
        return gradient;
    });

    return (
        <div 
            className="w-48 h-48 rounded-full transition-all duration-500"
            style={{ background: `conic-gradient(${gradients.join(', ')})` }}
        ></div>
    );
};

export const DigitalMarketingBudgetPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [totalBudget, setTotalBudget] = useState(100000);
    const [allocations, setAllocations] = useState([30, 25, 20, 15, 10]);

    const handleAllocationChange = (index: number, value: number) => {
        const newAllocations = [...allocations];
        const oldValue = newAllocations[index];
        const diff = value - oldValue;
        newAllocations[index] = value;

        let remainingDiff = -diff;
        const otherIndices = channels.map((_, i) => i).filter(i => i !== index);

        // Distribute the difference proportionally among other sliders
        const totalOfOthers = otherIndices.reduce((sum, i) => sum + newAllocations[i], 0);

        if(totalOfOthers > 0) {
            for (const i of otherIndices) {
                const proportion = newAllocations[i] / totalOfOthers;
                newAllocations[i] += remainingDiff * proportion;
            }
        } else {
             // If others are all 0, distribute evenly
             for (const i of otherIndices) {
                newAllocations[i] += remainingDiff / otherIndices.length;
            }
        }
        
        // Ensure total is exactly 100 due to floating point inaccuracies
        const currentTotal = newAllocations.reduce((a, b) => a + b, 0);
        newAllocations[index] += 100 - currentTotal;

        setAllocations(newAllocations.map(v => Math.round(v)));
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your budget across various digital marketing channels.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Budget Allocation</h2>
                    <label>Total Monthly Budget: ₹{totalBudget.toLocaleString()}</label>
                    <input type="range" min="10000" max="1000000" step="10000" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value))} />
                    
                    <div className="space-y-3 pt-4 border-t">
                        {channels.map((channel, index) => (
                            <div key={channel.name}>
                                <label className="text-sm">{channel.name}: {allocations[index]}%</label>
                                <input type="range" min="0" max="100" value={allocations[index]} onChange={e => handleAllocationChange(index, Number(e.target.value))} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center">
                     <h2 className="text-xl font-bold mb-4">Breakdown</h2>
                     <div className="flex justify-center mb-6">
                        <PieChart data={channels.map((c, i) => ({...c, value: allocations[i]}))} />
                     </div>
                     <div className="space-y-2">
                        {channels.map((channel, index) => (
                            <div key={channel.name} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: channel.color}}></div>{channel.name}</span>
                                <span className="font-bold">₹{((totalBudget * allocations[index]) / 100).toLocaleString()}</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};