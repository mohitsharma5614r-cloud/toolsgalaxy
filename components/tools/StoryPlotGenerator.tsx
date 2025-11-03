
import React, { useState } from 'react';
import { generateStoryPlot, StoryPlot } from '../../services/geminiService';
import { Toast } from '../Toast';

const genres = ['Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Adventure'];

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Writing your plot...</p>
        <style>{`
            .dark .quill-body { fill: #cbd5e1; }
            .dark .quill-nib { fill: #0f172a; }
            .dark .scroll-line { stroke: #818cf8; }

            .scroll-line {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-scroll 1.5s 0.5s forwards;
            }

            .quill-body, .quill-nib {
                animation: move-quill 2s forwards;
            }

            @keyframes draw-scroll {
                to { stroke-dashoffset: 0; }
            }

            @keyframes move-quill {
                0% { transform: translate(-20px, 20px) rotate(15deg); }
                25% { transform: translate(0, 0) rotate(15deg); }
                100% { transform: translate(80px, 0) rotate(15deg); }
            }
        `}</style>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md"
        >
            {copied ? 'Copied!' : 'Copy Plot'}
        </button>
    );
};

export const StoryPlotGenerator: React.FC = () => {
    const [genre, setGenre] = useState(genres[0]);
    const [plot, setPlot] = useState<StoryPlot | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setPlot(null);
        setError(null);

        try {
            const result = await generateStoryPlot(genre);
            setPlot(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate a story plot.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatForCopy = (): string => {
        if (!plot) return '';
        return `Title: ${plot.title}\n\nProtagonist: ${plot.protagonist}\n\nSetting: ${plot.setting}\n\nConflict: ${plot.conflict}\n\nResolution: ${plot.resolution}`;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Story Plot Generator 📜</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get inspiration with random story plots to kickstart your next masterpiece.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Choose a Genre</label>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(g => (
                                <button key={g} onClick={() => setGenre(g)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${genre === g ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{g}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        {isLoading ? 'Generating...' : 'Generate Plot'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : plot ? (
                        <div className="w-full animate-fade-in space-y-4">
                            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">{plot.title}</h2>
                            <div className="space-y-3 text-left">
                                <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">Protagonist:</strong> {plot.protagonist}</p>
                                <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">Setting:</strong> {plot.setting}</p>
                                <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">Conflict:</strong> {plot.conflict}</p>
                                <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">Resolution:</strong> {plot.resolution}</p>
                            </div>
                            <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={formatForCopy()} />
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your story plot will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
