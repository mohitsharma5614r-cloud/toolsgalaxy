import React, { useState } from 'react';
import { generateCreditScorePlan, CreditRecommendation } from '../../services/geminiService';
import { Toast } from '../Toast';

// --- Loader Component ---
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="score-loader mx-auto">
            <div className="gauge">
                <div className="needle"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing your financial profile...</p>
        <style>{`
            .score-loader { width: 100px; height: 60px; position: relative; }
            .gauge { width: 100%; height: 50px; border: 8px solid #cbd5e1; border-bottom: none; border-radius: 50px 50px 0 0; position: relative; }
            .dark .gauge { border-color: #475569; }
            .needle { width: 4px; height: 40px; background: #ef4444; border-radius: 2px; position: absolute; bottom: -8px; left: 50%; transform-origin: bottom center; animation: sweep 2.5s infinite ease-in-out; }
            @keyframes sweep { 0%, 100% { transform: rotate(-60deg); } 50% { transform: rotate(60deg); } }
        `}</style>
    </div>
);

// --- Main Component ---
export const CreditScoreImprovementPlanner: React.FC = () => {
    // Form state
    const [score, setScore] = useState(650);
    const [paymentHistory, setPaymentHistory] = useState('Often');
    const [utilization, setUtilization] = useState(50);
    const [historyLength, setHistoryLength] = useState('2-5 years');
    const [newApplications, setNewApplications] = useState('1-2');
    const [creditMix, setCreditMix] = useState<string[]>(['Credit Card']);

    // Component state
    const [plan, setPlan] = useState<CreditRecommendation[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMixToggle = (type: string) => {
        setCreditMix(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCreditScorePlan(score, paymentHistory, utilization, historyLength, newApplications, creditMix);
            setPlan(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate a plan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setPlan(null);
        setError(null);
    };

    const recommendationIcons = ['🎯', '💳', '📈', '⏳', '🔍'];

    if (isLoading) {
        return <div className="max-w-4xl mx-auto min-h-[500px] flex items-center justify-center"><Loader /></div>;
    }
    
    if (plan) {
         return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Your Personalized Improvement Plan</h1>
                </div>
                <div className="space-y-4">
                    {plan.map((item, index) => (
                        <div key={index} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-start gap-4">
                            <div className="text-3xl bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">{recommendationIcons[index % recommendationIcons.length]}</div>
                            <div>
                                <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-300">{item.recommendation}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-8">
                    <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">← Start Over</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Credit Score Improvement Planner</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get a personalized AI plan to help improve your credit score.</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
                    {/* Current Score */}
                    <div>
                        <label className="label-style">Current Credit Score (approx.): <span className="font-bold text-indigo-600">{score}</span></label>
                        <input type="range" min="300" max="850" value={score} onChange={e => setScore(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    {/* Payment History */}
                    <div>
                        <label className="label-style">How often are your payments on time?</label>
                        <div className="flex flex-wrap gap-2">
                            {['Always', 'Often', 'Sometimes', 'Rarely'].map(opt => <button key={opt} onClick={() => setPaymentHistory(opt)} className={`btn-toggle ${paymentHistory === opt ? 'btn-selected' : ''}`}>{opt}</button>)}
                        </div>
                    </div>
                     {/* Credit Utilization */}
                    <div>
                        <label className="label-style">Credit Card Utilization: <span className="font-bold text-indigo-600">{utilization}%</span></label>
                        <input type="range" min="0" max="100" value={utilization} onChange={e => setUtilization(Number(e.target.value))} className="w-full range-style" />
                    </div>
                     {/* Other fields in a grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="label-style">Length of Credit History</label>
                            <div className="flex flex-col gap-2">
                                {['< 2 years', '2-5 years', '5-10 years', '10+ years'].map(opt => <button key={opt} onClick={() => setHistoryLength(opt)} className={`btn-toggle w-full text-left pl-4 ${historyLength === opt ? 'btn-selected' : ''}`}>{opt}</button>)}
                            </div>
                        </div>
                        <div>
                            <label className="label-style">New Applications (last 6 months)</label>
                            <div className="flex flex-col gap-2">
                                {['0', '1-2', '3-4', '5+'].map(opt => <button key={opt} onClick={() => setNewApplications(opt)} className={`btn-toggle w-full text-left pl-4 ${newApplications === opt ? 'btn-selected' : ''}`}>{opt}</button>)}
                            </div>
                        </div>
                    </div>
                     {/* Credit Mix */}
                     <div>
                        <label className="label-style">What types of credit do you have?</label>
                        <div className="flex flex-wrap gap-2">
                            {['Credit Card', 'Personal Loan', 'Car Loan', 'Home Loan'].map(type => (
                                <button key={type} onClick={() => handleMixToggle(type)} className={`btn-toggle ${creditMix.includes(type) ? 'btn-selected' : ''}`}>{type}</button>
                            ))}
                        </div>
                    </div>
                    
                    <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-10">Generate My Plan</button>
                </div>

            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #475569; }
                .dark .label-style { color: #94a3b8; }
                .btn-toggle { padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-selected { background-color: #4f46e5; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; }
                .range-style { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark .range-style { background: #334155; }
                .range-style::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
