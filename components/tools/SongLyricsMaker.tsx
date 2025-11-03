
import React, { useState } from 'react';
import { generateSongLyrics } from '../../services/geminiService';
import { Toast } from '../Toast';

const genres = ['Pop', 'Rock', 'Country', 'Hip-Hop', 'Ballad'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="music-loader mx-auto">
            <div className="note n1">♪</div>
            <div className="note n2">♫</div>
            <div className="note n3">🎶</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing a hit song...</p>
        <style>{`
            .music-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .note {
                position: absolute;
                font-size: 40px;
                color: #6366f1; /* indigo-500 */
                opacity: 0;
                animation: float-up 2.5s infinite;
            }
            .dark .note { color: #818cf8; }
            .n1 { top: 60%; left: 10%; animation-delay: 0s; }
            .n2 { top: 50%; left: 50%; animation-delay: 0.5s; }
            .n3 { top: 70%; left: 80%; animation-delay: 1s; }
            
            @keyframes float-up {
                0% { transform: translateY(0) scale(0.8); opacity: 1; }
                100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
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
            {copied ? 'Copied!' : 'Copy Lyrics'}
        </button>
    );
};

export const SongLyricsMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [genre, setGenre] = useState(genres[0]);
    const [lyrics, setLyrics] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your song.");
            return;
        }
        setIsLoading(true);
        setLyrics(null);
        setError(null);

        try {
            const result = await generateSongLyrics(topic, genre);
            setLyrics(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate lyrics.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Song Lyrics Maker 🎤</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create lyrics for your next hit song. Just provide a topic and genre.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., a long road trip" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Genre</label>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(g => (
                                <button key={g} onClick={() => setGenre(g)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${genre === g ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{g}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        {isLoading ? 'Generating...' : 'Generate Lyrics'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : lyrics ? (
                        <div className="w-full animate-fade-in text-center">
                            <pre className="whitespace-pre-wrap font-sans text-base text-left text-slate-800 dark:text-slate-200">
                                {lyrics}
                            </pre>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={lyrics} />
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your song lyrics will appear here.</p>
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
