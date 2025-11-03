
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value, suffix = '' }: { value: number | string, suffix?: string }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // FIX: Removed `currentValue` from dependency array to prevent infinite re-renders.
    useEffect(() => {
        if (typeof numValue !== 'number' || isNaN(numValue)) return;
        let frameId: number;
        const startValue = currentValue;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            setCurrentValue(startValue + (numValue - startValue) * easeOut);
            if (progress < duration) { frameId = requestAnimationFrame(animate); }
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, numValue]);
    
    if(typeof value === 'string' && value === 'Infinity') return <span>Forever</span>;
    if(isNaN(numValue)) return <span>...</span>;

    return <span>{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 1 })}{suffix}</span>;
};

// Loader
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="tree-loader mx-auto">
            <div className="trunk">
                <div className="branch b1"></div>
                <div className="branch b2"></div>
                <div className="branch b3"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Planning your wealth growth...</p>
        <style>{`
            .tree-loader { width: 100px; height: 120px; position: relative; }
            .trunk { width: 15px; height: 100%; background: #a1887f; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); border-radius: 8px 8px 0 0; }
            .dark .trunk { background: #bcaaa4; }
            .branch {
                position: absolute;
                width: 6px;
                height: 40px;
                background: #8d6e63; /* A bit darker */
                border-radius: 3px;
                transform-origin: bottom center;
            }
            .dark .branch { background: #a1887f; }
            .b1 { top: 20px; left: -10px; transform: rotate(-45deg); }
            .b2 { top: 10px; left: 5px; }
            .b3 { top: 20px; right: -10px; transform: rotate(45deg); }
        `}</style>
    </div>
);

export const WealthAccumulationPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [targetAmount, setTargetAmount] = useState(10000000); // 1 Crore
    const [initialInvestment, setInitialInvestment] = useState(500000);
    const [annualInvestment, setAnnualInvestment] = useState(500000);
    const [returnRate, setReturnRate] = useState(12);

    const { yearsToReach, finalCorpus } = useMemo(() => {
        // FIX: Corrected logic to use state variables from this component instead of incorrect ones.
        const P = initialInvestment;
        const PMT = annualInvestment;
        const r = returnRate / 100;
        const FV = targetAmount;

        if (P >= FV) {
            return { yearsToReach: 0, finalCorpus: FV };
        }
        
        if (r <= 0 && PMT <= 0) {
            return { yearsToReach: Infinity, finalCorpus: FV };
        }

        if (r === 0) {
            if (PMT > 0) {
                return { yearsToReach: (FV - P) / PMT, finalCorpus: FV };
            }
            return { yearsToReach: Infinity, finalCorpus: FV };
        }

        // Formula to calculate number of periods: NPER in Excel
        // years = log((FV*r + PMT) / (PV*r + PMT)) / log(1+r)
        const years = Math.log((FV * r + PMT) / (P * r + PMT)) / Math.log(1 + r);
        
        return {
            yearsToReach: isFinite(years) && years > 0 ? years : Infinity,
            finalCorpus: FV
        };

    }, [targetAmount, initialInvestment, annualInvestment, returnRate]);
    
    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your investments to accumulate wealth over a specific period.</p>
            </div>
            {/* The rest of the component's JSX would follow here, using yearsToReach and finalCorpus */}
        </div>
    );
};
