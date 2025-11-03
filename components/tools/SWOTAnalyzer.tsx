import React, { useState } from 'react';
import { generateSWOTAnalysis, SWOTAnalysis } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="swot-loader" width="120" height="120" viewBox="0 0 120 120">
            <line className="swot-line" x1="60" y1="10" x2="60" y2="110" />
            <line className="swot-line" x1="10" y1="60" x2="110" y2="60" />
            <rect className="swot-border" x="10" y="10" width="100" height="100" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Analyzing your idea...</p>
        <style>{`
            .swot-loader {
                stroke: #818cf8; /* indigo-400 */
                stroke-width: 3;
                fill: none;
            }
            .dark .swot-loader { stroke: #6366f1; }
            .swot-line, .swot-border {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-swot 2s ease-in-out infinite;
            }
            .swot-line:nth-child(2) { animation-delay: 0.2s; }
            .swot-border { animation-delay: 0.5s; stroke-dasharray: 400; stroke-dashoffset: 400; }

            @keyframes draw-swot {
                to { stroke-dashoffset: 0; }
            }
        `}</style>
    </div>
);

const AnalysisSection: React.FC<{ title: string; items: string[]; color: string }> = ({ title, items, color }) => (
    <div className={`p-4 rounded-lg ${color}`}>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

export const SWOTAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [idea, setIdea] = useState('');
    const [analysis, setAnalysis] = useState<SWOTAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea.trim()) {
            setError("Please enter a business idea to analyze.");
            return;
        }
        setIsLoading(true);
        setAnalysis(null);
        setError(null);
        try {
            const result = await generateSWOTAnalysis(idea);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate SWOT analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for your business idea.</p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? <div className="min-h-[200px] flex items-center justify-center"><Loader /></div> :
                     analysis ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-center">SWOT Analysis for: "{idea}"</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnalysisSection title="Strengths 💪" items={analysis.strengths} color="bg-emerald-100 dark:bg-emerald-900/50" />
                                <AnalysisSection title="Weaknesses ⛓️" items={analysis.weaknesses} color="bg-rose-100 dark:bg-rose-900/50" />
                                <AnalysisSection title="Opportunities ✨" items={analysis.opportunities} color="bg-sky-100 dark:bg-sky-900/50" />
                                <AnalysisSection title="Threats ⛈️" items={analysis.threats} color="bg-amber-100 dark:bg-amber-900/50" />
                            </div>
                             <div className="text-center">
                                <button onClick={() => setAnalysis(null)} className="btn-primary mt-4">Analyze Another Idea</button>
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Your Business Idea or Project</label>
                            <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4} placeholder="e.g., A subscription service for gourmet coffee beans sourced from local roasters." className="input-style w-full"/>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Analysis</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};