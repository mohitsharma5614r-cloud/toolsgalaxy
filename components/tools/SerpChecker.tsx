import React, { useState } from 'react';
import { generateSerpResults, SerpResult } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="serp-loader mx-auto">
            <div className="magnifying-glass"></div>
            <div className="text-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Checking search results...</p>
        <style>{`
            .serp-loader { width: 100px; height: 100px; position: relative; }
            .magnifying-glass {
                width: 50px;
                height: 50px;
                border: 6px solid #6366f1;
                border-radius: 50%;
                position: absolute;
                top: 0; left: 0;
                animation: scan 2.5s infinite ease-in-out;
            }
            .dark .magnifying-glass { border-color: #818cf8; }
            .magnifying-glass::after {
                content: '';
                position: absolute;
                width: 8px;
                height: 25px;
                background-color: #6366f1;
                bottom: -20px;
                right: -10px;
                transform: rotate(-45deg);
            }
            .dark .magnifying-glass::after { background-color: #818cf8; }
            .text-line {
                position: absolute;
                width: 80%;
                height: 6px;
                background-color: #cbd5e1;
                border-radius: 3px;
                bottom: 10px;
                left: 10%;
            }
            .dark .text-line { background-color: #475569; }
            @keyframes scan {
                0%, 100% { transform: translate(0, 0) rotate(0); }
                25% { transform: translate(40px, 0) rotate(20deg); }
                50% { transform: translate(50px, 40px) rotate(-10deg); }
                75% { transform: translate(10px, 50px) rotate(30deg); }
            }
        `}</style>
    </div>
);

export const SerpChecker: React.FC<{ title: string }> = ({ title }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<SerpResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!keyword.trim()) {
            setError("Please enter a keyword.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const serpResults = await generateSerpResults(keyword);
            setResults(serpResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch SERP results.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check the (simulated) search engine results for a keyword.</p>
                </div>
                
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <label className="block text-sm font-medium">Enter Keyword</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleCheck()}
                            placeholder="e.g., best travel destinations"
                            className="flex-grow w-full input-style"
                        />
                        <button onClick={handleCheck} disabled={isLoading} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md">
                            {isLoading ? 'Checking...' : 'Check SERP'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[400px]">
                    {isLoading ? <div className="flex items-center justify-center pt-10"><Loader /></div> :
                     results.length > 0 ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-semibold">Top 10 Fictional Results for "{keyword}"</h2>
                            {results.map((res, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow border">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{res.url}</p>
                                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{res.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{res.snippet}</p>
                                </div>
                            ))}
                        </div>
                     ) : null}
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