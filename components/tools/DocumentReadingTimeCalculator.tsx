
import React, { useState, useMemo } from 'react';

const AVERAGE_WPM = 225;

export const DocumentReadingTimeCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');

    const { wordCount, readingTimeMinutes } = useMemo(() => {
        if (!text.trim()) {
            return { wordCount: 0, readingTimeMinutes: 0 };
        }
        const words = text.trim().split(/\s+/).filter(Boolean);
        const count = words.length;
        const minutes = count / AVERAGE_WPM;
        return { wordCount: count, readingTimeMinutes: minutes };
    }, [text]);
    
    const formatTime = (minutes: number) => {
        if (minutes === 0) return '0 seconds';
        if (minutes < 1) {
            const seconds = Math.ceil(minutes * 60);
            return `${seconds} second${seconds > 1 ? 's' : ''}`;
        }
        const mins = Math.floor(minutes);
        const secs = Math.round((minutes - mins) * 60);
        
        let timeString = '';
        if (mins > 0) {
            timeString += `${mins} min${mins > 1 ? 's' : ''} `;
        }
        if (secs > 0) {
            timeString += `${secs} sec${secs > 1 ? 's' : ''}`;
        }
        return timeString.trim();
    };

    return (
        <>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    {/* FIX: Use title prop for the component's heading. */}
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate how long it will take to read a block of text.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={10}
                        placeholder="Paste your text here to calculate the reading time..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center animate-fade-in">
                        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Word Count</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{wordCount.toLocaleString()}</p>
                        </div>
                         <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Estimated Reading Time</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatTime(readingTimeMinutes)}</p>
                             <p className="text-xs text-slate-400">(at {AVERAGE_WPM} WPM)</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};