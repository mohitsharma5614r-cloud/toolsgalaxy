import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value, prefix = '' }: { value: number, prefix?: string }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const frameRef = useRef<number>();

    // FIX: Removed `currentValue` from dependency array to prevent an infinite re-render loop.
    useEffect(() => {
        const startValue = currentValue;
        const duration = 500; // ms
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);
            
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

    return <span>{prefix}{Math.round(currentValue).toLocaleString('en-IN')}</span>;
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

export const WholesaleVsRetailProfitTool: React.FC<{ title: string }> = ({ title }) => {
    const [productCost, setProductCost] = useState(50);
    const [wholesalePrice, setWholesalePrice] = useState(80);
    const [wholesaleUnits, setWholesaleUnits] = useState(1000);
    const [retailPrice, setRetailPrice] = useState(150);
    const [retailUnits, setRetailUnits] = useState(400);

    const { wholesaleProfit, retailProfit } = useMemo(() => {
        const wp = (wholesalePrice - productCost) * wholesaleUnits;
        const rp = (retailPrice - productCost) * retailUnits;
        return { wholesaleProfit: wp, retailProfit: rp };
    }, [productCost, wholesalePrice, wholesaleUnits, retailPrice, retailUnits]);
    
    const moreProfitable = wholesaleProfit > retailProfit ? 'Wholesale' : 'Retail';

    return (
        <div className="max-w-7xl mx-auto">
            <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                .result-card { background: #fff; border-radius: 0.75rem; padding: 1rem; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                .dark .result-card { background: #1e293b; }
                .result-label { font-size: 0.875rem; color: #64748b; font-weight: 600; }
                .dark .result-label { color: #94a3b8; }
                .result-value { font-size: 1.875rem; font-weight: 700; }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare profitability between wholesale and retail selling models.</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                <label className="font-semibold text-lg">Product Cost (Per Unit): <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{productCost}</span></label>
                <input type="range" min="1" max="1000" value={productCost} onChange={e => setProductCost(Number(e.target.value))} className="w-full mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Wholesale Column */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-center">Wholesale</h2>
                    <div>
                        <label>Selling Price: <span className="font-bold">₹{wholesalePrice}</span></label>
                        <input type="range" min={productCost} max="5000" value={wholesalePrice} onChange={e => setWholesalePrice(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label>Units Sold: <span className="font-bold">{wholesaleUnits}</span></label>
                        <input type="range" min="100" max="10000" step="100" value={wholesaleUnits} onChange={e => setWholesaleUnits(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="result-card"><p className="result-label">Total Profit</p><p className="result-value text-emerald-600 dark:text-emerald-400"><AnimatedNumber value={wholesaleProfit} prefix="₹ " /></p></div>
                </div>

                 {/* Retail Column */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-center">Retail</h2>
                    <div>
                        <label>Selling Price: <span className="font-bold">₹{retailPrice}</span></label>
                        <input type="range" min={productCost} max="10000" value={retailPrice} onChange={e => setRetailPrice(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label>Units Sold: <span className="font-bold">{retailUnits}</span></label>
                        <input type="range" min="10" max="5000" step="10" value={retailUnits} onChange={e => setRetailUnits(Number(e.target.value))} className="w-full" />
                    </div>
                     <div className="result-card"><p className="result-label">Total Profit</p><p className="result-value text-emerald-600 dark:text-emerald-400"><AnimatedNumber value={retailProfit} prefix="₹ " /></p></div>
                </div>
            </div>

            <div className={`mt-8 p-6 rounded-xl text-center font-bold text-2xl transition-colors duration-500 ${moreProfitable === 'Wholesale' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                {wholesaleProfit === retailProfit ? "Both models are equally profitable." : `${moreProfitable} is more profitable for this scenario!`}
            </div>
        </div>
    );
};