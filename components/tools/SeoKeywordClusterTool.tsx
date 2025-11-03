import React, { useState } from 'react';
import { Toast } from '../Toast';

// FIX: Component was not exported, causing an error in App.tsx. Added 'export' and implemented component with mock data.

interface KeywordCluster {
    theme: string;
    keywords: string[];
}

// Mock data for keyword clusters
const mockClusters: KeywordCluster[] = [
    {
        theme: 'Beginner Guitar Chords',
        keywords: ['easy guitar chords', 'basic guitar chords for beginners', 'how to play G C D', 'first guitar chords'],
    },
    {
        theme: 'Guitar Learning Path',
        keywords: ['how to learn guitar', 'beginner guitar lessons', 'guitar learning roadmap', 'self-taught guitar'],
    },
    {
        theme: 'Guitar Equipment for Beginners',
        keywords: ['best beginner acoustic guitar', 'what guitar to buy first', 'guitar starter pack'],
    }
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="cluster-loader mx-auto">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Clustering keywords...</p>
        <style>{`
            .cluster-loader {
                display: flex;
                gap: 10px;
            }
            .dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #6366f1;
                animation: pulse-dot 1.5s infinite ease-in-out;
            }
            .dark .dot { background-color: #818cf8; }
            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes pulse-dot {
                0%, 100% { transform: scale(0.8); opacity: 0.7; }
                50% { transform: scale(1.2); opacity: 1; }
            }
        `}</style>
    </div>
);

export const SeoKeywordClusterTool: React.FC<{ title: string }> = ({ title }) => {
    const [keywords, setKeywords] = useState('');
    const [clusters, setClusters] = useState<KeywordCluster[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!keywords.trim()) {
            setError("Please enter some keywords to cluster.");
            return;
        }
        setIsLoading(true);
        setClusters(null);
        setError(null);

        // Simulate API call with mock data
        setTimeout(() => {
            // This logic is a simple mock and doesn't use the input keywords
            setClusters(mockClusters);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Group related keywords into clusters for your content strategy.</p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keywords (one per line or comma-separated)</label>
                    <textarea
                        value={keywords}
                        onChange={e => setKeywords(e.target.value)}
                        rows={8}
                        placeholder="e.g., best running shoes, marathon training shoes, running shoes for flat feet..."
                        className="w-full input-style"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg">
                        {isLoading ? 'Clustering...' : 'Generate Clusters'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px]">
                    {isLoading ? <Loader /> : clusters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {clusters.map((cluster, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400">{cluster.theme}</h3>
                                    <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                                        {cluster.keywords.map((kw, i) => <li key={i}>{kw}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </>
    );
};
