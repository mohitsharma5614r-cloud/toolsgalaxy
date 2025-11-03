import React, { useState } from 'react';
import { generateQuiz, QuizQuestion } from '../../services/geminiService';
import { Toast } from '../Toast';

type QuizStatus = 'configuring' | 'generating' | 'taking' | 'finished';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const QuizCreator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [status, setStatus] = useState<QuizStatus>('configuring');
    const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for the quiz.");
            return;
        }
        setStatus('generating');
        setError(null);

        try {
            const questions = await generateQuiz(topic, numQuestions, difficulty);
            setQuizData(questions);
            setStatus('taking');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate quiz.");
            setStatus('configuring');
        }
    };

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer
        setSelectedAnswer(answer);
        setUserAnswers(prev => [...prev, answer]);
        if (answer === quizData[currentQuestionIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setStatus('finished');
        }
    };

    const handleRestart = () => {
        setStatus('configuring');
        setTopic('');
        setQuizData([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setUserAnswers([]);
        setScore(0);
        setError(null);
    };

    const getOptionClass = (option: string) => {
        if (!selectedAnswer) {
            return "bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-slate-300 dark:border-slate-600";
        }
        const isCorrect = option === quizData[currentQuestionIndex].answer;
        const isSelected = option === selectedAnswer;

        if (isCorrect) return "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 ring-2 ring-emerald-400";
        if (isSelected) return "bg-red-100 dark:bg-red-900/50 border-red-500";
        return "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 opacity-60";
    };

    const renderContent = () => {
        switch (status) {
            case 'generating':
                return (
                    <div className="text-center py-20">
                        <div className="brain-loader mx-auto">
                            <div className="left-hemisphere"></div>
                            <div className="right-hemisphere"></div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">AI is crafting your questions...</p>
                    </div>
                );

            case 'taking':
                const question = quizData[currentQuestionIndex];
                const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
                return (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                            Question {currentQuestionIndex + 1} of {quizData.length}
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">{question.question}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={!!selectedAnswer}
                                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all duration-200 ${getOptionClass(option)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {selectedAnswer && (
                            <div className="text-center animate-fade-in">
                                <button onClick={handleNextQuestion} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                    {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'finished':
                const finalScore = (score / quizData.length) * 100;
                return (
                    <div className="animate-fade-in text-center space-y-6">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Quiz Complete!</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">You scored:</p>
                        <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">{score} / {quizData.length}</p>
                        <p className="text-2xl font-semibold text-slate-500 dark:text-slate-400">({finalScore.toFixed(0)}%)</p>
                        <button onClick={handleRestart} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                            Create a New Quiz
                        </button>
                    </div>
                );

            case 'configuring':
            default:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quiz Topic</label>
                            <input
                                id="topic"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., The Solar System, World War II"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
                                <div className="flex gap-2">
                                    {[5, 10, 15].map(num => (
                                        <button key={num} onClick={() => setNumQuestions(num)} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${numQuestions === num ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{num}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                                <div className="flex gap-2">
                                    {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{d}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleGenerate} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">
                            Generate Quiz
                        </button>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Quiz Creator 🧠</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a custom quiz on any topic in seconds.</p>
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
                .brain-loader {
                    width: 80px;
                    height: 70px;
                    position: relative;
                }
                .brain-loader .left-hemisphere, .brain-loader .right-hemisphere {
                    width: 45px;
                    height: 60px;
                    background-color: #a5b4fc;
                    border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
                    position: absolute;
                    bottom: 0;
                    animation: brain-pulse 1.5s infinite ease-in-out;
                }
                .dark .brain-loader .left-hemisphere, .dark .brain-loader .right-hemisphere {
                    background-color: #6366f1;
                }
                .brain-loader .left-hemisphere {
                    left: 0;
                    transform: rotate(-15deg);
                }
                .brain-loader .right-hemisphere {
                    right: 0;
                    transform: rotate(15deg);
                    animation-delay: 0.1s;
                }
                @keyframes brain-pulse {
                    0%, 100% { transform: scale(1) rotate(var(--angle)); }
                    50% { transform: scale(1.1) rotate(var(--angle)); }
                }
                .left-hemisphere { --angle: -15deg; }
                .right-hemisphere { --angle: 15deg; }
            `}</style>
        </>
    );
};