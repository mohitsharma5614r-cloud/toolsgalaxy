import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="chain-loader mx-auto">
            <div className="link"></div>
            <div className="link"></div>
            <div className="link"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing backlinks...</p>
        <style>{`
            .chain-loader {
                width: 100px;
                height: 40px;
                position: relative;
            }
            .link {
                width: 40px;
                height: 40px;
                border: 5px solid #6366f1; /* indigo-500 */
                border-radius: 50%;
                position: absolute;
                top: 0;
            }
            .dark .link {
                border-color: #818cf8; /* indigo-400 */
            }
            .link:nth-child(1) {
                left: 0;
                animation: link-one 2s infinite;
            }
            .link:nth-child(2) {
                left: 50%;
                transform: translateX(-50%);
                z-index: 1;
            }
            .link:nth-child(3) {
                right: 0;
                animation: link-three 2s infinite;
            }
            @keyframes link-one {
                50% { transform: translateX(15px) rotate(15deg); }
            }
            @keyframes link-three {
                50% { transform: translateX(-15px) rotate(-15deg); }
            }
        `}</style>
    </div>
);

interface Result {
    url: string;
    da: number;
    pa: number;
    spam: number;
}

const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

export const BacklinkAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [urls, setUrls] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = () => {
        if (!urls.trim()) return;
        setIsLoading(true);
        setResults([]);
        setTimeout(() => {
            const urlList = urls.trim().split('\n').filter(Boolean);
            const newResults = urlList.map(url => {
                const hash = stringToHash(url);
                return {
                    url,
                    da: 20 + (hash % 70), // DA 20-89
                    pa: 15 + (hash % 65), // PA 15-79
                    spam: 1 + (hash % 10), // Spam Score 1-10
                };
            });
            setResults(newResults);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manually input backlinks to get a simulated quality analysis.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                <textarea
                    value={urls}
                    onChange={e => setUrls(e.target.value)}
                    rows={8}
                    placeholder="Paste one URL per line..."
                    className="w-full input-style font-mono text-sm"
                />
                <button onClick={handleAnalyze} disabled={isLoading} className="w-full btn-primary text-lg mt-4">
                    {isLoading ? 'Analyzing...' : 'Analyze Backlinks'}
                </button>
            </div>

            <div className="mt-8 min-h-[250px] flex flex-col">
                {isLoading ? <div className="m-auto"><Loader /></div> :
                 results.length > 0 ? (
                    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border animate-fade-in overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 dark:bg-slate-700">
                                <tr>
                                    <th className="p-3">URL</th>
                                    <th className="p-3 text-center">DA</th>
                                    <th className="p-3 text-center">PA</th>
                                    <th className="p-3 text-center">Spam Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((res, i) => (
                                    <tr key={i} className="border-b dark:border-slate-700">
                                        <td className="p-3 truncate max-w-xs">{res.url}</td>
                                        <td className="p-3 text-center font-bold">{res.da}</td>
                                        <td className="p-3 text-center font-bold">{res.pa}</td>
                                        <td className={`p-3 text-center font-bold ${res.spam > 7 ? 'text-red-500' : res.spam > 4 ? 'text-yellow-500' : 'text-emerald-500'}`}>{res.spam}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : null}
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};