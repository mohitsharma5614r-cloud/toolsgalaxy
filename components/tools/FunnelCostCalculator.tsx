import React, { useState } from 'react';

interface FunnelStage {
    name: string;
    cost: string;
}

export const FunnelCostCalculator: React.FC = () => {
    const [stages, setStages] = useState<FunnelStage[]>([
        { name: 'Awareness (Ads)', cost: '' },
        { name: 'Interest (Content)', cost: '' },
        { name: 'Consideration (Email)', cost: '' },
        { name: 'Conversion (Landing Page)', cost: '' },
    ]);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [monthlyBudget, setMonthlyBudget] = useState('');

    const updateStageCost = (index: number, cost: string) => {
        const newStages = [...stages];
        newStages[index].cost = cost;
        setStages(newStages);
        calculateTotal(newStages);
    };

    const updateStageName = (index: number, name: string) => {
        const newStages = [...stages];
        newStages[index].name = name;
        setStages(newStages);
    };

    const addStage = () => {
        setStages([...stages, { name: `Stage ${stages.length + 1}`, cost: '' }]);
    };

    const removeStage = (index: number) => {
        const newStages = stages.filter((_, i) => i !== index);
        setStages(newStages);
        calculateTotal(newStages);
    };

    const calculateTotal = (stageList: FunnelStage[]) => {
        const total = stageList.reduce((sum, stage) => {
            const cost = parseFloat(stage.cost) || 0;
            return sum + cost;
        }, 0);
        setTotalCost(total);
    };

    const getRemainingBudget = () => {
        const budget = parseFloat(monthlyBudget) || 0;
        return budget - totalCost;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Funnel Cost Calculator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the total cost of your marketing funnel stages.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Budget (Optional)</label>
                    <input
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        placeholder="e.g., 5000"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Funnel Stages</h3>
                        <button
                            onClick={addStage}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            + Add Stage
                        </button>
                    </div>

                    {stages.map((stage, index) => (
                        <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={stage.name}
                                        onChange={(e) => updateStageName(index, e.target.value)}
                                        placeholder="Stage name"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="number"
                                        value={stage.cost}
                                        onChange={(e) => updateStageCost(index, e.target.value)}
                                        placeholder="Cost ($)"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                {stages.length > 1 && (
                                    <button
                                        onClick={() => removeStage(index)}
                                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Total Funnel Cost</h3>
                            <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">${totalCost.toLocaleString()}</p>
                        </div>
                        {monthlyBudget && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Remaining Budget</h3>
                                <p className={`text-4xl font-extrabold ${getRemainingBudget() >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${Math.abs(getRemainingBudget()).toLocaleString()}
                                    {getRemainingBudget() < 0 && ' over'}
                                </p>
                            </div>
                        )}
                    </div>

                    {stages.length > 0 && totalCost > 0 && (
                        <div className="mt-6 pt-4 border-t border-indigo-200 dark:border-indigo-800">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Cost Breakdown</h4>
                            <div className="space-y-2">
                                {stages.map((stage, idx) => {
                                    const cost = parseFloat(stage.cost) || 0;
                                    const percentage = totalCost > 0 ? (cost / totalCost) * 100 : 0;
                                    return cost > 0 ? (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-700 dark:text-slate-300">{stage.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-indigo-600 h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 w-20 text-right">
                                                    ${cost.toLocaleString()} ({percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Tips:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Include all costs: ads, content creation, tools, and team time</li>
                        <li>• Track costs per stage to identify optimization opportunities</li>
                        <li>• Regularly review and adjust based on performance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
