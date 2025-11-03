import React, { useState, useMemo, useEffect, useRef } from 'react';

const AnimatedNumber: React.FC<{ value: number, suffix?: string }> = ({ value, suffix }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 750;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const p = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - p, 3);
            setCurrent(start + (value - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current]);

    return <span>{current.toLocaleString('en-US', { maximumFractionDigits: 1 })}{suffix}</span>;
};

export const VideoWatchTimeCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [views, setViews] = useState('100000');
    const [minutes, setMinutes] = useState('5');
    const [seconds, setSeconds] = useState('30');

    const { totalHours, totalDays, totalYears } = useMemo(() => {
        const numViews = parseInt(views) || 0;
        const avgMinutes = parseInt(minutes) || 0;
        const avgSeconds = parseInt(seconds) || 0;
        
        if (numViews === 0 || (avgMinutes === 0 && avgSeconds === 0)) {
            return { totalHours: 0, totalDays: 0, totalYears: 0 };
        }

        const totalSeconds = numViews * (avgMinutes * 60 + avgSeconds);
        const hours = totalSeconds / 3600;
        const days = hours / 24;
        const years = days / 365.25;

        return { totalHours: hours, totalDays: days, totalYears: years };
    }, [views, minutes, seconds]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the total watch time of your videos.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <h2 className="text-xl font-bold">Your Video Stats</h2>
                    <div>
                        <label className="block text-sm font-medium">Total Views</label>
                        <input type="number" value={views} onChange={e => setViews(e.target.value)} className="input-style w-full mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Average View Duration</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="number" value={minutes} onChange={e => setMinutes(e.target.value)} className="input-style w-full text-center" />
                            <span>min</span>
                            <input type="number" value={seconds} onChange={e => setSeconds(e.target.value)} className="input-style w-full text-center" />
                            <span>sec</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col justify-center text-center">
                    <h2 className="text-xl font-bold mb-4">Total Watch Time</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={totalHours} /></p>
                            <p className="text-lg font-semibold text-slate-500">Hours</p>
                        </div>
                         <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <p className="text-3xl font-bold"><AnimatedNumber value={totalDays} /></p>
                            <p className="text-md text-slate-500">Days</p>
                        </div>
                         <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <p className="text-3xl font-bold"><AnimatedNumber value={totalYears} /></p>
                            <p className="text-md text-slate-500">Years</p>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
            `}</style>
        </div>
    );
};