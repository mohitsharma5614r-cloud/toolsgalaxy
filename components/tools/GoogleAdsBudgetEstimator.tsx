
import React, { useState, useMemo, useEffect } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string }> = ({ value, prefix }) => {
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

    return <span>{prefix}{Math.round(current).toLocaleString('en-IN')}</span>;
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="paddle-loader mx-auto">
            <div className="paddle-handle"></div>
            <div className="paddle-head">
                <span className="paddle-number">BID</span>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Estimating budget...</p>
        <style>{`
            .paddle-loader { width: 100px; height: 120px; position: relative; animation: raise-paddle 1.5s infinite ease-in-out; }
            .paddle-handle { width: 12px; height: 70px; background: #a1887f; border-radius: 4px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
            .dark .paddle-handle { background: #bcaaa4; }
            .paddle-head { width: 100%; height: 60px; background: #6366f1; border-radius: 8px; position: absolute; top: 0; display: flex; align-items: center; justify-content: center; }
            .dark .paddle-head { background: #818cf8; }
            .paddle-number { font-size: 24px; font-weight: bold; color: white; }
            @keyframes raise-paddle { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg) translateY(-10px); } }
        `}</style>
    </div>
);

export const GoogleAdsBudgetEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [cpc, setCpc] = useState(150);
    const [clicks, setClicks] = useState(500);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const { monthly, daily, annual } = useMemo(() => {
        const m = cpc * clicks;
        return { monthly: m, daily: m / 30.4, annual: m * 12 };
    }, [cpc, clicks]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate your Google Ads budget based on keywords and industry benchmarks.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-8">
                    <div>
                        <label>Target Cost-Per-Click (CPC): <span className="font-bold text-indigo-600">₹{cpc}</span></label>
                        <input type="range" min="10" max="1000" step="5" value={cpc} onChange={e => setCpc(Number(e.target.value))} className="w-full mt-2" />
                    </div>
                    <div>
                        <label>Desired Monthly Clicks: <span className="font-bold text-indigo-600">{clicks}</span></label>
                        <input type="range" min="100" max="10000" step="100" value={clicks} onChange={e => setClicks(Number(e.target.value))} className="w-full mt-2" />
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[250px] flex items-center justify-center"><Loader /></div> :
                    <div className="space-y-4 text-center animate-fade-in">
                        <div className="result-card bg-indigo-100/50">
                            <p className="result-label">Est. Monthly Budget</p>
                            <p className="value text-indigo-700 text-4xl"><AnimatedNumber value={monthly} prefix="₹ " /></p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="result-card"><p className="result-label">Est. Daily Budget</p><p className="value"><AnimatedNumber value={daily} prefix="₹ " /></p></div>
                            <div className="result-card"><p className="result-label">Est. Annual Budget</p><p className="value"><AnimatedNumber value={annual} prefix="₹ " /></p></div>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <style>{`
                .result-card { border-radius: 0.5rem; padding: 1rem; }
                .result-card p:first-child { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .result-card .value { font-size: 1.875rem; font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
