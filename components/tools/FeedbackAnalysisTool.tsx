import React, { useState } from 'react';
import { analyzeCustomerFeedback, FeedbackAnalysis } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="feedback-loader mx-auto">
            <div className="doc d1"></div>
            <div className="doc d2"></div>
            <div className="doc d3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing feedback...</p>
        <style>{`
            .feedback-loader { width: 120px; height: 100px; position: relative; }
            .doc { width: 60px; height: 80px; background: #e2e8f0; border-radius: 4px; position: absolute; top: 10px; border: 2px solid #cbd5e1; }
            .dark .doc { background: #334155; border-color: #475569; }
            .d1 { animation: sort-1 2.5s infinite; }
            .d2 { animation: sort-2 2.5s infinite; }
            .d3 { animation: sort-3 2.5s infinite; }
            @keyframes sort-1 { 0%,100% {left: 30px;} 50% {left: 0px;} }
            @keyframes sort-2 { 0%,100% {z-index: 2;} 50% {z-index: 0;} }
            @keyframes sort-3 { 0%,100% {left: 30px;} 50% {left: 60px;} }
        `}</style>
    </div>
);

export const FeedbackAnalysisTool: React.FC<{ title: string }> = ({ title }) => {
    const [feedback, setFeedback] = useState('');
    const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!feedback.trim()) {
            setError("Please paste some feedback to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await analyzeCustomerFeedback(feedback);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze feedback.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Analyze customer feedback to find key themes and sentiments.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     analysis ? (
                        <div className="animate-fade-in space-y-6">
                            <div className="p-4 rounded-lg text-center bg-slate-100 dark:bg-slate-700/50">
                                <h3 className="font-bold">Overall Sentiment</h3>
                                <p className="text-2xl font-bold">{analysis.sentiment}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300">👍 Positive Themes</h4>
                                    <ul className="list-disc list-inside text-sm mt-2">{analysis.positiveThemes.map((t,i) => <li key={i}>{t}</li>)}</ul>
                                </div>
                                 <div className="p-4 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-300">👎 Negative Themes</h4>
                                    <ul className="list-disc list-inside text-sm mt-2">{analysis.negativeThemes.map((t,i) => <li key={i}>{t}</li>)}</ul>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                <h4 className="font-bold text-indigo-800 dark:text-indigo-300">💡 Actionable Suggestions</h4>
                                <ul className="list-disc list-inside text-sm mt-2">{analysis.suggestions.map((s,i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                            <div className="text-center"><button onClick={() => setAnalysis(null)} className="btn-primary">Analyze More Feedback</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Paste customer reviews or feedback</label>
                            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={10} placeholder="e.g., 'The app is great, but it crashes sometimes. I love the new feature!'" className="input-style w-full"/>
                            <button onClick={handleAnalyze} className="w-full btn-primary text-lg !mt-6">Analyze Feedback</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};
