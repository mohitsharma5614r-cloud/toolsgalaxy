import React, { useState } from 'react';
import { generateFeedbackForm, FeedbackQuestion } from '../../services/geminiService';
import { Toast } from '../Toast';

type FormType = 'General Feedback' | 'Understanding Check' | 'Engagement Level';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="form-loader mx-auto">
            <div className="form-paper">
                <div className="form-line"></div>
                <div className="form-line"></div>
                <div className="form-line"></div>
            </div>
            <div className="pencil">
                <div className="pencil-tip"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Drafting your form...</p>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
        >
            {copied ? 'Copied!' : 'Copy as Text'}
        </button>
    );
};

export const StudentFeedbackFormBuilder: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [formType, setFormType] = useState<FormType>('General Feedback');
    const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a lesson topic.");
            return;
        }
        setIsLoading(true);
        setQuestions([]);
        setError(null);
        try {
            const result = await generateFeedbackForm(topic, formType);
            setQuestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate the form.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => window.print();

    const formatForCopy = (): string => {
        if (questions.length === 0) return '';
        let text = `Student Feedback: ${topic}\n\n`;
        questions.forEach((q, i) => {
            text += `${i + 1}. ${q.questionText}\n`;
            if (q.questionType === 'rating') {
                text += "(Rate on a scale of 1 to 5)\n\n";
            } else if (q.questionType === 'multiple-choice' && q.options) {
                q.options.forEach(opt => text += `   - ${opt}\n`);
                text += '\n';
            } else { // short-answer
                text += "________________________________________\n\n";
            }
        });
        return text;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto printable-area">
                <div className="text-center mb-10 no-print">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Student Feedback Form Builder</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Quickly generate feedback forms to gauge student understanding and engagement.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6 no-print">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lesson Topic</label>
                        <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The American Revolution" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Feedback Style</label>
                        <div className="flex flex-wrap gap-2">
                            {(['General Feedback', 'Understanding Check', 'Engagement Level'] as FormType[]).map(type => (
                                <button key={type} onClick={() => setFormType(type)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${formType === type ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{type}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        Generate Form
                    </button>
                </div>
                
                <div className="mt-8">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> :
                    questions.length > 0 ? (
                        <div className="animate-fade-in p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 printable-content">
                            <div className="text-center mb-6 border-b-2 border-slate-300 dark:border-slate-600 pb-4">
                                <h2 className="text-2xl font-bold">Feedback: {topic}</h2>
                                <p className="text-slate-500">Name: _________________________</p>
                            </div>
                            <div className="space-y-6">
                                {questions.map((q, i) => (
                                    <div key={i}>
                                        <p className="font-semibold">{i + 1}. {q.questionText}</p>
                                        <div className="mt-2 pl-4">
                                            {q.questionType === 'rating' && (
                                                <div className="flex gap-2 items-center text-xl text-slate-400">
                                                    <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                                                    <span className="text-sm ml-2">(Circle one)</span>
                                                </div>
                                            )}
                                            {q.questionType === 'short-answer' && (
                                                <div className="w-full h-20 border-b-2 border-slate-300 dark:border-slate-600"></div>
                                            )}
                                            {q.questionType === 'multiple-choice' && q.options && (
                                                <div className="space-y-2">
                                                    {q.options.map((opt, oi) => <div key={oi} className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-slate-400 rounded"></div><span>{opt}</span></div>)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700 no-print flex flex-wrap justify-center gap-4">
                                <CopyButton textToCopy={formatForCopy()} />
                                <button onClick={handlePrint} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">Print Form</button>
                            </div>
                        </div>
                    ) : null }
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .form-loader { width: 80px; height: 100px; position: relative; }
                .form-paper { width: 100%; height: 100%; background: #f1f5f9; border: 2px solid #9ca3af; border-radius: 4px; padding: 10px; box-sizing: border-box; }
                .dark .form-paper { background: #1e293b; border-color: #475569; }
                .form-line { width: 80%; height: 6px; background: #cbd5e1; border-radius: 3px; margin-top: 12px; }
                .dark .form-line { background: #334155; }
                
                .pencil { position: absolute; top: -20px; right: -10px; width: 30px; height: 120px; background: #fcd34d; border-radius: 10px 10px 0 0; transform: rotate(20deg); animation: write-anim 2s infinite ease-in-out; }
                .pencil-tip { position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 15px 15px 0 15px; border-color: #334155 transparent transparent transparent; }

                @keyframes write-anim {
                    0% { transform: rotate(20deg) translateY(0); }
                    50% { transform: rotate(20deg) translateY(60px); }
                    100% { transform: rotate(20deg) translateY(0); }
                }

                @media print {
                  body { background-color: white !important; }
                  .no-print { display: none !important; }
                  .printable-area, .printable-content { margin: 0; padding: 0; width: 100%; max-width: 100%; box-shadow: none !important; border: none !important; }
                  .printable-content * { color: black !important; border-color: #666 !important; background-color: transparent !important; }
                }
            `}</style>
        </>
    );
};
