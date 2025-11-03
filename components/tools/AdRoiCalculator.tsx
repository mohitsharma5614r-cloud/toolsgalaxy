import React, { useState, useMemo } from 'react';

const AnimatedNumber: React.FC<{ value: number, suffix?: string }> = ({ value, suffix }) => {
    const [current, setCurrent] = useState(0);

    React.useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 750;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setCurrent(start + (value - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current]);
    
    return <span>{current.toFixed(1)}{suffix}</span>;
};

export const AdRoiCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [adSpend, setAdSpend] = useState(50000);
    const [revenue, setRevenue] = useState(150000);

    const { roi, netProfit } = useMemo(() => {
        if (adSpend <= 0) return { roi: 0, netProfit: 0 };
        const profit = revenue - adSpend;
        const r = (profit / adSpend) * 100;
        return { roi: r, netProfit: profit };
    }, [adSpend, revenue]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the Return on Investment for your advertising campaigns.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <label>Total Ad Spend: ₹{adSpend.toLocaleString()}</label>
                    <input type="range" min="1000" max="1000000" step="1000" value={adSpend} onChange={e => setAdSpend(Number(e.target.value))} />
                    <label>Total Revenue from Ads: ₹{revenue.toLocaleString()}</label>
                    <input type="range" min="0" max="5000000" step="5000" value={revenue} onChange={e => setRevenue(Number(e.target.value))} />
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center text-center">
                    <div className={`arrow-indicator ${roi >= 0 ? 'up' : 'down'}`}>
                        <div className="arrow-body"></div>
                        <div className="arrow-head"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        <div className="result-card">
                            <p>ROI</p>
                            <p className={`value ${roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}><AnimatedNumber value={roi} suffix="%" /></p>
                        </div>
                         <div className="result-card">
                            <p>Net Profit</p>
                            <p className={`value ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>₹{Math.round(netProfit).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                .arrow-indicator { width: 80px; height: 80px; position: relative; }
                .arrow-body { width: 20px; height: 50px; background: currentColor; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
                .arrow-head { width: 0; height: 0; border-style: solid; border-width: 0 30px 30px 30px; border-color: transparent transparent currentColor transparent; position: absolute; top: 0; left: 50%; transform: translateX(-50%); }
                .arrow-indicator.up { color: #10b981; animation: bounce-up 1.5s infinite; }
                .arrow-indicator.down { color: #ef4444; transform: rotate(180deg); animation: bounce-down 1.5s infinite; }
                @keyframes bounce-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes bounce-down { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
            `}</style>
        </div>
    );
};