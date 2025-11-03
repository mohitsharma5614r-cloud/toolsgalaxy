
import React, { useState } from 'react';

// Mock data for calculation
const industryMultiples = {
    'SaaS/Tech': { base: 'revenue', multiple: 6 },
    'E-commerce': { base: 'revenue', multiple: 1.2 },
    'Retail (Brick & Mortar)': { base: 'profit', multiple: 2.5 },
    'Service Business': { base: 'profit', multiple: 2 },
    'Manufacturing': { base: 'profit', multiple: 4 },
};

const growthMultipliers = {
    'Low (<5%)': 0.9,
    'Medium (5-15%)': 1.1,
    'High (>15%)': 1.3,
};

type Industry = keyof typeof industryMultiples;
type GrowthRate = keyof typeof growthMultipliers;

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="valuation-loader mx-auto">
            <div className="bar b1"></div>
            <div className="bar b2"></div>
            <div className="bar b3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating Business Value...</p>
        <style>{`
            .valuation-loader {
                width: 80px;
                height: 60px;
                display: flex;
                justify-content: space-around;
                align-items: flex-end;
            }
            .bar {
                width: 15px;
                background-color: #6366f1;
                border-radius: 4px;
                animation: grow-bar 1.2s infinite ease-in-out;
            }
            .dark .bar { background-color: #818cf8; }
            .b1 { height: 20px; animation-delay: 0s; }
            .b2 { height: 40px; animation-delay: 0.2s; }
            .b3 { height: 30px; animation-delay: 0.4s; }

            @keyframes grow-bar {
                0%, 100% { transform: scaleY(0.2); }
                50% { transform: scaleY(1); }
            }
        `}</style>
    </div>
);

// Animated Number
const AnimatedNumber = ({ value }: { value: number }) => {
    const [current, setCurrent] = useState(0);
    React.useEffect(() => {
        let frameId: number;
        const start = current;
        const end = value;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setCurrent(start + (end - start) * easeOut);
            if (progress < duration) { frameId = requestAnimationFrame(animate); }
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current]); // Re-run if value changes
    return <span>{Math.round(current).toLocaleString('en-IN')}</span>;
};

// Main Component
export const BusinessValuationCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [revenue, setRevenue] = useState(5000000);
    const [profit, setProfit] = useState(1000000);
    const [industry, setIndustry] = useState<Industry>('SaaS/Tech');
    const [growth, setGrowth] = useState<GrowthRate>('Medium (5-15%)');
    const [valuation, setValuation] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        setIsLoading(true);
        setValuation(null);
        setTimeout(() => {
            const industryData = industryMultiples[industry];
            const baseValue = industryData.base === 'revenue' ? revenue : profit;
            const baseValuation = baseValue * industryData.multiple;
            const finalValuation = baseValuation * growthMultipliers[growth];
            setValuation(finalValuation);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get a simple, industry-based valuation estimate for your business.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Inputs */}
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                     <div>
                        <label className="label-style">Industry</label>
                        <select value={industry} onChange={e => setIndustry(e.target.value as Industry)} className="input-style w-full">
                            {Object.keys(industryMultiples).map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label-style">Annual Revenue: <span className="font-bold text-indigo-600">₹{revenue.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="100000" max="100000000" step="100000" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Annual Profit (SDE): <span className="font-bold text-indigo-600">₹{profit.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="50000000" step="50000" value={profit} onChange={e => setProfit(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Annual Growth Rate</label>
                        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            {Object.keys(growthMultipliers).map(g => (
                                <button key={g} onClick={() => setGrowth(g as GrowthRate)} className={`flex-1 btn-toggle ${growth === g ? 'btn-toggle-active' : ''}`}>{g}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleCalculate} disabled={isLoading} className="w-full btn-primary text-lg !mt-8">
                        Calculate Valuation
                    </button>
                </div>

                {/* Results */}
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border min-h-[400px] flex flex-col items-center justify-center">
                    {isLoading ? <Loader /> : valuation !== null ? (
                        <div className="text-center animate-fade-in">
                            <p className="text-lg text-slate-500 dark:text-slate-400">Estimated Business Valuation</p>
                            <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">
                                ₹ <AnimatedNumber value={valuation} />
                            </p>
                            <p className="text-xs text-slate-400 mt-4 max-w-xs mx-auto">
                                Based on a {industryMultiples[industry].multiple}x {industryMultiples[industry].base} multiple for the {industry} sector, adjusted for growth.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 mb-4"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <p>Your valuation will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-toggle { padding: 0.5rem; font-size: 0.8rem; border-radius: 0.375rem; font-weight: 600; transition: all 0.2s; }
                .btn-toggle-active { background: white; color: #334155; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
                .dark .btn-toggle-active { background: #1e293b; color: white; }
                .range-style { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark .range-style { background: #334155; }
                .range-style::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
