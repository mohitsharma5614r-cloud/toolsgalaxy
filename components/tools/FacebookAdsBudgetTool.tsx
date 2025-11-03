
import React, { useState, useMemo, useEffect } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string, suffix?: string }> = ({ value, prefix, suffix }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 750;
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

    return <span>{prefix}{Math.round(current).toLocaleString('en-IN')}{suffix}</span>;
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="boosting-loader mx-auto">
            <div className="rocket">🚀</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Boosting your results...</p>
        <style>{`
            .boosting-loader {
                width: 100px; height: 100px;
                background: conic-gradient(#3b82f6 0%, #a78bfa 50%, #3b82f6 100%);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                animation: spin-boost 2s infinite linear;
            }
            .rocket { font-size: 40px; animation: rocket-shake 0.5s infinite; }
            @keyframes spin-boost { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes rocket-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px) rotate(-3deg)} 75%{transform:translateX(2px) rotate(3deg)} }
        `}</style>
    </div>
);

const goals = {
    Reach: { baseCpm: 200, unit: 'Impressions' },
    Traffic: { baseCpc: 15, unit: 'Clicks' },
    Conversions: { baseCpa: 400, unit: 'Conversions' },
};
type Goal = keyof typeof goals;

export const FacebookAdsBudgetTool: React.FC<{ title: string }> = ({ title }) => {
    const [goal, setGoal] = useState<Goal>('Traffic');
    const [audience, setAudience] = useState(100000);
    const [outcome, setOutcome] = useState(5000);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const { budget, cpm, cpc, cpa } = useMemo(() => {
        let b = 0;
        const audienceFactor = 1 + (audience / 5000000); // Higher cost for larger audiences
        const g = goals[goal];
        
        let estCpm = g.baseCpm ? g.baseCpm * audienceFactor : 0;
        let estCpc = g.baseCpc ? g.baseCpc * audienceFactor : 0;
        let estCpa = g.baseCpa ? g.baseCpa * audienceFactor : 0;

        if (goal === 'Reach') b = (outcome / 1000) * estCpm;
        if (goal === 'Traffic') b = outcome * estCpc;
        if (goal === 'Conversions') b = outcome * estCpa;

        return { budget: b, cpm: estCpm, cpc: estCpc, cpa: estCpa };
    }, [goal, audience, outcome]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your Facebook advertising spend for optimal results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                    <h2 className="text-xl font-bold">Campaign Details</h2>
                    <div>
                        <label>Campaign Goal</label>
                        <select value={goal} onChange={e => setGoal(e.target.value as Goal)} className="input-style w-full mt-1">
                            {Object.keys(goals).map(g => <option key={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Target Audience Size: {audience.toLocaleString()}</label>
                        <input type="range" min="10000" max="5000000" step="10000" value={audience} onChange={e => setAudience(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Desired Outcome ({goals[goal].unit}): {outcome.toLocaleString()}</label>
                        <input type="range" min="100" max="100000" step="100" value={outcome} onChange={e => setOutcome(Number(e.target.value))} />
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                     {isLoading ? <div className="min-h-[250px] flex items-center justify-center"><Loader /></div> :
                    <div className="space-y-4 text-center animate-fade-in">
                        <div className="result-card bg-indigo-100/50">
                            <p className="result-label">Recommended Budget</p>
                            <p className="value text-indigo-700 text-4xl"><AnimatedNumber value={budget} prefix="₹ " /></p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                             <div className="result-card"><p className="result-label">Est. CPM</p><p className="value text-sm">₹ {Math.round(cpm)}</p></div>
                             <div className="result-card"><p className="result-label">Est. CPC</p><p className="value text-sm">₹ {Math.round(cpc)}</p></div>
                             <div className="result-card"><p className="result-label">Est. CPA</p><p className="value text-sm">₹ {Math.round(cpa)}</p></div>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e2b3b; border-color: #475569; color: white; }
                .result-card { border-radius: 0.5rem; padding: 0.75rem; }
                .result-label { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .dark .result-label { color: #94a3b8; }
                .value { font-weight: 700; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};
