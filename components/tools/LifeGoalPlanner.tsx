import React, { useState, useMemo } from 'react';

// TypeScript interfaces
interface Step {
    id: number;
    text: string;
    completed: boolean;
}

interface Goal {
    id: number;
    name: string;
    category: string;
    steps: Step[];
}

type Category = 'Career' | 'Personal' | 'Health' | 'Finance';

const categoryStyles: { [key in Category]: { icon: string; color: string } } = {
    Career: { icon: '💼', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    Personal: { icon: '👤', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
    Health: { icon: '❤️‍🩹', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' },
    Finance: { icon: '💰', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
};

const initialGoals: Goal[] = [
    {
        id: 1, name: 'Learn a New Programming Language', category: 'Career',
        steps: [
            { id: 101, text: 'Choose a language (e.g., Python, Rust)', completed: true },
            { id: 102, text: 'Complete a "Hello, World!" tutorial', completed: true },
            { id: 103, text: 'Build a small project', completed: false },
            { id: 104, text: 'Contribute to an open-source project', completed: false },
        ]
    },
    {
        id: 2, name: 'Run a 5K Race', category: 'Health',
        steps: [
            { id: 201, text: 'Get proper running shoes', completed: true },
            { id: 202, text: 'Start a couch-to-5K program', completed: false },
            { id: 203, text: 'Register for a local race', completed: false },
        ]
    }
];

export const LifeGoalPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [goals, setGoals] = useState<Goal[]>(initialGoals);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState<Category>('Personal');

    const addGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalName.trim()) return;
        const newGoal: Goal = {
            id: Date.now(),
            name: newGoalName,
            category: newGoalCategory,
            steps: [],
        };
        setGoals([newGoal, ...goals]);
        setNewGoalName('');
    };

    const deleteGoal = (goalId: number) => {
        setGoals(goals.filter(g => g.id !== goalId));
    };

    const addStep = (goalId: number, stepText: string) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newStep: Step = { id: Date.now(), text: stepText, completed: false };
                return { ...g, steps: [...g.steps, newStep] };
            }
            return g;
        }));
    };
    
    const toggleStepCompletion = (goalId: number, stepId: number) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    steps: g.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s)
                };
            }
            return g;
        }));
    };

    const deleteStep = (goalId: number, stepId: number) => {
         setGoals(goals.map(g => {
            if (g.id === goalId) {
                return { ...g, steps: g.steps.filter(s => s.id !== stepId) };
            }
            return g;
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🎯</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Organize your aspirations and track your progress.</p>
            </div>

            <form onSubmit={addGoal} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8 space-y-4">
                <h2 className="text-xl font-bold">Add a New Goal</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        value={newGoalName}
                        onChange={e => setNewGoalName(e.target.value)}
                        placeholder="What's your goal?"
                        className="md:col-span-2 w-full input-style"
                    />
                    <select
                        value={newGoalCategory}
                        onChange={e => setNewGoalCategory(e.target.value as Category)}
                        className="w-full input-style"
                    >
                        {Object.keys(categoryStyles).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <button type="submit" className="w-full btn-primary">Add Goal</button>
            </form>

            <div className="space-y-6">
                {goals.map(goal => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onDeleteGoal={deleteGoal}
                        onAddStep={addStep}
                        onToggleStep={toggleStepCompletion}
                        onDeleteStep={deleteStep}
                    />
                ))}
            </div>
             <style>{`
                .input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
                .btn-primary:hover { background-color: #4338ca; }
            `}</style>
        </div>
    );
};

// Sub-component for each goal
interface GoalCardProps {
    goal: Goal;
    onDeleteGoal: (goalId: number) => void;
    onAddStep: (goalId: number, stepText: string) => void;
    onToggleStep: (goalId: number, stepId: number) => void;
    onDeleteStep: (goalId: number, stepId: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDeleteGoal, onAddStep, onToggleStep, onDeleteStep }) => {
    const [newStepText, setNewStepText] = useState('');

    const progress = useMemo(() => {
        if (goal.steps.length === 0) return 0;
        const completedSteps = goal.steps.filter(s => s.completed).length;
        return (completedSteps / goal.steps.length) * 100;
    }, [goal.steps]);
    
    const handleAddStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStepText.trim()) return;
        onAddStep(goal.id, newStepText);
        setNewStepText('');
    };

    const style = categoryStyles[goal.category as Category];

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${style.color}`}>
                        {style.icon} {goal.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2">{goal.name}</h3>
                </div>
                <button onClick={() => onDeleteGoal(goal.id)} className="text-red-500 hover:text-red-700 font-bold text-2xl">&times;</button>
            </div>

            <div>
                <div className="flex justify-between text-sm font-semibold text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="space-y-2">
                {goal.steps.map(step => (
                    <div key={step.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md group">
                        <input
                            type="checkbox"
                            checked={step.completed}
                            onChange={() => onToggleStep(goal.id, step.id)}
                            className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`flex-grow ${step.completed ? 'line-through text-slate-500' : ''}`}>{step.text}</span>
                         <button onClick={() => onDeleteStep(goal.id, step.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddStep} className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <input
                    value={newStepText}
                    onChange={e => setNewStepText(e.target.value)}
                    placeholder="Add an actionable step..."
                    className="flex-grow input-style"
                />
                <button type="submit" className="btn-primary">+</button>
            </form>
        </div>
    );
};