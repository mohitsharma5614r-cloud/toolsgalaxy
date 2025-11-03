import React, { useState } from 'react';
import { generateBusinessNames } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Modern', 'Classic', 'Playful', 'Minimalist', 'Techy'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="name-loader">
            <div className="char">B</div>
            <div className="char">U</div>
            <div className="char">S</div>
            <div className="char">I</div>
            <div className="char">N</div>
            <div className="char">E</div>
            <div className="char">S</div>
            <div className="char">S</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Brainstorming names...</p>
        <style>{`
            .name-loader { display: flex; gap: 4px; perspective: 400px; justify-content: center; }
            .name-loader .char { width: 30px; height: 40px; display: flex; justify-content: center; align-items: center; font-size: 20px; font-weight: bold; color: white; background-color: #6366f1; border-radius: 4px; animation: flip-char 2.5s infinite; }
            .dark .name-loader .char { background-color: #818cf8; }
            .name-loader .char:nth-child(1) { animation-delay: 0.1s; }
            .name-loader .char:nth-child(2) { animation-delay: 0.2s; }
            .name-loader .char:nth-child(3) { animation-delay: 0.3s; }
            .name-loader .char:nth-child(4) { animation-delay: 0.4s; }
            .name-loader .char:nth-child(5) { animation-delay: 0.5s; }
            .name-loader .char:nth-child(6) { animation-delay: 0.6s; }
            .name-loader .char:nth-child(7) { animation-delay: 0.7s; }
            .name-loader .char:nth-child(8) { animation-delay: 0.8s; }
            @keyframes flip-char { 0%, 100% { transform: rotateX(0deg); } 50% { transform: rotateX(180deg); background-color: #a5b4fc; } }
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

export const BusinessNameGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [keywords, setKeywords] = useState('');
    const [style, setStyle] = useState(styles[0]);
    const [names, setNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            setError("Please enter some keywords.");
            return;
        }
        setIsLoading(true);
        setNames([]);
        setError(null);

        try {
            const result = await generateBusinessNames(keywords, style);
            setNames(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate names.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find available and memorable names for your company.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Keywords</label>
                        <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., coffee, tech, sustainable" className="input-style w-full"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Style</label>
                        <div className="flex flex-wrap gap-2">
                            {styles.map(s => <button key={s} onClick={() => setStyle(s)} className={`btn-toggle ${style === s ? 'btn-selected' : ''}`}>{s}</button>)}
                        </div>
                    </div>

                    <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg !mt-8">
                        {isLoading ? 'Generating...' : 'Generate Names'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? <div className="m-auto"><Loader /></div> :
                     names.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {names.map((name, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border">
                                    <p className="text-lg font-semibold">{name}</p>
                                    <CopyButton textToCopy={name} />
                                </div>
                            ))}
                        </div>
                     ) : (
                        <div className="m-auto text-center text-slate-500 p-10">
                            <p>Your generated business names will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
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