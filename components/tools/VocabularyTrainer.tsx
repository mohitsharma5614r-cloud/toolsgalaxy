import React, { useState } from 'react';
import { generateVocabularyWords, VocabularyWord } from '../../services/geminiService';
import { Toast } from '../Toast';

type TrainerStatus = 'configuring' | 'generating' | 'training' | 'finished';
type Difficulty = 'Common' | 'Advanced' | 'Expert';

export const VocabularyTrainer: React.FC = () => {
    const [status, setStatus] = useState<TrainerStatus>('configuring');
    const [difficulty, setDifficulty] = useState<Difficulty>('Common');
    const [words, setWords] = useState<VocabularyWord[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    const WORD_COUNT = 5;

    const handleStart = async () => {
        setStatus('generating');
        setError(null);
        try {
            const generatedWords = await generateVocabularyWords(difficulty, WORD_COUNT);
            setWords(generatedWords);
            setStatus('training');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate vocabulary words.");
            setStatus('configuring');
        }
    };

    const handleAnswer = (option: string) => {
        if (selectedOption) return;

        setSelectedOption(option);
        if (option === words[currentIndex].definition) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            setStatus('finished');
        }
    };

    const handleRestart = () => {
        setStatus('configuring');
        setWords([]);
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setError(null);
    };

    const getOptionClass = (option: string) => {
        if (!selectedOption) {
            return "bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-slate-300 dark:border-slate-600";
        }
        const isCorrect = option === words[currentIndex].definition;
        const isSelected = option === selectedOption;

        if (isCorrect) return "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 ring-2 ring-emerald-400";
        if (isSelected) return "bg-red-100 dark:bg-red-900/50 border-red-500";
        return "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 opacity-60 cursor-not-allowed";
    };

    const renderContent = () => {
        switch (status) {
            case 'generating':
                return (
                    <div className="text-center py-20">
                        <div className="book-loader mx-auto">
                            <div className="book">
                                <div className="book__pg-shadow"></div>
                                <div className="book__pg"></div>
                                <div className="book__pg book__pg--2"></div>
                                <div className="book__pg book__pg--3"></div>
                                <div className="book__pg book__pg--4"></div>
                                <div className="book__pg book__pg--5"></div>
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Compiling vocabulary list...</p>
                    </div>
                );

            case 'training':
                const word = words[currentIndex];
                const progress = ((currentIndex + 1) / words.length) * 100;
                return (
                    <div className="animate-fade-in space-y-6">
                         <div className="text-center">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Word {currentIndex + 1} of {words.length}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Score: {score}</p>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 capitalize">{word.word}</h2>
                        <p className="text-center text-slate-500 dark:text-slate-400 text-lg">Choose the correct definition:</p>
                        <div className="grid grid-cols-1 gap-4">
                            {word.options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={!!selectedOption}
                                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all duration-200 ${getOptionClass(option)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {selectedOption && (
                            <div className="text-center animate-fade-in">
                                <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                    {currentIndex < words.length - 1 ? 'Next Word' : 'Finish Training'}
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'finished':
                return (
                     <div className="animate-fade-in text-center space-y-6 py-10">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Training Complete!</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">Your final score is:</p>
                        <p className="text-7xl font-extrabold text-indigo-600 dark:text-indigo-400">{score} / {words.length}</p>
                        <button onClick={handleRestart} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                            Train Again
                        </button>
                    </div>
                );
            
            case 'configuring':
            default:
                return (
                    <div className="space-y-8 text-center">
                        <div>
                            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Select Difficulty</label>
                            <div className="flex justify-center gap-3">
                                {(['Common', 'Advanced', 'Expert'] as Difficulty[]).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${difficulty === d ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                    >{d}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleStart} className="w-full max-w-xs mx-auto px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">
                            Start Training
                        </button>
                    </div>
                );
        }
    };

    return (
         <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Vocabulary Trainer 📖</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Expand your lexicon with AI-powered quizzes.</p>
                </div>
                {renderContent()}
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
                .book-loader {
                    --book-color: #a5b4fc;
                    --book-cover-color: #6366f1;
                }
                .dark .book-loader {
                    --book-color: #4338ca;
                    --book-cover-color: #818cf8;
                }
                .book {
                    position: relative;
                    width: 80px;
                    height: 55px;
                    perspective: 1000px;
                }
                .book__pg-shadow {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transform-origin: 0% 50%;
                    animation: page-flip 2.5s infinite;
                    background: linear-gradient(to right, rgba(0,0,0,0) 80%, rgba(0,0,0,0.1) 100%);
                }
                .book__pg {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--book-color);
                    border: 2px solid var(--book-cover-color);
                    border-radius: 0 5px 5px 0;
                    transform-style: preserve-3d;
                    transform-origin: 0% 50%;
                    animation: page-flip 2.5s infinite;
                }
                .book__pg--2 { animation-delay: 0.1s; }
                .book__pg--3 { animation-delay: 0.2s; }
                .book__pg--4 { animation-delay: 0.3s; }
                .book__pg--5 { animation-delay: 0.4s; }
                @keyframes page-flip {
                    0%, 10% { transform: rotateY(0deg); }
                    50% { transform: rotateY(-180deg); }
                    100% { transform: rotateY(-180deg); }
                }
            `}</style>
        </>
    );
};
