import React, { useState, useMemo } from 'react';

interface Competitor {
    id: number;
    name: string;
    price: number; // 1-10
    features: number; // 1-10
    marketing: number; // 1-10
}

const RatingBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
        <div 
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${value * 10}%` }}
        ></div>
    </div>
);

export const CompetitorAnalysisTool: React.FC<{ title: string }> = ({ title }) => {
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState(5);
    const [newFeatures, setNewFeatures] = useState(5);
    const [newMarketing, setNewMarketing] = useState(5);

    const addCompetitor = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            const newComp: Competitor = {
                id: Date.now(),
                name: newName,
                price: newPrice,
                features: newFeatures,
                marketing: newMarketing,
            };
            setCompetitors([newComp, ...competitors]);
            setNewName('');
            setNewPrice(5);
            setNewFeatures(5);
            setNewMarketing(5);
        }
    };

    const calculateScore = (c: Competitor) => {
        // Higher features and marketing are better, lower price is better.
        return (c.features * 0.4) + (c.marketing * 0.3) + ((10 - c.price) * 0.3);
    };

    const bestCompetitor = useMemo(() => {
        if (competitors.length === 0) return null;
        return competitors.reduce((best, current) => 
            calculateScore(current) > calculateScore(best) ? current : best
        , competitors[0]);
    }, [competitors]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a framework to analyze your top competitors side-by-side.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={addCompetitor} className="lg:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Add Competitor</h2>
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Competitor Name" className="input-style w-full" required />
                    <div>
                        <label>Price (1=Cheap, 10=Expensive): {newPrice}</label>
                        <input type="range" min="1" max="10" value={newPrice} onChange={e => setNewPrice(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label>Features (1=Basic, 10=Advanced): {newFeatures}</label>
                        <input type="range" min="1" max="10" value={newFeatures} onChange={e => setNewFeatures(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label>Marketing (1=Weak, 10=Strong): {newMarketing}</label>
                        <input type="range" min="1" max="10" value={newMarketing} onChange={e => setNewMarketing(Number(e.target.value))} className="w-full" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Add to Analysis</button>
                </form>

                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-bold mb-4">Competitor Scoreboard</h2>
                    <div className="space-y-4">
                        {competitors.length > 0 ? competitors.map(c => {
                            const score = calculateScore(c);
                            const isBest = bestCompetitor?.id === c.id;
                            return (
                                <div key={c.id} className={`p-4 rounded-lg border-2 transition-all duration-300 animate-fade-in ${isBest ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400' : 'bg-slate-100 dark:bg-slate-700/50 border-transparent'}`}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">{c.name}</h3>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-slate-500">Overall Score</p>
                                            <p className="font-bold text-xl text-indigo-600 dark:text-indigo-400">{score.toFixed(1)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-2 text-sm">
                                        <div className="grid grid-cols-3 items-center"><span className="col-span-1">Price</span><div className="col-span-2"><RatingBar value={10 - c.price} /></div></div>
                                        <div className="grid grid-cols-3 items-center"><span className="col-span-1">Features</span><div className="col-span-2"><RatingBar value={c.features} /></div></div>
                                        <div className="grid grid-cols-3 items-center"><span className="col-span-1">Marketing</span><div className="col-span-2"><RatingBar value={c.marketing} /></div></div>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-slate-400 text-center">Add competitors to see the analysis.</p>}
                    </div>
                </div>
            </div>
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};