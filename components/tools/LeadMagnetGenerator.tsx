import React, { useState } from 'react';
import { generateLeadMagnetIdeas, LeadMagnetIdea } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="magnet-loader mx-auto">
            <div className="magnet-body">
                <div className="pole pole-n"></div>
                <div className="pole pole-s"></div>
            </div>
            <div className="lead lead1">👤</div>
            <div className="lead lead2">👤</div>
            <div className="lead lead3">👤</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Attracting great ideas...</p>
        <style>{`
            .magnet-loader { width: 100px; height: 100px; position: relative; }
            .magnet-body {
                width: 80px; height: 70px;
                position: absolute; bottom: 0; left: 10px;
                border: 10px solid #ef4444; /* red-500 */
                border-top: none;
                border-radius: 0 0 40px 40px;
            }
            .pole {
                position: absolute; bottom: -10px; width: 30px; height: 10px;
            }
            .pole-n { left: 0; background: #60a5fa; }
            .pole-s { right: 0; background: #9ca3af; }
            .lead {
                position: absolute;
                font-size: 20px;
                opacity: 0;
                animation: attract 2.5s infinite;
            }
            .lead1 { top: 0; left: 0; animation-delay: 0s; }
            .lead2 { top: 20px; left: 80%; animation-delay: 0.5s; }
            .lead3 { top: -10px; left: 40%; animation-delay: 1s; }
            @keyframes attract {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                80% { transform: translateY(80px) scale(0.5); opacity: 1; }
                100% { transform: translateY(90px) scale(0); opacity: 0; }
            }
        `}</style>
    </div>
);

export const LeadMagnetGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [audience, setAudience] = useState('');
    const [ideas, setIdeas] = useState<LeadMagnetIdea[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim() || !audience.trim()) {
            setError("Please fill in both topic and audience.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateLeadMagnetIdeas(topic, audience);
            setIdeas(result);
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
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get ideas and outlines for compelling lead magnets to grow your audience.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     ideas ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-center">Lead Magnet Ideas for "{topic}"</h2>
                            {ideas.map((idea, index) => (
                                <div key={index} className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                    <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{idea.type}: {idea.title}</h3>
                                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                        {idea.outline.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                            <div className="text-center pt-4"><button onClick={() => setIdeas(null)} className="btn-primary">Generate New Ideas</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Your Topic (e.g., 'Learn Guitar')" className="input-style w-full"/>
                            <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Target Audience (e.g., 'Absolute beginners')" className="input-style w-full"/>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate Ideas</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
