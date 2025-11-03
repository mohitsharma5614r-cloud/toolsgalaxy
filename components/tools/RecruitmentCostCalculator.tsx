import React, { useState, useMemo } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string }> = ({ value, prefix = '' }) => {
    const [current, setCurrent] = useState(0);
    React.useEffect(() => {
        const start = current;
        const duration = 750;
        let startTime: number | null = null;
        let frameId: number;
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
    return <span>{prefix}{Math.round(current).toLocaleString('en-IN')}</span>;
};

export const RecruitmentCostCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [external, setExternal] = useState({ ads: 25000, agency: 0, tools: 5000 });
    const [internal, setInternal] = useState({ recruiterHours: 40, managerHours: 15 });
    const [hourlyRates, setHourlyRates] = useState({ recruiter: 500, manager: 800 });

    const { totalExternal, totalInternal, totalCost } = useMemo(() => {
        const ext = external.ads + external.agency + external.tools;
        const int = (internal.recruiterHours * hourlyRates.recruiter) + (internal.managerHours * hourlyRates.manager);
        return { totalExternal: ext, totalInternal: int, totalCost: ext + int };
    }, [external, internal, hourlyRates]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate the total cost to hire a new employee.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">External Costs</h2>
                    <label>Job Ads: ₹<input type="number" value={external.ads} onChange={e => setExternal({...external, ads: Number(e.target.value)})} className="input-style w-32"/></label>
                    <label>Agency Fees: ₹<input type="number" value={external.agency} onChange={e => setExternal({...external, agency: Number(e.target.value)})} className="input-style w-32"/></label>
                    <label>Recruiting Tools: ₹<input type="number" value={external.tools} onChange={e => setExternal({...external, tools: Number(e.target.value)})} className="input-style w-32"/></label>
                    
                    <h2 className="text-xl font-bold pt-4 border-t">Internal Costs</h2>
                    <label>Recruiter Hours: <input type="number" value={internal.recruiterHours} onChange={e => setInternal({...internal, recruiterHours: Number(e.target.value)})} className="input-style w-20"/> hrs</label>
                    <label>Hiring Manager Hours: <input type="number" value={internal.managerHours} onChange={e => setInternal({...internal, managerHours: Number(e.target.value)})} className="input-style w-20"/> hrs</label>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <div className="text-center">
                        <div className="person-loader mx-auto">
                            <div className="head"></div>
                            <div className="body"></div>
                            <div className="arm left"></div>
                            <div className="arm right"></div>
                            <div className="leg left"></div>
                            <div className="leg right"></div>
                        </div>
                    </div>
                    <div className="result-card bg-indigo-100/50"><p>Total Cost Per Hire</p><p className="value text-indigo-700 text-4xl"><AnimatedNumber value={totalCost} prefix="₹ "/></p></div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="result-card"><p>External Costs</p><p className="value"><AnimatedNumber value={totalExternal} prefix="₹ "/></p></div>
                         <div className="result-card"><p>Internal Costs</p><p className="value"><AnimatedNumber value={totalInternal} prefix="₹ "/></p></div>
                    </div>
                </div>
            </div>
             <style>{`
                .person-loader { width: 80px; height: 120px; position: relative; }
                .person-loader > div { background: #cbd5e1; position: absolute; border-radius: 4px; animation: assemble 2s forwards; opacity: 0; }
                .dark .person-loader > div { background: #475569; }
                .head { width: 30px; height: 30px; border-radius: 50%; top: 0; left: 25px; animation-delay: 0s; }
                .body { width: 30px; height: 50px; top: 32px; left: 25px; animation-delay: 0.4s; }
                .arm.left { width: 15px; height: 40px; top: 35px; left: 8px; transform: rotate(20deg); animation-delay: 0.8s; }
                .arm.right { width: 15px; height: 40px; top: 35px; right: 8px; transform: rotate(-20deg); animation-delay: 1.0s; }
                .leg.left { width: 15px; height: 40px; bottom: 0; left: 20px; animation-delay: 1.2s; }
                .leg.right { width: 15px; height: 40px; bottom: 0; right: 20px; animation-delay: 1.4s; }
                @keyframes assemble { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};
