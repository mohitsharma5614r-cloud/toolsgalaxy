import React, { useState, useMemo } from 'react';
import { generateCrossword, CrosswordData } from '../../services/geminiService';
import { Toast } from '../Toast';

interface WordInput {
  word: string;
  clue: string;
}

interface ProcessedPuzzle {
  grid: (string | null)[][];
  numbers: (number | null)[][];
  clues: {
    across: { num: number; clue: string }[];
    down: { num: number; clue: string }[];
  };
}

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="pencil-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="pencil-body" d="M90,20 L110,40 L60,90 L40,70 Z" />
            <path className="pencil-tip" d="M40,70 L50,80 L60,90 Z" />
            <g className="grid-lines">
                <line className="grid-line" x1="10" y1="10" x2="110" y2="10" />
                <line className="grid-line" x1="10" y1="35" x2="110" y2="35" />
                <line className="grid-line" x1="10" y1="60" x2="110" y2="60" />
                <line className="grid-line" x1="10" y1="85" x2="110" y2="85" />
                <line className="grid-line" x1="10" y1="10" x2="10" y2="110" />
                <line className="grid-line" x1="35" y1="10" x2="35" y2="110" />
                <line className="grid-line" x1="60" y1="10" x2="60" y2="110" />
                <line className="grid-line" x1="85" y1="10" x2="85" y2="110" />
            </g>
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">AI is sketching your puzzle...</p>
    </div>
);


export const CrosswordMaker: React.FC = () => {
    const [wordList, setWordList] = useState<WordInput[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [currentClue, setCurrentClue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [puzzle, setPuzzle] = useState<ProcessedPuzzle | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);

    const addWord = () => {
        if (currentWord.trim() && currentClue.trim() && !wordList.some(w => w.word.toLowerCase() === currentWord.trim().toLowerCase())) {
            setWordList([...wordList, { word: currentWord.trim().toUpperCase(), clue: currentClue.trim() }]);
            setCurrentWord('');
            setCurrentClue('');
        }
    };

    const removeWord = (index: number) => {
        setWordList(wordList.filter((_, i) => i !== index));
    };

    const processPuzzleData = (data: CrosswordData): ProcessedPuzzle => {
        const grid: (string | null)[][] = Array(data.height).fill(null).map(() => Array(data.width).fill(null));
        const numbers: (number | null)[][] = Array(data.height).fill(null).map(() => Array(data.width).fill(null));
        const clues = { across: [], down: [] };

        data.placedWords.forEach(wordData => {
            const { word, row, col, direction, number, clue } = wordData;
            if (direction === 'across') {
                clues.across.push({ num: number, clue });
                for (let i = 0; i < word.length; i++) {
                    grid[row][col + i] = word[i];
                }
            } else {
                clues.down.push({ num: number, clue });
                for (let i = 0; i < word.length; i++) {
                    grid[row + i][col] = word[i];
                }
            }
            numbers[row][col] = number;
        });
        
        clues.across.sort((a, b) => a.num - b.num);
        clues.down.sort((a, b) => a.num - b.num);

        return { grid, numbers, clues };
    };

    const handleGenerate = async () => {
        if (wordList.length < 3) {
            setError("Please add at least 3 words to generate a puzzle.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPuzzle(null);
        try {
            const result = await generateCrossword(wordList);
            const processed = processPuzzleData(result);
            setPuzzle(processed);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate crossword.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const cellSize = useMemo(() => puzzle ? Math.min(35, 500 / Math.max(puzzle.grid.length, puzzle.grid[0].length)) : 35, [puzzle]);

    const handlePrint = () => window.print();

    return (
        <>
            <div className="max-w-7xl mx-auto printable-area">
                <div className="text-center mb-10 no-print">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Crossword Maker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create your own crossword puzzle with AI-powered grid generation.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6 no-print">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">1. Add Words & Clues</h2>
                            <div className="space-y-3">
                                <input type="text" value={currentWord} onChange={e => setCurrentWord(e.target.value)} placeholder="Word (e.g., REACT)" className="w-full input-style" />
                                <input type="text" value={currentClue} onChange={e => setCurrentClue(e.target.value)} placeholder="Clue (e.g., A popular UI library)" className="w-full input-style" />
                                <button onClick={addWord} className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm">Add Word</button>
                            </div>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Your Word List ({wordList.length})</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {wordList.map((w, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
                                        <div>
                                            <p className="font-semibold text-sm">{w.word}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{w.clue}</p>
                                        </div>
                                        <button onClick={() => removeWord(i)} className="text-red-500 hover:text-red-700 p-1">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <button onClick={handleGenerate} disabled={isLoading || wordList.length < 3} className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-lg shadow-lg disabled:bg-slate-400">
                            2. Generate Crossword
                        </button>
                    </div>

                    <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? <div className="flex items-center justify-center min-h-[400px]"><Loader /></div> :
                        puzzle ? (
                            <div className="animate-fade-in printable-content">
                                <div className="crossword-grid" style={{ gridTemplateColumns: `repeat(${puzzle.grid[0].length}, ${cellSize}px)` }}>
                                    {puzzle.grid.flat().map((cell, i) => {
                                        const row = Math.floor(i / puzzle.grid[0].length);
                                        const col = i % puzzle.grid[0].length;
                                        return (
                                            <div key={i} className={`cell ${!cell ? 'filled' : ''}`} style={{ width: `${cellSize}px`, height: `${cellSize}px`, fontSize: `${cellSize * 0.6}px`}}>
                                                {puzzle.numbers[row][col] && <span className="number">{puzzle.numbers[row][col]}</span>}
                                                {showAnswers && cell}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="clues-container mt-8">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Across</h3>
                                        <ol className="space-y-1">
                                            {puzzle.clues.across.map(c => <li key={c.num} value={c.num}>{c.clue}</li>)}
                                        </ol>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Down</h3>
                                        <ol className="space-y-1">
                                            {puzzle.clues.down.map(c => <li key={c.num} value={c.num}>{c.clue}</li>)}
                                        </ol>
                                    </div>
                                </div>
                                <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700 no-print flex flex-wrap justify-center gap-4">
                                    <button onClick={() => setShowAnswers(!showAnswers)} className="px-6 py-2 bg-slate-600 text-white rounded-lg">{showAnswers ? 'Hide' : 'Show'} Answers</button>
                                    <button onClick={handlePrint} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Print</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px] text-center text-slate-500">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto"><path d="M16 4h2a2 2 0 0 1 2 2v2M8 4H6a2 2 0 0 0-2 2v2M16 20h2a2 2 0 0 0 2-2v-2M8 20H6a2 2 0 0 1-2-2v-2M12 8v8M8 12h8"/></svg>
                                    <p className="mt-4">Your puzzle will appear here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .pencil-loader { stroke: #6366f1; } .dark .pencil-loader { stroke: #818cf8; }
                .pencil-body { fill: #a5b4fc; } .dark .pencil-body { fill: #4f46e5; }
                .pencil-tip { fill: #334155; } .dark .pencil-tip { fill: #cbd5e1; }
                .grid-line { stroke-width: 2; stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw-line 2s infinite; }
                .grid-line:nth-child(2) { animation-delay: 0.1s; } .grid-line:nth-child(3) { animation-delay: 0.2s; }
                .grid-line:nth-child(4) { animation-delay: 0.3s; } .grid-line:nth-child(5) { animation-delay: 0.4s; }
                .grid-line:nth-child(6) { animation-delay: 0.5s; } .grid-line:nth-child(7) { animation-delay: 0.6s; }
                .grid-line:nth-child(8) { animation-delay: 0.7s; }
                .pencil-loader > path { animation: move-pencil 2s infinite; }
                @keyframes draw-line { to { stroke-dashoffset: 0; } }
                @keyframes move-pencil { 0%, 100% { transform: translate(0, 0) rotate(45deg); } 50% { transform: translate(80px, 80px) rotate(45deg); } }

                .crossword-grid { display: inline-grid; border: 2px solid #334155; }
                .dark .crossword-grid { border-color: #94a3b8; }
                .cell { position: relative; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-weight: bold; text-transform: uppercase; }
                .dark .cell { border-color: #4b5563; }
                .cell.filled { background-color: #334155; border-color: #334155; }
                .dark .cell.filled { background-color: #0f172a; border-color: #0f172a; }
                .cell .number { position: absolute; top: 1px; left: 2px; font-size: 8px; font-weight: normal; }

                .clues-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .clues-container ol { list-style-position: inside; padding-left: 0; list-style-type: none; }
                .clues-container li::before { content: attr(value) ". "; font-weight: bold; }
                
                @media print {
                  body { background-color: white !important; }
                  .no-print { display: none !important; }
                  .printable-area, .printable-content { margin: 0; padding: 0; width: 100%; max-width: 100%; box-shadow: none !important; border: none !important; }
                  .printable-content * { color: black !important; border-color: #666 !important; }
                  .cell.filled { background-color: black !important; border-color: black !important; }
                }

            `}</style>
        </>
    );
};
