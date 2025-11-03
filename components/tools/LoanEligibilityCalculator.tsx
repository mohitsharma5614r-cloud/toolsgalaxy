import React, { useState, useEffect } from 'react';

// --- UI Components & Types ---
type LoanType = 'Personal' | 'Home' | 'Car';
type EligibilityStatus = 'High Chance' | 'Moderate Chance' | 'Low Chance';

// Loader component with a vault animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="vault-loader mx-auto">
            <div className="vault-door">
                <div className="vault-dial"></div>
                <div className="vault-handle"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Running Credit Simulation...</p>
    </div>
);

// Result Display Component with animated gauge
const ResultDisplay: React.FC<{
    score: number;
    status: EligibilityStatus;
    eligibleAmount: number;
    onReset: () => void;
}> = ({ score, status, eligibleAmount, onReset }) => {
    
    const getStatusColor = () => {
        if (status === 'High Chance') return 'text-emerald-500';
        if (status === 'Moderate Chance') return 'text-yellow-500';
        return 'text-red-500';
    };

    const circumference = 2 * Math.PI * 52; // 2 * pi * r (radius is 52 for a 120x120 svg)
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progress = score / 100;
        const newOffset = circumference * (1 - progress);
        // Animate the stroke-dashoffset after a short delay
        const animation = setTimeout(() => setOffset(newOffset), 100);
        return () => clearTimeout(animation);
    }, [score, circumference]);

    return (
        <div className="animate-fade-in text-center space-y-6">
            <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-200 dark:text-slate-700" strokeWidth="12" stroke="currentColor" fill="transparent" r="52" cx="80" cy="80" />
                    <circle 
                        className={`${getStatusColor()} transition-all duration-1000 ease-out`} 
                        strokeWidth="12" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor" 
                        fill="transparent" 
                        r="52" 
                        cx="80" 
                        cy="80" 
                    />
                </svg>
                <span className={`absolute text-4xl font-bold ${getStatusColor()}`}>{score}</span>
            </div>
            <h2 className={`text-3xl font-bold ${getStatusColor()}`}>{status}</h2>
            <div>
                <p className="text-slate-500 dark:text-slate-400">Based on your inputs, you may be eligible for a loan up to:</p>
                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ {eligibleAmount.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={onReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">
                Check Another
            </button>
        </div>
    );
};

// Main Component
export const LoanEligibilityCalculator: React.FC = () => {
    const [loanType, setLoanType] = useState<LoanType>('Personal');
    const [income, setIncome] = useState(50000);
    const [expenses, setExpenses] = useState(15000);
    const [loanAmount, setLoanAmount] = useState(500000);
    const [tenure, setTenure] = useState(5); // in years

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ score: number; status: EligibilityStatus; eligibleAmount: number } | null>(null);

    const MOCK_INTEREST_RATES = {
        Personal: 12,
        Home: 8.5,
        Car: 9.5,
    };

    const calculateEligibility = () => {
        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const principal = loanAmount;
            const rate = MOCK_INTEREST_RATES[loanType];
            const monthlyRate = rate / 12 / 100;
            const months = tenure * 12;

            // 1. Calculate Proposed EMI
            const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

            // 2. Calculate DTI
            const dti = (emi + expenses) / income;

            // 3. Determine Score and Status based on DTI
            let score: number;
            let status: EligibilityStatus;
            if (dti <= 0.40) {
                status = 'High Chance';
                score = Math.round(99 - (dti * 47.5)); // Scale 80-99
            } else if (dti <= 0.55) {
                status = 'Moderate Chance';
                score = Math.round(79 - ((dti - 0.4) * 133)); // Scale 60-79
            } else {
                status = 'Low Chance';
                score = Math.round(59 - ((dti - 0.55) * 66)); // Scale 40-59
            }
            score = Math.max(40, Math.min(99, score)); // Clamp score

            // 4. Calculate Max Eligible Amount (based on 45% DTI)
            const maxEmi = (income * 0.45) - expenses;
            let eligibleAmount = 0;
            if (maxEmi > 0) {
                eligibleAmount = (maxEmi * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months));
                eligibleAmount = Math.floor(eligibleAmount / 1000) * 1000; // Round down to nearest thousand
            }

            setResult({ score, status, eligibleAmount });
            setIsLoading(false);
        }, 2500); // Simulate processing time
    };
    
    const handleReset = () => {
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #475569; }
                .dark .label-style { color: #94a3b8; }
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
                .btn-primary:hover { background: #4338ca; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }

                /* Loader CSS */
                .vault-loader { width: 100px; height: 100px; position: relative; }
                .vault-door { width: 100%; height: 100%; background: #9ca3af; border-radius: 50%; border: 6px solid #475569; position: relative; }
                .dark .vault-door { background: #475569; border-color: #9ca3af; }
                .vault-dial { width: 40%; height: 40%; background: #64748b; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: spin-dial 2.5s infinite linear; }
                .dark .vault-dial { background: #cbd5e1; }
                .vault-dial::before { content: ''; position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 4px; height: 10px; background: #ef4444; }
                .vault-handle { width: 8px; height: 30px; background: #64748b; position: absolute; top: 50%; left: 50%; transform-origin: 50% 0; transform: translate(-50%, 0) rotate(45deg); }
                .dark .vault-handle { background: #cbd5e1; }

                @keyframes spin-dial {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }

                /* Custom styles for range inputs */
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }
                input[type=range]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; }
                .dark input[type=range]::-moz-range-thumb { border-color: #1e293b; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Loan Eligibility Calculator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check your eligibility for various loans based on your income and expenses.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px] flex flex-col justify-center">
                {isLoading ? (
                    <Loader/>
                ) : result ? (
                    <ResultDisplay {...result} onReset={handleReset}/>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-style">Loan Type</label>
                                <select value={loanType} onChange={e => setLoanType(e.target.value as LoanType)} className="input-style w-full">
                                    <option>Personal</option>
                                    <option>Home</option>
                                    <option>Car</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-style">Monthly Income: ₹{income.toLocaleString('en-IN')}</label>
                                <input type="range" min="10000" max="500000" step="5000" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <label className="label-style">Monthly Expenses: ₹{expenses.toLocaleString('en-IN')}</label>
                                <input type="range" min="0" max="200000" step="2500" value={expenses} onChange={e => setExpenses(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <label className="label-style">Desired Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}</label>
                                <input type="range" min="50000" max="10000000" step="50000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full" />
                            </div>
                             <div className="md:col-span-2">
                                <label className="label-style">Loan Tenure (Years): {tenure}</label>
                                <input type="range" min="1" max="30" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full" />
                            </div>
                        </div>
                        <button onClick={calculateEligibility} className="w-full btn-primary text-lg py-3">
                            Check Eligibility
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};