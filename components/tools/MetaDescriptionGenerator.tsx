import React, { useState } from 'react';
import { generateMetaDescriptions } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="writing-loader mx-auto">
            <div className="text-line"></div>
            <div className="cursor"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Writing meta descriptions...</p>
        <style>{`
            .writing-loader { width: 120px; height: 60px; border: 2px solid #cbd5e1; dark:border-slate-700; border-radius: 8px; padding: 10px; position: relative; }
            .text-line { width: 0%; height: 8px; background: #6366f1; border-radius: 4px; animation: write-line 2.5s infinite; }
            .cursor { width: 4px; height: 12px; background: #6366f1; position: absolute; top: 8px; left: 10px; animation: blink 0.8s infinite, move-cursor 2.5s infinite; }
            .dark .text-line, .dark .cursor { background: #818cf8; }
            @keyframes write-line { 0% { width: 0; } 80%, 100% { width: 80%; } }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes move-cursor { 0% { left: 10px; } 80%, 100% { left: calc(10px + 80%); } }
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

export const MetaDescriptionGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [keyword, setKeyword] = useState('');
    const [descriptions, setDescriptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim() || !keyword.trim()) {
            setError("Please provide both a topic and a keyword.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateMetaDescriptions(topic, keyword);
            setDescriptions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate descriptions.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create SEO-friendly meta descriptions for your web pages.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Page Topic (e.g., 'How to Bake a Cake')" className="input-style w-full"/>
                        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Primary Keyword (e.g., 'baking a cake')" className="input-style w-full"/>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg !mt-6">
                        {isLoading ? 'Generating...' : 'Generate Descriptions'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? <div className="m-auto"><Loader /></div> :
                     descriptions.length > 0 && (
                        <div className="w-full space-y-3 animate-fade-in">
                            {descriptions.map((desc, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-slate-700 dark:text-slate-300 pr-4">{desc}</p>
                                        <CopyButton textToCopy={desc} />
                                    </div>
                                    <p className={`text-xs mt-2 font-bold ${desc.length > 160 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {desc.length} / 160 characters
                                    </p>
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
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};