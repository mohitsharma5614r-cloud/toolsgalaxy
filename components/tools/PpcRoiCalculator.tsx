import React, { useState, useMemo, useEffect } from 'react';

// Animated number component for smooth counting effect
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

    return <span>{prefix}{current.toLocaleString('en-IN', { maximumFractionDigits: value % 1 !== 0 ? 2 : 0 })}{suffix}</span>;
};

// Loader component with a piggy bank animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="piggy-bank-loader mx-auto">
            <div className="piggy-body">
                <div className="piggy-ear"></div>
                <div className="piggy-snout"></div>
            </div>
            <div className="coin">₹</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Calculating ROI...</p>
        <style>{`
            .piggy-bank-loader { width: 120px; height: 100px; position: relative; }
            .piggy-body { width: 100px; height: 70px; background: #f472b6; border-radius: 50% / 60% 60% 40% 40%; position: absolute; bottom: 0; left: 10px; }
            .piggy-ear { width: 20px; height: 20px; background: #f472b6; border-radius: 50%; position: absolute; top: -5px; left: 10px; }
            .piggy-snout { width: 30px; height: 25px; background: #f9a8d4; border-radius: 50%; position: absolute; top: 20px; right: -20px; }
            .coin { font-size: 24px; color: #facc15; font-weight: bold; position: absolute; top: 0; left: 50%; transform: translateX(-50%); opacity: 0; animation: drop-coin 1.5s infinite; }
            @keyframes drop-coin { 0% { top: -20px; opacity: 1; } 50% { top: 10px; opacity: 1; } 51% { opacity: 0; } 100% { opacity: 0; } }
        `}</style>
    </div>
);

// Main Component
export const PpcRoiCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [adSpend, setAdSpend] = useState(50000);
    const [clicks, setClicks] = useState(2500);
    const [conversions, setConversions] = useState(100);
    const [saleValue, setSaleValue] = useState(1200);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const { cpc, cr, revenue, roi, netProfit } = useMemo(() => {
        const costPerClick = clicks > 0 ? adSpend / clicks : 0;
        const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
        const totalRevenue = conversions * saleValue;
        const profit = totalRevenue - adSpend;
        const returnOnInvestment = adSpend > 0 ? (profit / adSpend) * 100 : 0;
        return { cpc: costPerClick, cr: conversionRate, revenue: totalRevenue, roi: returnOnInvestment, netProfit: profit };
    }, [adSpend, clicks, conversions, saleValue]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the Return on Investment for your PPC campaigns.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <h2 className="text-xl font-bold">Campaign Metrics</h2>
                    <label>Total Ad Spend: <span className="font-bold text-indigo-600">₹{adSpend.toLocaleString()}</span></label>
                    <input type="range" min="1000" max="1000000" step="1000" value={adSpend} onChange={e => setAdSpend(Number(e.target.value))} />
                    <label>Number of Clicks: <span className="font-bold text-indigo-600">{clicks.toLocaleString()}</span></label>
                    <input type="range" min="10" max="10000" step="10" value={clicks} onChange={e => setClicks(Number(e.target.value))} />
                     <label>Number of Conversions: <span className="font-bold text-indigo-600">{conversions.toLocaleString()}</span></label>
                    <input type="range" min="0" max={clicks} step="1" value={conversions} onChange={e => setConversions(Number(e.target.value))} />
                     <label>Average Sale Value: <span className="font-bold text-indigo-600">₹{saleValue.toLocaleString()}</span></label>
                    <input type="range" min="100" max="50000" step="100" value={saleValue} onChange={e => setSaleValue(Number(e.target.value))} />
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                     {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                    <div className="space-y-4 text-center animate-fade-in">
                        <div className={`result-card ${roi >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                            <p className="result-label">Return on Investment (ROI)</p>
                            <p className={`value text-4xl ${roi >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}><AnimatedNumber value={roi} suffix="%" /></p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="result-card"><p className="result-label">CPC</p><p className="value"><AnimatedNumber value={cpc} prefix="₹ " /></p></div>
                            <div className="result-card"><p className="result-label">Conv. Rate</p><p className="value"><AnimatedNumber value={cr} suffix="%" /></p></div>
                             <div className="result-card"><p className="result-label">Revenue</p><p className="value"><AnimatedNumber value={revenue} prefix="₹ " /></p></div>
                             <div className="result-card"><p className="result-label">Net Profit</p><p className="value"><AnimatedNumber value={netProfit} prefix="₹ " /></p></div>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <style>{`
                .result-card { border-radius: 0.5rem; padding: 1rem; }
                .result-label { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .dark .result-label { color: #94a3b8; }
                .value { font-size: 1.875rem; font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};