import React, { useState } from 'react';
import { generateTestPaper, TestQuestion } from '../../services/geminiService';
import { Toast } from '../Toast';

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
            </g>
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">AI is preparing your test...</p>
        <style>{`
            .pencil-loader { stroke: #6366f1; } .dark .pencil-loader { stroke: #818cf8; }
            .pencil-body { fill: #a5b4fc; } .dark .pencil-body { fill: #4f46e5; }
            .pencil-tip { fill: #334155; } .dark .pencil-tip { fill: #cbd5e1; }
            .grid-line { stroke-width: 2; stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw-line-test 2s infinite; }
            .grid-line:nth-child(2) { animation-delay: 0.2s; } .grid-line:nth-child(3) { animation-delay: 0.4s; } .grid-line:nth-child(4) { animation-delay: 0.6s; }
            .pencil-loader > .pencil-group { animation: move-pencil-test 2s infinite; }
            @keyframes draw-line-test { to { stroke-dashoffset: 0; } }
            @keyframes move-pencil-test { 0%, 100% { transform: translate(0, 0) rotate(45deg); } 50% { transform: translate(80px, 80px) rotate(45deg); } }
        `}</style>
    </div>
);


export const TestPaperGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [questionTypes, setQuestionTypes] = useState<string[]>(['Multiple Choice']);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);

    const handleTypeToggle = (type: string) => {
        setQuestionTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleGenerate = async () => {
        if (!topic.trim() || questionTypes.length === 0) {
            setError("Please provide a topic and select at least one question type.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        try {
            const result = await generateTestPaper(topic, numQuestions, questionTypes);
            setQuestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate test paper.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePrint = () => window.print();

    return (
        <>
            <div className="max-w-7xl mx-auto printable-area">
                <div className="text-center mb-10 no-print">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Test Paper Generator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create custom test papers with different question types.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Topic</label>
                            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The Solar System" className="input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Number of Questions: {numQuestions}</label>
                            <input type="range" min="5" max="25" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full mt-2" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Question Types</label>
                        <div className="flex flex-wrap gap-2">
                            {['Multiple Choice', 'Short Answer', 'True/False'].map(type => (
                                <button key={type} onClick={() => handleTypeToggle(type)} className={`btn-toggle ${questionTypes.includes(type) ? 'btn-selected' : ''}`}>{type}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary text-lg">Generate Test</button>
                </div>

                <div className="mt-8">
                    {isLoading && <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>}
                    {questions.length > 0 && (
                        <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 printable-content animate-fade-in">
                            <header className="text-center border-b-2 pb-4 mb-6">
                                <h2 className="text-2xl font-bold">Test: {topic}</h2>
                                <div className="flex justify-between mt-4 text-sm">
                                    <p>Name: _________________________</p>
                                    <p>Date: _________________________</p>
                                </div>
                            </header>
                            <section className="space-y-6">
                                {questions.map((q, i) => (
                                    <div key={i}>
                                        <p className="font-semibold">{i + 1}. {q.questionText}</p>
                                        <div className="pl-4 mt-2">
                                            {q.questionType === 'Multiple Choice' && q.options && (
                                                <ul className="space-y-1">
                                                    {q.options.map((opt, oi) => <li key={oi}>{String.fromCharCode(65 + oi)}. {opt}</li>)}
                                                </ul>
                                            )}
                                            {q.questionType === 'Short Answer' && <div className="w-full h-12 border-b mt-4"></div>}
                                            {q.questionType === 'True/False' && <div className="flex gap-4"><span>True</span><span>False</span></div>}
                                        </div>
                                    </div>
                                ))}
                            </section>
                             {showAnswers && (
                                <section className="mt-10 pt-6 border-t-2 border-dashed">
                                    <h3 className="text-xl font-bold text-center mb-4">Answer Key</h3>
                                    <ol className="list-decimal list-inside space-y-1">
                                        {questions.map((q, i) => <li key={i}>{q.answer}</li>)}
                                    </ol>
                                </section>
                            )}
                             <div className="mt-8 text-center pt-6 border-t no-print flex flex-wrap justify-center gap-4">
                                <button onClick={() => setShowAnswers(!showAnswers)} className="btn-secondary">{showAnswers ? 'Hide' : 'Show'} Answers</button>
                                <button onClick={handlePrint} className="btn-primary">Print Test</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; background-color: #f1f5f9; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .btn-toggle { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; transition: all 0.2s; background-color: #e2e8f0; }
                .dark .btn-toggle { background-color: #334155; }
                .btn-toggle.btn-selected { background-color: #4f46e5; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @media print {
                  body { background: white !important; }
                  .no-print { display: none !important; }
                  .printable-area { margin: 0; padding: 0; width: 100%; max-width: 100%; }
                  .printable-content { box-shadow: none !important; border: none !important; color: black !important; }
                  .printable-content * { color: black !important; border-color: #ccc !important; background: transparent !important; }
                }
            `}</style>
        </>
    );
};