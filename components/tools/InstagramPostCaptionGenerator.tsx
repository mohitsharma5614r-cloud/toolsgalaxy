import React, { useState } from 'react';
import { generateInstagramCaptions } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Witty', 'Inspirational', 'Funny', 'Salesy', 'Casual'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="phone-loader mx-auto">
            <div className="phone-screen"></div>
            <div className="heart">❤️</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating viral captions...</p>
        <style>{`
            .phone-loader {
                width: 70px;
                height: 120px;
                border: 5px solid #475569; /* slate-600 */
                border-radius: 12px;
                position: relative;
                background: #e2e8f0; /* slate-200 */
            }
            .dark .phone-loader {
                border-color: #94a3b8; /* slate-400 */
                background: #334155; /* slate-700 */
            }
            .phone-screen {
                width: 100%;
                height: 100%;
                background: #f1f5f9; /* slate-100 */
                border-radius: 6px;
            }
            .dark .phone-screen {
                background: #1e293b; /* slate-800 */
            }
            .heart {
                font-size: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
                animation: like-pop 2s infinite ease-out;
            }
            
            @keyframes like-pop {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                30% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 1;
                }
                50% {
                    transform: translate(-50%, -70px) scale(1);
                    opacity: 1;
                }
                80% {
                    transform: translate(-50%, -100px) scale(1);
                    opacity: 0;
                }
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
        <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const InstagramPostCaptionGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [captions, setCaptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please describe your post.");
            return;
        }
        setIsLoading(true);
        setCaptions([]);
        setError(null);

        try {
            const result = await generateInstagramCaptions(topic, tone);
            setCaptions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate captions.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate engaging captions for your Instagram posts.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">What's your post about?</label>
                        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., my morning coffee, a beautiful sunset" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Caption Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`btn-toggle ${tone === t ? 'btn-selected' : ''}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="w-full btn-primary text-lg !mt-8">
                        Generate Captions
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : captions.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {captions.map((caption, index) => (
                                <div key={index} className="flex justify-between items-start gap-4 bg-white dark:bg-slate-800 rounded-lg p-4 border shadow-sm">
                                    <p className="text-sm text-slate-800 dark:text-slate-200">{caption}</p>
                                    <CopyButton textToCopy={caption} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p>Your caption ideas will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .btn-toggle { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-selected { background-color: #4f46e5; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};