import React, { useState } from 'react';
import { generateAdCreativeIdeas, AdCreativeIdea } from '../../services/geminiService';
import { Toast } from '../Toast';

const platforms = ['Instagram', 'Facebook', 'TikTok', 'X (Twitter)'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="lightbulb-loader mx-auto">
            <div className="lightbulb"></div>
            <div className="spark s1"></div>
            <div className="spark s2"></div>
            <div className="spark s3"></div>
            <div className="spark s4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating ad ideas...</p>
        <style>{`
            .lightbulb-loader { position: relative; width: 80px; height: 80px; }
            .lightbulb { width: 30px; height: 30px; background: #facc15; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: light-flicker 2s infinite; }
            .lightbulb::after { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 15px; height: 10px; background: #9ca3af; border-radius: 3px; }
            .spark { position: absolute; width: 4px; height: 12px; background: #facc15; border-radius: 2px; opacity: 0; animation: spark-animation 2s infinite; }
            .s1 { top: 10px; left: 50%; animation-delay: 0s; }
            .s2 { top: 50%; left: 90%; animation-delay: 0.5s; }
            .s3 { bottom: 10px; left: 50%; animation-delay: 1s; }
            .s4 { top: 50%; right: 90%; animation-delay: 1.5s; }
            @keyframes light-flicker { 0%,100% { box-shadow: 0 0 10px #facc15; } 50% { box-shadow: 0 0 25px #fde047; } }
            @keyframes spark-animation { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
        `}</style>
    </div>
);

export const AiAdCreativePlanner: React.FC<{ title: string }> = ({ title }) => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [platform, setPlatform] = useState(platforms[0]);
    const [ideas, setIdeas] = useState<AdCreativeIdea[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openIdea, setOpenIdea] = useState(0);

    const handleGenerate = async () => {
        if (!product.trim() || !audience.trim()) {
            setError("Please fill out both product and audience fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateAdCreativeIdeas(product, audience, platform);
            setIdeas(result);
            setOpenIdea(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate ideas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get AI-powered ideas for your ad creatives.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     ideas ? (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="text-2xl font-bold text-center">Your Ad Creative Ideas</h2>
                             {ideas.map((idea, index) => (
                                <div key={index} className="border-b dark:border-slate-700">
                                    <button onClick={() => setOpenIdea(openIdea === index ? -1 : index)} className="w-full flex justify-between items-center py-3 text-left">
                                        <span className="font-semibold text-lg">Idea {index + 1}: {idea.concept}</span>
                                        <span className={`transform transition-transform ${openIdea === index ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                     <div className={`overflow-hidden transition-all duration-300 ${openIdea === index ? 'max-h-[500px]' : 'max-h-0'}`}>
                                        <div className="pb-4 space-y-3">
                                            <p><strong className="text-indigo-500">Visual:</strong> {idea.visual}</p>
                                            <p><strong className="text-indigo-500">Copy:</strong> "{idea.copy}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="text-center pt-4"><button onClick={() => setIdeas(null)} className="btn-primary">Generate New Ideas</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <input value={product} onChange={e => setProduct(e.target.value)} placeholder="Product/Service" className="input-style w-full"/>
                            <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Target Audience" className="input-style w-full"/>
                            <div>
                                <label className="label-style">Platform</label>
                                <div className="flex flex-wrap gap-2">
                                    {platforms.map(p => <button key={p} onClick={() => setPlatform(p)} className={`btn-toggle ${platform === p ? 'btn-selected' : ''}`}>{p}</button>)}
                                </div>
                            </div>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Ideas</button>
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
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};