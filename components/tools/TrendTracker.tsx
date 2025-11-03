import React, { useState, useEffect, useCallback } from 'react';
import { generateTrends } from '../../services/geminiService';
import { Toast } from '../Toast';

// Loader component with a rising graph animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="trend-loader mx-auto">
            <svg viewBox="0 0 100 50">
                <path className="grid-line" d="M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100" />
                <path className="trend-line" d="M0 40 C 20 40, 20 10, 40 10 S 60 40, 80 40 S 100 20, 100 20" />
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Fetching latest trends...</p>
    </div>
);

// Trend data interface with fake volume
interface Trend {
    topic: string;
    volume: string; // e.g., "1.2M Posts"
}

export const TrendTracker: React.FC = () => {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrends = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const trendTopics = await generateTrends();
            // Add fake random volume data for display
            const trendsWithVolume = trendTopics.map(topic => ({
                topic,
                volume: `${(Math.random() * 2 + 0.1).toFixed(1)}${Math.random() > 0.5 ? 'M' : 'K'} Posts`
            }));
            setTrends(trendsWithVolume);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch trends.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Fetch on initial load
    useEffect(() => {
        fetchTrends();
    }, [fetchTrends]);

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Trend Tracker 📈</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Discover the top 10 daily trends powered by AI.</p>
                </div>

                <div className="min-h-[400px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : trends.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            <ol>
                                {trends.map((trend, index) => (
                                    <li key={index} className="flex items-center gap-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                        <span className="text-2xl font-bold text-indigo-500 dark:text-indigo-400 w-8 text-center">#{index + 1}</span>
                                        <div className="flex-grow">
                                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{trend.topic}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{trend.volume}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                             <div className="text-center pt-6">
                                <button
                                    onClick={fetchTrends}
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                                >
                                    Refresh Trends
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <p className="mt-4 text-lg">Click "Refresh Trends" to see what's happening.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                
                .trend-loader {
                    width: 100px;
                    height: 50px;
                }
                .trend-loader svg {
                    width: 100%;
                    height: 100%;
                }
                .grid-line {
                    stroke: #e2e8f0; /* slate-200 */
                    stroke-width: 1;
                }
                .dark .grid-line {
                    stroke: #334155; /* slate-700 */
                }
                .trend-line {
                    fill: none;
                    stroke: #6366f1; /* indigo-500 */
                    stroke-width: 3;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: draw-trend 2s infinite ease-in-out;
                }
                .dark .trend-line {
                    stroke: #818cf8; /* indigo-400 */
                }

                @keyframes draw-trend {
                    0% {
                        stroke-dashoffset: 200;
                    }
                    50% {
                        stroke-dashoffset: 0;
                    }
                    100% {
                        stroke-dashoffset: -200;
                    }
                }
            `}</style>
        </>
    );
};
