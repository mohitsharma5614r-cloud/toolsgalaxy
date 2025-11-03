import React, { useState, useMemo } from 'react';

// Deterministic hash function for consistent results
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="hashtag-loader mx-auto">
            <div className="tag">#</div>
            <div className="tag">#</div>
            <div className="tag">#</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing hashtag data...</p>
        <style>{`
            .hashtag-loader { display: flex; gap: 10px; align-items: center; justify-content: center; }
            .tag { font-size: 40px; font-weight: bold; color: #818cf8; animation: pulse-tag 1.5s infinite ease-in-out; }
            .dark .tag { color: #a5b4fc; }
            .tag:nth-child(2) { animation-delay: 0.2s; }
            .tag:nth-child(3) { animation-delay: 0.4s; }
            @keyframes pulse-tag {
                0%, 100% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.2); opacity: 1; }
            }
        `}</style>
    </div>
);

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const angle = (score / 100) * 180;
    const getStatusColor = (s: number) => {
        if (s < 40) return 'text-red-500';
        if (s < 75) return 'text-yellow-500';
        return 'text-emerald-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0" style={{ background: `conic-gradient(from 180deg at 50% 100%, #ef4444 0 40%, #f59e0b 41% 75%, #10b981 76% 100%)` }}></div>
                <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-1000 ease-out" style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}></div>
            </div>
            <p className={`-mt-8 text-5xl font-extrabold ${getStatusColor(score)}`}>{Math.round(score)}</p>
        </div>
    );
};

export const HashtagRankAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [hashtag, setHashtag] = useState('');
    const [result, setResult] = useState<{ score: number; engagement: string; related: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = () => {
        if (!hashtag.trim()) return;
        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const cleanTag = hashtag.replace(/#/g, '').trim();
            const hash = stringToHash(cleanTag);
            const score = 30 + (hash % 70); // 30-99
            const engagement = (1 + (hash % 40) / 10).toFixed(1); // 1.0 - 5.0
            const related = [`#${cleanTag}love`, `#${cleanTag}life`, `#insta${cleanTag}`];

            setResult({ score, engagement, related });
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Analyze the (simulated) popularity and ranking of hashtags.</p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input value={hashtag} onChange={e => setHashtag(e.target.value)} placeholder="Enter a hashtag, e.g., #travel" className="flex-grow w-full input-style" />
                    <button onClick={handleAnalyze} disabled={isLoading} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md">
                        {isLoading ? 'Analyzing...' : 'Analyze Hashtag'}
                    </button>
                </div>
            </div>

            <div className="mt-8 min-h-[300px]">
                {isLoading ? <div className="flex justify-center"><Loader /></div> :
                 result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border text-center">
                            <h3 className="font-bold text-slate-500">Popularity Score</h3>
                            <ScoreGauge score={result.score} />
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                            <div>
                                <h4 className="font-bold">Est. Engagement Rate</h4>
                                <p className="text-3xl font-bold text-indigo-500">{result.engagement}%</p>
                            </div>
                             <div>
                                <h4 className="font-bold">Related Hashtags</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {result.related.map(tag => <span key={tag} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-sm rounded-full">{tag}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                 )}
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};