
import React, { useState } from 'react';
import { generateCustomerPersona, Persona } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="persona-loader mx-auto">
            <div className="head"></div>
            <div className="body"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Building your customer persona...</p>
        <style>{`
            .persona-loader {
                width: 80px;
                height: 100px;
                position: relative;
            }
            .head, .body {
                background: #cbd5e1; /* slate-300 */
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                animation: build-persona 2s infinite ease-in-out;
            }
            .dark .head, .dark .body {
                background: #475569; /* slate-600 */
            }
            .head {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                top: 0;
            }
            .body {
                width: 80px;
                height: 50px;
                bottom: 0;
                border-radius: 40px 40px 0 0;
                animation-delay: 0.5s;
            }
            @keyframes build-persona {
                0%, 100% {
                    transform: translateX(-50%) translateY(10px);
                    opacity: 0;
                }
                50% {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `}</style>
    </div>
);

export const CustomerPersonaGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [persona, setPersona] = useState<Persona | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!product.trim() || !audience.trim()) {
            setError("Please fill out both product and audience fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCustomerPersona(product, audience);
            setPersona(result);
        } catch (err) {
            // FIX: Changed err.message() to err.message as it's a property, not a function.
            setError(err instanceof Error ? err.message : "Failed to generate persona.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create detailed personas for your target marketing audience.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     persona ? (
                        <div className="animate-fade-in space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">{persona.name}, {persona.age}</h2>
                                <p className="text-lg font-semibold text-indigo-500">{persona.role}</p>
                            </div>
                            <p className="italic text-center text-slate-600 dark:text-slate-400">"{persona.bio}"</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300">Goals</h3>
                                    <ul className="list-disc list-inside text-sm mt-2">
                                        {persona.goals.map((g, i) => <li key={i}>{g}</li>)}
                                    </ul>
                                </div>
                                <div className="p-4 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                                    <h3 className="font-bold text-rose-800 dark:text-rose-300">Frustrations</h3>
                                    <ul className="list-disc list-inside text-sm mt-2">
                                        {persona.frustrations.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-center pt-4">
                                <button onClick={() => setPersona(null)} className="btn-primary">Create Another Persona</button>
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="label-style">Your Product/Service</label>
                            <input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g., A project management tool" className="input-style w-full"/>
                            <label className="label-style">Your Target Audience</label>
                            <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., Freelance designers and small agencies" className="input-style w-full"/>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Persona</button>
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
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};