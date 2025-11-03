
import React, { useState, useEffect, useRef } from 'react';

// Fun, deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Quiz data
const questions = [
    {
        id: 'q1',
        text: 'How did you sleep last night?',
        options: [
            { text: 'Like a log 😴', value: 1 },
            { text: 'Pretty good', value: 2 },
            { text: 'Tossed and turned', value: 3 },
            { text: 'Barely slept', value: 4 },
        ],
    },
    {
        id: 'q2',
        text: "What's your workload like today?",
        options: [
            { text: 'Super light', value: 1 },
            { text: 'Manageable', value: 2 },
            { text: 'A bit heavy', value: 3 },
            { text: 'Overwhelming', value: 4 },
        ],
    },
    {
        id: 'q3',
        text: 'Have you taken a break today?',
        options: [
            { text: 'Yes, a nice long one!', value: 1 },
            { text: 'A quick 5 minutes', value: 2 },
            { text: "Not yet, but I'm planning to", value: 3 },
            { text: 'No time for breaks', value: 4 },
        ],
    },
];

const getResult = (score: number) => {
    if (score <= 5) {
        return { level: 'Relaxed', message: "You're doing great! Keep riding those good vibes.", color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' };
    }
    if (score <= 8) {
        return { level: 'A Little Busy', message: "Things are a bit hectic, but you're handling it. Remember to take a deep breath.", color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    }
    return { level: 'High Stress', message: "It sounds like a tough day. Be kind to yourself and take a moment to unplug if you can.", color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
};

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="stress-loader mx-auto">
            <div className="person">🧘</div>
            <div className="wave w1"></div>
            <div className="wave w2"></div>
            <div className="wave w3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing your vibes...</p>
    </div>
);

export const StressLevelChecker: React.FC<{ title: string }> = ({ title }) => {
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [status, setStatus] = useState<'quiz' | 'loading' | 'result'>('quiz');
    const [result, setResult] = useState<{ level: string; message: string; color: string } | null>(null);

    const handleAnswerSelect = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateStress = () => {
        if (Object.keys(answers).length < questions.length) {
            // This is a simple validation, could add a proper toast/error message
            return;
        }

        setStatus('loading');
        setTimeout(() => {
            // FIX: Add explicit types to the reduce function's callback parameters to resolve type errors.
            const totalScore = Object.values(answers).reduce((sum: number, value: number) => sum + value, 0);
            const calculatedResult = getResult(totalScore);
            setResult(calculatedResult);
            setStatus('result');
        }, 2000);
    };
    
    const allQuestionsAnswered = Object.keys(answers).length === questions.length;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Answer a few questions to get a (non-scientific) stress level reading.</p>
            </div>
            <div className="min-h-[350px] flex flex-col justify-center">
                {status === 'loading' && <Loader />}
                {status === 'result' && result && (
                    <div className="animate-fade-in text-center space-y-6">
                        <h2 className="text-2xl font-bold">Your Stress Level Analysis</h2>
                        <div className={`p-6 rounded-lg ${result.color}`}>
                            <p className="text-5xl font-extrabold">{result.level}</p>
                        </div>
                        <p className="italic text-slate-600 dark:text-slate-400">"{result.message}"</p>
                        <button onClick={() => { setAnswers({}); setStatus('quiz'); setResult(null); }} className="btn-primary">Take Again</button>
                    </div>
                )}
                {status === 'quiz' && (
                     <div className="space-y-8 animate-fade-in">
                        {questions.map((q) => (
                            <div key={q.id}>
                                <p className="font-semibold mb-2">{q.text}</p>
                                <div className="flex flex-wrap gap-2">
                                    {q.options.map(opt => (
                                        <button
                                            key={opt.text}
                                            onClick={() => handleAnswerSelect(q.id, opt.value)}
                                            className={`btn-toggle ${answers[q.id] === opt.value ? 'btn-selected' : ''}`}
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={calculateStress} disabled={!allQuestionsAnswered} className="w-full btn-primary text-lg !mt-8">
                            Calculate Stress Level
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                .btn-primary { background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; transition: all 0.2s; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-toggle { padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-selected { background-color: #4f46e5; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .stress-loader { width: 100px; height: 100px; position: relative; }
                .person { font-size: 50px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: bob 2s infinite ease-in-out; }
                .wave {
                    position: absolute;
                    width: 100%; height: 100%;
                    border: 4px solid #a5b4fc;
                    border-radius: 50%;
                    opacity: 0;
                    animation: ripple 2s infinite;
                }
                .w2 { animation-delay: 0.5s; }
                .w3 { animation-delay: 1s; }
                @keyframes bob { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, -55%); } }
                @keyframes ripple { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }
            `}</style>
        </div>
    );
};