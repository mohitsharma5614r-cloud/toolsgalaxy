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

// Loader/Initial Animation
const StampAnimation: React.FC = () => (
    <div className="flex items-center justify-center h-full">
         <div className="stamp-animation">
            <div className="contract">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className="stamper">HIRED</div>
        </div>
    </div>
);


export const EmployeeSalaryCostTool: React.FC<{ title: string }> = ({ title }) => {
    const [baseSalary, setBaseSalary] = useState(1200000);
    const [benefitsPercent, setBenefitsPercent] = useState(15);
    const [taxesPercent, setTaxesPercent] = useState(12);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowResults(true), 1500); // Show results after animation
        return () => clearTimeout(timer);
    }, []);

    const { benefitsCost, taxesCost, totalCost, monthlyCost } = useMemo(() => {
        const bc = baseSalary * (benefitsPercent / 100);
        const tc = baseSalary * (taxesPercent / 100);
        const total = baseSalary + bc + tc;
        const monthly = total / 12;
        return { benefitsCost: bc, taxesCost: tc, totalCost: total, monthlyCost: monthly };
    }, [baseSalary, benefitsPercent, taxesPercent]);
    
    const salaryPercent = (baseSalary / totalCost) * 100;
    const benefitsBarPercent = (benefitsCost / totalCost) * 100;
    const taxesBarPercent = (taxesCost / totalCost) * 100;

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                
                /* Stamp Animation */
                .stamp-animation { width: 150px; height: 150px; position: relative; }
                .contract { width: 120px; height: 150px; background: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 4px; position: absolute; bottom: 0; left: 15px; }
                .dark .contract { background: #334155; border-color: #475569; }
                .contract .line { width: 80%; height: 6px; background: #e2e8f0; margin: 15px auto 0; }
                .dark .contract .line { background: #475569; }
                .stamper { width: 100px; height: 60px; background: #64748b; color: white; font-size: 24px; font-weight: bold; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: absolute; top: -80px; left: 25px; animation: stamp-it 1.5s forwards; }
                .dark .stamper { background: #94a3b8; }
                @keyframes stamp-it {
                    0% { transform: translateY(0) rotate(-15deg); }
                    50% { transform: translateY(90px) rotate(-15deg); }
                    60% { transform: translateY(80px) rotate(-15deg) scale(1.1); }
                    80%, 100% { transform: translateY(80px) rotate(-15deg) scale(1); }
                }
            `}</style>
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the total cost of an employee, including taxes and benefits.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <label>Base Annual Salary: <span className="font-bold text-indigo-600">₹{baseSalary.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="300000" max="10000000" step="50000" value={baseSalary} onChange={e => setBaseSalary(Number(e.target.value))} className="w-full mt-2 range-style" />
                    </div>
                     <div>
                        <label>Benefits % of Salary: <span className="font-bold text-indigo-600">{benefitsPercent}%</span></label>
                        <input type="range" min="5" max="40" step="1" value={benefitsPercent} onChange={e => setBenefitsPercent(Number(e.target.value))} className="w-full mt-2 range-style" />
                    </div>
                    <div>
                        <label>Payroll Taxes & Contributions %: <span className="font-bold text-indigo-600">{taxesPercent}%</span></label>
                        <input type="range" min="5" max="25" step="1" value={taxesPercent} onChange={e => setTaxesPercent(Number(e.target.value))} className="w-full mt-2 range-style" />
                    </div>
                </div>

                {/* Results */}
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border min-h-[350px]">
                    {!showResults ? <StampAnimation /> : (
                        <div className="animate-fade-in-up space-y-4">
                            <div className="text-center">
                                <p className="text-lg text-slate-500">Total Annual Cost to Company</p>
                                <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">₹ <AnimatedNumber value={totalCost} /></p>
                                <p className="text-md text-slate-400">(~ ₹{Math.round(monthlyCost).toLocaleString('en-IN')}/month)</p>
                            </div>
                            <div className="pt-4">
                                <h3 className="font-semibold mb-2 text-center">Cost Breakdown</h3>
                                <div className="w-full flex h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                    <div className="bg-emerald-500" style={{width: `${salaryPercent}%`}} title={`Base: ₹${baseSalary.toLocaleString()}`}></div>
                                    <div className="bg-sky-500" style={{width: `${benefitsBarPercent}%`}} title={`Benefits: ₹${Math.round(benefitsCost).toLocaleString()}`}></div>
                                    <div className="bg-amber-500" style={{width: `${taxesBarPercent}%`}} title={`Taxes: ₹${Math.round(taxesCost).toLocaleString()}`}></div>
                                </div>
                                <div className="flex justify-around text-xs mt-2">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Base Salary</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sky-500"></div>Benefits</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Taxes</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};