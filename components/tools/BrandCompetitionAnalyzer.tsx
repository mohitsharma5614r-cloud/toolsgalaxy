import React, { useState, useMemo } from 'react';

interface Competitor {
    id: number;
    name: string;
    pricing: number; // 1-10
    features: number; // 1-10
    marketing: number; // 1-10
    brand: number; // 1-10
}

const RadarChart: React.FC<{ data: Competitor[] }> = ({ data }) => {
    const size = 200;
    const center = size / 2;
    const labels = ['Pricing', 'Features', 'Marketing', 'Brand'];
    const angles = Array.from({ length: labels.length }, (_, i) => i * (Math.PI * 2) / labels.length);
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];
    
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                {/* Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map(scale => (
                    <polygon
                        key={scale}
                        points={angles.map(angle => `${center + center * 0.8 * scale * Math.sin(angle)},${center - center * 0.8 * scale * Math.cos(angle)}`).join(' ')}
                        className="fill-none stroke-slate-200 dark:stroke-slate-700"
                    />
                ))}
                {angles.map((angle, i) => (
                    <line key={i} x1={center} y1={center} x2={center + center * 0.8 * Math.sin(angle)} y2={center - center * 0.8 * Math.cos(angle)} className="stroke-slate-200 dark:stroke-slate-700" />
                ))}
                
                {/* Data Paths */}
                {data.map((comp, compIndex) => {
                    const points = [
                        (10 - comp.pricing) / 10, // Invert pricing score
                        comp.features / 10,
                        comp.marketing / 10,
                        comp.brand / 10,
                    ];
                    const path = points.map((p, i) => `${center + center * 0.8 * p * Math.sin(angles[i])},${center - center * 0.8 * p * Math.cos(angles[i])}`).join(' ');
                    return <polygon key={comp.id} points={path} fill={colors[compIndex % colors.length]} fillOpacity="0.3" stroke={colors[compIndex % colors.length]} strokeWidth="2" />;
                })}
            </svg>
            {/* Labels */}
            {labels.map((label, i) => (
                <div key={label} className="absolute text-xs font-semibold text-slate-500" style={{
                    left: `${center + center * 0.95 * Math.sin(angles[i])}px`,
                    top: `${center - center * 0.95 * Math.cos(angles[i])}px`,
                    transform: 'translate(-50%, -50%)',
                }}>{label}</div>
            ))}
        </div>
    );
};


export const BrandCompetitionAnalyzer: React.FC<{ title: string }> = ({ title }) => {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [newName, setNewName] = useState('');

    const addCompetitor = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && competitors.length < 4) {
            setCompetitors([...competitors, { id: Date.now(), name: newName, pricing: 5, features: 5, marketing: 5, brand: 5 }]);
            setNewName('');
        }
    };
    
    const updateCompetitor = (id: number, field: keyof Omit<Competitor, 'id'|'name'>, value: number) => {
        setCompetitors(competitors.map(c => c.id === id ? {...c, [field]: value} : c));
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a framework to analyze your brand's competition.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <form onSubmit={addCompetitor} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex gap-2">
                        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Add competitor (max 4)" className="input-style flex-grow" />
                        <button type="submit" className="btn-primary">+</button>
                    </form>
                    <div className="space-y-4">
                        {competitors.map(comp => (
                            <div key={comp.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                                <h3 className="font-bold">{comp.name}</h3>
                                <label className="text-xs">Pricing (1=Cheap, 10=Expensive): {comp.pricing}</label><input type="range" min="1" max="10" value={comp.pricing} onChange={e => updateCompetitor(comp.id, 'pricing', Number(e.target.value))} />
                                <label className="text-xs">Features: {comp.features}/10</label><input type="range" min="1" max="10" value={comp.features} onChange={e => updateCompetitor(comp.id, 'features', Number(e.target.value))} />
                                <label className="text-xs">Marketing: {comp.marketing}/10</label><input type="range" min="1" max="10" value={comp.marketing} onChange={e => updateCompetitor(comp.id, 'marketing', Number(e.target.value))} />
                                <label className="text-xs">Brand Strength: {comp.brand}/10</label><input type="range" min="1" max="10" value={comp.brand} onChange={e => updateCompetitor(comp.id, 'brand', Number(e.target.value))} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Radar Chart</h2>
                    {competitors.length > 0 ? (
                        <>
                            <RadarChart data={competitors} />
                            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                                {competitors.map((c, i) => <span key={c.id} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'][i]}}></div>{c.name}</span>)}
                            </div>
                        </>
                    ) : <p className="text-slate-400">Add competitors to see the chart.</p>}
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