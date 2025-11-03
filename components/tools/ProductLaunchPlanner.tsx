
import React, { useState, useMemo } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}
type Phase = 'Pre-Launch' | 'Launch Day' | 'Post-Launch';
type PlannerData = Record<Phase, Task[]>;

const initialData: PlannerData = {
    'Pre-Launch': [
        { id: 1, text: 'Finalize product features', completed: false },
        { id: 2, text: 'Prepare marketing materials', completed: false },
        { id: 3, text: 'Set up analytics and tracking', completed: false },
        { id: 4, text: 'Announce launch date', completed: false },
    ],
    'Launch Day': [
        { id: 5, text: 'Deploy product to production', completed: false },
        { id: 6, text: 'Send announcement email', completed: false },
        { id: 7, text: 'Post on all social media channels', completed: false },
    ],
    'Post-Launch': [
        { id: 8, text: 'Monitor analytics for bugs and usage', completed: false },
        { id: 9, text: 'Collect user feedback', completed: false },
        { id: 10, text: 'Publish a "lessons learned" blog post', completed: false },
    ]
};

const PhaseSection: React.FC<{
    title: Phase;
    tasks: Task[];
    onAddTask: (text: string) => void;
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
}> = ({ title, tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTask, setNewTask] = useState('');

    const progress = useMemo(() => {
        if (tasks.length === 0) return 0;
        const completedSteps = tasks.filter(s => s.completed).length;
        return (completedSteps / tasks.length) * 100;
    }, [tasks]);

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">{title}</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 group">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleTask(task.id)}
                            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`flex-grow text-sm ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.text}</span>
                         <button onClick={() => onDeleteTask(task.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); onAddTask(newTask); setNewTask(''); }} className="flex gap-2 mt-3 pt-3 border-t">
                <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add new task..." className="input-style text-sm flex-grow" />
                <button type="submit" className="btn-secondary text-sm">+</button>
            </form>
        </div>
    );
};

export const ProductLaunchPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [tasks, setTasks] = useState<PlannerData>(initialData);

    const { totalTasks, completedTasks, overallProgress } = useMemo(() => {
        const allTasks = Object.values(tasks).flat();
        const total = allTasks.length;
        // FIX: Explicitly type the 't' parameter to resolve the "does not exist on type 'unknown'" error.
        const completed = allTasks.filter((t: Task) => t.completed).length;
        return { totalTasks: total, completedTasks: completed, overallProgress: total > 0 ? (completed / total) * 100 : 0 };
    }, [tasks]);

    const handleAddTask = (phase: Phase, text: string) => {
        const newTask = { id: Date.now(), text, completed: false };
        setTasks(prev => ({ ...prev, [phase]: [...prev[phase], newTask] }));
    };

    const handleToggleTask = (phase: Phase, taskId: number) => {
        setTasks(prev => ({ ...prev, [phase]: prev[phase].map(t => t.id === taskId ? {...t, completed: !t.completed} : t) }));
    };
    
    const handleDeleteTask = (phase: Phase, taskId: number) => {
        setTasks(prev => ({ ...prev, [phase]: prev[phase].filter(t => t.id !== taskId) }));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a checklist and timeline for your product launch.</p>
            </div>
             <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                <h2 className="text-xl font-bold text-center">Launch Readiness</h2>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mt-3">
                    <div className="bg-emerald-500 h-4 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                </div>
                <p className="text-center text-sm mt-2 text-slate-500">{completedTasks} of {totalTasks} tasks complete</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['Pre-Launch', 'Launch Day', 'Post-Launch'] as Phase[]).map(phase => (
                    <PhaseSection 
                        key={phase} 
                        title={phase} 
                        tasks={tasks[phase]}
                        onAddTask={(text) => handleAddTask(phase, text)}
                        onToggleTask={(id) => handleToggleTask(phase, id)}
                        onDeleteTask={(id) => handleDeleteTask(phase, id)}
                    />
                ))}
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-secondary { background: #64748b; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0 0.75rem; }
            `}</style>
        </div>
    );
};