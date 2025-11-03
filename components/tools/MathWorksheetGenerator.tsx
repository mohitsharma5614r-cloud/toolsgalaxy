import React, { useState } from 'react';

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
type Difficulty = 'easy' | 'medium' | 'hard';
interface Problem {
  num1: number;
  num2: number;
  answer: number;
  operation: string;
}

const difficultyRanges = {
  easy: { min: 1, max: 10 },
  medium: { min: 1, max: 100 },
  hard: { min: 10, max: 999 },
};

const operationSymbols = {
  addition: '+',
  subtraction: '-',
  multiplication: '×',
  division: '÷',
};

// Loader component for generating state
const Loader = () => (
    <div className="text-center">
        <div className="calculator-loader mx-auto">
            <div className="screen"></div>
            <div className="buttons">
                <div className="btn"></div><div className="btn"></div><div className="btn"></div>
                <div className="btn"></div><div className="btn"></div><div className="btn"></div>
                <div className="btn"></div><div className="btn"></div><div className="btn"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your worksheet...</p>
    </div>
);

export const MathWorksheetGenerator: React.FC = () => {
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [numProblems, setNumProblems] = useState(20);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [worksheetKey, setWorksheetKey] = useState(0); // To trigger animations on regenerate

  const generateProblems = () => {
    setIsLoading(true);
    setShowAnswers(false);
    setProblems([]);

    setTimeout(() => {
        const newProblems: Problem[] = [];
        const { min, max } = difficultyRanges[difficulty];

        const generateNumber = () => Math.floor(Math.random() * (max - min + 1)) + min;

        while (newProblems.length < numProblems) {
            let num1 = generateNumber();
            let num2 = generateNumber();
            let answer = 0;

            switch (operation) {
                case 'addition':
                    answer = num1 + num2;
                    break;
                case 'subtraction':
                    if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive result
                    answer = num1 - num2;
                    break;
                case 'multiplication':
                    // Adjust range for multiplication to keep it reasonable
                    if (difficulty === 'hard') {
                        num1 = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
                        num2 = Math.floor(Math.random() * (50 - 2 + 1)) + 2;
                    } else if (difficulty === 'medium') {
                        num1 = Math.floor(Math.random() * (20 - 2 + 1)) + 2;
                        num2 = Math.floor(Math.random() * (12 - 2 + 1)) + 2;
                    }
                    answer = num1 * num2;
                    break;
                case 'division':
                    // Ensure integer answers
                    const factor = generateNumber();
                    answer = generateNumber();
                    num1 = factor * answer;
                    num2 = factor;
                    if (num2 === 0) continue; // Avoid division by zero
                    break;
            }
            newProblems.push({ num1, num2, answer, operation: operationSymbols[operation] });
        }
        setProblems(newProblems);
        setIsLoading(false);
        setWorksheetKey(prev => prev + 1);
    }, 1500); // Simulate generation time for animation
  };

  const handlePrint = () => {
      window.print();
  };
  
  return (
    <div className="max-w-4xl mx-auto printable-area">
      <div className="text-center mb-10 no-print">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Math Worksheet Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create custom math worksheets for practice.</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6 no-print">
        {/* Configuration Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Operation</label>
          <div className="flex flex-wrap gap-2">
            {(['addition', 'subtraction', 'multiplication', 'division'] as Operation[]).map(op => (
              <button key={op} onClick={() => setOperation(op)} className={`px-4 py-2 text-lg font-mono rounded-md transition-colors ${operation === op ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>
                {operationSymbols[op]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 capitalize rounded-md font-semibold transition-colors ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="numProblems" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Problems: {numProblems}
          </label>
          <input
            id="numProblems"
            type="range"
            min="10"
            max="50"
            step="5"
            value={numProblems}
            onChange={e => setNumProblems(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <button onClick={generateProblems} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">
          Generate Worksheet
        </button>
      </div>

      {/* Worksheet Display */}
      <div className="mt-8">
        {isLoading && <Loader />}
        
        {problems.length > 0 && !isLoading && (
            <div key={worksheetKey} className="worksheet-container animate-fade-in p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="worksheet-header text-center mb-8 border-b-2 border-slate-300 dark:border-slate-600 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Math Practice</h2>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mt-2">
                        <span>Name: ____________________</span>
                        <span>Date: ____________________</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-6 text-lg font-mono">
                    {problems.map((p, i) => (
                        <div key={i} className="flex flex-col items-end">
                            <span>{p.num1}</span>
                            <span>{p.operation} {p.num2}</span>
                            <span className="w-full border-t-2 border-slate-400 dark:border-slate-500 mt-1 mb-1"></span>
                            <span className={`answer-box h-8 transition-colors duration-300 ${showAnswers ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                                {showAnswers && p.answer}
                            </span>
                        </div>
                    ))}
                </div>

                 <div className="mt-12 text-center pt-6 border-t border-slate-300 dark:border-slate-600 no-print flex flex-wrap justify-center gap-4">
                    <button onClick={() => setShowAnswers(!showAnswers)} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                        {showAnswers ? 'Hide' : 'Show'} Answers
                    </button>
                     <button onClick={generateProblems} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                        Regenerate
                    </button>
                    <button onClick={handlePrint} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                        Print Worksheet
                    </button>
                </div>
            </div>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }

        .calculator-loader {
            width: 80px;
            height: 100px;
            background-color: #9ca3af;
            border-radius: 8px;
            padding: 8px;
            border: 2px solid #6b7280;
            display: flex;
            flex-direction: column;
            gap: 8px;
            animation: calc-shake 2s infinite;
        }
        .dark .calculator-loader {
            background-color: #4b5563;
            border-color: #374151;
        }

        .calculator-loader .screen {
            height: 25%;
            background-color: #cbd5e1;
            border-radius: 4px;
            animation: screen-flicker 1.5s infinite steps(2, start);
        }
        .dark .calculator-loader .screen {
             background-color: #1f2937;
        }

        .calculator-loader .buttons {
            flex-grow: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
        }

        .calculator-loader .btn {
            background-color: #e5e7eb;
            border-radius: 4px;
        }
        .dark .calculator-loader .btn {
            background-color: #374151;
        }
        
        @keyframes calc-shake {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
        }
        @keyframes screen-flicker {
            to { background-color: #94a3b8; }
        }
        .dark @keyframes screen-flicker {
            to { background-color: #374151; }
        }
        
        @media print {
            body {
                background-color: white !important;
            }
            .no-print {
                display: none !important;
            }
            .printable-area {
                margin: 0;
                padding: 0;
                width: 100%;
                max-width: 100%;
            }
            .worksheet-container {
                box-shadow: none !important;
                border: none !important;
                color: black !important;
            }
             .worksheet-container * {
                color: black !important;
                border-color: #aaa !important;
            }
            .answer-box {
                color: #059669 !important; /* emerald-600 */
            }
        }
      `}</style>
    </div>
  );
};