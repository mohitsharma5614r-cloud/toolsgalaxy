import React, { useState } from 'react';

export const CpmCpcCalculator: React.FC = () => {
    const [mode, setMode] = useState<'cpm' | 'cpc'>('cpm');
    
    // CPM inputs
    const [cpmCost, setCpmCost] = useState('');
    const [impressions, setImpressions] = useState('');
    
    // CPC inputs
    const [cpcCost, setCpcCost] = useState('');
    const [clicks, setClicks] = useState('');
    
    // Results
    const [cpmResult, setCpmResult] = useState<number | null>(null);
    const [cpcResult, setCpcResult] = useState<number | null>(null);
    const [ctr, setCtr] = useState<number | null>(null);

    const calculateCPM = () => {
        const cost = parseFloat(cpmCost);
        const impr = parseFloat(impressions);
        
        if (isNaN(cost) || isNaN(impr) || impr === 0) {
            return;
        }
        
        const result = (cost / impr) * 1000;
        setCpmResult(result);
    };

    const calculateCPC = () => {
        const cost = parseFloat(cpcCost);
        const clk = parseFloat(clicks);
        
        if (isNaN(cost) || isNaN(clk) || clk === 0) {
            return;
        }
        
        const result = cost / clk;
        setCpcResult(result);
        
        // Calculate CTR if impressions are available
        const impr = parseFloat(impressions);
        if (!isNaN(impr) && impr > 0) {
            setCtr((clk / impr) * 100);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">CPM / CPC Calculator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate Cost Per Mille (CPM) and Cost Per Click (CPC) for your campaigns.</p>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setMode('cpm')}
                    className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
                        mode === 'cpm' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                    CPM Calculator
                </button>
                <button
                    onClick={() => setMode('cpc')}
                    className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
                        mode === 'cpc' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                    CPC Calculator
                </button>
            </div>

            {mode === 'cpm' ? (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Cost ($)</label>
                        <input
                            type="number"
                            value={cpmCost}
                            onChange={(e) => setCpmCost(e.target.value)}
                            placeholder="e.g., 500"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Impressions</label>
                        <input
                            type="number"
                            value={impressions}
                            onChange={(e) => setImpressions(e.target.value)}
                            placeholder="e.g., 100000"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        onClick={calculateCPM}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        Calculate CPM
                    </button>

                    {cpmResult !== null && (
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-green-200 dark:border-green-800 animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">CPM Result</h3>
                            <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">${cpmResult.toFixed(2)}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Cost per 1,000 impressions</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Cost ($)</label>
                        <input
                            type="number"
                            value={cpcCost}
                            onChange={(e) => setCpcCost(e.target.value)}
                            placeholder="e.g., 500"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Clicks</label>
                        <input
                            type="number"
                            value={clicks}
                            onChange={(e) => setClicks(e.target.value)}
                            placeholder="e.g., 250"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Impressions (Optional, for CTR)</label>
                        <input
                            type="number"
                            value={impressions}
                            onChange={(e) => setImpressions(e.target.value)}
                            placeholder="e.g., 100000"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        onClick={calculateCPC}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        Calculate CPC
                    </button>

                    {cpcResult !== null && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">CPC Result</h3>
                                <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">${cpcResult.toFixed(2)}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Cost per click</p>
                            </div>
                            
                            {ctr !== null && (
                                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Click-Through Rate (CTR)</h3>
                                    <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">{ctr.toFixed(2)}%</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Percentage of impressions that resulted in clicks</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">📊 Formulas:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• <strong>CPM</strong> = (Total Cost / Total Impressions) × 1,000</li>
                    <li>• <strong>CPC</strong> = Total Cost / Total Clicks</li>
                    <li>• <strong>CTR</strong> = (Total Clicks / Total Impressions) × 100</li>
                </ul>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
