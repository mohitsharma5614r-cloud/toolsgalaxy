import React, { useState } from 'react';
import { findPhysicsFormula, PhysicsFormula } from '../../services/geminiService';
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
            {copied ? 'Copied!' : 'Copy Info'}
        </button>
    );
};

export const PhysicsFormulaFinder: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [formulaData, setFormulaData] = useState<PhysicsFormula | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFind = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic to find a formula.");
            return;
        }
        setIsLoading(true);
        setFormulaData(null);
        setError(null);

        try {
            const result = await findPhysicsFormula(topic);
            setFormulaData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not find a formula for this topic.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const setExample = (t: string) => {
        setTopic(t);
        setFormulaData(null);
    };
    
    const formatForCopy = (): string => {
        if (!formulaData) return '';
        let text = `Formula: ${formulaData.formula}\n\n`;
        text += `Explanation: ${formulaData.explanation}\n\n`;
        text += `Variables:\n`;
        formulaData.variables.forEach(v => {
            text += `- ${v.symbol}: ${v.name} (${v.unit})\n`;
        });
        return text;
    };

    const examples = ["Newton's Second Law", "Kinetic Energy", "Ohm's Law", "Ideal Gas Law", "Wave Speed"];

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Physics Formula Finder</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your AI-powered physics dictionary.</p>
                </div>
                
                 <div className="space-y-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter a physics topic or formula name</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleFind()}
                            placeholder="e.g., Force, Velocity, E=mc^2"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                         <button
                            onClick={handleFind}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                          {isLoading ? 'Finding...' : 'Find'}
                        </button>
                    </div>
                     <div className="flex flex-wrap gap-2 pt-2">
                         <span className="text-sm text-slate-500 dark:text-slate-400 self-center">Try:</span>
                         {examples.map(ex => (
                            <button key={ex} onClick={() => setExample(ex)} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                {ex}
                            </button>
                         ))}
                     </div>
                </div>

                 <div className="mt-8 min-h-[300px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="text-center">
                           <div className="newtons-cradle mx-auto">
                               <div className="cradle-ball"></div>
                               <div className="cradle-ball"></div>
                               <div className="cradle-ball"></div>
                               <div className="cradle-ball"></div>
                               <div className="cradle-ball"></div>
                           </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Consulting the laws of physics...</p>
                        </div>
                    ) : formulaData ? (
                         <div className="w-full animate-fade-in text-left space-y-6">
                            <div>
                                <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Formula</h2>
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600">
                                    <p className="text-3xl text-center font-mono font-bold text-slate-800 dark:text-slate-100">{formulaData.formula}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Explanation</h3>
                                <p className="text-slate-600 dark:text-slate-300">{formulaData.explanation}</p>
                            </div>
                             <div>
                                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Variables</h3>
                                <div className="space-y-2">
                                    {formulaData.variables.map(v => (
                                        <div key={v.symbol} className="grid grid-cols-3 gap-2 items-center text-sm p-2 bg-white dark:bg-slate-800/50 rounded">
                                            <span className="font-mono font-bold text-center text-lg">{v.symbol}</span>
                                            <span>{v.name}</span>
                                            <span className="text-slate-500 dark:text-slate-400">{v.unit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={formatForCopy()} />
                           </div>
                         </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            <p className="mt-4 text-lg">The formula and its explanation will appear here.</p>
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
                .newtons-cradle {
                    position: relative;
                    display: flex;
                    gap: 16px;
                    width: 200px;
                    height: 100px;
                }
                .cradle-ball {
                    position: relative;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: #9ca3af;
                    transform-origin: 50% -80px;
                }
                .dark .cradle-ball {
                     background-color: #64748b;
                }
                .cradle-ball::before {
                    content: '';
                    position: absolute;
                    top: -80px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 80px;
                    background-color: #9ca3af;
                }
                 .dark .cradle-ball::before {
                     background-color: #64748b;
                }
                .cradle-ball:first-child {
                    animation: swing-left 2s ease-in-out infinite;
                }
                .cradle-ball:last-child {
                    animation: swing-right 2s ease-in-out infinite;
                }

                @keyframes swing-left {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(45deg); }
                    50% { transform: rotate(0deg); }
                }

                @keyframes swing-right {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(-45deg); }
                }
            `}</style>
        </>
    );
};