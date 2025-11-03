import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const frameRef = useRef<number>();

    // FIX: Removed `currentValue` from dependency array to prevent an infinite re-render loop.
    useEffect(() => {
        const startValue = currentValue;
        const duration = 750; // ms
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 4);
            
            const nextValue = startValue + (value - startValue) * easeOutPercentage;
            setCurrentValue(nextValue);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [value]);

    return <span>{currentValue.toFixed(1)}</span>;
};


// Main Component
export const ProfitMarginCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [revenue, setRevenue] = useState(1000000);
    const [cogs, setCogs] = useState(400000);
    const [opEx, setOpEx] = useState(200000);
    const [interestTaxes, setInterestTaxes] = useState(100000);

    const { grossMargin, operatingMargin, netMargin } = useMemo(() => {
        if (revenue <= 0) {
            return { grossMargin: 0, operatingMargin: 0, netMargin: 0 };
        }

        const grossProfit = revenue - cogs;
        const gm = (grossProfit / revenue) * 100;

        const operatingProfit = grossProfit - opEx;
        const om = (operatingProfit / revenue) * 100;

        const netProfit = operatingProfit - interestTaxes;
        const nm = (netProfit / revenue) * 100;

        return { grossMargin: gm, operatingMargin: om, netMargin: nm };
    }, [revenue, cogs, opEx, interestTaxes]);

    const getMarginColor = (margin: number) => {
        if (margin > 20) return 'text-emerald-500';
        if (margin > 0) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                /* Custom styles for range inputs */
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; /* slate-200 */ }
                .dark input[type=range] { background: #334155; /* slate-700 */ }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; /* indigo-600 */ cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your business's gross, operating, and net profit margins.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Revenue</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {revenue.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max="10000000" step="10000" value={revenue} onChange={e => setRevenue(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Cost of Goods Sold (COGS)</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {cogs.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max={revenue} step="5000" value={cogs} onChange={e => setCogs(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Operating Expenses</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {opEx.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max={revenue - cogs} step="5000" value={opEx} onChange={e => setOpEx(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Interest & Taxes</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {interestTaxes.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="0" max={revenue - cogs - opEx} step="5000" value={interestTaxes} onChange={e => setInterestTaxes(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                <div className="space-y-4 text-center">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Gross Margin</h3>
                        <p className={`text-5xl font-extrabold mt-1 ${getMarginColor(grossMargin)}`}>
                            <AnimatedNumber value={grossMargin} />%
                        </p>
                    </div>
                     <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Operating Margin</h3>
                        <p className={`text-5xl font-extrabold mt-1 ${getMarginColor(operatingMargin)}`}>
                            <AnimatedNumber value={operatingMargin} />%
                        </p>
                    </div>
                     <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Net Profit Margin</h3>
                        <p className={`text-5xl font-extrabold mt-1 ${getMarginColor(netMargin)}`}>
                            <AnimatedNumber value={netMargin} />%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};