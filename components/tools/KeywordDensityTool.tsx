import React, { useState } from 'react';
import { Toast } from '../Toast';

interface KeywordData {
    keyword: string;
    count: number;
    density: number;
}

export const KeywordDensityTool: React.FC = () => {
    const [content, setContent] = useState('');
    const [targetKeyword, setTargetKeyword] = useState('');
    const [results, setResults] = useState<{
        totalWords: number;
        uniqueWords: number;
        targetDensity: number;
        topKeywords: KeywordData[];
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyzeKeywordDensity = () => {
        if (!content.trim()) {
            setError("Please enter some content to analyze.");
            return;
        }

        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2); // Ignore words with 2 or fewer characters

        const totalWords = words.length;
        const wordFreq: { [key: string]: number } = {};

        // Count word frequencies
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        const uniqueWords = Object.keys(wordFreq).length;

        // Calculate target keyword density
        let targetDensity = 0;
        if (targetKeyword.trim()) {
            const targetLower = targetKeyword.toLowerCase().trim();
            const targetCount = wordFreq[targetLower] || 0;
            targetDensity = (targetCount / totalWords) * 100;
        }

        // Get top keywords
        const topKeywords: KeywordData[] = Object.entries(wordFreq)
            .map(([keyword, count]) => ({
                keyword,
                count,
                density: (count / totalWords) * 100
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        setResults({
            totalWords,
            uniqueWords,
            targetDensity,
            topKeywords
        });
        setError(null);
    };

    const getDensityColor = (density: number) => {
        if (density > 3) return 'text-red-600 dark:text-red-400';
        if (density >= 1 && density <= 3) return 'text-green-600 dark:text-green-400';
        if (density >= 0.5) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-slate-600 dark:text-slate-400';
    };

    return (
        <>
            <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Keyword Density Tool</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check the keyword density of your content for SEO optimization.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Keyword (Optional)</label>
                        <input
                            type="text"
                            value={targetKeyword}
                            onChange={(e) => setTargetKeyword(e.target.value)}
                            placeholder="e.g., digital marketing"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content to Analyze</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your content here..."
                            rows={10}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                    </div>

                    <button
                        onClick={analyzeKeywordDensity}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        Analyze Keyword Density
                    </button>
                </div>

                {results && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-blue-800">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Total Words</h3>
                                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{results.totalWords}</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-purple-200 dark:border-purple-800">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Unique Words</h3>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{results.uniqueWords}</p>
                            </div>
                            {targetKeyword && (
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-green-200 dark:border-green-800">
                                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Keyword Density</h3>
                                    <p className={`text-3xl font-bold ${getDensityColor(results.targetDensity)}`}>
                                        {results.targetDensity.toFixed(2)}%
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {results.targetDensity >= 1 && results.targetDensity <= 3 ? '✓ Optimal range (1-3%)' : 
                                         results.targetDensity > 3 ? '⚠ Too high (keyword stuffing)' : 
                                         '⚠ Too low (consider using more)'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Top 20 Keywords</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-900">
                                            <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Rank</th>
                                            <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Keyword</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Count</th>
                                            <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Density</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.topKeywords.map((kw, idx) => (
                                            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900/50'} hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors`}>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">{idx + 1}</td>
                                                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                                                    {kw.keyword}
                                                    {targetKeyword && kw.keyword === targetKeyword.toLowerCase() && (
                                                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">Target</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">{kw.count}</td>
                                                <td className={`p-3 text-right font-semibold border-b border-slate-200 dark:border-slate-700 ${getDensityColor(kw.density)}`}>
                                                    {kw.density.toFixed(2)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 SEO Tips:</h4>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Ideal keyword density is between 1-3% for most content</li>
                                <li>• Avoid keyword stuffing (density above 3%)</li>
                                <li>• Use variations and related keywords naturally</li>
                                <li>• Focus on creating valuable content for readers first</li>
                            </ul>
                        </div>
                    </div>
                )}
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
            `}</style>
        </>
    );
};
