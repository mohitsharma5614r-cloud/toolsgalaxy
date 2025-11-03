
import React, { useState, useMemo, useEffect } from 'react';

// --- Gauge Component ---
const ScoreGauge = ({ score }: { score: number }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const angle = (displayScore / 100) * 180;

    const getStatus = () => {
        if (score < 30) return { text: 'Back to the Drawing Board', color: 'text-red-500' };
        if (score < 60) return { text: 'A Promising Start', color: 'text-yellow-500' };
        if (score < 85) return { text: 'A Solid Concept', color: 'text-sky-500' };
        return { text: 'The Next Big Thing!', color: 'text-emerald-500' };
    };
    const status = getStatus();

    useEffect(() => {
        let frameId: number;
        const start = displayScore;
        const end = score;
        const duration = 1000;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setDisplayScore(start + (end - start) * easeOut);
            if (progress < duration) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => { if(frameId) cancelAnimationFrame(frameId); };
    }, [score, displayScore]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                {/* Gauge Background */}
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                {/* Gauge Color Arc */}
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0"
                     style={{ background: `conic-gradient(from 180deg at 50% 100%, #ef4444 0 30%, #f59e0b 31% 60%, #38bdf8 61% 85%, #10b981 86% 100%)` }}>
                </div>
                 <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}>
                </div>
                {/* Needle Pivot */}
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                {/* Needle */}
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-700 ease-out"
                     style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
                </div>
            </div>
            <div className={`text-center -mt-8 ${status.color}`}>
                 <p className="text-5xl font-extrabold">{Math.round(displayScore)}</p>
                 <p className="text-xl font-bold">{status.text}</p>
            </div>
        </div>
    );
};

export const InnovationScoreCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [scores, setScores] = useState({
        novelty: 5,
        viability: 5,
        marketNeed: 5,
        scalability: 5,
        wowFactor: 5,
    });

    const handleScoreChange = (criteria: keyof typeof scores, value: number) => {
        setScores(prev => ({ ...prev, [criteria]: value }));
    };
    
    const innovationScore = useMemo(() => {
        // FIX: Add explicit types to the reduce function's callback parameters to resolve the arithmetic operation type error.
        const total = Object.values(scores).reduce((sum: number, val: number) => sum + val, 0);
        // (total / 50) * 100 = total * 2
        return total * 2;
    }, [scores]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .range-style { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark .range-style { background: #334155; }
                .range-style::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 💡</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Rate your idea on key metrics to calculate its innovation potential.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="label-style">Novelty (How new is it?): <span className="font-bold text-indigo-600">{scores.novelty}/10</span></label>
                        <input type="range" min="0" max="10" value={scores.novelty} onChange={e => handleScoreChange('novelty', Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Viability (Is it feasible?): <span className="font-bold text-indigo-600">{scores.viability}/10</span></label>
                        <input type="range" min="0" max="10" value={scores.viability} onChange={e => handleScoreChange('viability', Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">Market Need (Is it wanted?): <span className="font-bold text-indigo-600">{scores.marketNeed}/10</span></label>
                        <input type="range" min="0" max="10" value={scores.marketNeed} onChange={e => handleScoreChange('marketNeed', Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">Scalability (Can it grow?): <span className="font-bold text-indigo-600">{scores.scalability}/10</span></label>
                        <input type="range" min="0" max="10" value={scores.scalability} onChange={e => handleScoreChange('scalability', Number(e.target.value))} className="w-full range-style" />
                    </div>
                     <div>
                        <label className="label-style">"Wow" Factor (Is it exciting?): <span className="font-bold text-indigo-600">{scores.wowFactor}/10</span></label>
                        <input type="range" min="0" max="10" value={scores.wowFactor} onChange={e => handleScoreChange('wowFactor', Number(e.target.value))} className="w-full range-style" />
                    </div>
                </div>
                
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                    <p className="text-lg text-slate-500 dark:text-slate-400">Total Innovation Score</p>
                    <ScoreGauge score={innovationScore} />
                </div>
            </div>
        </div>
    );
};