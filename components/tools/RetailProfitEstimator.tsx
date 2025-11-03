
import React, { useState, useMemo, useEffect } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string, suffix?: string }> = ({ value, prefix, suffix }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 750;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const p = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - p, 3);
            setCurrent(start + (value - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current]);

    return <span>{prefix}{current.toLocaleString('en-IN', { maximumFractionDigits: 1 })}{suffix}</span>;
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="cash-register-loader mx-auto">
            <div className="register-body">
                <div className="receipt-paper"></div>
            </div>
            <div className="drawer">
                <div className="coin c1"></div><div className="coin c2"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Calculating profit...</p>
        <style>{`
            .cash-register-loader { width: 120px; height: 100px; position: relative; }
            .register-body { width: 100%; height: 70px; background: #9ca3af; border-radius: 8px 8px 0 0; position: absolute; top: 0; }
            .dark .register-body { background: #475569; }
            .receipt-paper { width: 40px; height: 50px; background: #f1f5f9; position: absolute; top: -30px; left: 50%; transform: translateX(-50%); animation: print-receipt 2s forwards; }
            .dark .receipt-paper { background: #1e293b; }
            .drawer { width: 110%; height: 30px; background: #64748b; border-radius: 0 0 8px 8px; position: absolute; bottom: -30px; left: -5%; display: flex; justify-around; align-items: center; animation: open-drawer 2s forwards; }
            .dark .drawer { background: #94a3b8; }
            .coin { width: 15px; height: 15px; background: #facc15; border-radius: 50%; }
            @keyframes print-receipt { 0% { height: 10px; top: 5px; } 100% { height: 50px; top: -30px; } }
            @keyframes open-drawer { 0%, 20% { transform: translateY(0); } 40%, 60% { transform: translateY(10px); } 80%, 100% { transform: translateY(0); } }
        `}</style>
    </div>
);

export const RetailProfitEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [cost, setCost] = useState(500);
    const [price, setPrice] = useState(1200);
    const [units, setUnits] = useState(100);
    const [otherCosts, setOtherCosts] = useState(5000);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);
    
    const { totalRevenue, totalCost, grossProfit, profitMargin } = useMemo(() => {
        const rev = price * units;
        const costOfGoods = cost * units;
        const profit = rev - costOfGoods - otherCosts;
        const margin = rev > 0 ? (profit / rev) * 100 : 0;
        return { totalRevenue: rev, totalCost: costOfGoods + otherCosts, grossProfit: profit, profitMargin: margin };
    }, [cost, price, units, otherCosts]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate profit for retail products based on cost, price, and other expenses.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <label>Cost Price (per unit): ₹{cost.toLocaleString()}</label><input type="range" min="1" max="10000" value={cost} onChange={e => setCost(Number(e.target.value))} />
                    <label>Selling Price (per unit): ₹{price.toLocaleString()}</label><input type="range" min={cost} max="20000" value={price} onChange={e => setPrice(Number(e.target.value))} />
                    <label>Units Sold: {units.toLocaleString()}</label><input type="range" min="1" max="5000" value={units} onChange={e => setUnits(Number(e.target.value))} />
                    <label>Other Costs (Marketing, etc.): ₹{otherCosts.toLocaleString()}</label><input type="range" min="0" max="100000" step="1000" value={otherCosts} onChange={e => setOtherCosts(Number(e.target.value))} />
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col justify-center">
                    {isLoading ? <Loader /> : (
                        <div className="space-y-4 animate-fade-in">
                            <div className="result-card"><p>Total Revenue</p><p className="value"><AnimatedNumber value={totalRevenue} prefix="₹ " /></p></div>
                            <div className="result-card"><p>Total Costs</p><p className="value"><AnimatedNumber value={totalCost} prefix="₹ " /></p></div>
                            <div className={`result-card ${grossProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                <p>Gross Profit</p><p className={`value text-3xl ${grossProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}><AnimatedNumber value={grossProfit} prefix="₹ " /></p>
                            </div>
                            <div className="result-card"><p>Profit Margin</p><p className="value text-indigo-600"><AnimatedNumber value={profitMargin} suffix="%" /></p></div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                .result-card { border-radius: 0.5rem; padding: 0.75rem; text-align: center; }
                .result-card p:first-child { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .result-card .value { font-size: 1.875rem; font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
