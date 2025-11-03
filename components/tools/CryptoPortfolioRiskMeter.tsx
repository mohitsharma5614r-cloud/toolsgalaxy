
import React, { useState, useMemo } from 'react';

// --- Configuration ---
const categories = [
    { name: 'BTC/ETH', riskWeight: 1.5, color: '#f59e0b' },
    { name: 'Top Altcoins', riskWeight: 3.0, color: '#3b82f6' },
    { name: 'Meme Coins', riskWeight: 5.0, color: '#ef4444' },
    { name: 'Stablecoins', riskWeight: 0.1, color: '#22c55e' },
];

// --- Risk Meter Component ---
const RiskMeter = ({ score }: { score: number }) => {
    const angle = (score / 100) * 180;
    const getStatus = () => {
        if (score <= 30) return { text: 'Safe Hodler', color: 'text-emerald-500' };
        if (score <= 50) return { text: 'Calculated Risk', color: 'text-yellow-500' };
        if (score <= 80) return { text: 'High-Risk Ape', color: 'text-orange-500' };
        return { text: 'Full Degenerate', color: 'text-red-500' };
    };
    const status = getStatus();

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0"
                     style={{ background: `conic-gradient(from 180deg at 50% 100%, #10b981 0 30%, #f59e0b 31% 50%, #f97316 51% 80%, #ef4444 81% 100%)` }}>
                </div>
                <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-700 ease-out"
                     style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
                </div>
            </div>
            <div className={`text-center -mt-8 ${status.color}`}>
                 <p className="text-5xl font-extrabold">{Math.round(score)}</p>
                 <p className="text-xl font-bold">{status.text}</p>
            </div>
        </div>
    );
};


// --- Main Component ---
export const CryptoPortfolioRiskMeter: React.FC = () => {
    const [allocations, setAllocations] = useState([60, 20, 10, 10]);

    const handleAllocationChange = (index: number, value: number) => {
        const newAllocations = [...allocations];
        const oldValue = newAllocations[index];
        const diff = value - oldValue;
        newAllocations[index] = value;

        // Distribute the difference among other sliders
        let remainingDiff = diff;
        while (Math.abs(remainingDiff) > 0.1) {
             for (let i = 0; i < newAllocations.length; i++) {
                if (i === index) continue;
                const share = remainingDiff / (newAllocations.length - 1);
                if (newAllocations[i] - share >= 0 && newAllocations[i] - share <= 100) {
                     newAllocations[i] -= share;
                }
            }
            const currentTotal = newAllocations.reduce((a, b) => a + b, 0);
            remainingDiff = 100 - currentTotal;
        }
        
        // Final rounding to ensure it's exactly 100
        const total = newAllocations.reduce((a, b) => a + b, 0);
        if (total !== 100) {
            const lastIndex = newAllocations.length - 1;
            newAllocations[lastIndex] += 100 - total;
        }

        setAllocations(newAllocations.map(v => Math.round(v)));
    };
    
    const riskScore = useMemo(() => {
        const weightedScore = allocations.reduce((sum, allocation, index) => {
            return sum + (allocation / 100) * categories[index].riskWeight;
        }, 0);
        
        // Normalize the score to a 0-100 scale
        const maxPossibleScore = 5.0; // Meme coins
        return (weightedScore / maxPossibleScore) * 100;
    }, [allocations]);

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Crypto Portfolio Risk Meter 🚀</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Assess the risk level of your crypto portfolio allocation.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold text-center mb-4">Portfolio Allocation (Total: 100%)</h2>
                    {categories.map((cat, index) => (
                        <div key={cat.name}>
                            <label className="label-style flex items-center gap-2">{cat.name}: <span className="font-bold text-indigo-600">{allocations[index]}%</span></label>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                <input type="range" min="0" max="100" value={allocations[index]} onChange={e => handleAllocationChange(index, Number(e.target.value))} className="w-full range-style" />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Results */}
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center gap-6">
                    <RiskMeter score={riskScore} />
                     <p className="text-center text-sm text-slate-600 dark:text-slate-400 italic">
                        This is a simplified, fun tool. Not financial advice. Higher allocation to volatile assets like meme coins significantly increases risk.
                    </p>
                </div>
            </div>
             <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .range-style { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark .range-style { background: #334155; }
                .range-style::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; }
            `}</style>
        </div>
    );
};
