import React, { useState } from 'react';
import { analyzeHeadline, HeadlineAnalysis } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="analyzer-loader mx-auto">
            <div className="gauge">
                <div className="needle"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing headline...</p>
        <style>{`
            .analyzer-loader {
                width: 100px;
                height: 60px;
                position: relative;
            }
            .gauge {
                width: 100%;
                height: 50px;
                border: 8px solid #cbd5e1; /* slate-300 */
                border-bottom: none;
                border-radius: 50px 50px 0 0;
                position: relative;
            }
            .dark .gauge { border-color: #475569; }
            .needle {
                width: 4px;
                height: 40px;
                background: #ef4444; /* red-500 */
                border-radius: 2px;
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform-origin: bottom center;
                animation: sweep 2.5s infinite ease-in-out;
            }
            @keyframes sweep {
                0%, 100% { transform: rotate(-60deg); }
                50% { transform: rotate(60deg); }
            }
        `}</style>
    </div>
);

export const HeadlineAnalyzer: React.FC = () => {
    const [headline, setHeadline] = useState('');
    const [analysis, setAnalysis] = useState<HeadlineAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!headline.trim()) {
            setError("Please enter a headline to analyze.");
            return;
        }
        setIsLoading(true);
        setAnalysis(null);
        setError(null);

        try {
            const result = await analyzeHeadline(headline);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze the headline.");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 5) return 'text-red-500';
        if (score < 8) return 'text-yellow-500';
        return 'text-emerald-500';
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Headline Analyzer 📊</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Analyze your headlines for effectiveness and get improvement tips.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label htmlFor="headline-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter your headline</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="headline-input"
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g., 5 Ways to Improve Your Productivity"
                            className="flex-grow w-full input-style"
                        />
                        <button onClick={handleGenerate} disabled={isLoading || !headline.trim()} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md">
                            {isLoading ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : analysis ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            <div className="md:col-span-1 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-center">
                                <h3 className="font-bold text-slate-500 dark:text-slate-400">Score</h3>
                                <p className={`text-8xl font-extrabold ${getScoreColor(analysis.score)}`}>{analysis.score}<span className="text-4xl">/10</span></p>
                            </div>
                            <div className="md:col-span-2 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-4">
                                <div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300">Analysis</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.analysis}</p>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300">Suggestions</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                        {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p className="text-lg">Your headline analysis will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
