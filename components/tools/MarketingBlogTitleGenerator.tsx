import React, { useState } from 'react';
import { generateMarketingBlogTitles } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="lightbulb-loader mx-auto">
            <div className="lightbulb"></div>
            <div className="spark s1"></div>
            <div className="spark s2"></div>
            <div className="spark s3"></div>
            <div className="spark s4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating title ideas...</p>
        <style>{`
            .lightbulb-loader { position: relative; width: 80px; height: 80px; }
            .lightbulb {
                width: 30px; height: 30px; background: #facc15;
                border-radius: 50%; position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%); animation: light-flicker 2s infinite;
            }
            .lightbulb::after {
                content: ''; position: absolute; bottom: -10px; left: 50%;
                transform: translateX(-50%); width: 15px; height: 10px;
                background: #9ca3af; border-radius: 3px;
            }
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

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const MarketingBlogTitleGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateMarketingBlogTitles(topic);
            setTitles(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate titles.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate catchy and SEO-friendly titles for your blog posts.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <label className="block text-sm font-medium">Blog Topic / Keyword</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleGenerate()}
                            placeholder="e.g., 'email marketing tips'"
                            className="flex-grow w-full input-style"
                        />
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md">
                            {isLoading ? 'Generating...' : 'Generate Titles'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? <div className="m-auto"><Loader /></div> :
                     titles.length > 0 && (
                        <div className="w-full space-y-3 animate-fade-in">
                            {titles.map((t, index) => (
                                <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-800 rounded-lg p-4 border shadow-sm">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t}</p>
                                    <CopyButton textToCopy={t} />
                                </div>
                            ))}
                        </div>
                     )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};