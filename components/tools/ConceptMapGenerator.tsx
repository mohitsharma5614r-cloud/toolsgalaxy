import React, { useState } from 'react';
import { generateConceptMap, ConceptMapNode } from '../../services/geminiService';
import { Toast } from '../Toast';

// Recursive component to render each node and its children
const NodeComponent: React.FC<{ node: ConceptMapNode; isRoot?: boolean }> = ({ node, isRoot = false }) => {
    const nodeClass = isRoot
        ? 'bg-indigo-600 text-white font-bold text-lg'
        : (node.children ? 'bg-white dark:bg-slate-700 font-semibold' : 'bg-slate-100 dark:bg-slate-600');

    return (
        <div className="concept-node-container">
            <div className={`concept-node ${nodeClass}`}>
                {node.text}
            </div>
            {node.children && node.children.length > 0 && (
                <div className="children-wrapper">
                    {node.children.map((child, index) => (
                        <NodeComponent key={index} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const ConceptMapGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [mapData, setMapData] = useState<ConceptMapNode | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a central topic for the map.");
            return;
        }
        setIsLoading(true);
        setMapData(null);
        setError(null);

        try {
            const result = await generateConceptMap(topic);
            setMapData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate concept map.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatForCopy = (node: ConceptMapNode, prefix = ''): string => {
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
        if (!mapData) return;
        navigator.clipboard.writeText(formatForCopy(mapData));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <>
            <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Concept Map Generator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visually connect ideas branching from a central topic.</p>
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
                            placeholder="e.g., Photosynthesis"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
                
                 <div className="mt-8 min-h-[400px] overflow-x-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-center items-center">
                    {isLoading ? (
                         <div className="text-center">
                           <div className="node-loader mx-auto">
                                <div className="node n-center"></div>
                                <div className="node n-orbit"></div>
                                <div className="node n-orbit"></div>
                                <div className="node n-orbit"></div>
                            </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Connecting ideas...</p>
                        </div>
                    ) : mapData ? (
                        <div className="w-full animate-fade-in text-center p-4">
                           <NodeComponent node={mapData} isRoot={true} />
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
                            <p className="mt-4 text-lg">Your concept map will be generated here.</p>
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
                .concept-node-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .concept-node {
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0; /* slate-200 */
                    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
                    text-align: center;
                    min-width: 120px;
                    max-width: 250px;
                    z-index: 1;
                }
                .dark .concept-node {
                    border-color: #334155; /* slate-700 */
                }
                .children-wrapper {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-top: 3rem;
                    position: relative;
                }
                /* Vertical line from parent */
                .concept-node-container:not(:only-child)::before,
                .concept-node-container:has(.children-wrapper)::before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    top: 100%;
                    height: 1.5rem;
                    border-left: 2px solid #cbd5e1; /* slate-300 */
                    transform: translateX(-1px);
                }
                .dark .concept-node-container:not(:only-child)::before,
                .dark .concept-node-container:has(.children-wrapper)::before {
                    border-color: #475569; /* slate-600 */
                }
                /* Vertical line to child */
                .concept-node-container::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 100%;
                    height: 1.5rem;
                    border-left: 2px solid #cbd5e1; /* slate-300 */
                    transform: translateX(-1px);
                }
                .dark .concept-node-container::after {
                    border-color: #475569; /* slate-600 */
                }
                /* Hide top line for root */
                .concept-node-container:first-child:has(> .concept-node.bg-indigo-600)::after {
                    display: none;
                }
                
                /* Horizontal line connecting siblings */
                .children-wrapper::before {
                    content: '';
                    position: absolute;
                    top: -1.5rem;
                    left: 25%;
                    right: 25%;
                    border-top: 2px solid #cbd5e1; /* slate-300 */
                }
                 .dark .children-wrapper::before {
                    border-color: #475569; /* slate-600 */
                }
                /* Hide horizontal line if only one child */
                .children-wrapper:has(> .concept-node-container:only-child)::before {
                    display: none;
                }


                .node-loader {
                    width: 100px; height: 100px;
                    position: relative;
                }
                .node {
                    position: absolute;
                    width: 20px; height: 20px;
                    background-color: #818cf8; /* indigo-400 */
                    border-radius: 50%;
                }
                .dark .node { background-color: #a5b4fc; }
                .node.n-center {
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 24px; height: 24px;
                    background-color: #6366f1; /* indigo-600 */
                    animation: pulse-center 2s infinite;
                }
                .dark .node.n-center { background-color: #818cf8; }

                .node.n-orbit {
                    animation: orbit 3s infinite linear;
                }
                .node.n-orbit:nth-of-type(2) { animation-delay: 0s; }
                .node.n-orbit:nth-of-type(3) { animation-delay: -1s; }
                .node.n-orbit:nth-of-type(4) { animation-delay: -2s; }
                
                @keyframes pulse-center {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg) translateX(40px) rotate(0deg) scale(0.5); }
                    to { transform: rotate(360deg) translateX(40px) rotate(-360deg) scale(0.5); }
                }

            `}</style>
        </>
    );
};
