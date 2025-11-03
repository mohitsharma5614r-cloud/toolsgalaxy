import React, { useState } from 'react';

const questions = [
    { text: "How much of your workday was spent on your Most Important Tasks?", options: [ {text: "< 25%", score: 1}, {text: "25-50%", score: 2}, {text: "50-75%", score: 4}, {text: "> 75%", score: 5} ] },
    { text: "How often were you distracted by notifications or social media?", options: [ {text: "Constantly", score: 1}, {text: "Often", score: 2}, {text: "Sometimes", score: 4}, {text: "Rarely/Never", score: 5} ] },
    { text: "Did you take planned breaks away from your screen?", options: [ {text: "No breaks", score: 1}, {text: "One short break", score: 3}, {text: "Multiple short breaks", score: 5} ] },
    { text: "How many items did you complete on your to-do list?", options: [ {text: "None", score: 1}, {text: "A few", score: 3}, {text: "Most of them", score: 4}, {text: "All of them!", score: 5} ] },
    { text: "How would you rate your energy level throughout the day?", options: [ {text: "Exhausted", score: 1}, {text: "Up and down", score: 3}, {text: "Mostly steady", score: 4}, {text: "High energy", score: 5} ] },
];
const maxScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0);

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const angle = (score / 100) * 180;
    const getStatusColor = (s: number) => {
        if (s < 40) return 'text-red-500';
        if (s < 75) return 'text-yellow-500';
        return 'text-emerald-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0" style={{ background: `conic-gradient(from 180deg at 50% 100%, #ef4444 0 40%, #f59e0b 41% 75%, #10b981 76% 100%)` }}></div>
                <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-1000 ease-out" style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}></div>
            </div>
            <p className={`-mt-8 text-5xl font-extrabold ${getStatusColor(score)}`}>{Math.round(score)}</p>
        </div>
    );
};


export const ProductivityScoreCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [answers, setAnswers] = useState<number[]>([]);
    const [step, setStep] = useState(0);

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers];
        newAnswers[step] = score;
        setAnswers(newAnswers);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep(step + 1); // Go to results
        }
    };
    
    const score = (answers.reduce((a, b) => a + b, 0) / maxScore) * 100;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Answer a few questions to get your daily productivity score.</p>
            </div>

            {step < questions.length ? (
                <div className="animate-fade-in">
                    <p className="text-sm font-semibold text-center text-slate-500 mb-4">Question {step + 1} of {questions.length}</p>
                    <h2 className="text-2xl font-bold text-center mb-6">{questions[step].text}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {questions[step].options.map(opt => (
                            <button key={opt.text} onClick={() => handleAnswer(opt.score)} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                 <div className="text-center animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">Your Productivity Score</h2>
                    <ScoreGauge score={score} />
                    <button onClick={() => {setStep(0); setAnswers([]);}} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg">Take Again</button>
                </div>
            )}
        </div>
    );
};
