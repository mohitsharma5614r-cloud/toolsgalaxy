import React, { useState } from 'react';
import { generateBusinessRiskScore, BusinessRiskScore } from '../../services/geminiService';
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
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Assessing business risks...</p>
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

const RiskGauge: React.FC<{ score: number }> = ({ score }) => {
    const angle = (score / 100) * 180;
    const getStatus = () => {
        if (score <= 30) return { text: 'Low Risk', color: 'text-emerald-500' };
        if (score <= 60) return { text: 'Medium Risk', color: 'text-yellow-500' };
        return { text: 'High Risk', color: 'text-red-500' };
    };
    const status = getStatus();

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0"
                     style={{ background: `conic-gradient(from 180deg at 50% 100%, #10b981 0 30%, #f59e0b 31% 60%, #ef4444 61% 100%)` }}>
                </div>
                 <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-1000 ease-out"
                     style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
                </div>
            </div>
            <div className={`text-center -mt-8 ${status.color}`}>
                 <p className="text-5xl font-extrabold">{score}</p>
                 <p className="text-xl font-bold">{status.text}</p>
            </div>
        </div>
    );
};

export const BusinessRiskScoreTool: React.FC<{ title: string }> = ({ title }) => {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState<BusinessRiskScore | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!description.trim()) {
            setError("Please enter a business description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const analysis = await generateBusinessRiskScore(description);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze risk.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Assess and score potential risks for your business with AI.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     result ? (
                        <div className="animate-fade-in space-y-6">
                            <RiskGauge score={result.score} />
                            <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Analysis</h3>
                                <p className="text-sm mt-1">{result.analysis}</p>
                            </div>
                             <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Recommendations</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm mt-1">
                                    {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                            <div className="text-center"><button onClick={() => setResult(null)} className="btn-primary">Analyze Another</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Describe your business or project</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="e.g., A mobile app that connects local dog walkers with owners in real-time. We will charge a 15% commission on each walk." className="input-style w-full"/>
                            <button onClick={handleAnalyze} className="w-full btn-primary text-lg !mt-6">Assess Risk</button>
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