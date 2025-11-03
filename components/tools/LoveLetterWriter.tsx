import React, { useState } from 'react';
import { generateLoveLetter } from '../../services/geminiService';
import { Toast } from '../Toast';

// Loader component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="heart-loader mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing from the heart...</p>
        <style>{`
            .heart-loader {
                width: 80px;
                height: 80px;
                position: relative;
                animation: heart-beat 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            .heart-loader::before, .heart-loader::after {
                content: "";
                position: absolute;
                top: 0;
                width: 42px;
                height: 65px;
                border-radius: 50px 50px 0 0;
                background: #ef4444; /* red-500 */
            }
            .heart-loader::before {
                left: 40px;
                transform: rotate(-45deg);
                transform-origin: 0 100%;
            }
            .heart-loader::after {
                left: 0;
                transform: rotate(45deg);
                transform-origin: 100% 100%;
            }
            @keyframes heart-beat {
                0% { transform: scale(0.95); }
                5% { transform: scale(1.1); }
                39% { transform: scale(0.85); }
                45% { transform: scale(1); }
                60% { transform: scale(0.95); }
                100% { transform: scale(0.9); }
            }
        `}</style>
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
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md"
        >
            {copied ? 'Copied!' : 'Copy Letter'}
        </button>
    );
};


const tones = ['Passionate', 'Sweet & Gentle', 'Playful & Fun', 'Poetic'];

export const LoveLetterWriter: React.FC<{ title: string }> = ({ title }) => {
    const [recipientName, setRecipientName] = useState('');
    const [feelings, setFeelings] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [letter, setLetter] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!recipientName.trim() || !feelings.trim()) {
            setError("Please fill in the recipient's name and your feelings.");
            return;
        }
        setIsLoading(true);
        setLetter(null);
        setError(null);

        try {
            const result = await generateLoveLetter(recipientName, feelings, tone);
            setLetter(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to write the letter.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} ❤️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Let AI help you express your deepest feelings in a beautiful love letter.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient's Name</label>
                        <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="e.g., Alex" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Describe your feelings, memories, or what you love about them</label>
                        <textarea rows={4} value={feelings} onChange={e => setFeelings(e.target.value)} placeholder="e.g., I love their laugh, our first date at the park, the way they always support me..." className="w-full input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tone of the Letter</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        {isLoading ? 'Writing...' : 'Write Love Letter'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : letter ? (
                        <div className="w-full animate-fade-in text-center">
                            <pre className="whitespace-pre-wrap font-serif text-base text-left text-slate-800 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 p-4 rounded-md">
                                {letter}
                            </pre>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={letter} />
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your heartfelt letter will appear here.</p>
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
