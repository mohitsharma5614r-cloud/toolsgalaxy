import React, { useState, useMemo } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string, suffix?: string, decimals?: number }> = ({ value, prefix, suffix, decimals = 0 }) => {
    const [current, setCurrent] = useState(0);
    React.useEffect(() => {
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

    return <span>{prefix}{current.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="money-tree-loader mx-auto">
            <div className="trunk"></div>
            <div className="leaf l1"></div>
            <div className="leaf l2"></div>
            <div className="leaf l3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating profitability...</p>
        <style>{`
            .money-tree-loader { width: 100px; height: 120px; position: relative; }
            .trunk { width: 15px; height: 100%; background: #a1887f; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); border-radius: 8px 8px 0 0; }
            .dark .trunk { background: #bcaaa4; }
            .leaf {
                position: absolute;
                width: 40px; height: 40px;
                background: #22c55e; /* emerald-500 */
                border-radius: 50% 0;
                opacity: 0;
                animation: grow-leaf 2s infinite;
            }
            .l1 { top: 0; left: 50%; transform: rotate(45deg); animation-delay: 0s; }
            .l2 { top: 20px; left: 10%; transform: rotate(-30deg); animation-delay: 0.5s; }
            .l3 { top: 20px; right: 10%; transform: rotate(120deg); animation-delay: 1s; }
            @keyframes grow-leaf {
                0%, 100% { transform: scale(0) rotate(var(--angle)); opacity: 0; }
                50% { transform: scale(1) rotate(var(--angle)); opacity: 1; }
            }
            .l1 { --angle: 45deg; } .l2 { --angle: -30deg; } .l3 { --angle: 120deg; }
        `}</style>
    </div>
);

export const SubscriptionProfitCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [arpu, setArpu] = useState(1500); // Average Revenue Per User (monthly)
    const [cac, setCac] = useState(8000); // Customer Acquisition Cost
    const [churn, setChurn] = useState(5); // Monthly churn rate %
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);
    
    const { ltv, ltvToCacRatio, monthsToPayback } = useMemo(() => {
        if (churn <= 0) return { ltv: Infinity, ltvToCacRatio: Infinity, monthsToPayback: 0 };
        
        const churnRate = churn / 100;
        const lifetimeValue = arpu / churnRate;
        const ratio = lifetimeValue / cac;
        const payback = cac / arpu;

        return { ltv: lifetimeValue, ltvToCacRatio: ratio, monthsToPayback: payback };
    }, [arpu, cac, churn]);

    const getRatioColor = (ratio: number) => {
        if (ratio >= 3) return 'text-emerald-500';
        if (ratio >= 1) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate key metrics for your subscription-based business.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label>Avg. Revenue Per User (ARPU)/month: <span className="font-bold text-indigo-600">₹{arpu.toLocaleString()}</span></label>
                        <input type="range" min="100" max="25000" step="100" value={arpu} onChange={e => setArpu(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label>Customer Acquisition Cost (CAC): <span className="font-bold text-indigo-600">₹{cac.toLocaleString()}</span></label>
                        <input type="range" min="500" max="50000" step="500" value={cac} onChange={e => setCac(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label>Monthly Churn Rate: <span className="font-bold text-indigo-600">{churn}%</span></label>
                        <input type="range" min="0.5" max="20" step="0.5" value={churn} onChange={e => setChurn(Number(e.target.value))} className="w-full" />
                    </div>
                </div>
                
                <div className="min-h-[350px] flex flex-col justify-center">
                    {isLoading ? <Loader /> : (
                        <div className="space-y-4 text-center animate-fade-in">
                            <div className="result-card">
                                <p className="result-label">Customer Lifetime Value (LTV)</p>
                                <p className="value text-3xl"><AnimatedNumber value={ltv} prefix="₹ " /></p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="result-card">
                                    <p className="result-label">LTV : CAC Ratio</p>
                                    <p className={`value text-4xl ${getRatioColor(ltvToCacRatio)}`}><AnimatedNumber value={ltvToCacRatio} decimals={1} /> : 1</p>
                                </div>
                                <div className="result-card">
                                    <p className="result-label">Months to Payback CAC</p>
                                    <p className="value text-4xl"><AnimatedNumber value={monthsToPayback} decimals={1} /></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                .result-card { background: #fff; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                .dark .result-card { background: #1e293b; }
                .result-label { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .dark .result-label { color: #94a3b8; }
                .result-card .value { font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};
