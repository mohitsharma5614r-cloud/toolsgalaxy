import React, { useState, useEffect } from 'react';
import { elements, ElementData } from '../../data/periodic-table-data';
import { getFunFact } from '../../services/geminiService';
import { Toast } from '../Toast';

const categoryColors: { [key: string]: string } = {
    'diatomic nonmetal': 'bg-emerald-500/80 border-emerald-400 text-emerald-950',
    'noble gas': 'bg-purple-500/80 border-purple-400 text-purple-950',
    'alkali metal': 'bg-red-500/80 border-red-400 text-red-950',
    'alkaline earth metal': 'bg-orange-500/80 border-orange-400 text-orange-950',
    'metalloid': 'bg-cyan-500/80 border-cyan-400 text-cyan-950',
    'polyatomic nonmetal': 'bg-green-500/80 border-green-400 text-green-950',
    'post-transition metal': 'bg-sky-500/80 border-sky-400 text-sky-950',
    'transition metal': 'bg-rose-500/80 border-rose-400 text-rose-950',
    'lanthanide': 'bg-amber-500/80 border-amber-400 text-amber-950',
    'actinide': 'bg-pink-500/80 border-pink-400 text-pink-950',
    'unknown': 'bg-slate-500/80 border-slate-400 text-slate-950',
};

const AtomLoader: React.FC = () => (
    <div className="atom-loader">
        <div className="nucleus"></div>
        <div className="electron"></div>
        <div className="electron"></div>
    </div>
);


export const PeriodicTableExplorer: React.FC = () => {
    const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
    const [funFact, setFunFact] = useState<string | null>(null);
    const [isLoadingFact, setIsLoadingFact] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleElementClick = async (element: ElementData) => {
        if (selectedElement?.atomicNumber === element.atomicNumber) {
             setSelectedElement(null);
             return;
        }
        setSelectedElement(element);
        setFunFact(null);
        setIsLoadingFact(true);
        setError(null);
        try {
            const fact = await getFunFact(element.name);
            setFunFact(fact);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not fetch fun fact.');
        } finally {
            setIsLoadingFact(false);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Periodic Table Explorer</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">An interactive periodic table powered by Gemini.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <div className="periodic-table-grid">
                            {elements.map((el, i) => {
                                const isLanthanide = el.atomicNumber >= 57 && el.atomicNumber <= 71;
                                const isActinide = el.atomicNumber >= 89 && el.atomicNumber <= 103;

                                let gridColumn, gridRow;
                                if (isLanthanide) {
                                    gridColumn = (el.atomicNumber - 57) + 3;
                                    gridRow = 9;
                                } else if (isActinide) {
                                    gridColumn = (el.atomicNumber - 89) + 3;
                                    gridRow = 10;
                                } else {
                                    gridColumn = el.group;
                                    gridRow = el.period;
                                }

                                const colorClass = categoryColors[el.category] || categoryColors['unknown'];
                                const isSelected = selectedElement?.atomicNumber === el.atomicNumber;

                                return (
                                    <button
                                        key={el.atomicNumber}
                                        onClick={() => handleElementClick(el)}
                                        className={`element-tile ${colorClass} ${isSelected ? 'selected' : ''}`}
                                        style={{ 
                                            gridColumn: gridColumn, 
                                            gridRow: gridRow,
                                            animationDelay: `${i * 10}ms`
                                        }}
                                        aria-label={`Select ${el.name}`}
                                    >
                                        <div className="text-xs text-left">{el.atomicNumber}</div>
                                        <div className="text-2xl font-bold">{el.symbol}</div>
                                        <div className="text-xs truncate">{el.name}</div>
                                    </button>
                                );
                            })}
                             <div className="text-center text-slate-500 dark:text-slate-400 text-sm" style={{gridColumn: '3', gridRow: '6'}}>57-71</div>
                             <div className="text-center text-slate-500 dark:text-slate-400 text-sm" style={{gridColumn: '3', gridRow: '7'}}>89-103</div>
                             <div className="text-center text-slate-500 dark:text-slate-400 text-sm" style={{gridColumn: '2', gridRow: '9'}}>La-Lu</div>
                             <div className="text-center text-slate-500 dark:text-slate-400 text-sm" style={{gridColumn: '2', gridRow: '10'}}>Ac-Lr</div>
                        </div>

                        <div className="mt-8">
                             <h3 className="font-bold text-center mb-4 text-slate-700 dark:text-slate-300">Element Categories</h3>
                             <div className="flex flex-wrap justify-center gap-2">
                                {Object.entries(categoryColors).map(([category, className]) => (
                                    <div key={category} className="flex items-center gap-2 text-xs">
                                        <div className={`w-3 h-3 rounded-sm ${className.split(' ')[0]}`}></div>
                                        <span className="capitalize text-slate-600 dark:text-slate-400">{category.replace(/-/g, ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-1">
                        <div className="sticky top-24 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[300px] transition-all duration-300">
                           {selectedElement ? (
                                <div className="animate-fade-in space-y-4">
                                    <div className={`p-4 rounded-lg text-center ${categoryColors[selectedElement.category]}`}>
                                        <h2 className="text-3xl font-bold">{selectedElement.name} ({selectedElement.symbol})</h2>
                                        <p className="text-sm font-semibold capitalize">{selectedElement.category.replace(/-/g, ' ')}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                       <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded">
                                            <p className="font-semibold text-slate-500 dark:text-slate-400">Atomic Number</p>
                                            <p className="font-mono text-lg text-slate-800 dark:text-slate-200">{selectedElement.atomicNumber}</p>
                                       </div>
                                       <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded">
                                            <p className="font-semibold text-slate-500 dark:text-slate-400">Atomic Mass</p>
                                            <p className="font-mono text-lg text-slate-800 dark:text-slate-200">{selectedElement.atomicMass}</p>
                                       </div>
                                    </div>
                                     <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded text-sm">
                                        <p className="font-semibold text-slate-500 dark:text-slate-400">Electron Config.</p>
                                        <p className="font-mono text-lg text-slate-800 dark:text-slate-200">{selectedElement.electronConfiguration}</p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                                            Fun Fact
                                        </h3>
                                        <div className="min-h-[60px] flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-900/50 rounded">
                                            {isLoadingFact ? <AtomLoader /> : 
                                                <p className="text-slate-600 dark:text-slate-300 text-center italic">"{funFact}"</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                           ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M15.042 21.672L13.684 16.6m0 0l-2.5-2.5m2.5 2.5l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    <p className="mt-4 text-lg font-semibold">Select an element</p>
                                    <p>Click on any element in the table to see its details and get a fun fact from Gemini.</p>
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
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                @keyframes tile-pop-in {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }

                .periodic-table-grid {
                    display: grid;
                    grid-template-columns: repeat(18, minmax(0, 1fr));
                    grid-template-rows: repeat(10, minmax(0, 1fr));
                    gap: 4px;
                    margin: 0 auto;
                    max-width: 1200px;
                }
                .element-tile {
                    padding: 4px;
                    border-radius: 4px;
                    border-width: 2px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    opacity: 0;
                    animation: tile-pop-in 0.5s ease-out forwards;
                }
                .element-tile:hover {
                    transform: scale(1.1);
                    z-index: 10;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .element-tile.selected {
                     transform: scale(1.1);
                     z-index: 10;
                     outline: 3px solid #6366f1;
                     box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                }

                .atom-loader {
                    width: 40px;
                    height: 40px;
                    position: relative;
                }
                .nucleus {
                    width: 10px;
                    height: 10px;
                    background-color: #6366f1;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                .electron {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    border: 2px solid #a5b4fc;
                    border-radius: 50%;
                    animation: rotate 2s linear infinite;
                }
                .electron::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background-color: #818cf8;
                    border-radius: 50%;
                    position: absolute;
                    top: -3px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .electron:nth-child(2) {
                    transform: rotate(60deg);
                    animation-duration: 1.5s;
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};