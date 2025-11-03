
import React, { useState, useMemo } from 'react';

// Mock data for carriers
const carriers = [
    { name: 'SpeedyShip 🚀', base: 50, perKg: 20, dimFactor: 5000 },
    { name: 'EcoPost 🌿', base: 30, perKg: 25, dimFactor: 6000 },
    { name: 'GlobalExpress ✈️', base: 150, perKg: 40, dimFactor: 5000 },
];

const zones = { 'Local': 1, 'National': 1.5, 'International': 4 };
type Zone = keyof typeof zones;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="shipping-loader mx-auto">
            <div className="truck-body">
                <div className="truck-cab"></div>
                <div className="wheel w1"></div>
                <div className="wheel w2"></div>
            </div>
            <div className="road-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating shipping rates...</p>
        <style>{`
            .shipping-loader { width: 150px; height: 80px; position: relative; overflow: hidden; }
            .truck-body { width: 80px; height: 40px; background: #60a5fa; border-radius: 4px; position: absolute; bottom: 20px; animation: truck-bounce 0.5s infinite; }
            .dark .truck-body { background: #3b82f6; }
            .truck-cab { width: 30px; height: 30px; background: #93c5fd; position: absolute; left: -25px; bottom: 0; border-radius: 4px 0 0 4px; }
            .dark .truck-cab { background: #60a5fa; }
            .wheel { width: 20px; height: 20px; background: #334155; border-radius: 50%; position: absolute; bottom: -10px; animation: spin-wheel 0.5s infinite linear; }
            .dark .wheel { background: #cbd5e1; }
            .w1 { left: 10px; } .w2 { right: 10px; }
            .road-line { width: 100%; height: 4px; background: #cbd5e1; position: absolute; bottom: 0; animation: move-road 0.5s infinite linear; }
            .dark .road-line { background: #475569; }

            @keyframes truck-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
            @keyframes spin-wheel { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes move-road { from { transform: translateX(0); } to { transform: translateX(-20px); } }
        `}</style>
    </div>
);

export const ShippingCostCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [weight, setWeight] = useState(5); // kg
    const [dims, setDims] = useState({ l: 30, w: 20, h: 15 }); // cm
    const [zone, setZone] = useState<Zone>('National');
    const [results, setResults] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        setIsLoading(true);
        setTimeout(() => {
            const actualWeight = weight;
            const volWeight = (dims.l * dims.w * dims.h) / 5000; // Common IATA dim factor
            const chargeableWeight = Math.max(actualWeight, volWeight);
            
            const costs = carriers.map(c => {
                const dimWeightForCarrier = (dims.l * dims.w * dims.h) / c.dimFactor;
                const finalWeight = Math.max(actualWeight, dimWeightForCarrier);
                const cost = (c.base + c.perKg * finalWeight) * zones[zone];
                return { name: c.name, cost: Math.round(cost) };
            });
            
            setResults(costs.sort((a,b) => a.cost - b.cost));
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare and calculate shipping costs for your products.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label>Package Weight (kg): {weight}</label>
                        <input type="range" min="0.5" max="50" step="0.5" value={weight} onChange={e => setWeight(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Destination Zone</label>
                        <select value={zone} onChange={e => setZone(e.target.value as Zone)} className="input-style w-full mt-1">
                            {Object.keys(zones).map(z => <option key={z}>{z}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label>Package Dimensions (cm)</label>
                    <div className="grid grid-cols-3 gap-4 mt-1">
                        <input type="number" value={dims.l} onChange={e => setDims({...dims, l: Number(e.target.value)})} placeholder="Length" className="input-style"/>
                        <input type="number" value={dims.w} onChange={e => setDims({...dims, w: Number(e.target.value)})} placeholder="Width" className="input-style"/>
                        <input type="number" value={dims.h} onChange={e => setDims({...dims, h: Number(e.target.value)})} placeholder="Height" className="input-style"/>
                    </div>
                </div>
                 <button onClick={handleCalculate} disabled={isLoading} className="w-full btn-primary text-lg !mt-8">
                    {isLoading ? 'Calculating...' : 'Calculate Costs'}
                </button>
            </div>
            
            <div className="mt-8 min-h-[250px] flex flex-col">
                {isLoading ? <div className="m-auto"><Loader /></div> :
                 results ? (
                    <div className="w-full space-y-3 animate-fade-in">
                        {results.map((res, index) => (
                            <div key={res.name} className={`flex justify-between items-center p-4 rounded-lg border-2 ${index === 0 ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400' : 'bg-slate-100 dark:bg-slate-700/50 border-transparent'}`}>
                                <div className="font-semibold">{index === 0 && '🏆 '}{res.name}</div>
                                <div className="font-bold text-xl">₹{res.cost.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                 ) : null}
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
