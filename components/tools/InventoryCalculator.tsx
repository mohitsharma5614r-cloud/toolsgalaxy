import React, { useState, useMemo } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="inventory-loader mx-auto">
            <div className="box b1"></div>
            <div className="box b2"></div>
            <div className="box b3"></div>
            <div className="box b4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating metrics...</p>
        <style>{`
            .inventory-loader { width: 100px; height: 100px; position: relative; }
            .box { width: 40px; height: 40px; background: #a1887f; border: 2px solid #5d4037; position: absolute; animation: stack 2s infinite ease-in-out; }
            .dark .box { background: #bcaaa4; border-color: #8d6e63; }
            .b1 { bottom: 0; left: 10px; }
            .b2 { bottom: 0; right: 10px; animation-delay: 0.5s; }
            .b3 { bottom: 42px; left: 10px; animation-delay: 1s; }
            .b4 { bottom: 42px; right: 10px; animation-delay: 1.5s; }
            @keyframes stack { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
    </div>
);

export const InventoryCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [cogs, setCogs] = useState(500000);
    const [avgInventory, setAvgInventory] = useState(100000);
    const [dailyUsage, setDailyUsage] = useState(100);
    const [leadTime, setLeadTime] = useState(7);
    const [safetyStock, setSafetyStock] = useState(200);

    const turnoverRatio = useMemo(() => cogs > 0 && avgInventory > 0 ? (cogs / avgInventory) : 0, [cogs, avgInventory]);
    const reorderPoint = useMemo(() => (dailyUsage * leadTime) + safetyStock, [dailyUsage, leadTime, safetyStock]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate key inventory metrics like turnover and reorder points.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <h2 className="text-xl font-bold">Turnover Ratio</h2>
                    <label>Cost of Goods Sold (COGS): ₹{cogs.toLocaleString()}</label>
                    <input type="range" min="10000" max="2000000" step="10000" value={cogs} onChange={e => setCogs(Number(e.target.value))} />
                    <label>Average Inventory Value: ₹{avgInventory.toLocaleString()}</label>
                    <input type="range" min="5000" max="500000" step="5000" value={avgInventory} onChange={e => setAvgInventory(Number(e.target.value))} />
                    <div className="result-card bg-indigo-100"><p>Turnover Ratio</p><p className="value text-indigo-700">{turnoverRatio.toFixed(2)}</p></div>
                </div>
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <h2 className="text-xl font-bold">Reorder Point</h2>
                    <label>Average Daily Usage: {dailyUsage} units</label>
                    <input type="range" min="10" max="1000" value={dailyUsage} onChange={e => setDailyUsage(Number(e.target.value))} />
                    <label>Lead Time (days): {leadTime}</label>
                    <input type="range" min="1" max="30" value={leadTime} onChange={e => setLeadTime(Number(e.target.value))} />
                    <label>Safety Stock: {safetyStock} units</label>
                    <input type="range" min="0" max="1000" value={safetyStock} onChange={e => setSafetyStock(Number(e.target.value))} />
                    <div className="result-card bg-emerald-100"><p>Reorder Point</p><p className="value text-emerald-700">{reorderPoint} units</p></div>
                </div>
            </div>
        </div>
    );
};