import React, { useState } from 'react';
import { generateLessonPlan, LessonPlan } from '../../services/geminiService';
import { Toast } from '../Toast';

type GradeLevel = 'Elementary School' | 'Middle School' | 'High School';
type Duration = 30 | 45 | 60;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="apple-tree-loader mx-auto">
            <div className="branch"></div>
            <div className="apple"></div>
            <div className="leaf l1"></div>
            <div className="leaf l2"></div>
            <div className="leaf l3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Cultivating knowledge...</p>
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
            {copied ? 'Copied!' : 'Copy Plan'}
        </button>
    );
};

export const LessonPlanMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState<GradeLevel>('Middle School');
    const [duration, setDuration] = useState<Duration>(45);
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a lesson topic.");
            return;
        }
        setIsLoading(true);
        setLessonPlan(null);
        setError(null);
        try {
            const result = await generateLessonPlan(topic, gradeLevel, duration);
            setLessonPlan(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate lesson plan.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePrint = () => window.print();

    const formatForCopy = (): string => {
        if (!lessonPlan) return '';
        let text = `Lesson Plan: ${topic}\n`;
        text += `Grade Level: ${gradeLevel} | Duration: ${duration} minutes\n\n`;
        text += "--- LEARNING OBJECTIVES ---\n" + lessonPlan.learningObjectives.map(obj => `- ${obj}`).join('\n') + '\n\n';
        text += "--- MATERIALS ---\n" + lessonPlan.materials.map(mat => `- ${mat}`).join('\n') + '\n\n';
        text += "--- LESSON ACTIVITIES ---\n" + lessonPlan.lessonActivities.map(act => `(${act.duration} mins) ${act.activity}`).join('\n') + '\n\n';
        text += "--- ASSESSMENT ---\n" + lessonPlan.assessment;
        return text;
    };

    return (
        <>
            <div className="max-w-4xl mx-auto printable-area">
                <div className="text-center mb-10 no-print">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Lesson Plan Maker 🍎</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a complete lesson plan for any topic and grade level.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6 no-print">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lesson Topic</label>
                        <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The Water Cycle" className="w-full input-style" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Grade Level</label>
                            <div className="flex gap-2">
                                {(['Elementary School', 'Middle School', 'High School'] as GradeLevel[]).map(level => (
                                    <button key={level} onClick={() => setGradeLevel(level)} className={`flex-1 py-2 text-xs sm:text-sm rounded-md font-semibold transition-colors ${gradeLevel === level ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{level.replace(' School', '')}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                            <div className="flex gap-2">
                                {([30, 45, 60] as Duration[]).map(d => (
                                    <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${duration === d ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{d} min</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        Generate Lesson Plan
                    </button>
                </div>
                
                <div className="mt-8">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> :
                    lessonPlan ? (
                        <div className="animate-fade-in p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 printable-content">
                            <div className="text-center mb-6 border-b-2 border-slate-300 dark:border-slate-600 pb-4">
                                <h2 className="text-2xl font-bold">Lesson Plan: {topic}</h2>
                                <p className="text-slate-500">{gradeLevel} | {duration} Minutes</p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Learning Objectives</h3>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {lessonPlan.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Materials</h3>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {lessonPlan.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Lesson Activities</h3>
                                    <div className="mt-2 space-y-3">
                                        {lessonPlan.lessonActivities.map((act, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <span className="font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">({act.duration} min)</span>
                                                <p>{act.activity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Assessment</h3>
                                    <p className="mt-2">{lessonPlan.assessment}</p>
                                </div>
                            </div>
                            <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700 no-print flex flex-wrap justify-center gap-4">
                                <CopyButton textToCopy={formatForCopy()} />
                                <button onClick={handlePrint} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">Print Plan</button>
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

                .apple-tree-loader { width: 100px; height: 100px; position: relative; }
                .branch { width: 6px; height: 70px; background: #8d6e63; position: absolute; bottom: 0; left: 50%; transform-origin: bottom center; animation: grow-branch 1.5s ease-out forwards; }
                .dark .branch { background: #a1887f; }
                .apple { width: 20px; height: 20px; background: #ef4444; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; position: absolute; top: 20px; left: 65%; opacity: 0; animation: grow-apple 1s 1s ease-out forwards; }
                .leaf { width: 15px; height: 10px; background: #4caf50; border-radius: 40% 60% 30% 70% / 50% 50% 50% 50%; position: absolute; opacity: 0; }
                .leaf.l1 { top: 40px; left: 30%; transform: rotate(-20deg); animation: grow-leaf 1s 0.8s forwards; }
                .leaf.l2 { top: 25px; left: 40%; transform: rotate(10deg); animation: grow-leaf 1s 1.2s forwards; }
                .leaf.l3 { top: 35px; left: 60%; transform: rotate(120deg); animation: grow-leaf 1s 1.5s forwards; }

                @keyframes grow-branch { from { transform: scaleY(0); } to { transform: scaleY(1); } }
                @keyframes grow-apple { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes grow-leaf { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                @media print {
                  body { background-color: white !important; }
                  .no-print { display: none !important; }
                  .printable-area, .printable-content { margin: 0; padding: 0; width: 100%; max-width: 100%; box-shadow: none !important; border: none !important; }
                  .printable-content * { color: black !important; border-color: #aaa !important; background-color: transparent !important; }
                }
            `}</style>
        </>
    );
};
