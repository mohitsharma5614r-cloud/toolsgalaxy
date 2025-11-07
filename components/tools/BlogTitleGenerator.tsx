import React, { useState } from 'react';
import { generateBlogTitles } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Informative', 'Catchy', 'Professional', 'Casual', 'Listicle', 'How-To'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="blog-loader mx-auto">
            <div className="book">
                <div className="page page1"></div>
                <div className="page page2"></div>
                <div className="page page3"></div>
            </div>
            <div className="pen">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Crafting catchy titles...</p>
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
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const BlogTitleGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [keywords, setKeywords] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a blog topic.");
            return;
        }
        setIsLoading(true);
        setTitles([]);
        setError(null);

        try {
            const result = await generateBlogTitles(topic, tone, keywords);
            setTitles(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate blog titles.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Blog Title Generator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create catchy and engaging titles for your blog posts in seconds.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blog Topic</label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Digital Marketing Strategies for 2024"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords (Optional)</label>
                        <input
                            id="keywords"
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g., SEO, social media, content marketing"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title Style</label>
                         <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setTone(t)} 
                                    className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${
                                        tone === t 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Blog Titles'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : titles.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {titles.map((title, index) => (
                                <div key={index} className="flex justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-md">
                                    <div className="flex items-start gap-3 flex-1">
                                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex-1">{title}</p>
                                    </div>
                                    <CopyButton textToCopy={title} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                                <path d="M12 6h4"/>
                                <path d="M12 10h4"/>
                                <path d="M12 14h4"/>
                            </svg>
                            <p className="mt-4 text-lg">Your catchy blog titles will appear here.</p>
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
                
                .blog-loader {
                    position: relative;
                    width: 100px;
                    height: 80px;
                }
                .book {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 60px;
                    height: 50px;
                    perspective: 300px;
                }
                .page {
                    position: absolute;
                    width: 30px;
                    height: 50px;
                    background: linear-gradient(to right, #e2e8f0 0%, #cbd5e1 100%);
                    border: 1px solid #94a3b8;
                    border-radius: 2px;
                    transform-origin: left center;
                }
                .dark .page {
                    background: linear-gradient(to right, #475569 0%, #334155 100%);
                    border-color: #1e293b;
                }
                .page1 {
                    left: 0;
                    animation: flip-page 3s infinite;
                    animation-delay: 0s;
                    z-index: 3;
                }
                .page2 {
                    left: 0;
                    animation: flip-page 3s infinite;
                    animation-delay: 0.5s;
                    z-index: 2;
                }
                .page3 {
                    left: 0;
                    animation: flip-page 3s infinite;
                    animation-delay: 1s;
                    z-index: 1;
                }
                .pen {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    animation: pen-write 3s infinite;
                }
                .pen svg {
                    color: #6366f1;
                    filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.5));
                }
                .dark .pen svg {
                    color: #818cf8;
                }

                @keyframes flip-page {
                    0%, 100% { transform: rotateY(0deg); }
                    50% { transform: rotateY(-180deg); }
                }
                @keyframes pen-write {
                    0%, 100% { transform: translateY(-50%) translateX(0); }
                    50% { transform: translateY(-50%) translateX(-10px) rotate(-15deg); }
                }
            `}</style>
        </>
    );
};
