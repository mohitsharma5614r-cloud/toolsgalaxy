import React, { useState } from 'react';
import { generateCreditCardRecommendations, CreditCard } from '../../services/geminiService';
import { Toast } from '../Toast';

// --- UI Components & Types ---
const spendingCategories = ["Travel ✈️", "Dining 🍔", "Groceries 🛒", "Online Shopping 💻", "Gas ⛽"];
const creditScores = ["Excellent (750+)", "Good (700-749)", "Fair (650-699)", "Needs Improvement (<650)"];
const rewardTypes = ["Cash Back 💵", "Travel Points 🌴", "No Preference ✨"];

// --- Loader Component ---
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="card-loader mx-auto">
            <div className="card c1"></div>
            <div className="card c2"></div>
            <div className="card c3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding the best cards for you...</p>
        <style>{`
            .card-loader { width: 120px; height: 80px; position: relative; }
            .card {
                width: 80px;
                height: 50px;
                background-color: #a5b4fc; /* indigo-300 */
                border-radius: 6px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid #6366f1;
            }
            .dark .card { background-color: #4338ca; border-color: #818cf8; }
            .card.c1 { animation: shuffle-1 2s infinite; }
            .card.c2 { animation: shuffle-2 2s infinite; }
            .card.c3 { animation: shuffle-3 2s infinite; }
            @keyframes shuffle-1 {
                0%, 100% { transform: translate(-50%, -50%) rotate(0deg); z-index: 3; }
                33% { transform: translate(-80%, -50%) rotate(-10deg); z-index: 1; }
                66% { transform: translate(-20%, -50%) rotate(10deg); z-index: 2; }
            }
             @keyframes shuffle-2 {
                0%, 100% { transform: translate(-50%, -50%) rotate(0deg); z-index: 2; }
                33% { transform: translate(-50%, -50%) rotate(0deg); z-index: 3; }
                66% { transform: translate(-80%, -50%) rotate(-10deg); z-index: 1; }
            }
             @keyframes shuffle-3 {
                0%, 100% { transform: translate(-50%, -50%) rotate(0deg); z-index: 1; }
                33% { transform: translate(-20%, -50%) rotate(10deg); z-index: 2; }
                66% { transform: translate(-50%, -50%) rotate(0deg); z-index: 3; }
            }
        `}</style>
    </div>
);

// --- Main Component ---
export const CreditCardChecker: React.FC = () => {
    // Form state
    const [selectedSpending, setSelectedSpending] = useState<string[]>([]);
    const [selectedScore, setSelectedScore] = useState(creditScores[0]);
    const [selectedReward, setSelectedReward] = useState(rewardTypes[0]);

    // Component state
    const [recommendations, setRecommendations] = useState<CreditCard[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSpendingToggle = (category: string) => {
        setSelectedSpending(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleGenerate = async () => {
        if (selectedSpending.length === 0) {
            setError("Please select at least one spending category.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCreditCardRecommendations(selectedSpending, selectedScore, selectedReward);
            setRecommendations(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get recommendations.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setRecommendations(null);
        setError(null);
    };
    
    if (isLoading) {
        return <div className="max-w-4xl mx-auto min-h-[500px] flex items-center justify-center"><Loader /></div>;
    }
    
    if (recommendations) {
        return (
            <div className="max-w-6xl mx-auto animate-fade-in">
                 <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Your Fictional Card Recommendations</h1>
                     <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl mx-auto">
                         Disclaimer: These are AI-generated, fictional credit cards for entertainment purposes only and do not represent real financial products.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendations.map((card, index) => (
                        <div key={index} className={`relative p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 animate-card-in ${card.bestMatch ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'bg-white dark:bg-slate-800 shadow-lg'}`} style={{ animationDelay: `${index * 150}ms` }}>
                            {card.bestMatch && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 font-bold text-sm rounded-full">Best Match</div>}
                            <div>
                                <p className={`font-semibold ${card.bestMatch ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>{card.issuer}</p>
                                <h3 className="text-2xl font-bold mt-1">{card.cardName}</h3>
                                <p className={`mt-4 text-sm ${card.bestMatch ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300'}`}>{card.description}</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-dashed">
                                 <p className={`text-sm font-semibold ${card.bestMatch ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>Key Feature</p>
                                 <p className="font-bold">{card.feature}</p>
                                 <p className="text-xs mt-2">{card.annualFee} Annual Fee</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">← Start Over</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Credit Card Checker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find the best fictional credit card for your spending habits.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
                    <div>
                        <label className="label-style">1. Where do you spend the most? (Select up to 3)</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {spendingCategories.map(cat => <button key={cat} onClick={() => handleSpendingToggle(cat)} disabled={selectedSpending.length >= 3 && !selectedSpending.includes(cat)} className={`btn-toggle ${selectedSpending.includes(cat) ? 'btn-selected' : ''}`}>{cat}</button>)}
                        </div>
                    </div>
                    <div>
                        <label className="label-style">2. What's your credit score range?</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                             {creditScores.map(opt => <button key={opt} onClick={() => setSelectedScore(opt)} className={`btn-toggle ${selectedScore === opt ? 'btn-selected' : ''}`}>{opt}</button>)}
                        </div>
                    </div>
                    <div>
                        <label className="label-style">3. What reward type do you prefer?</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                             {rewardTypes.map(opt => <button key={opt} onClick={() => setSelectedReward(opt)} className={`btn-toggle ${selectedReward === opt ? 'btn-selected' : ''}`}>{opt}</button>)}
                        </div>
                    </div>
                    <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-10">Find My Card</button>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                 .label-style { display: block; margin-bottom: 0.5rem; font-size: 1rem; font-weight: 600; color: #334155; }
                .dark .label-style { color: #cbd5e1; }
                .btn-toggle { padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; background-color: #e2e8f0; border: 2px solid transparent; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-toggle:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-selected { background-color: #eef2ff; color: #4338ca; border-color: #6366f1; }
                .dark .btn-selected { background-color: #312e81; color: #c7d2fe; border-color: #818cf8; }
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .animate-card-in { animation: card-in 0.5s ease-out forwards; opacity: 0; }
                @keyframes card-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </>
    );
};