import React, { useState } from 'react';
import { generateMovieDialogue } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Tense', 'Comedic', 'Dramatic', 'Romantic', 'Action-Packed'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="clapperboard-loader mx-auto">
            <div className="clapper-top"></div>
            <div className="clapper-bottom"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing your scene...</p>
        <style>{`
            .clapperboard-loader {
                width: 120px;
                height: 100px;
                position: relative;
            }
            .clapper-top, .clapper-bottom {
                width: 100%;
                height: 50%;
                background: #1e293b;
                border: 2px solid #9ca3af;
                position: absolute;
                box-sizing: border-box;
                background-image: repeating-linear-gradient(135deg, #1e293b 0 15px, #f1f5f9 15px 30px);
            }
            .dark .clapper-top, .dark .clapper-bottom {
                 background-image: repeating-linear-gradient(135deg, #1e293b 0 15px, #475569 15px 30px);
            }

            .clapper-top {
                top: 0;
                border-radius: 8px 8px 0 0;
                transform-origin: 0 100%;
                animation: clap 1.2s infinite ease-in-out;
            }
            .clapper-bottom {
                bottom: 0;
                border-radius: 0 0 8px 8px;
            }

            @keyframes clap {
                0%, 100% {
                    transform: rotate(-15deg);
                }
                50% {
                    transform: rotate(0deg);
                }
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
            {copied ? 'Copied!' : 'Copy Dialogue'}
        </button>
    );
};

export const MovieDialogueGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [scene, setScene] = useState('');
    const [characters, setCharacters] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!scene.trim() || !characters.trim()) {
            setError("Please fill in both scene and character descriptions.");
            return;
        }
        setIsLoading(true);
        setDialogue(null);
        setError(null);

        try {
            const result = await generateMovieDialogue(scene, characters, tone);
            setDialogue(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate dialogue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🎬</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create dialogue for a movie scene with AI.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Scene Description</label>
                        <textarea rows={3} value={scene} onChange={e => setScene(e.target.value)} placeholder="e.g., A tense negotiation in a dimly lit warehouse." className="w-full input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Characters</label>
                        <input value={characters} onChange={e => setCharacters(e.target.value)} placeholder="e.g., Detective Miller, a grizzled veteran; and The Shadow, a mysterious informant." className="w-full input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Dialogue Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        {isLoading ? 'Generating...' : 'Generate Dialogue'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : dialogue ? (
                        <div className="w-full animate-fade-in text-center">
                            <pre className="whitespace-pre-wrap font-mono text-base text-left text-slate-800 dark:text-slate-200">
                                {dialogue}
                            </pre>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={dialogue} />
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your generated dialogue will appear here.</p>
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