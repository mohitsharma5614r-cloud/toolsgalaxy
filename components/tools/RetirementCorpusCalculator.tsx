
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Removed `currentValue` from the dependency array to prevent an infinite re-render loop.
    useEffect(() => {
        let frameId: number;
        const startValue = currentValue;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            setCurrentValue(startValue + (value - startValue) * easeOut);
            if (progress < duration) { frameId = requestAnimationFrame(animate); }
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    // FIX: Removed `currentValue` from the dependency array to prevent an infinite re-render loop.
    }, [value]);
    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};


// FIX: Add title prop to component.
export const RetirementCorpusCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
    const [inflationRate, setInflationRate] = useState(6);
    
    const { retirementCorpus, futureMonthlyExpenses } = useMemo(() => {
        const yearsToRetirement = retirementAge - currentAge;
        if (yearsToRetirement <= 0) {
            return { retirementCorpus: 0, futureMonthlyExpenses: monthlyExpenses };
        }

        // Calculate future value of monthly expenses at retirement
        const futureExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
        
        // Using the 4% rule (or 25x rule) as a common heuristic
        const annualExpensesAtRetirement = futureExpenses * 12;
        const corpus = annualExpensesAtRetirement * 25;

        return {
            retirementCorpus: Math.round(corpus),
            futureMonthlyExpenses: Math.round(futureExpenses)
        };
    }, [currentAge, retirementAge, monthlyExpenses, inflationRate]);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the total amount you need to save for a comfortable retirement.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Current Age: <span className="font-bold text-indigo-600">{currentAge}</span></label>
                        <input type="range" min="18" max="60" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Retirement Age: <span className="font-bold text-indigo-600">{retirementAge}</span></label>
                        <input type="range" min={currentAge + 1} max="80" value={retirementAge} onChange={e => setRetirementAge(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Current Monthly Expenses: <span className="font-bold text-indigo-600">₹{monthlyExpenses.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="10000" max="300000" step="5000" value={monthlyExpenses} onChange={e => setMonthlyExpenses(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Expected Inflation Rate: <span className="font-bold text-indigo-600">{inflationRate}%</span></label>
                        <input type="range" min="1" max="15" step="0.5" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                
                {/* Results */}
                 <div className="space-y-4 animate-fade-in text-center">
                     <div className="result-card bg-indigo-100/50 dark:bg-indigo-900/50">
                        <p className="result-label">You Will Need a Retirement Corpus of</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={retirementCorpus} /></p>
                    </div>
                     <div className="result-card">
                        <p className="result-label">To Cover Monthly Expenses of</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">₹ <AnimatedNumber value={futureMonthlyExpenses} /></p>
                         <p className="text-xs text-slate-400 mt-1">at the time of retirement.</p>
                    </div>
                     <p className="text-xs text-slate-400 pt-2">
                        *Based on the 4% withdrawal rule, assuming post-retirement returns beat inflation. This is an estimate for planning purposes.
                    </p>
                </div>
            </div>
        </div>
    );
};
