import React, { useState, useMemo } from 'react';

const AnimatedScore: React.FC<{ value: number, suffix?: string }> = ({ value, suffix = '' }) => {
    const [current, setCurrent] = useState(0);
    // FIX: Corrected useEffect to prevent infinite loop and properly handle animation frames.
    React.useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 750;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setCurrent(start + (value - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => { if (frameId) cancelAnimationFrame(frameId); };
    }, [value]);

    const getColor = () => {
        if (value < 20) return 'text-red-500';
        if (value < 60) return 'text-yellow-500';
        return 'text-emerald-500';
    };
    
    return <span className={`font-extrabold transition-colors ${getColor()}`}>{Math.round(current)}{suffix}</span>;
};

export const CustomerSatisfactionScoreTool: React.FC<{ title: string }> = ({ title }) => {
    const [mode, setMode] = useState<'csat' | 'nps'>('csat');
    
    // CSAT state
    const [satisfied, setSatisfied] = useState(80);
    const [totalResponses, setTotalResponses] = useState(100);
    
    // NPS state
    const [promoters, setPromoters] = useState(70);
    const [passives, setPassives] = useState(20);
    const [detractors, setDetractors] = useState(10);

    const csatScore = useMemo(() => totalResponses > 0 ? (satisfied / totalResponses) * 100 : 0, [satisfied, totalResponses]);
    const npsScore = useMemo(() => {
        const total = promoters + passives + detractors;
        if (total === 0) return 0;
        return ((promoters / total) * 100) - ((detractors / total) * 100);
    }, [promoters, passives, detractors]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate CSAT, NPS, and other key satisfaction scores.</p>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 mb-6">
                <button onClick={() => setMode('csat')} className={`flex-1 py-2 rounded-md font-semibold ${mode === 'csat' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>CSAT Calculator</button>
                <button onClick={() => setMode('nps')} className={`flex-1 py-2 rounded-md font-semibold ${mode === 'nps' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>NPS Calculator</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mode === 'csat' ? (
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <h2 className="text-xl font-bold">CSAT Inputs</h2>
                        <label># of Satisfied Customers (4 & 5 ratings): {satisfied}</label>
                        <input type="range" min="0" max={totalResponses} value={satisfied} onChange={e => setSatisfied(Number(e.target.value))} />
                         <label>Total # of Responses: {totalResponses}</label>
                        <input type="range" min="1" max="1000" value={totalResponses} onChange={e => setTotalResponses(Number(e.target.value))} />
                    </div>
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <h2 className="text-xl font-bold">NPS Inputs</h2>
                        <label># of Promoters (9-10 scores): {promoters}</label>
                        <input type="range" min="0" max="1000" value={promoters} onChange={e => setPromoters(Number(e.target.value))} />
                        <label># of Passives (7-8 scores): {passives}</label>
                        <input type="range" min="0" max="1000" value={passives} onChange={e => setPassives(Number(e.target.value))} />
                        <label># of Detractors (0-6 scores): {detractors}</label>
                        <input type="range" min="0" max="1000" value={detractors} onChange={e => setDetractors(Number(e.target.value))} />
                    </div>
                )}
                
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center">
                    <p className="text-lg text-slate-500">Your Score</p>
                    <p className="text-8xl my-4">
                        {mode === 'csat' ? <AnimatedScore value={csatScore} suffix="%" /> : <AnimatedScore value={npsScore} />}
                    </p>
                     <p className="text-sm text-slate-400">{mode === 'csat' ? 'Higher is better' : 'Score from -100 to 100'}</p>
                </div>
            </div>
        </div>
    );
};
