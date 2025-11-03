import React, { useState } from 'react';
import { generateEssayOutline, EssayOutline } from '../../services/geminiService';
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            disabled={!textToCopy}
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
            {copied ? 'Copied!' : 'Copy Outline'}
        </button>
    );
};

export const EssayOutlineGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [outline, setOutline] = useState<EssayOutline | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter an essay topic.");
            return;
        }
        setIsLoading(true);
        setOutline(null);
        setError(null);

        try {
            const result = await generateEssayOutline(topic);
            setOutline(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate the outline.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatOutlineForCopy = (): string => {
        if (!outline) return '';
        let text = `Title: ${outline.title}\n\n`;
        text += `I. Introduction\n`;
        text += `   A. Hook: ${outline.introduction.hook}\n`;
        text += `   B. Thesis Statement: ${outline.introduction.thesis}\n\n`;
        
        outline.body.forEach((paragraph, index) => {
            text += `II. Body Paragraph ${index + 1}: ${paragraph.title}\n`;
            paragraph.points.forEach(point => {
                text += `    - ${point}\n`;
            });
            text += '\n';
        });

        text += `III. Conclusion\n`;
        text += `   A. Summary: ${outline.conclusion.summary}\n`;
        text += `   B. Final Thought: ${outline.conclusion.finalThought}\n`;
        return text;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Essay Outline Generator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Structure your thoughts and build a strong foundation for your essay.</p>
                </div>
                
                <div className="space-y-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Essay Topic</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                            placeholder="e.g., The Impact of Artificial Intelligence on Society"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Generating...' : 'Generate Outline'}
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 min-h-[300px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto text-center">
                           <div className="outline-loader mx-auto">
                                <div className="line l-main"></div>
                                <div className="line l-sub l-sub1"></div>
                                <div className="line l-sub l-sub2"></div>
                                <div className="line l-sub l-sub3"></div>
                            </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Structuring your essay...</p>
                        </div>
                    ) : outline ? (
                        <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-fade-in text-left">
                           <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b-2 border-indigo-500/50">{outline.title}</h2>
                           
                           <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">I. Introduction</h3>
                                    <p className="pl-4 mt-1"><strong className="font-semibold text-slate-600 dark:text-slate-300">Hook:</strong> {outline.introduction.hook}</p>
                                    <p className="pl-4 mt-1"><strong className="font-semibold text-slate-600 dark:text-slate-300">Thesis:</strong> {outline.introduction.thesis}</p>
                                </div>
                                <div>
                                     <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">II. Body Paragraphs</h3>
                                     {outline.body.map((p, i) => (
                                         <div key={i} className="pl-4 mt-2">
                                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">{i+1}. {p.title}</h4>
                                            <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-600 dark:text-slate-400">
                                                {p.points.map((point, pi) => <li key={pi}>{point}</li>)}
                                            </ul>
                                         </div>
                                     ))}
                                </div>
                                 <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">III. Conclusion</h3>
                                    <p className="pl-4 mt-1"><strong className="font-semibold text-slate-600 dark:text-slate-300">Summary:</strong> {outline.conclusion.summary}</p>
                                    <p className="pl-4 mt-1"><strong className="font-semibold text-slate-600 dark:text-slate-300">Final Thought:</strong> {outline.conclusion.finalThought}</p>
                                </div>
                           </div>
                           <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={formatOutlineForCopy()} />
                           </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                            <p className="mt-4 text-lg">Your generated essay outline will appear here.</p>
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
                .outline-loader {
                    width: 80px;
                    height: 60px;
                    position: relative;
                }
                .outline-loader .line {
                    position: absolute;
                    left: 0;
                    height: 6px;
                    background-color: #6366f1; /* indigo-500 */
                    border-radius: 3px;
                    animation: write-line 1.5s infinite ease-in-out;
                }
                 .dark .outline-loader .line {
                    background-color: #818cf8; /* indigo-400 */
                 }
                .outline-loader .l-main { top: 0; width: 80%; }
                .outline-loader .l-sub { left: 10px; }
                .outline-loader .l-sub1 { top: 20px; width: 60%; animation-delay: 0.1s; }
                .outline-loader .l-sub2 { top: 35px; width: 70%; animation-delay: 0.2s; }
                .outline-loader .l-sub3 { top: 50px; width: 65%; animation-delay: 0.3s; }
                @keyframes write-line {
                    0% { width: 0; }
                    50%, 100% { width: var(--final-width, 80%); }
                }
                .l-main { --final-width: 80%; }
                .l-sub1 { --final-width: 60%; }
                .l-sub2 { --final-width: 70%; }
                .l-sub3 { --final-width: 65%; }

            `}</style>
        </>
    );
};
