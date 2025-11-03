import React, { useState } from 'react';

interface FunnelStage {
  id: number;
  name: string;
  description: string;
}

const initialStages: FunnelStage[] = [
  { id: 1, name: 'Awareness', description: 'Attract potential customers who are not yet aware of your brand.' },
  { id: 2, name: 'Interest', description: 'Engage prospects and build interest in your solution.' },
  { id: 3, name: 'Consideration', description: 'Nurture leads and provide information to help them evaluate.' },
  { id: 4, name: 'Conversion', description: 'Turn leads into paying customers with a clear call-to-action.' },
  { id: 5, name: 'Loyalty', description: 'Retain customers and turn them into brand advocates.' },
];

const FunnelStageItem: React.FC<{
  stage: FunnelStage;
  index: number;
  total: number;
  onDelete: (id: number) => void;
}> = ({ stage, index, total, onDelete }) => {
  const widthPercentage = 100 - (index * (60 / total)); // Decreases from 100% to 40%
  
  return (
    <div 
      className="relative bg-white dark:bg-slate-800 border-t-4 border-indigo-500 rounded-b-lg shadow-md p-4 mx-auto transition-all duration-300"
      style={{ width: `${widthPercentage}%` }}
    >
      <h3 className="font-bold text-indigo-700 dark:text-indigo-300">{stage.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stage.description}</p>
      <button onClick={() => onDelete(stage.id)} className="absolute top-2 right-2 text-red-500 font-bold opacity-50 hover:opacity-100">&times;</button>
    </div>
  );
};

export const SalesFunnelBuilder: React.FC<{ title: string }> = ({ title }) => {
  const [stages, setStages] = useState<FunnelStage[]>(initialStages);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newDesc.trim()) {
      const newStage: FunnelStage = {
        id: Date.now(),
        name: newName,
        description: newDesc,
      };
      setStages([...stages, newStage]);
      setNewName('');
      setNewDesc('');
    }
  };

  const handleDeleteStage = (id: number) => {
    setStages(stages.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visually map out and organize the stages of your sales funnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
          <h2 className="text-xl font-bold">Add Funnel Stage</h2>
          <form onSubmit={handleAddStage} className="space-y-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Stage Name (e.g., Retention)" className="w-full input-style" required />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} placeholder="Description..." className="w-full input-style" required />
            <button type="submit" className="w-full btn-primary">Add Stage</button>
          </form>
        </div>

        <div className="md:col-span-2 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-xl shadow-inner border">
          <div className="space-y-[-2px]">
            {stages.map((stage, index) => (
              <FunnelStageItem 
                key={stage.id} 
                stage={stage} 
                index={index}
                total={stages.length}
                onDelete={handleDeleteStage}
              />
            ))}
          </div>
          {stages.length === 0 && <p className="text-center text-slate-500 p-8">Your funnel is empty. Add a stage to begin!</p>}
        </div>
      </div>
       <style>{`
        .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
        .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
        .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
      `}</style>
    </div>
  );
};
