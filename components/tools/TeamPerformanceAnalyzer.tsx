import React, { useState, useMemo } from 'react';

interface Member {
  id: number;
  name: string;
  tasks: number;
  quality: number; // 1-10
  deadlines: number; // 0-100
}

const BarChart: React.FC<{ data: { name: string, value: number, color: string }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);
  return (
    <div className="w-full h-56 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 flex justify-around items-end gap-2">
      {data.map(item => (
        <div key={item.name} className="flex-1 flex flex-col items-center justify-end group">
          <div 
            className="w-full rounded-t-md transition-all duration-500" 
            style={{ height: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
          ></div>
          <span className="text-xs mt-1 font-semibold text-slate-500">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export const TeamPerformanceAnalyzer: React.FC<{ title: string }> = ({ title }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [newName, setNewName] = useState('');

  const addMember = () => {
    if (newName.trim()) {
      setMembers([...members, { id: Date.now(), name: newName, tasks: 10, quality: 8, deadlines: 95 }]);
      setNewName('');
    }
  };

  const updateMember = (id: number, field: keyof Omit<Member, 'id' | 'name'>, value: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  
  const scores = useMemo(() => {
    return members.map(m => {
        // Simple weighted score: Tasks 30%, Quality 50%, Deadlines 20%
        const score = (m.tasks / 50 * 30) + (m.quality / 10 * 50) + (m.deadlines / 100 * 20);
        return { name: m.name, score: parseFloat(score.toFixed(1)) };
    });
  }, [members]);

  const topPerformer = useMemo(() => scores.length > 0 ? scores.reduce((top, current) => current.score > top.score ? current : top, scores[0]) : null, [scores]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Input metrics to analyze your team's performance with dynamic charts.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
          <h2 className="text-xl font-bold">Team Members</h2>
          <div className="flex gap-2">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Add member..." className="w-full input-style" />
            <button onClick={addMember} className="btn-primary">+</button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {members.map(m => (
              <div key={m.id} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <p className="font-bold">{m.name}</p>
                <label className="text-xs">Tasks Completed: {m.tasks}</label><input type="range" min="0" max="50" value={m.tasks} onChange={e => updateMember(m.id, 'tasks', Number(e.target.value))} />
                <label className="text-xs">Quality Score (1-10): {m.quality}</label><input type="range" min="1" max="10" value={m.quality} onChange={e => updateMember(m.id, 'quality', Number(e.target.value))} />
                <label className="text-xs">Deadlines Met: {m.deadlines}%</label><input type="range" min="0" max="100" value={m.deadlines} onChange={e => updateMember(m.id, 'deadlines', Number(e.target.value))} />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
          {members.length > 0 ? (
            <div className="space-y-6">
                <BarChart data={scores.map(s => ({ name: s.name, value: s.score, color: '#4f46e5' }))} />
                {topPerformer && <p className="text-center font-bold text-emerald-600">🏆 Top Performer: {topPerformer.name} (Score: {topPerformer.score})</p>}
            </div>
          ) : <p className="text-center text-slate-400">Add team members to see performance data.</p>}
        </div>
      </div>
      <style>{`
        .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
        .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
        .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0 1rem; }
      `}</style>
    </div>
  );
};
