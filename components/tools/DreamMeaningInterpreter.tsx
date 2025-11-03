import React, { useState } from 'react';
import { interpretDream, DreamInterpretation } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="dream-loader mx-auto">
            <div className="moon"></div>
            <div className="star s1"></div>
            <div className="star s2"></div>
            <div className="star s3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Interpreting your subconscious...</p>
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
            {copied ? 'Copied!' : 'Copy Interpretation'}
        </button>
    );
};

export const DreamMeaningInterpreter: React.FC<{ title: string }> = ({ title }) => {
    const [dream, setDream] = useState('');
    const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!dream.trim()) {
            setError("Please describe your dream.");
            return;
        }
        setIsLoading(true);
        setInterpretation(null);
        setError(null);

        try {
            const result = await interpretDream(dream);
            setInterpretation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to interpret the dream.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatForCopy = (): string => {
        if (!interpretation) return '';
        let text = `Main Interpretation:\n${interpretation.mainInterpretation}\n\n`;
        text += "Alternative Meanings:\n";
        text += interpretation.alternativeInterpretations.map(item => `- ${item}`).join('\n');
        return text;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🌙</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get possible interpretations of your dreams from AI.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Describe your dream</label>
                        <textarea
                            rows={5}
                            value={dream}
                            onChange={(e) => setDream(e.target.value)}
                            placeholder="e.g., I was flying over a city made of chocolate..."
                            className="w-full input-style"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !dream.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Interpreting...' : 'Interpret Dream'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : interpretation ? (
                        <div className="w-full animate-fade-in text-left">
                            <div className="mb-6">
                                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">Main Interpretation</h3>
                                <p>{interpretation.mainInterpretation}</p>
                            </div>
                             <div>
                                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">Alternative Meanings</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {interpretation.alternativeInterpretations.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                                <CopyButton textToCopy={formatForCopy()} />
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your dream interpretation will appear here.</p>
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

                .dream-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .moon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    box-shadow: 15px 15px 0 0 #f1c40f;
                    animation: moon-phase 2.5s infinite linear;
                    position: absolute;
                    top: 10px;
                    left: 5px;
                }
                .star {
                    position: absolute;
                    background: white;
                    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                    opacity: 0;
                    animation: twinkle 2.5s infinite;
                }
                .s1 { width: 15px; height: 15px; top: 10%; right: 10%; animation-delay: 0s; }
                .s2 { width: 10px; height: 10px; top: 70%; left: 0%; animation-delay: 0.5s; }
                .s3 { width: 12px; height: 12px; top: 40%; right: 0%; animation-delay: 1s; }

                @keyframes moon-phase {
                    0%, 100% { box-shadow: 15px 15px 0 0 #f1c40f; }
                    50% { box-shadow: -15px 15px 0 0 #f1c40f; }
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </>
    );
};