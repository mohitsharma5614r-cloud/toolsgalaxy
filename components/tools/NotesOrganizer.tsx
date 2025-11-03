import React, { useState } from 'react';
import { organizeNotes } from '../../services/geminiService';
import { Toast } from '../Toast';

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105"
            disabled={!textToCopy}
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
            {copied ? 'Copied!' : 'Copy Notes'}
        </button>
    );
};

export const NotesOrganizer: React.FC = () => {
    const [rawText, setRawText] = useState('');
    const [organizedNotes, setOrganizedNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOrganize = async () => {
        if (!rawText.trim()) {
            setError("Please paste some text to organize.");
            return;
        }
        setIsLoading(true);
        setOrganizedNotes('');
        setError(null);

        try {
            const result = await organizeNotes(rawText);
            setOrganizedNotes(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to organize notes.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Notes Organizer</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Paste your messy notes and let AI structure them for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                         <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">1. Your Raw Notes</h2>
                        <textarea
                            rows={15}
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste your unorganized meeting notes, lecture scribbles, or brainstorm dumps here..."
                            className="w-full flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <button 
                            onClick={handleOrganize} 
                            disabled={isLoading || !rawText.trim()}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                            {isLoading ? 'Organizing...' : 'Organize Notes'}
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">2. Organized Notes</h2>
                        <div className="min-h-[400px] bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
                            {isLoading ? (
                                <div className="m-auto text-center">
                                    <div className="organizer-loader mx-auto">
                                        <div className="bar b1"></div>
                                        <div className="bar b2"></div>
                                        <div className="bar b3"></div>
                                        <div className="bar b4"></div>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Structuring your content...</p>
                                </div>
                            ) : organizedNotes ? (
                                <div className="flex-grow flex flex-col justify-between animate-fade-in">
                                    <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap text-left text-sm">
                                        {organizedNotes}
                                    </div>
                                    <div className="mt-6 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <CopyButton textToCopy={organizedNotes} />
                                    </div>
                                </div>
                            ) : (
                                <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M2.75 12.75a3 3 0 0 0 3 3h12.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H5.75a3 3 0 0 0-3 3v6Z"/><path d="M12 5.25v13.5"/></svg>
                                    <p className="mt-4 text-lg">Your organized notes will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
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
                .prose { line-height: 1.7; }
                .organizer-loader {
                    width: 60px;
                    height: 50px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .organizer-loader .bar {
                    width: 10px;
                    background-color: #6366f1;
                    border-radius: 4px;
                    animation: organize-anim 1.2s infinite ease-in-out;
                }
                .dark .organizer-loader .bar {
                     background-color: #818cf8;
                }
                .organizer-loader .b1 { height: 10px; animation-delay: 0s; }
                .organizer-loader .b2 { height: 30px; animation-delay: 0.1s; }
                .organizer-loader .b3 { height: 50px; animation-delay: 0.2s; }
                .organizer-loader .b4 { height: 20px; animation-delay: 0.3s; }

                @keyframes organize-anim {
                    0%, 100% { height: 10px; }
                    50% { height: 50px; }
                }
            `}</style>
        </>
    );
};
