import React, { useState } from 'react';
import { generateMindMap, MindMapNode } from '../../services/geminiService';
import { Toast } from '../Toast';

// Recursive component to render each node and its children
const MindMapNodeComponent: React.FC<{ node: MindMapNode; level: number }> = ({ node, level }) => {
    const isRoot = level === 0;
    const isMainBranch = level === 1;

    const nodeStyles = {
        base: 'relative p-3 rounded-lg shadow-sm border text-left transition-all duration-300',
        level0: 'bg-indigo-600 text-white font-bold text-lg border-indigo-700 shadow-lg',
        level1: 'bg-white dark:bg-slate-800 font-semibold border-slate-300 dark:border-slate-600',
        level2: 'bg-slate-100 dark:bg-slate-700/50 text-sm border-slate-200 dark:border-slate-600',
    };

    const nodeClass = `${nodeStyles.base} ${isRoot ? nodeStyles.level0 : isMainBranch ? nodeStyles.level1 : nodeStyles.level2}`;

    return (
        <div className="flex items-start">
            {!isRoot && (
                <div className={`connector-line ${isMainBranch ? 'main-branch' : 'sub-branch'}`}></div>
            )}
            <div className="flex flex-col items-start w-full">
                <div className={nodeClass}>
                    {node.text}
                </div>
                {node.children && node.children.length > 0 && (
                    <div className="children-container pl-8 mt-4 space-y-4">
                        {node.children.map((child, index) => (
                            <MindMapNodeComponent key={index} node={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const MindMapMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a central topic.");
            return;
        }
        setIsLoading(true);
        setMindMap(null);
        setError(null);

        try {
            const result = await generateMindMap(topic);
            setMindMap(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate mind map.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatForCopy = (node: MindMapNode, prefix = ''): string => {
        let result = `${prefix}- ${node.text}\n`;
        if (node.children) {
            node.children.forEach(child => {
                result += formatForCopy(child, prefix + '  ');
            });
        }
        return result;
    };
    
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!mindMap) return;
        navigator.clipboard.writeText(formatForCopy(mindMap));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Mind Map Generator 🧠</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter a central topic and let AI branch out your ideas visually.</p>
                </div>

                <div className="space-y-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Central Topic</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                            placeholder="e.g., The Benefits of Regular Exercise"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                        >
                          {isLoading ? 'Generating...' : 'Generate Map'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto text-center">
                           <div className="tree-loader mx-auto">
                                <div className="trunk">
                                    <div className="branch"></div>
                                    <div className="branch"></div>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Branching out ideas...</p>
                        </div>
                    ) : mindMap ? (
                        <div className="w-full animate-fade-in">
                            <MindMapNodeComponent node={mindMap} level={0} />
                            <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                                    {copied ? 'Copied as Text!' : 'Copy as Text'}
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M3 11.5a1.5 1.5 0 0 1 3 0V12a2 2 0 0 0 2 2h1.5a2.5 2.5 0 0 1 0 5H8a2 2 0 0 0-2 2v.5a1.5 1.5 0 0 1-3 0V19a2 2 0 0 1 2-2h1.5a2.5 2.5 0 0 0 0-5H5a2 2 0 0 1-2-2zM21 12v.5a1.5 1.5 0 0 1-3 0V12a2 2 0 0 0-2-2h-1.5a2.5 2.5 0 0 0 0 5H16a2 2 0 0 1 2 2v.5a1.5 1.5 0 0 0 3 0V19a2 2 0 0 0-2-2h-1.5a2.5 2.5 0 0 1 0-5H19a2 2 0 0 0 2-2z"/></svg>
                            <p className="mt-4 text-lg">Your generated mind map will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                .children-container {
                    position: relative;
                }
                .connector-line {
                    position: relative;
                    width: 2rem; /* same as pl-8 */
                    flex-shrink: 0;
                    margin-top: 1.25rem; /* approximate half height of node */
                }
                .connector-line::before { /* Horizontal line */
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 1rem;
                    height: 2px;
                    background-color: #cbd5e1; /* slate-300 */
                }
                .dark .connector-line::before { background-color: #475569; /* slate-600 */ }
                
                .connector-line::after { /* Vertical line connecting siblings */
                    content: '';
                    position: absolute;
                    left: 0;
                    top: -100%;
                    bottom: 0;
                    width: 2px;
                    background-color: #cbd5e1; /* slate-300 */
                    transform: translateY(1.25rem);
                }
                .dark .connector-line::after { background-color: #475569; /* slate-600 */ }
                
                /* Hide vertical line for the first child */
                .children-container > div:first-child > .connector-line::after {
                    top: 0;
                }
                /* Hide bottom part of vertical line for the last child */
                 .children-container > div:last-child > .connector-line::after {
                    bottom: 100%;
                    transform: translateY(1.27rem);
                }

                .tree-loader {
                    width: 80px; height: 80px;
                    position: relative;
                }
                .trunk {
                    position: absolute;
                    bottom: 0; left: 50%;
                    transform: translateX(-50%);
                    width: 10px; height: 40px;
                    background-color: #a3a3a3; /* neutral-400 */
                    border-radius: 5px 5px 0 0;
                    animation: grow-trunk 1s forwards;
                }
                .dark .trunk { background-color: #525252; /* neutral-600 */ }
                .branch {
                    position: absolute;
                    top: 0; left: 50%;
                    width: 6px; height: 30px;
                    background-color: #a3a3a3; /* neutral-400 */
                    border-radius: 3px;
                    transform-origin: bottom center;
                    opacity: 0;
                }
                 .dark .branch { background-color: #525252; /* neutral-600 */ }
                .branch:nth-child(1) { animation: grow-branch 1.5s 0.5s infinite; transform: translateX(-50%) rotate(-45deg); }
                .branch:nth-child(2) { animation: grow-branch 1.5s 0.7s infinite; transform: translateX(-50%) rotate(45deg); }

                @keyframes grow-trunk {
                    from { height: 0; } to { height: 40px; }
                }
                @keyframes grow-branch {
                    0% { height: 0; opacity: 0; }
                    50% { height: 30px; opacity: 1; }
                    100% { height: 30px; opacity: 1; }
                }

            `}</style>
        </>
    );
};
