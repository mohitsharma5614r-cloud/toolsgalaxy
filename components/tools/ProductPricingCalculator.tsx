import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value, prefix = '' }: { value: number, prefix?: string }) => {
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

    return <span>{prefix}{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
};


// Loader component with a price tag stamping animation
const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center">
        <div className="pricing-loader">
            <div className="stamper"></div>
            <div className="tag"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Calculating price...</p>
        <style>{`
            .pricing-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .stamper {
                width: 70px;
                height: 70px;
                background: #64748b; /* slate-500 */
                border-radius: 8px;
                position: absolute;
                left: 15px;
                z-index: 2;
                animation: stamp 1.5s infinite ease-in-out;
            }
            .dark .stamper { background: #94a3b8; }
            .tag {
                width: 60px;
                height: 80px;
                background: #f1f5f9; /* slate-100 */
                border-radius: 4px 4px 20px 20px;
                position: absolute;
                bottom: 0;
                left: 20px;
            }
            .dark .tag { background: #334155; }
            .tag::before {
                content: '';
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 10px;
                border: 2px solid #9ca3af;
                border-radius: 50%;
            }
            .dark .tag::before { border-color: #64748b; }

            @keyframes stamp {
                0%, 100% { top: -20px; }
                50% { top: 10px; }
                60% { top: 5px; }
            }
        `}</style>
    </div>
);


// Main Component
export const ProductPricingCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [productCost, setProductCost] = useState(150);
    const [desiredMargin, setDesiredMargin] = useState(40);
    const [isLoading, setIsLoading] = useState(true); // Start with loading animation for effect
    const [result, setResult] = useState({ sellingPrice: 0, grossProfit: 0 });
    
    // Simulate initial calculation
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Recalculate on input change
    useEffect(() => {
        if (isLoading) return; // Don't recalculate during initial load

        const cost = productCost;
        const margin = desiredMargin / 100;

        if (margin >= 1) { // Avoid division by zero or negative prices
            setResult({ sellingPrice: Infinity, grossProfit: Infinity });
            return;
        }

        const price = cost / (1 - margin);
        const profit = price - cost;
        setResult({ sellingPrice: price, grossProfit: profit });
    }, [productCost, desiredMargin, isLoading]);
    
    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                /* Custom styles for range inputs */
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; /* slate-200 */ }
                .dark input[type=range] { background: #334155; /* slate-700 */ }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; /* indigo-600 */ cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Determine the best price for your products to maximize profit.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Product Cost</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">₹ {productCost.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="1" max="10000" step="1" value={productCost} onChange={e => setProductCost(Number(e.target.value))} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold">Desired Gross Margin</label>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">{desiredMargin}%</span>
                        </div>
                        <input type="range" min="1" max="99" step="1" value={desiredMargin} onChange={e => setDesiredMargin(Number(e.target.value))} />
                    </div>
                </div>
                
                {/* Results */}
                <div className="min-h-[250px] flex flex-col justify-center">
                    {isLoading ? <Loader /> : (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="p-6 rounded-xl shadow-lg border bg-indigo-100 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-700">
                                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Suggested Selling Price</h3>
                                <p className="text-5xl font-extrabold mt-1 text-indigo-600 dark:text-indigo-400">
                                    <AnimatedNumber value={result.sellingPrice} prefix="₹ " />
                                </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-base font-semibold text-slate-500 dark:text-slate-400">Gross Profit per Unit</h3>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                    <AnimatedNumber value={result.grossProfit} prefix="₹ " />
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};