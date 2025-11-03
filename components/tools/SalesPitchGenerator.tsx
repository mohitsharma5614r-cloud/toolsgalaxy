import React, { useState } from 'react';
import { generateSalesPitch, SalesPitch } from '../../services/geminiService';
import { Toast } from '../Toast';

const pitchStyles = ['Professional', 'Enthusiastic', 'Storytelling', 'Direct'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="sales-loader mx-auto">
            <div className="bar b1"></div>
            <div className="bar b2"></div>
            <div className="bar b3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Crafting your winning pitch...</p>
        <style>{`
            .sales-loader {
                width: 80px;
                height: 60px;
                display: flex;
                justify-content: space-around;
                align-items: flex-end;
            }
            .bar {
                width: 15px;
                background-color: #6366f1;
                border-radius: 4px;
                animation: grow-bar 1.2s infinite ease-in-out;
            }
            .dark .bar {
                background-color: #818cf8;
            }
            .b1 { height: 20px; animation-delay: 0s; }
            .b2 { height: 40px; animation-delay: 0.2s; }
            .b3 { height: 30px; animation-delay: 0.4s; }

            @keyframes grow-bar {
                0%, 100% { transform: scaleY(0.2); }
                50% { transform: scaleY(1); }
            }
        `}</style>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="w-full px-4 py-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm"
        >
            {copied ? 'Copied!' : 'Copy Full Pitch'}
        </button>
    );
};


export const SalesPitchGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [productName, setProductName] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [keyBenefit, setKeyBenefit] = useState('');
    const [pitchStyle, setPitchStyle] = useState(pitchStyles[0]);
    
    const [pitch, setPitch] = useState<SalesPitch | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!productName.trim() || !targetAudience.trim() || !keyBenefit.trim()) {
            setError("Please fill out all fields to generate a pitch.");
            return;
        }
        setIsLoading(true);
        setPitch(null);
        setError(null);

        try {
            const result = await generateSalesPitch(productName, targetAudience, keyBenefit, pitchStyle);
            setPitch(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate the sales pitch.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatForCopy = (): string => {
        if (!pitch) return '';
        return `Hook: ${pitch.hook}\n\nProblem: ${pitch.problem}\n\nSolution: ${pitch.solution}\n\nCall to Action: ${pitch.cta}`;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Craft a persuasive sales pitch with AI for any product.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <label className="label-style">Product/Service Name</label>
                            <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., Nova CRM" className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Target Audience</label>
                            <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g., Small business owners" className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Key Benefit / Problem Solved</label>
                            <textarea value={keyBenefit} onChange={e => setKeyBenefit(e.target.value)} rows={3} placeholder="e.g., It automates follow-up emails and saves time." className="input-style w-full"/>
                        </div>
                        <div>
                            <label className="label-style">Pitch Style</label>
                            <div className="flex flex-wrap gap-2">
                                {pitchStyles.map(style => (
                                    <button key={style} onClick={() => setPitchStyle(style)} className={`btn-toggle ${pitchStyle === style ? 'btn-selected' : ''}`}>{style}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg !mt-6">
                            {isLoading ? 'Generating...' : 'Generate Pitch'}
                        </button>
                    </div>
                    
                    {/* Output */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col">
                         {isLoading ? (
                            <div className="m-auto"><Loader /></div>
                        ) : pitch ? (
                            <div className="w-full animate-fade-in space-y-4">
                                <div>
                                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Hook</h3>
                                    <p className="text-sm italic">"{pitch.hook}"</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Problem</h3>
                                    <p className="text-sm">{pitch.problem}</p>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Solution</h3>
                                    <p className="text-sm">{pitch.solution}</p>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Call to Action</h3>
                                    <p className="text-sm font-semibold">{pitch.cta}</p>
                                </div>
                                <CopyButton textToCopy={formatForCopy()} />
                            </div>
                        ) : (
                            <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                                <p>Your generated pitch will appear here.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
                .btn-toggle { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-selected { background-color: #4f46e5; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
