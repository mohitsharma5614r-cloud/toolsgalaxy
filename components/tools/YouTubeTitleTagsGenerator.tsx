import React, { useState } from 'react';
import { generateYouTubeTitlesAndTags, YouTubeTitleTags } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="play-loader mx-auto">
            <div className="play-button"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating titles & tags...</p>
        <style>{`
            .play-loader {
                width: 80px;
                height: 80px;
                position: relative;
                border-radius: 50%;
                border: 4px solid #e2e8f0; /* slate-200 */
                animation: spin-loader 1.5s linear infinite;
                border-top-color: #ef4444; /* red-500 */
            }
            .dark .play-loader {
                border-color: #334155; /* slate-700 */
                border-top-color: #ef4444;
            }
            .play-button {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-40%, -50%);
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 15px 0 15px 26px;
                border-color: transparent transparent transparent #4b5563; /* gray-600 */
            }
            .dark .play-button {
                border-color: transparent transparent transparent #9ca3af; /* gray-400 */
            }
            @keyframes spin-loader {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const YouTubeTitleTagsGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [results, setResults] = useState<YouTubeTitleTags | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please describe your video topic.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateYouTubeTitlesAndTags(topic);
            setResults(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate ideas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate SEO-optimized titles and tags for your YouTube videos.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Video Topic / Description</label>
                        <textarea
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            rows={4}
                            placeholder="e.g., A tutorial on how to make the best homemade pizza from scratch, including the dough."
                            className="input-style w-full"
                        />
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg !mt-6">
                            {isLoading ? 'Generating...' : 'Generate Titles & Tags'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[300px]">
                    {isLoading ? <div className="flex justify-center"><Loader /></div> :
                     results && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                                <h3 className="font-bold text-lg mb-3">Title Suggestions</h3>
                                <div className="space-y-3">
                                    {results.titles.map((t, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">
                                            <p className="text-sm font-semibold pr-2">{t}</p>
                                            <CopyButton textToCopy={t} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                                <h3 className="font-bold text-lg mb-3">Tag Suggestions</h3>
                                <div className="flex flex-wrap gap-2">
                                    {results.tags.map(tag => <span key={tag} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-sm rounded-md">{tag}</span>)}
                                </div>
                                <CopyButton textToCopy={results.tags.join(', ')} />
                            </div>
                        </div>
                     )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #ef4444; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};