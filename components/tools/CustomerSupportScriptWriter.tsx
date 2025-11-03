
import React, { useState } from 'react';
import { generateCustomerSupportScript } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Empathetic', 'Formal', 'Direct', 'Friendly'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="headset-loader mx-auto">
            <div className="headband"></div>
            <div className="earpiece left"></div>
            <div className="earpiece right"></div>
            <div className="mic"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing your script...</p>
        <style>{`
            .headset-loader { width: 100px; height: 100px; position: relative; }
            .headband {
                width: 80px; height: 80px;
                border: 8px solid #9ca3af;
                border-bottom-color: transparent;
                border-radius: 50%;
                position: absolute;
                top: 0; left: 10px;
            }
            .earpiece {
                width: 30px; height: 40px;
                background: #64748b;
                border-radius: 8px;
                position: absolute;
                top: 50px;
            }
            .left { left: 5px; }
            .right { right: 5px; }
            .mic {
                width: 40px; height: 20px;
                border: 4px solid #64748b;
                border-right: none;
                border-radius: 20px 0 0 20px;
                position: absolute;
                bottom: 15px; right: -20px;
                animation: mic-pulse 1.5s infinite;
            }
            .dark .headband, .dark .earpiece, .dark .mic { border-color: #64748b; background-color: #94a3b8; }
            .dark .mic { border-color: #94a3b8; }
            @keyframes mic-pulse {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(1.1); }
            }
        `}</style>
    </div>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="btn-secondary">
            {copied ? 'Copied!' : 'Copy Script'}
        </button>
    );
};

export const CustomerSupportScriptWriter: React.FC<{ title: string }> = ({ title }) => {
    const [scenario, setScenario] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [script, setScript] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!scenario.trim()) {
            setError("Please describe the customer support scenario.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCustomerSupportScript(scenario, tone);
            setScript(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate script.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create scripts for common customer support scenarios.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <h2 className="text-xl font-bold">Scenario Details</h2>
                        <textarea value={scenario} onChange={e => setScenario(e.target.value)} rows={6} placeholder="e.g., An angry customer whose package hasn't arrived yet." className="input-style w-full"/>
                        <label>Desired Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => <button key={t} onClick={() => setTone(t)} className={`btn-toggle ${tone === t ? 'btn-selected' : ''}`}>{t}</button>)}
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary !mt-6 text-lg">
                            {isLoading ? 'Generating...' : 'Generate Script'}
                        </button>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4 text-center">Generated Script</h2>
                        <div className="min-h-[300px]">
                            {isLoading ? <Loader /> :
                             script ? (
                                <div className="space-y-4 animate-fade-in">
                                    <pre className="whitespace-pre-wrap font-sans text-sm p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg max-h-96 overflow-y-auto">{script}</pre>
                                    <CopyButton textToCopy={script} />
                                </div>
                             ) : <p className="text-slate-400 text-center pt-20">Your script will appear here.</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-secondary { background: #64748b; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.5rem 1rem; }
                .btn-toggle { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-selected { background-color: #4f46e5; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
