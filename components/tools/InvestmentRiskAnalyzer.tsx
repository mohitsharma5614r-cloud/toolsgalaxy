
import React, { useState, useEffect } from 'react';
import { analyzeInvestmentRisk, RiskAnalysis } from '../../services/geminiService';
import { Toast } from '../Toast';

// Loader component with a rising graph animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="trend-loader mx-auto">
            <svg viewBox="0 0 100 50">
                <path className="grid-line" d="M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100" />
                <path className="trend-line" d="M0 40 C 20 40, 20 10, 40 10 S 60 40, 80 40 S 100 20, 100 20" />
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing portfolio risk...</p>
        <style>{`
            .trend-loader { width: 100px; height: 50px; }
            .grid-line { stroke: #e2e8f0; stroke-width: 1; }
            .dark .grid-line { stroke: #334155; }
            .trend-line { fill: none; stroke: #6366f1; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-trend 2s infinite ease-in-out; }
            .dark .trend-line { stroke: #818cf8; }
            @keyframes draw-trend { 0% { stroke-dashoffset: 200; } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -200; } }
        `}</style>
    </div>
);

const RiskGauge: React.FC<{ analysis: RiskAnalysis }> = ({ analysis }) => {
    const { score, riskLevel } = analysis;
    const angle = (score / 100) * 180;

    const getScoreColor = () => {
        if (score <= 30) return 'text-emerald-500';
        if (score <= 70) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0"
                     style={{ background: `conic-gradient(from 180deg at 50% 100%, #10b981 0 30%, #f59e0b 31% 70%, #ef4444 71% 100%)` }}>
                </div>
                 <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-700 ease-out"
                     style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
                </div>
            </div>
            <div className={`text-center -mt-8 ${getScoreColor()}`}>
                 <p className="text-5xl font-extrabold">{score}</p>
                 <p className="text-xl font-bold">{riskLevel}</p>
            </div>
        </div>
    );
};

// FIX: Add title prop to component.
export const InvestmentRiskAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [portfolio, setPortfolio] = useState('');
    const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!portfolio.trim()) {
            setError("Please describe your portfolio.");
            return;
        }
        setIsLoading(true);
        setAnalysis(null);
        setError(null);

        try {
            const result = await analyzeInvestmentRisk(portfolio);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze risk.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setPortfolio('');
        setAnalysis(null);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    {/* FIX: Use title prop for the heading. */}
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Describe your portfolio to get an AI-powered risk analysis.</p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                         <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                    ) : analysis ? (
                        <div className="animate-fade-in text-center space-y-6">
                            <RiskGauge analysis={analysis} />
                            <p className="text-slate-600 dark:text-slate-300 italic max-w-lg mx-auto">"{analysis.analysis}"</p>
                             <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">Analyze Another</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label htmlFor="portfolio" className="block text-sm font-medium">Describe your portfolio allocation</label>
                            <textarea
                                id="portfolio"
                                rows={5}
                                value={portfolio}
                                onChange={e => setPortfolio(e.target.value)}
                                placeholder="e.g., 60% in large-cap stocks, 20% in government bonds, 10% in gold, and 10% in cash."
                                className="w-full input-style"
                            />
                            <button onClick={handleAnalyze} className="w-full btn-primary text-lg">Analyze My Risk</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 700; padding: 0.75rem 1rem; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </>
    );
};