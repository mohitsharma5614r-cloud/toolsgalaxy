

import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- Reusable Animated Number Component ---
const AnimatedNumber = ({ value }: { value: number }) => {
    const [current, setCurrent] = useState(0);

    // FIX: Corrected the useEffect hook for requestAnimationFrame to prevent infinite loops and ensure proper animation.
    useEffect(() => {
        let frameId: number;
        const start = current;
        const end = value;
        const duration = 1000; // 1 second animation
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease-out function
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);
            const currentValue = Math.floor(start + (end - start) * easeOutPercentage);
            setCurrent(currentValue);

            if (progress < duration) {
                // FIX: Pass the function reference `animate` instead of calling `animate()`.
                frameId = requestAnimationFrame(animate);
            }
        };
        
        // FIX: Pass the function reference `animate` instead of calling `animate()`.
        frameId = requestAnimationFrame(animate);

        return () => {
            // FIX: Use frameId in cleanup function to avoid stale closure issues
            if (frameId) cancelAnimationFrame(frameId);
        };
    // FIX: Removed `current` from dependency array to prevent infinite re-renders.
    }, [value]);

    return <span>{Math.round(current).toLocaleString('en-IN')}</span>;
};

// --- DTI Gauge Component ---
const DtiGauge = ({ ratio }: { ratio: number }) => {
    const clampedRatio = Math.min(Math.max(ratio, 0), 100);
    const angle = (clampedRatio / 100) * 180; // 0 to 180 degrees
    
    const getStatus = () => {
        if (ratio <= 36) return { text: 'Ideal', color: 'text-emerald-500' };
        if (ratio <= 43) return { text: 'Manageable', color: 'text-yellow-500' };
        if (ratio <= 50) return { text: 'Concerning', color: 'text-orange-500' };
        return { text: 'High Risk', color: 'text-red-500' };
    };
    const status = getStatus();

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0"
                     style={{
                         clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                         background: `conic-gradient(from 180deg at 50% 100%, #10b981 0 36%, #f59e0b 37% 43%, #f97316 44% 50%, #ef4444 51% 100%)`
                     }}>
                </div>
                <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-700 ease-out"
                     style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
                </div>
            </div>
            <div className="text-center -mt-8">
                 <p className={`text-5xl font-extrabold ${status.color}`}>{ratio.toFixed(1)}%</p>
                 <p className={`text-xl font-bold ${status.color}`}>{status.text}</p>
            </div>
        </div>
    );
};


// --- Main Component ---
export const DebtToIncomeRatioCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [income, setIncome] = useState(75000);
    const [debts, setDebts] = useState([
        { id: 1, name: 'Mortgage/Rent', amount: '20000' },
        { id: 2, name: 'Car Loan', amount: '8000' },
        { id: 3, name: 'Credit Card', amount: '2000' },
    ]);
    const [newDebtName, setNewDebtName] = useState('');

    const totalDebt = useMemo(() => {
        return debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);
    }, [debts]);
    
    const dtiRatio = useMemo(() => {
        if (income === 0) return 0;
        return (totalDebt / income) * 100;
    }, [totalDebt, income]);

    const handleDebtChange = (id: number, amount: string) => {
        setDebts(debts.map(d => d.id === id ? { ...d, amount } : d));
    };
    
    const handleAddDebt = () => {
        if (newDebtName.trim()) {
            setDebts([...debts, { id: Date.now(), name: newDebtName.trim(), amount: '' }]);
            setNewDebtName('');
        }
    };

    const handleDeleteDebt = (id: number) => {
        setDebts(debts.filter(d => d.id !== id));
    };
    
    const getInterpretation = () => {
        if (dtiRatio <= 36) return "Your DTI is in the ideal range. Lenders see you as a low-risk borrower.";
        if (dtiRatio <= 43) return "Your DTI is manageable, but you should be cautious about taking on more debt.";
        if (dtiRatio <= 50) return "Your DTI is a bit high. It might be challenging to get new loans.";
        return "Your DTI is considered high risk. Focus on paying down debt before applying for new credit.";
    }

    return (
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your DTI ratio to assess your financial health.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <label className="font-semibold">Gross Monthly Income</label>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-xl font-semibold">₹</span>
                             <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full text-2xl font-bold bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg"/>
                        </div>
                    </div>
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h3 className="font-semibold mb-4">Monthly Debt Payments</h3>
                        <div className="space-y-3">
                            {debts.map(debt => (
                                <div key={debt.id} className="flex items-center gap-2">
                                    <label className="flex-1 text-sm">{debt.name}</label>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">₹</span>
                                        <input type="number" value={debt.amount} onChange={e => handleDebtChange(debt.id, e.target.value)} className="w-28 bg-slate-100 dark:bg-slate-700 p-1 rounded-md"/>
                                         <button onClick={() => handleDeleteDebt(debt.id)} className="text-red-500">&times;</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="flex gap-2 mt-4 pt-4 border-t">
                            <input value={newDebtName} onChange={e => setNewDebtName(e.target.value)} placeholder="Add another debt..." className="flex-grow bg-slate-100 dark:bg-slate-700 p-1 rounded-md text-sm"/>
                            <button onClick={handleAddDebt} className="bg-indigo-500 text-white text-sm px-3 rounded-md font-semibold">+</button>
                        </div>
                    </div>
                </div>
                {/* Results */}
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center gap-6">
                    <DtiGauge ratio={dtiRatio} />
                    <div className="grid grid-cols-2 gap-4 w-full text-center">
                        <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg">
                            <p className="text-sm text-slate-500">Total Debt</p>
                            <p className="text-2xl font-bold">₹ <AnimatedNumber value={totalDebt} /></p>
                        </div>
                         <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg">
                            <p className="text-sm text-slate-500">Total Income</p>
                            <p className="text-2xl font-bold">₹ <AnimatedNumber value={income} /></p>
                        </div>
                    </div>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 italic">{getInterpretation()}</p>
                </div>
            </div>
        </div>
    );
};
