import React, { useState } from 'react';

export const DocumentWordCounter: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState<{
        words: number;
        characters: number;
        charactersNoSpaces: number;
        sentences: number;
        paragraphs: number;
        readingTime: number;
    } | null>(null);

    const analyzeText = () => {
        if (!text.trim()) {
            setStats(null);
            return;
        }

        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min

        setStats({ words, characters, charactersNoSpaces, sentences, paragraphs, readingTime });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Count words, characters, and analyze your text.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paste Your Text</label>
                    <textarea
                        value={text}
                        onChange={(e) => { setText(e.target.value); analyzeText(); }}
                        placeholder="Start typing or paste your text here..."
                        rows={12}
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    />
                </div>

                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Words</h3>
                            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats.words.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-purple-200 dark:border-purple-800">
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Characters</h3>
                            <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{stats.characters.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-green-200 dark:border-green-800">
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">No Spaces</h3>
                            <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{stats.charactersNoSpaces.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-orange-200 dark:border-orange-800">
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Sentences</h3>
                            <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">{stats.sentences.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-teal-200 dark:border-teal-800">
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Paragraphs</h3>
                            <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">{stats.paragraphs.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Reading Time</h3>
                            <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">{stats.readingTime} min</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
