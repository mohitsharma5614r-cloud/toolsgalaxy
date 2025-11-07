import React, { useState } from 'react';

export const AffiliateEarningEstimator: React.FC = () => {
    const [clicks, setClicks] = useState('');
    const [conversionRate, setConversionRate] = useState('');
    const [avgOrderValue, setAvgOrderValue] = useState('');
    const [commissionRate, setCommissionRate] = useState('');
    const [earnings, setEarnings] = useState<{
        sales: number;
        revenue: number;
        commission: number;
        monthly: number;
        yearly: number;
    } | null>(null);

    const calculate = () => {
        const clickCount = parseFloat(clicks);
        const conversion = parseFloat(conversionRate) / 100;
        const orderValue = parseFloat(avgOrderValue);
        const commission = parseFloat(commissionRate) / 100;

        if (isNaN(clickCount) || isNaN(conversion) || isNaN(orderValue) || isNaN(commission)) {
            return;
        }

        const sales = clickCount * conversion;
        const revenue = sales * orderValue;
        const commissionEarned = revenue * commission;

        setEarnings({
            sales: Math.round(sales),
            revenue: Math.round(revenue),
            commission: Math.round(commissionEarned),
            monthly: Math.round(commissionEarned * 30),
            yearly: Math.round(commissionEarned * 365)
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Affiliate Earning Estimator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate your potential earnings from affiliate marketing.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Daily Clicks</label>
                    <input
                        type="number"
                        value={clicks}
                        onChange={(e) => setClicks(e.target.value)}
                        placeholder="e.g., 1000"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conversion Rate (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={conversionRate}
                        onChange={(e) => setConversionRate(e.target.value)}
                        placeholder="e.g., 2.5"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Typical range: 1-5%</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Average Order Value ($)</label>
                    <input
                        type="number"
                        value={avgOrderValue}
                        onChange={(e) => setAvgOrderValue(e.target.value)}
                        placeholder="e.g., 50"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Commission Rate (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        placeholder="e.g., 10"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Typical range: 5-30%</p>
                </div>

                <button
                    onClick={calculate}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                    Calculate Earnings
                </button>

                {earnings && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-blue-800">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Daily Sales</h3>
                                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{earnings.sales}</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-purple-200 dark:border-purple-800">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Daily Revenue</h3>
                                <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">${earnings.revenue.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-green-200 dark:border-green-800">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Estimated Earnings</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900/50 rounded-lg">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Daily</span>
                                    <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">${earnings.commission.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900/50 rounded-lg">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly (30 days)</span>
                                    <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">${earnings.monthly.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900/50 rounded-lg">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Yearly (365 days)</span>
                                    <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">${earnings.yearly.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Calculation Breakdown</h4>
                            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p>• {clicks} clicks × {conversionRate}% conversion = {earnings.sales} sales/day</p>
                                <p>• {earnings.sales} sales × ${avgOrderValue} = ${earnings.revenue.toLocaleString()} revenue/day</p>
                                <p>• ${earnings.revenue.toLocaleString()} × {commissionRate}% commission = ${earnings.commission.toLocaleString()}/day</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Tips to Increase Earnings:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Increase traffic to your affiliate links</li>
                        <li>• Improve conversion rate with better content and targeting</li>
                        <li>• Promote higher-value products</li>
                        <li>• Choose programs with higher commission rates</li>
                    </ul>
                </div>
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
