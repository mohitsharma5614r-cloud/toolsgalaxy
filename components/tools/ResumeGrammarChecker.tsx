import React, { useState } from 'react';
import { checkResumeGrammar, GrammarCorrection } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="document-scanner" width="120" height="120" viewBox="0 0 120 120">
            <rect x="10" y="10" width="100" height="100" rx="5" className="doc-bg" />
            <g className="doc-text">
                <rect x="20" y="25" width="80" height="8" rx="2" />
                <rect x="20" y="45" width="70" height="8" rx="2" />
                <rect x="20" y="65" width="85" height="8" rx="2" />
                <rect x="20" y="85" width="50" height="8" rx="2" />
            </g>
            <line x1="5" y1="0" x2="115" y2="0" className="scanner-light" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Analyzing your resume...</p>
        <style>{`
            .doc-bg { fill: #f1f5f9; stroke: #cbd5e1; stroke-width: 2; }
            .doc-text rect { fill: #cbd5e1; }
            .dark .doc-bg { fill: #1e293b; stroke: #475569; }
            .dark .doc-text rect { fill: #475569; }
            .scanner-light {
                stroke: #6366f1;
                stroke-width: 4;
                stroke-linecap: round;
                box-shadow: 0 0 10px #818cf8;
                animation: scan-doc 2.5s infinite ease-in-out;
            }
            @keyframes scan-doc {
                0%, 100% { transform: translateY(10px); }
                50% { transform: translateY(110px); }
            }
        `}</style>
    </div>
);

export const ResumeGrammarChecker: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<GrammarCorrection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!text.trim()) {
            setError("Please paste your resume text to be checked.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const analysis = await checkResumeGrammar(text);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to check grammar.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check your resume for grammar, spelling, and style errors.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     result ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-center">Analysis Complete</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                    <h3 className="font-bold mb-2">Suggested Changes</h3>
                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                        {result.changes.map((change, i) => (
                                            <div key={i}>
                                                <p className="text-xs text-red-500 line-through">{change.original}</p>
                                                <p className="text-xs text-emerald-500">→ {change.suggested}</p>
                                                <p className="text-xs text-slate-500 italic mt-1">{change.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                    <h3 className="font-bold mb-2">Corrected Text</h3>
                                    <textarea readOnly value={result.correctedText} rows={10} className="w-full text-sm bg-white dark:bg-slate-800 rounded-md p-2"/>
                                </div>
                            </div>
                             <div className="text-center pt-4"><button onClick={() => setResult(null)} className="btn-primary">Check Another Resume</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Paste your resume content</label>
                            <textarea value={text} onChange={e => setText(e.target.value)} rows={12} placeholder="Paste your full resume text here for analysis..." className="input-style w-full"/>
                            <button onClick={handleCheck} className="w-full btn-primary text-lg !mt-6">Check My Resume</button>
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
