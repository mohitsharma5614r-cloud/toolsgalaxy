
import React, { useState, useMemo } from 'react';

// Gaussian Error Function approximation
const erf = (x: number): number => {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
};

// Cumulative Distribution Function for the standard normal distribution
const cdf = (z: number): number => {
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="scale-loader mx-auto">
            <div className="scale-arm">
                <div className="scale-pan left"></div>
                <div className="scale-pan right"></div>
            </div>
            <div className="scale-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating significance...</p>
        <style>{`
            .scale-loader { width: 120px; height: 80px; position: relative; }
            .scale-base { width: 40px; height: 10px; background: #9ca3af; border-radius: 4px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
            .dark .scale-base { background: #64748b; }
            .scale-base::before { content:''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 10px 40px 10px; border-color: transparent transparent #9ca3af transparent; }
            .dark .scale-base::before { border-color: transparent transparent #64748b transparent; }
            .scale-arm { width: 100%; height: 8px; background: #9ca3af; border-radius: 4px; position: absolute; top: 30px; transform-origin: center; animation: balance-scale 2s infinite ease-in-out; }
            .dark .scale-arm { background: #64748b; }
            .scale-pan { position: absolute; width: 30px; height: 15px; border: 2px solid #9ca3af; border-top: none; border-radius: 0 0 15px 15px; top: 10px; }
            .dark .scale-pan { border-color: #64748b; }
            .scale-pan.left { left: 0; }
            .scale-pan.right { right: 0; }
            @keyframes balance-scale { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
        `}</style>
    </div>
);


export const PriceTestingCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [dataA, setDataA] = useState({ visitors: '1000', conversions: '50' });
    const [dataB, setDataB] = useState({ visitors: '1000', conversions: '70' });
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        setIsLoading(true);
        setTimeout(() => {
            const vA = parseInt(dataA.visitors); const cA = parseInt(dataA.conversions);
            const vB = parseInt(dataB.visitors); const cB = parseInt(dataB.conversions);
            if (!vA || !cA || !vB || !cB || vA < cA || vB < cB) {
                setResult(null); setIsLoading(false); return;
            }

            const crA = cA / vA;
            const crB = cB / vB;
            const uplift = (crB - crA) / crA;

            const pPool = (cA + cB) / (vA + vB);
            const se = Math.sqrt(pPool * (1 - pPool) * (1 / vA + 1 / vB));
            const zScore = (crB - crA) / se;
            const pValue = 1 - cdf(Math.abs(zScore));
            const confidence = 100 * (1 - (2 * pValue));

            setResult({ crA, crB, uplift, confidence, isSignificant: confidence > 95 });
            setIsLoading(false);
        }, 1500);
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the statistical significance for A/B price tests.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-center">Variation A (Control)</h2>
                        <input type="number" value={dataA.visitors} onChange={e => setDataA({...dataA, visitors: e.target.value})} placeholder="Visitors" className="input-style w-full"/>
                        <input type="number" value={dataA.conversions} onChange={e => setDataA({...dataA, conversions: e.target.value})} placeholder="Conversions" className="input-style w-full"/>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-center">Variation B (Test)</h2>
                        <input type="number" value={dataB.visitors} onChange={e => setDataB({...dataB, visitors: e.target.value})} placeholder="Visitors" className="input-style w-full"/>
                        <input type="number" value={dataB.conversions} onChange={e => setDataB({...dataB, conversions: e.target.value})} placeholder="Conversions" className="input-style w-full"/>
                    </div>
                </div>
                <button onClick={handleCalculate} disabled={isLoading} className="w-full btn-primary text-lg !mt-8">
                    {isLoading ? 'Calculating...' : 'Calculate Significance'}
                </button>
            </div>
            
            <div className="mt-8 min-h-[250px] flex items-center justify-center">
                {isLoading ? <Loader /> : result ? (
                    <div className="w-full p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border animate-fade-in text-center space-y-4">
                        <div className={`p-4 rounded-lg font-bold text-xl ${result.isSignificant ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {result.isSignificant ? `The result is statistically significant with ${result.confidence.toFixed(1)}% confidence!` : `The result is not statistically significant (${result.confidence.toFixed(1)}% confidence).`}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="result-card"><p>CR (A)</p><p className="value">{(result.crA * 100).toFixed(2)}%</p></div>
                            <div className="result-card"><p>CR (B)</p><p className="value">{(result.crB * 100).toFixed(2)}%</p></div>
                            <div className="result-card"><p>Uplift</p><p className="value">{(result.uplift * 100).toFixed(2)}%</p></div>
                            <div className="result-card"><p>Confidence</p><p className="value">{result.confidence.toFixed(1)}%</p></div>
                        </div>
                    </div>
                ) : null}
            </div>
             <style>{`
                 .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                .result-card { background: #f8fafc; border-radius: 0.5rem; padding: 1rem; }
                .dark .result-card { background: #1e293b; }
                .result-card p:first-child { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .result-card .value { font-size: 1.5rem; font-weight: 700; }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};
