import React, { useState } from 'react';
import { convertToIPA } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="ipa-loader mx-auto">
            <div className="char-flipper">
                <div className="char-front">A</div>
                <div className="char-back">/eɪ/</div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Transcribing to IPA...</p>
        <style>{`
            .ipa-loader {
                width: 80px;
                height: 80px;
                perspective: 1000px;
            }
            .char-flipper {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                animation: flip-ipa 2.5s infinite;
            }
            .char-front, .char-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                font-weight: bold;
                border-radius: 8px;
            }
            .char-front {
                background: #a5b4fc; /* indigo-300 */
                color: #312e81; /* indigo-900 */
            }
            .char-back {
                background: #e0e7ff; /* indigo-100 */
                color: #4338ca; /* indigo-700 */
                transform: rotateY(180deg);
            }
            @keyframes flip-ipa {
                0%, 100% { transform: rotateY(0deg); }
                50% { transform: rotateY(180deg); }
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
            className="w-full px-4 py-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md"
        >
            {copied ? 'Copied!' : 'Copy IPA Transcription'}
        </button>
    );
};

export const TextToIpaConverter: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [ipa, setIpa] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError("Please enter some text to convert.");
            return;
        }
        setIsLoading(true);
        setIpa('');
        setError(null);

        try {
            const result = await convertToIPA(text);
            setIpa(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to convert text.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert English text to its IPA phonetic transcription.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Text to Convert</label>
                        <textarea
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g., The quick brown fox jumps over the lazy dog."
                            className="w-full input-style"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !text.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg"
                    >
                        {isLoading ? 'Converting...' : 'Convert to IPA'}
                    </button>
                </div>

                <div className="mt-8 min-h-[150px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : ipa ? (
                        <div className="w-full animate-fade-in text-center">
                            <p className="text-2xl font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-4 rounded-md">
                                /{ipa}/
                            </p>
                            <CopyButton textToCopy={ipa} />
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p>Your IPA transcription will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`.input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; } .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }`}</style>
        </>
    );
};
