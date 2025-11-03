import React, { useState } from 'react';
import { generateClientProposal, Proposal } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" />
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" />
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Drafting your proposal...</p>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">{title}</h3>
        <div className="text-slate-600 dark:text-slate-300 space-y-2">{children}</div>
    </div>
);

export const ClientProposalWriter: React.FC<{ title: string }> = ({ title }) => {
    const [client, setClient] = useState('');
    const [project, setProject] = useState('');
    const [scope, setScope] = useState('');
    const [deliverables, setDeliverables] = useState('');
    const [price, setPrice] = useState('');
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!client || !project || !scope || !deliverables || !price) {
            setError("Please fill out all fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateClientProposal(client, project, scope, deliverables, price);
            setProposal(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate proposal.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a professional proposal outline for your clients.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     proposal ? (
                        <div className="animate-fade-in space-y-6">
                            <h2 className="text-2xl font-bold text-center">Proposal for {client}</h2>
                            <Section title="Introduction">{proposal.introduction}</Section>
                            <Section title="Scope of Work"><ul className="list-disc list-inside">{proposal.scope.map((item, i) => <li key={i}>{item}</li>)}</ul></Section>
                            <Section title="Timeline"><p>{proposal.timeline}</p></Section>
                            <Section title="Pricing & Payment"><p>{proposal.pricing}</p></Section>
                            <Section title="Conclusion">{proposal.conclusion}</Section>
                            <div className="text-center pt-4"><button onClick={() => setProposal(null)} className="btn-primary">Create Another</button></div>
                        </div>
                     ) : (
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <input value={client} onChange={e => setClient(e.target.value)} placeholder="Client Name" className="w-full input-style" />
                            <input value={project} onChange={e => setProject(e.target.value)} placeholder="Project Title" className="w-full input-style" />
                            <textarea value={scope} onChange={e => setScope(e.target.value)} rows={3} placeholder="Project Scope..." className="w-full input-style" />
                            <textarea value={deliverables} onChange={e => setDeliverables(e.target.value)} rows={3} placeholder="Key Deliverables..." className="w-full input-style" />
                            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price / Budget" className="w-full input-style" />
                            <button type="submit" className="w-full btn-primary text-lg !mt-6">Generate Proposal</button>
                        </form>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                 .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                 /* Loader styles */
                .quill-loader { stroke: #6366f1; } .dark .quill-loader { stroke: #818cf8; }
                .quill-body { fill: #a5b4fc; } .dark .quill-body { fill: #4f46e5; }
                .quill-nib { fill: #334155; } .dark .quill-nib { fill: #cbd5e1; }
                .scroll-line { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-line 1.5s 0.5s forwards; }
                .quill-body, .quill-nib { animation: move-quill 2s forwards; }
                @keyframes draw-line { to { stroke-dashoffset: 0; } }
                @keyframes move-quill {
                    0% { transform: translate(-20px, 20px) rotate(15deg); }
                    25% { transform: translate(0, 0) rotate(15deg); }
                    100% { transform: translate(80px, 0) rotate(15deg); }
                }
            `}</style>
        </>
    );
};
