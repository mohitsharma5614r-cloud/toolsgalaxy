
import React, { useState } from 'react';

const funnelStages = {
    Awareness: "Strategies to attract a broad audience and make them aware of your brand and solution.",
    Interest: "Tactics to engage prospects, build interest, and encourage them to learn more.",
    Desire: "Methods to create a desire for your product by highlighting benefits and social proof.",
    Action: "Techniques to convert interested leads into paying customers with a clear call-to-action."
};

const mockTactics: Record<string, string[]> = {
    Awareness: ["Run targeted social media ad campaigns", "Create viral-worthy short-form video content", "Collaborate with influencers in your niche", "Publish SEO-optimized blog posts"],
    Interest: ["Offer a free downloadable e-book or guide", "Host an educational webinar", "Create an interactive quiz or tool", "Share detailed case studies and success stories"],
    Desire: ["Showcase customer testimonials and reviews", "Offer a limited-time free trial or demo", "Highlight unique features that solve a major pain point", "Create comparison pages against competitors"],
    Action: ["Provide a clear call-to-action (e.g., 'Buy Now', 'Sign Up')", "Offer a special introductory discount", "Use exit-intent popups to capture abandoning visitors", "Simplify the checkout process"]
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="funnel-loader mx-auto">
            <div className="funnel"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Generating your funnel strategy...</p>
        <style>{`
            .funnel-loader { width: 100px; height: 100px; position: relative; }
            .funnel {
                width: 100%; height: 100%;
                background: linear-gradient(#a5b4fc, #6366f1);
                clip-path: polygon(0 0, 100% 0, 75% 100%, 25% 100%);
            }
            .dark .funnel { background: linear-gradient(#6366f1, #4f46e5); }
            .funnel::before, .funnel::after {
                content: '';
                position: absolute;
                width: 6px; height: 6px;
                border-radius: 50%;
                background: white;
                top: 10px;
                animation: fall 2s infinite linear;
            }
            .funnel::before { left: 30%; animation-delay: 0s; }
            .funnel::after { left: 60%; animation-delay: -1s; }
            @keyframes fall {
                to { transform: translateY(90px); opacity: 0; }
            }
        `}</style>
    </div>
);

export const MarketingFunnelGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [funnel, setFunnel] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openStage, setOpenStage] = useState('Awareness');

    const handleGenerate = () => {
        if (!product.trim() || !audience.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            setFunnel(funnelStages);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a marketing funnel strategy for your business goals.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                 funnel ? (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-2xl font-bold text-center">AIDA Funnel for "{product}"</h2>
                        {Object.entries(funnel).map(([stage, description]) => (
                            <div key={stage} className="border-b dark:border-slate-700">
                                <button onClick={() => setOpenStage(openStage === stage ? '' : stage)} className="w-full flex justify-between items-center py-4">
                                    <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{stage}</span>
                                    <span className={`transform transition-transform ${openStage === stage ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openStage === stage ? 'max-h-96' : 'max-h-0'}`}>
                                    <div className="pb-4">
                                        <p className="text-sm italic text-slate-500 mb-3">{description as string}</p>
                                        <h4 className="font-semibold text-sm mb-2">Example Tactics:</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {mockTactics[stage].map(t => <li key={t}>{t}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="text-center pt-4"><button onClick={() => setFunnel(null)} className="btn-primary">Create Another</button></div>
                    </div>
                 ) : (
                    <div className="space-y-4">
                        <label>Product/Service</label>
                        <input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g., A premium coffee subscription" className="w-full input-style" />
                        <label>Target Audience</label>
                        <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., Remote workers who love specialty coffee" className="w-full input-style" />
                        <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Funnel</button>
                    </div>
                )}
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
