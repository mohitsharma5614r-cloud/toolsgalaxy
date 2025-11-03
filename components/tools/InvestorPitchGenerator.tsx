
import React, { useState } from 'react';
import { generateInvestorPitch, PitchSlide } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="rocket-loader mx-auto">
            <div className="rocket">🚀</div>
            <div className="smoke s1"></div>
            <div className="smoke s2"></div>
            <div className="smoke s3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Generating your pitch...</p>
        <style>{`
            .rocket-loader {
                width: 80px;
                height: 120px;
                position: relative;
            }
            .rocket {
                font-size: 50px;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                animation: launch 2.5s infinite ease-in-out;
            }
            .smoke {
                position: absolute;
                bottom: -10px;
                left: 50%;
                width: 15px;
                height: 15px;
                background: #e2e8f0; /* slate-200 */
                border-radius: 50%;
                transform: translateX(-50%);
                opacity: 0;
                animation: smoke-puff 2.5s infinite;
            }
            .dark .smoke { background: #475569; }
            .s1 { animation-delay: 0s; }
            .s2 { animation-delay: 0.3s; }
            .s3 { animation-delay: 0.6s; }

            @keyframes launch {
                0% { bottom: 0; }
                100% { bottom: 120px; opacity: 0; }
            }
            @keyframes smoke-puff {
                0% { transform: translate(-50%, 0) scale(0.5); opacity: 1; }
                100% { transform: translate(-50%, 20px) scale(3); opacity: 0; }
            }
        `}</style>
    </div>
);


export const InvestorPitchGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [companyName, setCompanyName] = useState('');
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    const [market, setMarket] = useState('');
    const [model, setModel] = useState('');
    
    const [pitch, setPitch] = useState<PitchSlide[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!companyName.trim() || !problem.trim() || !solution.trim() || !market.trim() || !model.trim()) {
            setError("Please fill out all fields to generate a pitch deck.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateInvestorPitch(companyName, problem, solution, market, model);
            setPitch(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate pitch.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatForCopy = () => {
        if (!pitch) return '';
        return pitch.map((slide, index) => `Slide ${index + 1}: ${slide.title}\n\n${slide.content}`).join('\n\n---\n\n');
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a compelling 10-slide pitch deck outline for investors.</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> :
                     pitch ? (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-2xl font-bold text-center">Your 10-Slide Pitch Deck</h2>
                             <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                                {pitch.map((slide, index) => (
                                    <div key={index} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-indigo-600 dark:text-indigo-400">SLIDE {index + 1}: {slide.title}</h3>
                                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                            {slide.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                <button onClick={() => navigator.clipboard.writeText(formatForCopy())} className="btn-secondary">Copy Pitch</button>
                                <button onClick={() => setPitch(null)} className="btn-primary">Create New Pitch</button>
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="label-style">Company Name</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-style w-full"/></div>
                                <div><label className="label-style">Target Market Size</label><input value={market} onChange={e => setMarket(e.target.value)} placeholder="e.g., $10B TAM" className="input-style w-full"/></div>
                            </div>
                            <div><label className="label-style">The Problem You Solve</label><textarea value={problem} onChange={e => setProblem(e.target.value)} rows={3} className="input-style w-full"/></div>
                            <div><label className="label-style">Your Solution</label><textarea value={solution} onChange={e => setSolution(e.target.value)} rows={3} className="input-style w-full"/></div>
                            <div><label className="label-style">Business Model</label><input value={model} onChange={e => setModel(e.target.value)} placeholder="e.g., B2B SaaS Subscription" className="input-style w-full"/></div>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Pitch Deck</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-secondary { background: #64748b; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
