import React, { useState } from 'react';
import { balanceEquation } from '../../services/geminiService';
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
            {copied ? 'Copied!' : 'Copy Equation'}
        </button>
    );
};

export const ChemistryEquationBalancer: React.FC = () => {
    const [unbalancedEquation, setUnbalancedEquation] = useState('');
    const [balancedEquation, setBalancedEquation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBalance = async () => {
        if (!unbalancedEquation.trim()) {
            setError("Please enter a chemical equation to balance.");
            return;
        }
        setIsLoading(true);
        setBalancedEquation(null);
        setError(null);

        try {
            const result = await balanceEquation(unbalancedEquation);
            setBalancedEquation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to balance the equation.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const setExample = (eq: string) => {
        setUnbalancedEquation(eq);
        setBalancedEquation(null);
    };

    const examples = ['H2 + O2 -> H2O', 'Fe + Cl2 -> FeCl3', 'C3H8 + O2 -> CO2 + H2O'];

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Chemistry Equation Balancer</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Let AI balance your chemical equations instantly.</p>
                </div>
                
                 <div className="space-y-4">
                    <label htmlFor="equation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter unbalanced equation</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="equation"
                            type="text"
                            value={unbalancedEquation}
                            onChange={(e) => setUnbalancedEquation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleBalance()}
                            placeholder="e.g., Na + H2O -> NaOH + H2"
                            className="flex-grow w-full font-mono bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                         <button
                            onClick={handleBalance}
                            disabled={isLoading || !unbalancedEquation.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                          {isLoading ? 'Balancing...' : 'Balance'}
                        </button>
                    </div>
                     <div className="flex flex-wrap gap-2 pt-2">
                         <span className="text-sm text-slate-500 dark:text-slate-400 self-center">Examples:</span>
                         {examples.map(ex => (
                            <button key={ex} onClick={() => setExample(ex)} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                {ex}
                            </button>
                         ))}
                     </div>
                </div>

                 <div className="mt-8 min-h-[250px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="text-center">
                           <div className="beaker-loader mx-auto">
                               <div className="beaker"></div>
                               <div className="bubbles">
                                   <div className="bubble"></div>
                                   <div className="bubble"></div>
                                   <div className="bubble"></div>
                                   <div className="bubble"></div>
                               </div>
                           </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Running chemical reaction...</p>
                        </div>
                    ) : balancedEquation ? (
                         <div className="w-full animate-fade-in text-center">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Balanced Equation</h2>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600">
                                <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{balancedEquation}</p>
                            </div>
                            <div className="mt-8">
                                <CopyButton textToCopy={balancedEquation} />
                           </div>
                         </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                            <p className="mt-4 text-lg">Your balanced equation will appear here.</p>
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
                .beaker-loader {
                    width: 80px;
                    height: 100px;
                    position: relative;
                }
                .beaker {
                    width: 100%;
                    height: 100%;
                    border: 5px solid #9ca3af; /* slate-400 */
                    border-top: none;
                    border-radius: 0 0 15px 15px;
                    position: relative;
                }
                .dark .beaker { border-color: #64748b; /* slate-500 */ }
                .beaker::before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: -15px;
                    right: -15px;
                    height: 10px;
                    background-color: #e5e7eb; /* slate-200 */
                    border: 5px solid #9ca3af; /* slate-400 */
                    border-radius: 5px;
                }
                .dark .beaker::before { background-color: #334155; border-color: #64748b; }
                .beaker::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40%;
                    background-color: #6366f1; /* indigo-500 */
                    border-radius: 0 0 10px 10px;
                    animation: fill-beaker 2s infinite;
                }
                .dark .beaker::after { background-color: #818cf8; }
                .bubbles {
                    position: absolute;
                    bottom: 5px;
                    left: 10px;
                    right: 10px;
                    height: 40%;
                }
                .bubble {
                    width: 8px;
                    height: 8px;
                    background-color: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    position: absolute;
                    bottom: 0;
                    animation: rise 2s infinite ease-in;
                }
                .bubble:nth-child(1) { left: 10%; animation-duration: 2.2s; }
                .bubble:nth-child(2) { left: 40%; animation-duration: 1.8s; animation-delay: 0.5s; }
                .bubble:nth-child(3) { left: 70%; animation-duration: 2.5s; animation-delay: 1s; }
                .bubble:nth-child(4) { left: 85%; animation-duration: 2s; animation-delay: 1.5s; }

                @keyframes fill-beaker {
                    0%, 100% { height: 40%; }
                    50% { height: 45%; }
                }
                @keyframes rise {
                    to {
                        transform: translateY(-80px);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};