
import React, { useState } from 'react';
import { generateYouTubeVideoIdeas } from '../../services/geminiService';
import { Toast } from '../Toast';

// Loader component with a YouTube-style buffering animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="play-loader mx-auto">
            <div className="play-button"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating viral ideas...</p>
    </div>
);

// Copy button component
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

// Main Component
export const YouTubeVideoIdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your channel.");
            return;
        }
        setIsLoading(true);
        setIdeas([]);
        setError(null);

        try {
            const result = await generateYouTubeVideoIdeas(topic);
            setIdeas(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate video ideas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">YouTube Video Idea Generator ▶️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate topics for your next YouTube video.</p>
                </div>
                
                <div className="space-y-4">
                    <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your channel topic or niche</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                            placeholder="e.g., historical deep dives, DIY crafting"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400"
                        >
                          {isLoading ? 'Generating...' : 'Generate Ideas'}
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : ideas.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {ideas.map((idea, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{idea}</p>
                                    <CopyButton textToCopy={idea} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <p className="mt-4 text-lg">Your next viral video ideas will appear here.</p>
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
        </>
    );
};
