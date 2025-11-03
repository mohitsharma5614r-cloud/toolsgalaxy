
import React, { useState } from 'react';
import { generateBrandSlogans } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Playful', 'Professional', 'Modern', 'Inspirational', 'Bold'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="lightbulb-loader mx-auto">
            <div className="lightbulb"></div>
            <div className="spark s1"></div>
            <div className="spark s2"></div>
            <div className="spark s3"></div>
            <div className="spark s4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating slogans...</p>
        <style>{`
            .lightbulb-loader {
                position: relative;
                width: 80px;
                height: 80px;
            }
            .lightbulb {
                width: 30px;
                height: 30px;
                background: #f1c40f;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: light-flicker 2s infinite;
            }
            .lightbulb::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 15px;
                height: 10px;
                background: #bdc3c7;
                border-radius: 3px;
            }
            .spark {
                position: absolute;
                width: 4px;
                height: 12px;
                background: #f1c40f;
                border-radius: 2px;
                opacity: 0;
            }
            .s1 { animation: spark-animation 2s infinite; animation-delay: 0s; top: 10px; left: 50%; }
            .s2 { animation: spark-animation 2s infinite; animation-delay: 0.5s; top: 50%; left: 90%; }
            .s3 { animation: spark-animation 2s infinite; animation-delay: 1s; bottom: 10px; left: 50%; }
            .s4 { animation: spark-animation 2s infinite; animation-delay: 1.5s; top: 50%; right: 90%; }
            @keyframes light-flicker {
                0%, 100% { box-shadow: 0 0 5px #f1c40f, 0 0 10px #f1c40f; opacity: 0.8; }
                50% { box-shadow: 0 0 20px #f1c40f, 0 0 30px #f1c40f; opacity: 1; }
            }
            @keyframes spark-animation {
                0% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
                20% { transform: scaleY(1) rotate(var(--angle, 0deg)); opacity: 1; }
                50% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
            }
            .s1 { --angle: 0deg; } .s2 { --angle: 90deg; } .s3 { --angle: 180deg; } .s4 { --angle: 270deg; }
        `}</style>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const BrandSloganGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [brandName, setBrandName] = useState('');
    const [description, setDescription] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [slogans, setSlogans] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!brandName.trim() || !description.trim()) {
            setError("Please provide a brand name and a description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateBrandSlogans(brandName, description, audience, tone);
            setSlogans(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate slogans.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate catchy slogans for your new business or product.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="label-style">Brand/Product Name</label><input value={brandName} onChange={e => setBrandName(e.target.value)} className="input-style w-full"/></div>
                        <div><label className="label-style">Target Audience</label><input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., young professionals" className="input-style w-full"/></div>
                    </div>
                     <div>
                        <label className="label-style">What it does</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="e.g., sells eco-friendly coffee" className="input-style w-full"/>
                    </div>
                     <div>
                        <label className="label-style">Desired Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => <button key={t} onClick={() => setTone(t)} className={`btn-toggle ${tone === t ? 'btn-selected' : ''}`}>{t}</button>)}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg !mt-8">Generate Slogans</button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : slogans.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {slogans.map((slogan, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{slogan}</p>
                                    <CopyButton textToCopy={slogan} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p>Your AI-generated slogans will appear here.</p>
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
                .btn-toggle { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-selected { background-color: #4f46e5; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
