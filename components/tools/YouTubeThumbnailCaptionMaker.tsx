import React, { useState } from 'react';
import { generateThumbnailCaptions } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Bold & Shocking', 'Question-Based', 'Intriguing', 'Listicle / "Top X"'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="play-loader mx-auto">
            <div className="play-button"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating viral ideas...</p>
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

export const YouTubeThumbnailCaptionMaker: React.FC = () => {
    const [videoTitle, setVideoTitle] = useState('');
    const [style, setStyle] = useState(styles[0]);
    const [captions, setCaptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!videoTitle.trim()) {
            setError("Please enter a video title.");
            return;
        }
        setIsLoading(true);
        setCaptions([]);
        setError(null);

        try {
            const result = await generateThumbnailCaptions(videoTitle, style);
            setCaptions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate captions.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">YouTube Thumbnail Caption Maker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create catchy text for your thumbnails to get more clicks.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="videoTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Title</label>
                        <input
                            id="videoTitle"
                            type="text"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="e.g., I Tried to Survive 100 Days in Minecraft"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Caption Style</label>
                         <div className="flex flex-wrap gap-2">
                            {styles.map(s => (
                                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${style === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !videoTitle.trim()}
                        className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Generating...' : 'Generate Captions'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : captions.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {captions.map((caption, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{caption}</p>
                                    <CopyButton textToCopy={caption} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                            <p className="mt-4 text-lg">Your catchy caption ideas will appear here.</p>
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