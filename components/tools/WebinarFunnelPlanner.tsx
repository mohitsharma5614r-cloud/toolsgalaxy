import React, { useState } from 'react';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

type Stage = 'Awareness' | 'Registration' | 'Show-Up' | 'Offer' | 'Follow-Up';
type PlannerData = Record<Stage, Task[]>;

const initialData: PlannerData = {
    'Awareness': [{ id: 1, text: 'Run social media ads', completed: false }, { id: 2, text: 'Email promotion to list', completed: false }],
    'Registration': [{ id: 3, text: 'Create high-converting landing page', completed: false }],
    'Show-Up': [{ id: 4, text: 'Send reminder emails (24hr, 1hr, 15min)', completed: false }, { id: 5, text: 'Create pre-webinar hype on social media', completed: false }],
    'Offer': [{ id: 6, text: 'Prepare a special webinar-only offer', completed: false }],
    'Follow-Up': [{ id: 7, text: 'Send replay link to all registrants', completed: false }, { id: 8, text: 'Start follow-up email sequence for attendees', completed: false }],
};

const StageCard: React.FC<{
    stage: Stage;
    tasks: Task[];
    onAddTask: (text: string) => void;
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
}> = ({ stage, tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTask, setNewTask] = useState('');
    
    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-3">{stage}</h3>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 group text-sm">
                        <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} className="h-4 w-4 rounded cursor-pointer" />
                        <span className={`flex-grow ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.text}</span>
                        <button onClick={() => onDeleteTask(task.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100">✕</button>
                    </div>
                ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); onAddTask(newTask); setNewTask(''); }} className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add task..." className="input-style text-sm flex-grow" />
                <button type="submit" className="btn-secondary text-sm">+</button>
            </form>
        </div>
    );
};

export const WebinarFunnelPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [plan, setPlan] = useState<PlannerData>(initialData);

    const handleUpdate = (stage: Stage, action: 'add' | 'toggle' | 'delete', payload: any) => {
        const stageTasks = plan[stage];
        let newTasks: Task[];
        if(action === 'add') {
            newTasks = [...stageTasks, { id: Date.now(), text: payload, completed: false }];
        } else if (action === 'toggle') {
            newTasks = stageTasks.map(t => t.id === payload ? {...t, completed: !t.completed} : t);
        } else { // delete
            newTasks = stageTasks.filter(t => t.id !== payload);
        }
        setPlan(prev => ({ ...prev, [stage]: newTasks }));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan the stages of your webinar marketing funnel from start to finish.</p>
            </div>
            <div className="relative flex items-start gap-4 p-4 overflow-x-auto">
                {(Object.keys(plan) as Stage[]).map((stage, index, arr) => (
                    <React.Fragment key={stage}>
                        <div className="w-80 flex-shrink-0">
                            <StageCard
                                title={stage}
                                tasks={plan[stage]}
                                onAddTask={(text) => handleUpdate(stage, 'add', text)}
                                onToggleTask={(id) => handleUpdate(stage, 'toggle', id)}
                                onDeleteTask={(id) => handleUpdate(stage, 'delete', id)}
                            />
                        </div>
                        {index < arr.length - 1 && <div className="self-center text-4xl text-slate-300 dark:text-slate-600 font-light">→</div>}
                    </React.Fragment>
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