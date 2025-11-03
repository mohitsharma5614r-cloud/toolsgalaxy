import React, { useState } from 'react';
import { generateHashtags, HashtagResult } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="hashtag-loader mx-auto">
            <div className="tag">#</div>
            <div className="tag">#</div>
            <div className="tag">#</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding the best tags...</p>
    </div>
);

const CopyButton = ({ textToCopy, label = 'Copy' }: { textToCopy: string, label?: string }) => {
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
            {copied ? 'Copied!' : label}
        </button>
    );
};


export const InstaHashtagFinder: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [hashtags, setHashtags] = useState<HashtagResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your post.");
            return;
        }
        setIsLoading(true);
        setHashtags(null);
        setError(null);
        try {
            const result = await generateHashtags(topic);
            setHashtags(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate hashtags.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatHashtagsForCopy = (tags: string[]): string => {
        return tags.map(t => `#${t}`).join(' ');
    };
    
    const allHashtags = hashtags ? [...hashtags.popular, ...hashtags.niche, ...hashtags.related] : [];

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Insta Hashtag Finder #️⃣</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Boost your post's reach with AI-generated hashtags.</p>
                </div>
                
                 <div className="space-y-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What is your post about?</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                            placeholder="e.g., Sunset photography, healthy breakfast"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                          {isLoading ? 'Finding...' : 'Find Hashtags'}
                        </button>
                    </div>
                </div>

                 <div className="mt-8 min-h-[300px] flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : hashtags ? (
                         <div className="w-full animate-fade-in space-y-6">
                             <div className="text-right">
                                 <CopyButton textToCopy={formatHashtagsForCopy(allHashtags)} label="Copy All" />
                             </div>
                             <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300">🔥 Popular</h3>
                                        <CopyButton textToCopy={formatHashtagsForCopy(hashtags.popular)} />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {hashtags.popular.map(tag => <span key={tag} className="tag-style bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200">#{tag}</span>)}
                                    </div>
                                </div>
                                 <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300">🎯 Niche</h3>
                                        <CopyButton textToCopy={formatHashtagsForCopy(hashtags.niche)} />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {hashtags.niche.map(tag => <span key={tag} className="tag-style bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">#{tag}</span>)}
                                    </div>
                                </div>
                                 <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300">🤝 Related</h3>
                                        <CopyButton textToCopy={formatHashtagsForCopy(hashtags.related)} />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {hashtags.related.map(tag => <span key={tag} className="tag-style bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">#{tag}</span>)}
                                    </div>
                                </div>
                             </div>
                         </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
                            <p className="mt-4 text-lg">Your hashtags will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .tag-style {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .hashtag-loader {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    justify-content: center;
                }
                .tag {
                    font-size: 40px;
                    font-weight: bold;
                    color: #818cf8; /* indigo-400 */
                    animation: pulse-tag 1.5s infinite ease-in-out;
                }
                .dark .tag { color: #a5b4fc; /* indigo-300 */ }

                .tag:nth-child(2) { animation-delay: 0.2s; }
                .tag:nth-child(3) { animation-delay: 0.4s; }

                @keyframes pulse-tag {
                    0%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
};
