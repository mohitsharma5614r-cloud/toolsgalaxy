import React, { useState, useMemo } from 'react';

interface Task {
    id: number;
    name: string;
    startTime: string; // "09:00"
    duration: number; // in minutes
    completed: boolean;
}

const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`); // 8 AM to 6 PM

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="hourglass-loader mx-auto">
            <div className="hourglass-top"></div>
            <div className="hourglass-bottom"></div>
            <div className="sand"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Planning your productive day...</p>
        <style>{`
            .hourglass-loader { width: 60px; height: 100px; position: relative; }
            .hourglass-top, .hourglass-bottom {
                width: 100%; height: 50%;
                border: 3px solid #9ca3af;
                box-sizing: border-box;
            }
            .hourglass-top { border-radius: 50% 50% 0 0; border-bottom: none; }
            .hourglass-bottom { border-radius: 0 0 50% 50%; border-top: none; }
            .sand {
                position: absolute; top: 5px; left: 5px;
                width: 50px; height: 40px; background: #facc15;
                clip-path: polygon(0 0, 100% 0, 50% 100%);
                animation: flow-sand 2.5s infinite;
            }
            @keyframes flow-sand {
                0% { transform: translateY(0); height: 40px; }
                100% { transform: translateY(50px); height: 0px; }
            }
        `}</style>
    </div>
);

export const ProductivityTimeBlocker: React.FC<{ title: string }> = ({ title }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState(60);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            const newTask: Task = { id: Date.now(), name, startTime, duration, completed: false };
            setTasks([...tasks, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime)));
            setName('');
        }
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const totalMinutes = useMemo(() => tasks.reduce((sum, t) => sum + t.duration, 0), [tasks]);
    const completedMinutes = useMemo(() => tasks.filter(t => t.completed).reduce((sum, t) => sum + t.duration, 0), [tasks]);
    const progress = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;

    const timeToPosition = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        return ((hour - 8) * 60 + minute) / (10 * 60) * 100; // Position as % of 10-hour day
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a time-blocked schedule to maximize your focus.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Add Task</h2>
                    <form onSubmit={addTask} className="space-y-3">
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Task name" className="input-style w-full" />
                        <select value={startTime} onChange={e => setStartTime(e.target.value)} className="input-style w-full">
                            {Array.from({ length: 10 * 4 }, (_, i) => {
                                const hour = 8 + Math.floor(i / 4);
                                const minute = (i % 4) * 15;
                                return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                            }).map(t => <option key={t}>{t}</option>)}
                        </select>
                        <div>
                            <label>Duration: {duration} mins</label>
                            <input type="range" min="15" max="180" step="15" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Add Block</button>
                    </form>
                </div>
                
                <div className="md:col-span-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold text-center mb-4">Your Day</h2>
                     <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                        <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="relative h-[500px] overflow-y-auto">
                        {/* Timeline */}
                        {timeSlots.map(time => (
                            <div key={time} className="flex items-center h-[50px] border-t border-slate-200 dark:border-slate-700">
                                <span className="text-xs text-slate-400 -ml-10 w-8 text-right">{time}</span>
                            </div>
                        ))}
                        {/* Tasks */}
                        {tasks.map((task, i) => (
                             <div 
                                key={task.id}
                                className={`task-block ${task.completed ? 'opacity-50' : ''}`}
                                style={{
                                    top: `${timeToPosition(task.startTime)}%`,
                                    height: `${(task.duration / (10 * 60)) * 100}%`,
                                    animationDelay: `${i * 50}ms`
                                }}
                                onClick={() => toggleTask(task.id)}
                            >
                                <span className={`font-bold text-sm ${task.completed ? 'line-through' : ''}`}>{task.name}</span>
                                <span className="text-xs">{task.startTime} - {task.duration}m</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes slide-in-task { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
                .task-block {
                    position: absolute;
                    left: 45px; right: 0;
                    background: #c7d2fe;
                    color: #312e81;
                    border-left: 4px solid #4f46e5;
                    border-radius: 4px;
                    padding: 4px 8px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    transform-origin: left;
                    animation: slide-in-task 0.4s ease-out forwards;
                }
                 .dark .task-block { background: #3730a3; color: #e0e7ff; border-color: #818cf8; }
            `}</style>
        </div>
    );
};
