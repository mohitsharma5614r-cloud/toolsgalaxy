import React, { useState, useMemo } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string }> = ({ value, prefix = '' }) => {
    const [current, setCurrent] = useState(0);
    React.useEffect(() => {
        const start = current;
        const duration = 750;
        let startTime: number | null = null;
        let frameId: number;
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

export const SalaryNegotiationCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [currentSalary, setCurrentSalary] = useState(1200000);
    const [marketAvg, setMarketAvg] = useState(1500000);
    const [desiredIncrease, setDesiredIncrease] = useState(20);

    const { target, lowEnd, highEnd } = useMemo(() => {
        const increaseFromCurrent = currentSalary * (1 + desiredIncrease / 100);
        const t = Math.max(increaseFromCurrent, marketAvg);
        const low = Math.min(increaseFromCurrent, marketAvg) * 1.05; // Slightly above the lower value
        const high = t * 1.15; // 15% above the target
        return { target: t, lowEnd: low, highEnd: high };
    }, [currentSalary, marketAvg, desiredIncrease]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Prepare for salary negotiations with data-driven insights.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <label>Current Annual Salary: ₹{currentSalary.toLocaleString()}</label>
                    <input type="range" min="300000" max="5000000" step="50000" value={currentSalary} onChange={e => setCurrentSalary(Number(e.target.value))} />
                    <label>Market Average for Role: ₹{marketAvg.toLocaleString()}</label>
                    <input type="range" min="300000" max="6000000" step="50000" value={marketAvg} onChange={e => setMarketAvg(Number(e.target.value))} />
                    <label>Desired Increase: {desiredIncrease}%</label>
                    <input type="range" min="5" max="50" value={desiredIncrease} onChange={e => setDesiredIncrease(Number(e.target.value))} />
                </div>
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center flex flex-col justify-center">
                    <h2 className="text-xl font-bold mb-4">Your Negotiation Range</h2>
                     <div className="space-y-3">
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm text-slate-500">Low End (Walk-away point)</p>
                            <p className="text-2xl font-bold"><AnimatedNumber value={lowEnd} prefix="₹ "/></p>
                        </div>
                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                            <p className="text-md font-bold text-indigo-600">Target Ask</p>
                            <p className="text-4xl font-extrabold text-indigo-600"><AnimatedNumber value={target} prefix="₹ "/></p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm text-slate-500">High End (Ambitious ask)</p>
                            <p className="text-2xl font-bold"><AnimatedNumber value={highEnd} prefix="₹ "/></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
