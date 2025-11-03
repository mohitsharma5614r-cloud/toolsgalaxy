import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
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

    if (!isFinite(value)) {
        return <span>∞</span>;
    }

    return <span>{prefix}{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}{suffix}</span>;
};


// Loader component with a balancing scale animation
const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center">
        <div className="scale-loader mx-auto">
            <div className="scale-arm">
                <div className="scale-pan left"></div>
                <div className="scale-pan right"></div>
            </div>
            <div className="scale-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating break-even point...</p>
        <style>{`
            .scale-loader { width: 120px; height: 80px; position: relative; }
            .scale-base { width: 40px; height: 10px; background: #9ca3af; border-radius: 4px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
            .dark .scale-base { background: #64748b; }
            .scale-base::before { content:''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 10px 40px 10px; border-color: transparent transparent #9ca3af transparent; }
            .dark .scale-base::before { border-color: transparent transparent #64748b transparent; }
            .scale-arm { width: 100%; height: 8px; background: #9ca3af; border-radius: 4px; position: absolute; top: 30px; transform-origin: center; animation: balance-scale 2s infinite ease-in-out; }
            .dark .scale-arm { background: #64748b; }
            .scale-pan { position: absolute; width: 30px; height: 15px; border: 2px solid #9ca3af; border-top: none; border-radius: 0 0 15px 15px; top: 10px; }
            .dark .scale-pan { border-color: #64748b; }
            .scale-pan.left { left: 0; }
            .scale-pan.right { right: 0; }
            @keyframes balance-scale { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
        `}</style>
    </div>
);

// Main Component
export const BreakEvenPointCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [fixedCosts, setFixedCosts] = useState(50000);
    const [variableCost, setVariableCost] = useState(25);
    const [sellingPrice, setSellingPrice] = useState(75);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { breakEvenUnits, breakEvenRevenue } = useMemo(() => {
        const contributionMargin = sellingPrice - variableCost;
        if (contributionMargin <= 0) {
            return { breakEvenUnits: Infinity, breakEvenRevenue: Infinity };
        }

        const units = fixedCosts / contributionMargin;
        const revenue = units * sellingPrice;
        
        return { breakEvenUnits: units, breakEvenRevenue: revenue };
    }, [fixedCosts, variableCost, sellingPrice]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find the point at which your revenue equals your costs.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Total Fixed Costs</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {fixedCosts.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="1000" max="500000" step="1000" value={fixedCosts} onChange={e => setFixedCosts(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Variable Cost per Unit</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {variableCost.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="1" max="1000" step="1" value={variableCost} onChange={e => setVariableCost(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Selling Price per Unit</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {sellingPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="1" max="2000" step="1" value={sellingPrice} onChange={e => setSellingPrice(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                <div className="min-h-[350px] flex flex-col justify-center">
                    {isLoading ? <Loader /> : (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="p-6 rounded-xl shadow-lg border bg-white dark:bg-slate-800">
                                <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Break-Even Point (Units)</h3>
                                <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                                    <AnimatedNumber value={breakEvenUnits} suffix=" units" />
                                </p>
                            </div>
                            <div className="p-6 rounded-xl shadow-lg border bg-white dark:bg-slate-800">
                                <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Break-Even Point (Revenue)</h3>
                                <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                                    <AnimatedNumber value={breakEvenRevenue} prefix="₹ " />
                                </p>
                            </div>
                             {sellingPrice <= variableCost && (
                                <p className="text-sm text-red-500 font-semibold">Selling price must be higher than variable cost to break even.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};