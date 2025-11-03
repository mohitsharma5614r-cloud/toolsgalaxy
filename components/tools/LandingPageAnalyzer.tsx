import React, { useState } from 'react';
import { analyzeLandingPage, LandingPageAnalysis } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="heatmap-loader mx-auto">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing your copy...</p>
        <style>{`
            .heatmap-loader {
                width: 100px;
                height: 80px;
                position: relative;
            }
            .dot {
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #ef4444; /* red-500 */
                animation: heatmap-pulse 2s infinite ease-in-out;
            }
            .dot:nth-child(1) { top: 10px; left: 15px; animation-delay: 0s; }
            .dot:nth-child(2) { top: 50px; left: 40px; animation-delay: 0.5s; }
            .dot:nth-child(3) { top: 20px; left: 70px; animation-delay: 1s; }

            @keyframes heatmap-pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                }
                70% {
                    transform: scale(2);
                    opacity: 0;
                    box-shadow: 0 0 10px 20px rgba(239, 68, 68, 0);
                }
            }
        `}</style>
    </div>
);

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const angle = (score / 100) * 180;
    const getStatusColor = (s: number) => {
        if (s < 50) return 'text-red-500';
        if (s < 80) return 'text-yellow-500';
        return 'text-emerald-500';
    };
    return (
        <div className={`font-extrabold text-7xl ${getStatusColor(score)}`}>{score}</div>
    );
};

export const LandingPageAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [headline, setHeadline] = useState('');
    const [body, setBody] = useState('');
    const [cta, setCta] = useState('');
    const [analysis, setAnalysis] = useState<LandingPageAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!headline.trim() || !body.trim() || !cta.trim()) {
            setError("Please fill in all sections of the landing page copy.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await analyzeLandingPage(headline, body, cta);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Analyze the effectiveness of your landing page copy and get AI suggestions.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> :
                     analysis ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-slate-500">Overall Score</h2>
                                <ScoreGauge score={analysis.score} />
                            </div>
                            <AnalysisSection title="Headline Analysis" analysis={analysis.headline.analysis} suggestions={analysis.headline.suggestions} />
                            <AnalysisSection title="Body Copy Analysis" analysis={analysis.body.analysis} suggestions={analysis.body.suggestions} />
                            <AnalysisSection title="Call to Action (CTA) Analysis" analysis={analysis.cta.analysis} suggestions={analysis.cta.suggestions} />
                            <div className="text-center pt-4"><button onClick={() => setAnalysis(null)} className="btn-primary">Analyze Another Page</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="label-style">Headline</label>
                            <input value={headline} onChange={e => setHeadline(e.target.value)} className="input-style w-full"/>
                            <label className="label-style">Body Copy</label>
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} className="input-style w-full"/>
                            <label className="label-style">Call to Action (CTA)</label>
                            <input value={cta} onChange={e => setCta(e.target.value)} className="input-style w-full"/>
                            <button onClick={handleAnalyze} className="w-full btn-primary text-lg !mt-6">Analyze Landing Page</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                 .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};

const AnalysisSection: React.FC<{ title: string; analysis: string; suggestions: string[] }> = ({ title, analysis, suggestions }) => (
    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">{title}</h3>
        <p className="text-sm italic mb-3">"{analysis}"</p>
        <h4 className="font-semibold text-sm mb-1">Suggestions:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
    </div>
);