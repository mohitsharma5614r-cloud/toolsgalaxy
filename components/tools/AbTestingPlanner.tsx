import React, { useState, useMemo } from 'react';
import { Toast } from '../Toast';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="btn-primary w-full text-lg">
            {copied ? 'Copied to Clipboard!' : 'Copy Plan as Text'}
        </button>
    );
};

export const AbTestingPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [hypothesis, setHypothesis] = useState('');
    const [control, setControl] = useState('');
    const [variation, setVariation] = useState('');
    const [metric, setMetric] = useState('');
    const [criteria, setCriteria] = useState('');
    const [isPlanVisible, setIsPlanVisible] = useState(false);

    const fullPlanText = useMemo(() => {
        return `
## A/B Test Plan

### Hypothesis
${hypothesis}

---

### Version A: Control
${control}

---

### Version B: Variation
${variation}

---

### Primary Metric
${metric}

---

### Success Criteria
${criteria}
        `.trim();
    }, [hypothesis, control, variation, metric, criteria]);

    const handleCreatePlan = () => {
        if (!hypothesis || !control || !variation || !metric || !criteria) {
            // Simple validation, could add a toast
            return;
        }
        setIsPlanVisible(true);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your A/B tests with a structured framework.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <h2 className="text-xl font-bold">Test Details</h2>
                        <div>
                            <label className="label-style">Hypothesis</label>
                            <textarea value={hypothesis} onChange={e => setHypothesis(e.target.value)} placeholder="e.g., 'Changing the button color from blue to green will increase sign-ups because...'" rows={3} className="input-style w-full"/>
                        </div>
                        <div>
                            <label className="label-style">Version A (Control)</label>
                            <textarea value={control} onChange={e => setControl(e.target.value)} placeholder="Description of the current version." rows={2} className="input-style w-full"/>
                        </div>
                        <div>
                            <label className="label-style">Version B (Variation)</label>
                            <textarea value={variation} onChange={e => setVariation(e.target.value)} placeholder="Description of the new version you're testing." rows={2} className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Primary Metric</label>
                            <input value={metric} onChange={e => setMetric(e.target.value)} placeholder="e.g., 'Conversion Rate on Sign-Up Button'" className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Success Criteria</label>
                            <input value={criteria} onChange={e => setCriteria(e.target.value)} placeholder="e.g., 'A 5% uplift with 95% statistical significance.'" className="input-style w-full"/>
                        </div>
                        <button onClick={handleCreatePlan} className="w-full btn-primary !mt-6">Create Plan</button>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4 text-center">Your A/B Test Plan</h2>
                        {isPlanVisible ? (
                            <div className="space-y-4 animate-fade-in">
                                <pre className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                                    {fullPlanText}
                                </pre>
                                <CopyButton text={fullPlanText} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-center">
                                <div className="split-path-loader mx-auto">
                                    <div className="path"></div>
                                    <div className="dot"></div>
                                </div>
                                <p className="mt-4">Fill out the details to generate your test plan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .label-style { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; }
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
                
                .split-path-loader { width: 80px; height: 80px; position: relative; }
                .path { width: 4px; height: 100%; background: #cbd5e1; border-radius: 2px; position: absolute; left: 50%; transform: translateX(-50%); }
                .path::before, .path::after {
                    content: ''; width: 4px; height: 50%; background: #cbd5e1; border-radius: 2px; position: absolute; bottom: 0;
                }
                .dark .path, .dark .path::before, .dark .path::after { background: #475569; }
                .path::before { transform: rotate(-30deg); transform-origin: top center; }
                .path::after { transform: rotate(30deg); transform-origin: top center; }
                .dot {
                    width: 12px; height: 12px; background: #6366f1; border-radius: 50%;
                    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                    animation: split 2.5s infinite ease-in-out;
                }
                .dark .dot { background: #818cf8; }
                @keyframes split {
                    0% { top: 0; } 40% { top: 40%; }
                    50% { opacity: 0; }
                    51% { top: 40%; }
                    52% { opacity: 1; }
                    100% { top: 100%; }
                }
            `}</style>
        </>
    );
};
