import React, { useState, useMemo, useEffect } from 'react';

interface Kpi {
    id: number;
    name: string;
    value: number;
    target: number;
    prefix?: string;
    suffix?: string;
}

const initialKpis: Kpi[] = [
    { id: 1, name: 'Website Visitors', value: 25678, target: 25000 },
    { id: 2, name: 'Conversion Rate', value: 3.4, target: 3.0, suffix: '%' },
    { id: 3, name: 'Cost Per Click (CPC)', value: 45, target: 50, prefix: '₹' },
    { id: 4, name: 'Email Subscribers', value: 8234, target: 8000 },
];

const AnimatedNumber: React.FC<{ value: number, prefix?: string, suffix?: string }> = ({ value, prefix, suffix }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const p = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - p, 3);
            setCurrent(start + (value - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current]);

    const isInt = value % 1 === 0;
    return <span>{prefix}{current.toLocaleString('en-IN', { maximumFractionDigits: isInt ? 0 : 1 })}{suffix}</span>;
};


const KpiCard: React.FC<{ kpi: Kpi, onUpdate: (id: number, field: 'value'|'target', value: number) => void, onDelete: (id: number) => void }> = ({ kpi, onUpdate, onDelete }) => {
    const isAboveTarget = kpi.value >= kpi.target;
    const diff = kpi.target > 0 ? ((kpi.value - kpi.target) / kpi.target) * 100 : 0;
    const colorClass = isAboveTarget ? 'text-emerald-500' : 'text-red-500';

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border relative group">
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">{kpi.name}</h3>
            <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">
                <AnimatedNumber value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
            </p>
            <div className={`flex items-center justify-center gap-1 font-semibold ${colorClass}`}>
                {isAboveTarget ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}% vs Target
            </div>
            <p className="text-xs text-slate-400 text-center mt-1">Target: {kpi.target.toLocaleString()}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onDelete(kpi.id)} className="text-red-500 text-xs">Delete</button>
            </div>
        </div>
    );
};

export const MarketingKpiDashboard: React.FC<{ title: string }> = ({ title }) => {
    const [kpis, setKpis] = useState<Kpi[]>(initialKpis);

    const handleUpdate = (id: number, field: 'value'|'target', value: number) => {
        setKpis(kpis.map(k => k.id === id ? { ...k, [field]: value } : k));
    };
    
    const handleDelete = (id: number) => {
        setKpis(kpis.filter(k => k.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A manual dashboard to track your Key Performance Indicators.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.id} kpi={kpi} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
                 <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-dashed flex flex-col items-center justify-center text-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer">
                    <p className="text-4xl">+</p>
                    <p className="font-semibold">Add KPI</p>
                    <p className="text-xs mt-1">This feature is a visual demo. Adding/editing functionality is simplified.</p>
                 </div>
            </div>
        </div>
    );
};