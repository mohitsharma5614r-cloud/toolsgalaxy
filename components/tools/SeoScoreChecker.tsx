import React, { useState } from 'react';
import { Toast } from '../Toast';

export const SeoScoreChecker: React.FC = () => {
    const [url, setUrl] = useState('');
    const [keyword, setKeyword] = useState('');
    const [content, setContent] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [score, setScore] = useState<number | null>(null);
    const [analysis, setAnalysis] = useState<{category: string; score: number; feedback: string}[]>([]);
    const [error, setError] = useState<string | null>(null);

    const analyzeSEO = () => {
        if (!content.trim() && !metaTitle.trim()) {
            setError("Please provide at least content or meta title to analyze.");
            return;
        }

        const results: {category: string; score: number; feedback: string}[] = [];
        let totalScore = 0;

        // Title Analysis
        const titleScore = analyzeTitle(metaTitle, keyword);
        results.push(titleScore);
        totalScore += titleScore.score;

        // Meta Description Analysis
        const descScore = analyzeMetaDescription(metaDescription, keyword);
        results.push(descScore);
        totalScore += descScore.score;

        // Content Analysis
        const contentScore = analyzeContent(content, keyword);
        results.push(contentScore);
        totalScore += contentScore.score;

        // Keyword Usage
        const keywordScore = analyzeKeywordUsage(content, metaTitle, metaDescription, keyword);
        results.push(keywordScore);
        totalScore += keywordScore.score;

        // URL Analysis
        const urlScore = analyzeURL(url, keyword);
        results.push(urlScore);
        totalScore += urlScore.score;

        const finalScore = Math.round(totalScore / 5);
        setScore(finalScore);
        setAnalysis(results);
        setError(null);
    };

    const analyzeTitle = (title: string, kw: string): {category: string; score: number; feedback: string} => {
        let score = 0;
        let feedback = '';

        if (!title) {
            feedback = 'No meta title provided. Add a title tag (50-60 characters).';
        } else if (title.length < 30) {
            score = 40;
            feedback = `Title is too short (${title.length} chars). Aim for 50-60 characters.`;
        } else if (title.length > 60) {
            score = 60;
            feedback = `Title is too long (${title.length} chars). Keep it under 60 characters.`;
        } else {
            score = 90;
            feedback = `Title length is optimal (${title.length} chars).`;
        }

        if (kw && title.toLowerCase().includes(kw.toLowerCase())) {
            score = Math.min(100, score + 10);
            feedback += ' Keyword found in title! ✓';
        } else if (kw) {
            feedback += ' Consider adding your keyword to the title.';
        }

        return { category: 'Meta Title', score, feedback };
    };

    const analyzeMetaDescription = (desc: string, kw: string): {category: string; score: number; feedback: string} => {
        let score = 0;
        let feedback = '';

        if (!desc) {
            feedback = 'No meta description provided. Add one (150-160 characters).';
        } else if (desc.length < 120) {
            score = 50;
            feedback = `Description is short (${desc.length} chars). Aim for 150-160 characters.`;
        } else if (desc.length > 160) {
            score = 70;
            feedback = `Description is too long (${desc.length} chars). Keep it under 160 characters.`;
        } else {
            score = 95;
            feedback = `Description length is great (${desc.length} chars).`;
        }

        if (kw && desc.toLowerCase().includes(kw.toLowerCase())) {
            score = Math.min(100, score + 5);
            feedback += ' Keyword found! ✓';
        }

        return { category: 'Meta Description', score, feedback };
    };

    const analyzeContent = (text: string, kw: string): {category: string; score: number; feedback: string} => {
        let score = 0;
        let feedback = '';
        const wordCount = text.trim().split(/\s+/).length;

        if (!text) {
            feedback = 'No content provided for analysis.';
        } else if (wordCount < 300) {
            score = 40;
            feedback = `Content is thin (${wordCount} words). Aim for at least 300-500 words.`;
        } else if (wordCount < 500) {
            score = 70;
            feedback = `Good content length (${wordCount} words). Consider expanding to 500+ words.`;
        } else {
            score = 95;
            feedback = `Excellent content length (${wordCount} words)! ✓`;
        }

        return { category: 'Content Length', score, feedback };
    };

    const analyzeKeywordUsage = (text: string, title: string, desc: string, kw: string): {category: string; score: number; feedback: string} => {
        if (!kw) {
            return { category: 'Keyword Usage', score: 50, feedback: 'No keyword provided for analysis.' };
        }

        const combined = `${title} ${desc} ${text}`.toLowerCase();
        const kwLower = kw.toLowerCase();
        const matches = (combined.match(new RegExp(kwLower, 'g')) || []).length;
        const wordCount = text.trim().split(/\s+/).length;
        const density = wordCount > 0 ? (matches / wordCount) * 100 : 0;

        let score = 0;
        let feedback = '';

        if (matches === 0) {
            feedback = 'Keyword not found in content. Add it naturally.';
        } else if (density < 0.5) {
            score = 50;
            feedback = `Keyword appears ${matches} time(s). Consider using it more (density: ${density.toFixed(2)}%).`;
        } else if (density > 3) {
            score = 60;
            feedback = `Keyword density is high (${density.toFixed(2)}%). Avoid keyword stuffing.`;
        } else {
            score = 100;
            feedback = `Great keyword usage! Appears ${matches} time(s) (density: ${density.toFixed(2)}%). ✓`;
        }

        return { category: 'Keyword Usage', score, feedback };
    };

    const analyzeURL = (urlStr: string, kw: string): {category: string; score: number; feedback: string} => {
        let score = 0;
        let feedback = '';

        if (!urlStr) {
            feedback = 'No URL provided.';
            score = 50;
        } else {
            const isShort = urlStr.length < 100;
            const hasKeyword = kw && urlStr.toLowerCase().includes(kw.toLowerCase().replace(/\s+/g, '-'));
            const hasHyphens = urlStr.includes('-');

            if (isShort && hasKeyword && hasHyphens) {
                score = 100;
                feedback = 'URL is SEO-friendly! Short, contains keyword, and uses hyphens. ✓';
            } else if (isShort && hasKeyword) {
                score = 90;
                feedback = 'URL is good! Contains keyword and is short.';
            } else if (isShort) {
                score = 70;
                feedback = 'URL is short but could include the keyword.';
            } else {
                score = 50;
                feedback = 'URL is long. Keep it short and descriptive.';
            }
        }

        return { category: 'URL Structure', score, feedback };
    };

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-600 dark:text-green-400';
        if (s >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreLabel = (s: number) => {
        if (s >= 80) return 'Excellent';
        if (s >= 60) return 'Good';
        if (s >= 40) return 'Needs Work';
        return 'Poor';
    };

    return (
        <>
            <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">SEO Score Checker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Analyze your on-page SEO and get actionable feedback.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Keyword</label>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g., digital marketing tips"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page URL (Optional)</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/blog/post-title"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Your page title (50-60 characters)"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{metaTitle.length} / 60 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                        <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder="Your meta description (150-160 characters)"
                            rows={2}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{metaDescription.length} / 160 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your page content here..."
                            rows={6}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{content.trim().split(/\s+/).filter(w => w).length} words</p>
                    </div>

                    <button
                        onClick={analyzeSEO}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        Analyze SEO Score
                    </button>
                </div>

                {score !== null && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                        <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Overall SEO Score</h2>
                            <div className={`text-7xl font-extrabold ${getScoreColor(score)}`}>{score}/100</div>
                            <p className="text-xl font-semibold mt-2 text-slate-600 dark:text-slate-300">{getScoreLabel(score)}</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Detailed Analysis</h3>
                            {analysis.map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.category}</h4>
                                        <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">{item.feedback}</p>
                                </div>
                            ))}
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
