import React, { useState } from 'react';
import { solveEquation, EquationSolution } from '../../services/geminiService';
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
            {copied ? 'Copied!' : 'Copy Solution'}
        </button>
    );
};

export const EquationSolver: React.FC = () => {
    const [equation, setEquation] = useState('');
    const [solution, setSolution] = useState<EquationSolution | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSolve = async () => {
        if (!equation.trim()) {
            setError("Please enter an equation to solve.");
            return;
        }
        setIsLoading(true);
        setSolution(null);
        setError(null);

        try {
            const result = await solveEquation(equation);
            setSolution(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to solve the equation.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatSolutionForCopy = (): string => {
        if (!solution) return '';
        let text = `Solving: ${equation}\n\n`;
        solution.steps.forEach((step, index) => {
            text += `Step ${index + 1}: ${step.description}\n`;
            text += `-> ${step.result}\n\n`;
        });
        text += `Final Answer: ${solution.finalAnswer}`;
        return text;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Equation Solver</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get step-by-step solutions to your algebra problems.</p>
                </div>
                
                 <div className="space-y-4">
                    <label htmlFor="equation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter your equation</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="equation"
                            type="text"
                            value={equation}
                            onChange={(e) => setEquation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSolve()}
                            placeholder="e.g., 2x + 10 = 4x - 6"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                         <button
                            onClick={handleSolve}
                            disabled={isLoading || !equation.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                          {isLoading ? 'Solving...' : 'Solve'}
                        </button>
                    </div>
                </div>

                 <div className="mt-8 min-h-[300px] flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto text-center">
                           <div className="chalkboard-loader mx-auto">
                                <svg className="w-24 h-24" viewBox="0 0 100 100">
                                    <path className="chalk-line" d="M 20 50 L 35 65 M 35 35 L 20 50" stroke="#FFF" strokeWidth="3" fill="none" />
                                    <path className="chalk-line" d="M 45 60 A 10 10 0 1 1 55 60" stroke="#FFF" strokeWidth="3" fill="none" />
                                    <path className="chalk-line" d="M 70 35 L 85 65 M 70 65 L 85 35" stroke="#FFF" strokeWidth="3" fill="none" />
                                </svg>
                           </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Calculating solution...</p>
                        </div>
                    ) : solution ? (
                         <div className="w-full animate-fade-in text-left">
                            <h2 className="text-xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">Solution Steps</h2>
                            <div className="space-y-4">
                                {solution.steps.map((step, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                        <div className="md:col-span-2 text-slate-600 dark:text-slate-300">{index + 1}. {step.description}</div>
                                        <div className="md:col-span-1 font-mono text-indigo-600 dark:text-indigo-400 text-left md:text-right bg-slate-100 dark:bg-slate-900/50 p-2 rounded">{step.result}</div>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-6 p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-center border-2 border-emerald-300 dark:border-emerald-600">
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 uppercase">Final Answer</h3>
                                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">{solution.finalAnswer}</p>
                            </div>
                            <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={formatSolutionForCopy()} />
                           </div>
                         </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                            <p className="mt-4 text-lg">Your step-by-step solution will appear here.</p>
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
                .chalkboard-loader {
                    background-color: #334155; /* slate-700 */
                    border-radius: 10px;
                    border: 5px solid #64748b; /* slate-500 */
                    padding: 10px;
                }
                .chalk-line {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw-line 2.5s infinite ease-in-out;
                }
                .chalk-line:nth-child(2) { animation-delay: 0.2s; }
                .chalk-line:nth-child(3) { animation-delay: 0.4s; }
                @keyframes draw-line {
                    30% { stroke-dashoffset: 0; }
                    60% { stroke-dashoffset: 0; }
                    80% { stroke-dashoffset: -100; }
                    100% { stroke-dashoffset: -100; }
                }
            `}</style>
        </>
    );
};
