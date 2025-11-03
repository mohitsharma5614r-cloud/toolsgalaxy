import React, { useState } from 'react';
import { generateMarketResearch, MarketResearch } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="lightbulb-loader mx-auto">
            <div className="lightbulb"></div>
            <div className="spark s1"></div><div className="spark s2"></div>
            <div className="spark s3"></div><div className="spark s4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating market insights...</p>
        <style>{`
            .lightbulb-loader { position: relative; width: 80px; height: 80px; }
            .lightbulb { width: 30px; height: 30px; background: #facc15; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: light-flicker 2s infinite; }
            .lightbulb::after { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 15px; height: 10px; background: #9ca3af; border-radius: 3px; }
            .spark { position: absolute; width: 4px; height: 12px; background: #facc15; border-radius: 2px; opacity: 0; animation: spark-animation 2s infinite; }
            .s1 { top: 10px; left: 50%; animation-delay: 0s; } .s2 { top: 50%; left: 90%; animation-delay: 0.5s; }
            .s3 { bottom: 10px; left: 50%; animation-delay: 1s; } .s4 { top: 50%; right: 90%; animation-delay: 1.5s; }
            @keyframes light-flicker { 0%,100% { box-shadow: 0 0 10px #facc15; } 50% { box-shadow: 0 0 25px #fde047; } }
            @keyframes spark-animation { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
        `}</style>
    </div>
);

export const MarketResearchGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [productIdea, setProductIdea] = useState('');
    const [research, setResearch] = useState<MarketResearch | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!productIdea.trim()) {
            setError("Please enter a product idea.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateMarketResearch(productIdea);
            setResearch(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate research.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get AI-generated insights for your market research.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     research ? (
                        <div className="animate-fade-in space-y-6">
                            <h2 className="text-2xl font-bold text-center">Market Research for "{productIdea}"</h2>
                            <ResearchSection title="🎯 Target Demographics" items={research.targetDemographics} />
                            <ResearchSection title="❓ Survey Questions" items={research.surveyQuestions} />
                            <ResearchSection title="⚔️ Potential Competitors" items={research.competitors} />
                            <div className="text-center">
                                <button onClick={() => setResearch(null)} className="btn-primary">Analyze Another Idea</button>
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Your Product or Business Idea</label>
                            <textarea value={productIdea} onChange={e => setProductIdea(e.target.value)} rows={4} placeholder="e.g., A subscription box for rare houseplants." className="input-style w-full"/>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Research</button>
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

const ResearchSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);