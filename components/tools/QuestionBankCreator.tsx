import React, { useState } from 'react';

type QuestionType = 'Multiple Choice' | 'Short Answer' | 'True/False';
interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options?: string[];
    answer: string;
}
interface QuestionBank {
    [subject: string]: Question[];
}

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="filing-cabinet-loader mx-auto">
            <div className="cabinet-body">
                <div className="drawer-front"></div>
                <div className="drawer-front"></div>
                <div className="drawer-front"></div>
            </div>
            <div className="file"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Filing your question...</p>
        <style>{`
            .filing-cabinet-loader { width: 80px; height: 100px; position: relative; }
            .cabinet-body { width: 100%; height: 100%; background: #9ca3af; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-around; padding: 5px; box-sizing: border-box; }
            .dark .cabinet-body { background: #4b5563; }
            .drawer-front { height: 28%; background: #cbd5e1; border-radius: 3px; }
            .dark .drawer-front { background: #374151; }
            .drawer-front:nth-child(2) { animation: open-drawer 2s infinite ease-in-out; }
            .file { width: 20px; height: 30px; background: #f1f5f9; border-top: 4px solid #f87171; position: absolute; top: 0; left: 50%; transform: translateX(-50%); opacity: 0; animation: file-it 2s infinite ease-in-out; }
            @keyframes open-drawer {
                0%, 20%, 80%, 100% { transform: translateY(0); }
                40%, 60% { transform: translateY(-5px); }
            }
            @keyframes file-it {
                0%, 30% { top: 0; opacity: 1; }
                50% { top: 40px; opacity: 1; }
                70%, 100% { top: 40px; opacity: 0; }
            }
        `}</style>
    </div>
);

export const QuestionBankCreator: React.FC = () => {
    const [bank, setBank] = useState<QuestionBank>({
        'Sample: Science': [{ id: 1, type: 'Multiple Choice', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Golgi apparatus'], answer: 'Mitochondrion' }]
    });
    const [newSubject, setNewSubject] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('Sample: Science');
    
    // Form state
    const [qType, setQType] = useState<QuestionType>('Multiple Choice');
    const [qText, setQText] = useState('');
    const [qOptions, setQOptions] = useState(['', '', '', '']);
    const [qAnswer, setQAnswer] = useState('');

    const handleAddSubject = () => {
        if (newSubject.trim() && !bank[newSubject.trim()]) {
            setBank(prev => ({ ...prev, [newSubject.trim()]: [] }));
            setSelectedSubject(newSubject.trim());
            setNewSubject('');
        }
    };
    
    const handleAddQuestion = () => {
        if (!qText.trim() || !qAnswer.trim()) return;

        const newQuestion: Question = {
            id: Date.now(),
            text: qText,
            type: qType,
            answer: qAnswer
        };
        if (qType === 'Multiple Choice') {
            newQuestion.options = qOptions.filter(opt => opt.trim() !== '');
        }

        setBank(prev => ({
            ...prev,
            [selectedSubject]: [...(prev[selectedSubject] || []), newQuestion]
        }));
        
        // Reset form
        setQText('');
        setQOptions(['', '', '', '']);
        setQAnswer('');
    };

    const handleDeleteQuestion = (subject: string, id: number) => {
        setBank(prev => ({
            ...prev,
            [subject]: prev[subject].filter(q => q.id !== id)
        }));
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Question Bank Creator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Store and manage questions for your quizzes and tests.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
                        <div className="flex gap-2">
                            <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="e.g., History" className="input-style flex-grow" />
                            <button onClick={handleAddSubject} className="btn-primary px-4">+</button>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">Add a Question</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="label-style">Subject</label>
                                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="input-style w-full">
                                    {Object.keys(bank).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="label-style">Question Type</label>
                                <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                                    {(['Multiple Choice', 'Short Answer', 'True/False'] as QuestionType[]).map(type => (
                                        <button key={type} onClick={() => setQType(type)} className={`flex-1 text-xs sm:text-sm btn-toggle ${qType === type ? 'btn-toggle-active' : ''}`}>{type}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="label-style">Question Text</label>
                                <textarea value={qText} onChange={e => setQText(e.target.value)} rows={3} className="input-style w-full" />
                            </div>
                            {qType === 'Multiple Choice' && (
                                <div className="space-y-2">
                                    <label className="label-style">Options</label>
                                    {qOptions.map((opt, i) => <input key={i} value={opt} onChange={e => {const newOpts = [...qOptions]; newOpts[i] = e.target.value; setQOptions(newOpts)}} placeholder={`Option ${i+1}`} className="input-style w-full text-sm" />)}
                                </div>
                            )}
                            <div>
                                <label className="label-style">Correct Answer</label>
                                {qType === 'True/False' ? (
                                    <select value={qAnswer} onChange={e => setQAnswer(e.target.value)} className="input-style w-full"><option value="">Select</option><option>True</option><option>False</option></select>
                                ) : (
                                    <input value={qAnswer} onChange={e => setQAnswer(e.target.value)} placeholder="Enter the exact answer" className="input-style w-full" />
                                )}
                            </div>
                            <button onClick={handleAddQuestion} className="w-full btn-primary">Add to Bank</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Bank */}
                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border min-h-[500px]">
                    <h2 className="text-2xl font-bold mb-4">Your Question Bank</h2>
                    {Object.keys(bank).map(subject => (
                        <div key={subject} className="mb-6">
                            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 pb-1 mb-3">{subject}</h3>
                            <div className="space-y-3">
                                {bank[subject].length > 0 ? bank[subject].map(q => (
                                    <div key={q.id} className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg relative group">
                                        <p className="font-semibold text-sm pr-6">{q.text}</p>
                                        {q.options && <ul className="text-xs list-disc list-inside pl-4 mt-1 text-slate-500"> {q.options.map((o,i) => <li key={i}>{o}</li>)} </ul>}
                                        <p className="text-xs mt-1"><strong className="text-emerald-600">Answer:</strong> {q.answer}</p>
                                        <button onClick={() => handleDeleteQuestion(subject, q.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                                )) : <p className="text-sm text-slate-400">No questions in this subject yet.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #475569; }
                .dark .label-style { color: #94a3b8; }
                .btn-toggle { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; }
                .btn-toggle-active { background: white; color: #334155; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
                .dark .btn-toggle-active { background: #1e293b; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; }
            `}</style>
        </div>
    );
};