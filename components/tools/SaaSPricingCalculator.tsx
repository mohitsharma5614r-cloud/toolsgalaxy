import React, { useState, useMemo } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string }> = ({ value, prefix }) => {
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

    return <span>{prefix}{Math.round(current).toLocaleString('en-IN')}</span>;
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="pricing-loader mx-auto">
            <div className="tag"></div>
            <div className="slider"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating pricing models...</p>
        <style>{`
            .pricing-loader { width: 100px; height: 100px; position: relative; }
            .tag { width: 60px; height: 80px; background: #f1f5f9; border-radius: 4px 4px 20px 20px; position: absolute; bottom: 0; left: 20px; border: 2px solid #cbd5e1; }
            .dark .tag { background: #334155; border-color: #475569; }
            .slider { width: 100%; height: 10px; background: #6366f1; border-radius: 5px; position: absolute; top: 20px; animation: slide-price 2s infinite ease-in-out; }
            @keyframes slide-price { 0%,100%{transform:scaleX(0.5)} 50%{transform:scaleX(1)} }
        `}</style>
    </div>
);

export const SaaSPricingCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [customers, setCustomers] = useState(500);
    const [arpu, setArpu] = useState(2000); // Avg Revenue Per User (monthly)
    const [growthRate, setGrowthRate] = useState(5); // Monthly customer growth %
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const { mrr, arr, projection } = useMemo(() => {
        const monthlyRecurring = customers * arpu;
        const annualRecurring = monthlyRecurring * 12;

        const projData = [];
        let currentCustomers = customers;
        for (let i = 0; i < 12; i++) {
            projData.push(currentCustomers * arpu);
            currentCustomers *= (1 + growthRate / 100);
        }

        return { mrr: monthlyRecurring, arr: annualRecurring, projection: projData };
    }, [customers, arpu, growthRate]);

    const maxProjected = Math.max(...projection);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Model different pricing strategies for your SaaS product.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold">Your Metrics</h2>
                    <div>
                        <label>Current Customers: <span className="font-bold text-indigo-600">{customers.toLocaleString()}</span></label>
                        <input type="range" min="10" max="10000" step="10" value={customers} onChange={e => setCustomers(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Avg. Monthly Revenue Per User (ARPU): <span className="font-bold text-indigo-600">₹{arpu.toLocaleString()}</span></label>
                        <input type="range" min="100" max="25000" step="100" value={arpu} onChange={e => setArpu(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Est. Monthly Customer Growth: <span className="font-bold text-indigo-600">{growthRate}%</span></label>
                        <input type="range" min="0" max="25" step="0.5" value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} />
                    </div>
                </div>
                
                <div className="min-h-[350px] flex flex-col justify-center">
                    {isLoading ? <Loader /> : (
                        <div className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="result-card"><p>Current MRR</p><p className="value"><AnimatedNumber value={mrr} prefix="₹ " /></p></div>
                                <div className="result-card"><p>Current ARR</p><p className="value"><AnimatedNumber value={arr} prefix="₹ " /></p></div>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                                <h3 className="font-bold text-center mb-4">12-Month MRR Projection</h3>
                                <div className="flex justify-around items-end h-40 gap-1">
                                    {projection.map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center justify-end">
                                            <div 
                                                className="w-full bg-indigo-500 rounded-t-md transition-all duration-500" 
                                                style={{ height: `${(val / maxProjected) * 100}%`}}
                                                title={`Month ${i+1}: ₹${Math.round(val).toLocaleString()}`}
                                            ></div>
                                            <span className="text-xs mt-1 text-slate-400">{i+1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                .result-card { background: #fff; border-radius: 0.75rem; padding: 1rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                .dark .result-card { background: #1e293b; }
                .result-card p:first-child { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .dark .result-card p:first-child { color: #94a3b8; }
                .result-card .value { font-size: 1.5rem; font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};
