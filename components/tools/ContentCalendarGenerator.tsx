import React, { useState } from 'react';
import { generateContentCalendar, CalendarWeek } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="calendar-loader mx-auto">
            <div className="calendar-body">
                <div className="calendar-header"></div>
                <div className="calendar-grid">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="day" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                </div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your content calendar...</p>
        <style>{`
            .calendar-loader { width: 100px; height: 90px; position: relative; }
            .calendar-body { width: 100%; height: 100%; background: #f1f5f9; border: 3px solid #64748b; border-radius: 8px; padding: 8px; box-sizing: border-box; }
            .dark .calendar-body { background: #334155; border-color: #94a3b8; }
            .calendar-header { height: 15%; background: #ef4444; border-radius: 4px 4px 0 0; }
            .calendar-grid { height: 75%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 5px; }
            .day { background: #e2e8f0; border-radius: 2px; opacity: 0; animation: fill-day 1.5s infinite; }
            .dark .day { background: #475569; }
            @keyframes fill-day {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                50% { opacity: 1; transform: scale(1); }
            }
        `}</style>
    </div>
);

export const ContentCalendarGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [calendar, setCalendar] = useState<CalendarWeek[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your calendar.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateContentCalendar(topic);
            setCalendar(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate calendar.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your content strategy with a generated calendar.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                     calendar ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-center">4-Week Content Plan for "{topic}"</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {calendar.sort((a,b) => a.week - b.week).map((week) => (
                                    <div key={week.week} className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                        <h3 className="font-bold text-lg text-indigo-600">Week {week.week}</h3>
                                        <div className="mt-2 space-y-2 text-sm">
                                            <p><strong>📝 Blog:</strong> {week.blogPost}</p>
                                            <p><strong>📱 Social:</strong> {week.socialMedia}</p>
                                            <p><strong>📹 Video:</strong> {week.videoIdea}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center pt-4"><button onClick={() => setCalendar(null)} className="btn-primary">Create New Calendar</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Your Content Topic / Niche</label>
                            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'Personal Finance for Millennials'" className="input-style w-full"/>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Generate 4-Week Calendar</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
