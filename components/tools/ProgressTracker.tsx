import React, { useState } from 'react';

interface ProgressEntry {
    id: number;
    date: string;
    note: string;
}

interface Goal {
    id: number;
    name: string;
    entries: ProgressEntry[];
}

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="progress-loader mx-auto">
            <svg viewBox="0 0 100 100">
                <path className="mountain-bg" d="M0 100 L40 30 L60 70 L100 20 L100 100 Z" />
                <path className="mountain-fg" d="M0 100 L50 20 L70 50 L100 30 L100 100 Z" />
                <path className="path-line" d="M5,95 C 25,60 40,70 50,50 C 60,30 80,40 95,20" />
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Tracking your progress...</p>
        <style>{`
            .progress-loader { width: 100px; height: 100px; }
            .mountain-bg, .mountain-fg { fill-opacity: 0.5; }
            .mountain-bg { fill: #a5b4fc; } .dark .mountain-bg { fill: #4338ca; }
            .mountain-fg { fill: #818cf8; } .dark .mountain-fg { fill: #6d28d9; }
            .path-line { fill: none; stroke: #f1f5f9; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-path 2.5s infinite; }
            @keyframes draw-path { to { stroke-dashoffset: 0; } }
        `}</style>
    </div>
);


export const ProgressTracker: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoal, setNewGoal] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
    const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], note: '' });

    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    const addGoal = () => {
        if (!newGoal.trim()) return;
        const goal = { id: Date.now(), name: newGoal.trim(), entries: [] };
        setGoals([...goals, goal]);
        setSelectedGoalId(goal.id);
        setNewGoal('');
    };

    const addEntry = () => {
        if (!newEntry.note.trim() || !selectedGoalId) return;
        const entry = { ...newEntry, id: Date.now() };
        setGoals(goals.map(g =>
            g.id === selectedGoalId ? { ...g, entries: [entry, ...g.entries] } : g
        ));
        setNewEntry({ date: new Date().toISOString().split('T')[0], note: '' });
    };

    const deleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
        if (selectedGoalId === id) {
            setSelectedGoalId(goals.length > 1 ? goals.find(g => g.id !== id)!.id : null);
        }
    };
    
    const deleteEntry = (goalId: number, entryId: number) => {
        setGoals(goals.map(g => 
            g.id === goalId ? { ...g, entries: g.entries.filter(e => e.id !== entryId) } : g
        ));
    };


    return (
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Progress Tracker</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Track your student or personal learning progress over time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-6">
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">Your Goals</h2>
                        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                            {goals.map(g => (
                                <div key={g.id} className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${selectedGoalId === g.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`} onClick={() => setSelectedGoalId(g.id)}>
                                    <span className="font-semibold">{g.name}</span>
                                    <button onClick={(e) => { e.stopPropagation(); deleteGoal(g.id); }} className="text-red-500">&times;</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="New goal..." className="input-style flex-grow"/>
                            <button onClick={addGoal} className="btn-primary px-4">+</button>
                        </div>
                    </div>
                     {selectedGoal && (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border animate-fade-in">
                            <h2 className="text-xl font-bold mb-4">Log Progress for "{selectedGoal.name}"</h2>
                            <div className="space-y-3">
                                <input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="input-style w-full"/>
                                <textarea value={newEntry.note} onChange={e => setNewEntry({...newEntry, note: e.target.value})} rows={3} placeholder="What progress did you make?" className="input-style w-full" />
                                <button onClick={addEntry} className="w-full btn-primary">Add Entry</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border min-h-[500px]">
                     <h2 className="text-2xl font-bold mb-6 text-center">Progress Timeline</h2>
                     {selectedGoal && selectedGoal.entries.length > 0 ? (
                        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                             {selectedGoal.entries.map(entry => (
                                <div key={entry.id} className="relative group">
                                    <div className="absolute -left-[33px] top-1 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                                    <p className="text-sm font-semibold text-slate-500">{new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="mt-1">{entry.note}</p>
                                    <button onClick={() => deleteEntry(selectedGoal.id, entry.id)} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100">&times;</button>
                                </div>
                             ))}
                        </div>
                     ) : (
                        <div className="flex items-center justify-center h-full text-center text-slate-400">
                             <p>{selectedGoal ? "No progress logged yet. Add an entry!" : "Select or add a goal to see your progress."}</p>
                        </div>
                     )}
                </div>
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};