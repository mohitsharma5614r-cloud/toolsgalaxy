

import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Corrected useEffect to prevent infinite loop and properly handle animation frames.
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
        return () => { if(frameId) cancelAnimationFrame(frameId); };
    }, [value]);
    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

// Loader
const Loader = () => (
    <div className="piggy-bank-loader mx-auto">
        <div className="piggy-body">
            <div className="piggy-ear"></div>
            <div className="piggy-snout"></div>
        </div>
        <div className="coin">₹</div>
    </div>
);

export const ChildEducationCostCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [currentCost, setCurrentCost] = useState(1500000);
    const [childAge, setChildAge] = useState(5);
    const [educationAge, setEducationAge] = useState(18);
    const [inflation, setInflation] = useState(7);

    const { futureCost, yearsLeft } = useMemo(() => {
        const years = educationAge - childAge;
        if (years <= 0) return { futureCost: currentCost, yearsLeft: 0 };
        
        const fv = currentCost * Math.pow(1 + inflation / 100, years);
        return { futureCost: fv, yearsLeft: years };
    }, [currentCost, childAge, educationAge, inflation]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .piggy-bank-loader { width: 120px; height: 100px; position: relative; }
                .piggy-body { width: 100px; height: 70px; background: #f472b6; border-radius: 50% / 60% 60% 40% 40%; position: absolute; bottom: 0; left: 10px; }
                .piggy-ear { width: 20px; height: 20px; background: #f472b6; border-radius: 50%; position: absolute; top: -5px; left: 10px; }
                .piggy-snout { width: 30px; height: 25px; background: #f9a8d4; border-radius: 50%; position: absolute; top: 20px; right: -20px; }
                .coin { font-size: 24px; color: #facc15; font-weight: bold; position: absolute; top: 0; left: 50%; transform: translateX(-50%); opacity: 0; animation: drop-coin 2s infinite; }
                @keyframes drop-coin { 0% { top: -20px; opacity: 1; } 50% { top: 10px; opacity: 1; } 51% { opacity: 0; } 100% { opacity: 0; } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🎓</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate the future cost of your child's education.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="label-style">Current Cost of Desired Education: <span className="font-bold text-indigo-600">₹{currentCost.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="500000" max="10000000" step="100000" value={currentCost} onChange={e => setCurrentCost(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Child's Current Age: <span className="font-bold text-indigo-600">{childAge}</span></label>
                        <input type="range" min="0" max="17" value={childAge} onChange={e => setChildAge(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Age for Higher Education: <span className="font-bold text-indigo-600">{educationAge}</span></label>
                        <input type="range" min={childAge + 1} max="25" value={educationAge} onChange={e => setEducationAge(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Expected Annual Inflation: <span className="font-bold text-indigo-600">{inflation}%</span></label>
                        <input type="range" min="1" max="15" step="0.5" value={inflation} onChange={e => setInflation(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <Loader />
                    <div className="mt-8">
                        <p className="text-lg text-slate-500 dark:text-slate-400">Future Cost of Education in {yearsLeft} years</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={futureCost} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
