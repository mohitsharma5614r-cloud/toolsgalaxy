
import React, { useState } from 'react';
import { generateBusinessPlan, BusinessPlan } from '../../services/geminiService';
import { Toast } from '../Toast';

// Loader component with blueprint animation
const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="blueprint-loader" width="120" height="120" viewBox="0 0 120 120">
            <rect className="blueprint-shape" x="10" y="10" width="100" height="100" rx="5" />
            <circle className="blueprint-shape" cx="60" cy="60" r="40" />
            <polyline className="blueprint-shape" points="20,100 60,20 100,100" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Drafting your business plan...</p>
        <style>{`
            .blueprint-loader { fill: none; stroke: #818cf8; stroke-width: 2; }
            .dark .blueprint-loader { stroke: #6366f1; }
            .blueprint-shape {
                stroke-dasharray: 500;
                stroke-dashoffset: 500;
                animation: draw-blueprint 3s ease-in-out infinite;
            }
            .blueprint-shape:nth-child(2) { animation-delay: 0.5s; }
            .blueprint-shape:nth-child(3) { animation-delay: 1s; }
            @keyframes draw-blueprint {
                30%, 70% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -500; }
            }
        `}</style>
    </div>
);

// Accordion Item Component
const AccordionItem: React.FC<{ title: string; content: string; isOpen: boolean; onClick: () => void }> = ({ title, content, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-slate-700">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left py-4 px-2">
            <span className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">{title}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{content}</div>
        </div>
    </div>
);

export const BusinessPlanGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [idea, setIdea] = useState('');
    const [audience, setAudience] = useState('');
    const [features, setFeatures] = useState('');
    const [plan, setPlan] = useState<BusinessPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>('Executive Summary');

    const handleGenerate = async () => {
        if (!idea.trim() || !audience.trim() || !features.trim()) {
            setError("Please fill out all fields to generate a plan.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateBusinessPlan(idea, audience, features);
            setPlan(result);
            setOpenAccordion('Executive Summary');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate business plan.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatForCopy = () => {
        if (!plan) return '';
        return Object.entries(plan).map(([key, value]) => {
            // Convert camelCase to Title Case
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return `## ${title}\n\n${value}`;
        }).join('\n\n---\n\n');
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a structured business plan outline with AI assistance.</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     plan ? (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-2xl font-bold text-center">Your Business Plan Outline</h2>
                            <div>
                                {Object.entries(plan).map(([key, value]) => {
                                    const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    return (
                                        <AccordionItem
                                            key={key}
                                            title={title}
                                            content={value}
                                            isOpen={openAccordion === title}
                                            onClick={() => setOpenAccordion(openAccordion === title ? null : title)}
                                        />
                                    );
                                })}
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                <button onClick={() => { navigator.clipboard.writeText(formatForCopy()) }} className="btn-secondary">Copy Plan</button>
                                <button onClick={() => setPlan(null)} className="btn-primary">Create New Plan</button>
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="label-style">Business Idea</label>
                                <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={3} placeholder="e.g., An AI-powered app that creates personalized workout plans." className="input-style w-full"/>
                            </div>
                            <div>
                                <label className="label-style">Target Audience</label>
                                <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., Busy professionals aged 25-40 who want to stay fit." className="input-style w-full"/>
                            </div>
                            <div>
                                <label className="label-style">Key Features / Products</label>
                                <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={3} placeholder="e.g., Adaptive workout generation, meal tracking, progress analytics." className="input-style w-full"/>
                            </div>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Business Plan</button>
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
