
import React, { useState } from 'react';
import { analyzeRisks, RiskAnalysisResult } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="scale-loader mx-auto">
            <div className="scale-arm">
                <div className="scale-pan left"></div>
                <div className="scale-pan right"></div>
            </div>
            <div className="scale-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing risks...</p>
        <style>{`
            .scale-loader { width: 120px; height: 80px; position: relative; }
            .scale-base { width: 40px; height: 10px; background: #9ca3af; border-radius: 4px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
            .dark .scale-base { background: #64748b; }
            .scale-base::before { content:''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 10px 40px 10px; border-color: transparent transparent #9ca3af transparent; }
            .dark .scale-base::before { border-color: transparent transparent #64748b transparent; }
            .scale-arm { width: 100%; height: 8px; background: #9ca3af; border-radius: 4px; position: absolute; top: 30px; transform-origin: center; animation: balance-scale 2s infinite ease-in-out; }
            .dark .scale-arm { background: #64748b; }
            .scale-pan { position: absolute; width: 30px; height: 15px; border: 2px solid #9ca3af; border-top: none; border-radius: 0 0 15px 15px; top: 10px; }
            .dark .scale-pan { border-color: #64748b; }
            .scale-pan.left { left: 0; }
            .scale-pan.right { right: 0; }
            @keyframes balance-scale { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
        `}</style>
    </div>
);

export const RiskAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [planText, setPlanText] = useState('');
    const [analysis, setAnalysis] = useState<RiskAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!planText.trim()) {
            setError("Please enter a plan to analyze.");
            return;
        }
        setIsLoading(true);
        setAnalysis(null);
        setError(null);

        try {
            const result = await analyzeRisks(planText);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze risks.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel?.toLowerCase()) {
            case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Identify potential risks in your plan before you start.</p>
                </div>

                {!analysis ? (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                        <label htmlFor="plan-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Business Idea or Project Plan</label>
                        <textarea
                            id="plan-text"
                            rows={8}
                            value={planText}
                            onChange={(e) => setPlanText(e.target.value)}
                            placeholder="Describe your business idea, project plan, or new venture here... The more detail, the better the analysis!"
                            className="w-full input-style"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg"
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze Risks'}
                        </button>
                    </div>
                ) : null}

                <div className="mt-8 min-h-[300px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : analysis ? (
                        <div className="w-full animate-fade-in space-y-6">
                            <div className={`p-6 rounded-lg text-center ${getRiskColor(analysis.overallRisk)}`}>
                                <h2 className="text-sm font-bold uppercase tracking-wider">Overall Risk Assessment</h2>
                                <p className="text-4xl font-extrabold mt-1">{analysis.overallRisk}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <RiskCategory title="Financial Risks 💰" risks={analysis.financialRisks} />
                                <RiskCategory title="Operational Risks ⚙️" risks={analysis.operationalRisks} />
                                <RiskCategory title="Market Risks 📈" risks={analysis.marketRisks} />
                            </div>

                             <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">Recommendation</h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-300">{analysis.recommendation}</p>
                            </div>

                            <div className="text-center">
                                <button onClick={() => setAnalysis(null)} className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg">Analyze Another Plan</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};

const RiskCategory: React.FC<{ title: string; risks: string[] }> = ({ title, risks }) => (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-center mb-3">{title}</h3>
        {risks.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside text-sm text-slate-600 dark:text-slate-400">
                {risks.map((risk, i) => <li key={i}>{risk}</li>)}
            </ul>
        ) : (
            <p className="text-sm text-slate-400 text-center italic">No significant risks identified.</p>
        )}
    </div>
);
