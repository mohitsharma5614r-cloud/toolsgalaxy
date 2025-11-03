
import React, { useState } from 'react';
import { generatePoem } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Haiku', 'Free Verse', 'Sonnet', 'Limerick'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="ink-loader mx-auto">
            <div className="ink-drop"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Brewing poetic thoughts...</p>
        <style>{`
            .ink-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .ink-drop {
                width: 20px;
                height: 20px;
                background: #4f46e5; /* indigo-600 */
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                animation: drop-ink 2s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55),
                           spread-ink 2s 1s infinite;
            }
            .dark .ink-drop { background: #818cf8; }
            
            @keyframes drop-ink {
                0% { top: 0; }
                50% { top: 60px; }
                51%, 100% { top: 60px; }
            }
            @keyframes spread-ink {
                0% { transform: translateX(-50%) scale(0.3); opacity: 1; }
                100% { transform: translateX(-50%) scale(2); opacity: 0; }
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
            {copied ? 'Copied!' : 'Copy Poem'}
        </button>
    );
};

export const PoemCreator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState(styles[0]);
    const [poem, setPoem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your poem.");
            return;
        }
        setIsLoading(true);
        setPoem(null);
        setError(null);

        try {
            const result = await generatePoem(topic, style);
            setPoem(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate a poem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Poem Creator ✒️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate beautiful poems on various topics and in different styles.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The ocean at night" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Style</label>
                        <div className="flex flex-wrap gap-2">
                            {styles.map(s => (
                                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${style === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        {isLoading ? 'Generating...' : 'Generate Poem'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : poem ? (
                        <div className="w-full animate-fade-in text-center">
                            <pre className="whitespace-pre-wrap font-serif text-lg text-slate-800 dark:text-slate-200">
                                {poem}
                            </pre>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={poem} />
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your poem will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
