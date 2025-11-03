import React, { useState } from 'react';
import { generateReelHooks } from '../../services/geminiService';
import { Toast } from '../Toast';

// Styles for the hook lines
const styles = ['Controversial 😮', 'Question-Based 🤔', 'Problem/Solution ✅', 'Story Time 📖'];

// Loader component with the custom animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="scroll-stopper-loader mx-auto">
            <div className="phone-frame">
                <div className="screen">
                    <div className="post p1"></div>
                    <div className="post p2"></div>
                    <div className="post p3"></div>
                </div>
            </div>
            <div className="finger">👆</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Creating scroll-stopping hooks...</p>
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

// Main component
export const ReelHookLineCreator: React.FC = () => {
    const [videoTopic, setVideoTopic] = useState('');
    const [style, setStyle] = useState(styles[0]);
    const [hooks, setHooks] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!videoTopic.trim()) {
            setError("Please describe what your video is about.");
            return;
        }
        setIsLoading(true);
        setHooks([]);
        setError(null);

        try {
            // Remove the emoji from the style string before sending to API
            const styleWithoutEmoji = style.split(' ')[0];
            const result = await generateReelHooks(videoTopic, styleWithoutEmoji);
            setHooks(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate hooks.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Reel Hook Line Creator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate attention-grabbing first lines for your Reels & TikToks.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="videoTopic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What is your video about?</label>
                        <input
                            id="videoTopic"
                            type="text"
                            value={videoTopic}
                            onChange={(e) => setVideoTopic(e.target.value)}
                            placeholder="e.g., a simple recipe, a travel tip, a funny sketch"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hook Style</label>
                         <div className="flex flex-wrap gap-2">
                            {styles.map(s => (
                                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${style === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !videoTopic.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Generating...' : 'Generate Hooks'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : hooks.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {hooks.map((hook, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 pr-4">{hook}</p>
                                    <CopyButton textToCopy={hook} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M18 8.18a4 4 0 0 0-4.5-4.14 4 4 0 1 0-4 7.91 4 4 0 0 0 4.5 4.14 4 4 0 1 0 4-7.91zM12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 12h2M20 12h2"/></svg>
                            <p className="mt-4 text-lg">Your scroll-stopping hooks will appear here.</p>
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
                
                .scroll-stopper-loader {
                    width: 80px;
                    height: 140px;
                    position: relative;
                }
                .phone-frame {
                    width: 100%;
                    height: 100%;
                    background: #1e293b; /* slate-800 */
                    border-radius: 12px;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .dark .phone-frame { background: #e2e8f0; }
                .screen {
                    width: 100%;
                    height: 100%;
                    background: #f1f5f9; /* slate-100 */
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                }
                .dark .screen { background: #0f172a; }
                .post {
                    position: absolute;
                    left: 10%;
                    width: 80%;
                    height: 50px;
                    background-color: #cbd5e1; /* slate-300 */
                    border-radius: 4px;
                    animation: scroll-posts 2.5s infinite linear;
                }
                .dark .post { background-color: #334155; }
                .post.p1 { top: 10px; animation-delay: 0s; }
                .post.p2 { top: 75px; animation-delay: 0s; }
                .post.p3 { top: 140px; animation-delay: 0s; }

                .finger {
                    position: absolute;
                    font-size: 30px;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    animation: tap-screen 2.5s infinite;
                }
                
                @keyframes scroll-posts {
                    0% { transform: translateY(0); }
                    80%, 100% { transform: translateY(-130px); }
                }
                
                @keyframes tap-screen {
                    0%, 70% { opacity: 0; }
                    80% { opacity: 1; transform: translateX(-50%) scale(1.2); }
                    90%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                }

            `}</style>
        </>
    );
};