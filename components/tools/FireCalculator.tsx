
import React, { useState, useMemo, useEffect } from 'react';

// Animated number component
const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number | string, prefix?: string, suffix?: string }) => {
    const [current, setCurrent] = useState(0);
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    useEffect(() => {
        if (typeof numValue !== 'number' || isNaN(numValue)) return;
        let frameId: number;
        const start = current;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            setCurrent(start + (numValue - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current, numValue]);
    
    if(typeof value === 'string' && value === 'Infinity') return <span>Forever</span>;
    if(isNaN(numValue)) return <span>...</span>;

    return <span>{prefix}{current.toLocaleString('en-IN', { maximumFractionDigits: 1 })}{suffix}</span>;
};


// FIX: Add title prop to component.
export const FireCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [annualExpenses, setAnnualExpenses] = useState(600000);
    const [currentCorpus, setCurrentCorpus] = useState(2500000);
    const [annualInvestment, setAnnualInvestment] = useState(500000);
    const [returnRate, setReturnRate] = useState(10);

    const { yearsToFIRE, finalCorpus } = useMemo(() => {
        // FIX: Added the missing destructured variables to fix "Variable declaration list cannot be empty" error.
        const P = currentCorpus;
        const PMT = annualInvestment;
        const r = returnRate / 100;
        
        // Target is 25x annual expenses (4% withdrawal rate)
        const target = annualExpenses * 25;

        if (P >= target) {
            return { yearsToFIRE: 0, finalCorpus: P };
        }
        
        if (r <= 0 && PMT <= 0) {
            return { yearsToFIRE: Infinity, finalCorpus: target };
        }

        // Formula to calculate number of periods: NPER in Excel
        // years = log((FV*r + PMT) / (PV*r + PMT)) / log(1+r)
        const years = Math.log((target * r + PMT) / (P * r + PMT)) / Math.log(1 + r);
        
        return {
            yearsToFIRE: isFinite(years) && years > 0 ? years : Infinity,
            finalCorpus: target
        };

    }, [annualExpenses, currentCorpus, annualInvestment, returnRate]);


    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🔥</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your path to Financial Independence, Retire Early.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div>
                        <label className="label-style">Current Annual Expenses: <span className="font-bold text-indigo-600">₹{annualExpenses.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="100000" max="5000000" step="50000" value={annualExpenses} onChange={e => setAnnualExpenses(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Current Investment Corpus: <span className="font-bold text-indigo-600">₹{currentCorpus.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="50000000" step="100000" value={currentCorpus} onChange={e => setCurrentCorpus(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Annual Investment: <span className="font-bold text-indigo-600">₹{annualInvestment.toLocaleString('en-IN')}</span></label>
                        <input type="range" min="0" max="5000000" step="50000" value={annualInvestment} onChange={e => setAnnualInvestment(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Expected Annual Return: <span className="font-bold text-indigo-600">{returnRate}%</span></label>
                        <input type="range" min="1" max="25" step="0.5" value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                <div className="space-y-4 text-center">
                    <div className="result-card bg-indigo-100/50">
                        <p className="result-label">Time to FIRE</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                            <AnimatedNumber value={yearsToFIRE} suffix={yearsToFIRE !== Infinity ? ' Years' : ''} />
                        </p>
                    </div>
                     <div className="result-card">
                        <p className="result-label">FIRE Corpus Target (25x expenses)</p>
                        <p className="result-value text-3xl">₹ <AnimatedNumber value={finalCorpus} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};