
import React, { useState, useMemo } from 'react';

const destinations = {
    'Asia': { medical: 25000, baggage: 500, cancellation: 1000 },
    'Europe': { medical: 50000, baggage: 1000, cancellation: 2000 },
    'USA/Canada': { medical: 100000, baggage: 1500, cancellation: 3000 },
    'Australia/NZ': { medical: 50000, baggage: 1000, cancellation: 2500 },
    'Other': { medical: 30000, baggage: 750, cancellation: 1500 },
};
type Destination = keyof typeof destinations;

const Loader: React.FC = () => (
    <div className="travel-loader mx-auto">
        <div className="globe">
            <div className="airplane">✈️</div>
        </div>
    </div>
);

export const TravelInsuranceCoverageChecker: React.FC<{ title: string }> = ({ title }) => {
    const [destination, setDestination] = useState<Destination>('Europe');
    const [duration, setDuration] = useState(15);
    const [adventureSports, setAdventureSports] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const coverage = useMemo(() => {
        let { medical, baggage, cancellation } = destinations[destination];
        if (duration > 30) {
            medical *= 1.5;
            cancellation *= 1.2;
        }
        if (adventureSports) {
            medical *= 2;
        }
        return {
            medical: Math.round(medical),
            baggage: Math.round(baggage),
            cancellation: Math.round(cancellation),
            personalAccident: Math.round(medical * 0.5),
        };
    }, [destination, duration, adventureSports]);

    const handleCheck = () => {
        setIsLoading(true);
        setTimeout(() => {
            setShowResult(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .travel-loader { width: 120px; height: 120px; position: relative; }
                .globe { width: 100%; height: 100%; border-radius: 50%; background: #60a5fa; overflow: hidden; animation: spin-globe 8s linear infinite; }
                .dark .globe { background: #3b82f6; }
                .airplane { font-size: 30px; position: absolute; animation: fly-around 4s infinite ease-in-out; }
                @keyframes spin-globe { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fly-around { 0% { top: 20%; left: -10%; } 50% { top: 70%; left: 50%; } 100% { top: 20%; left: 110%; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get suggested coverage amounts for your next trip.</p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {!showResult ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-style">Destination</label>
                                <select value={destination} onChange={e => setDestination(e.target.value as Destination)} className="input-style w-full">
                                    {Object.keys(destinations).map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label-style">Trip Duration: {duration} days</label>
                                <input type="range" min="1" max="60" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full range-style" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="adventure" checked={adventureSports} onChange={e => setAdventureSports(e.target.checked)} className="h-5 w-5 rounded"/>
                            <label htmlFor="adventure" className="font-medium">Includes Adventure Sports?</label>
                        </div>
                        <button onClick={handleCheck} disabled={isLoading} className="w-full btn-primary text-lg">
                            {isLoading ? 'Checking...' : 'Check Coverage'}
                        </button>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-center mb-6">Recommended Coverage</h2>
                        <div className="space-y-3">
                            <div className="result-item"><span className="font-semibold">🩺 Medical Expenses:</span> <span className="value-item">${coverage.medical.toLocaleString()}</span></div>
                            <div className="result-item"><span className="font-semibold">✈️ Trip Cancellation:</span> <span className="value-item">${coverage.cancellation.toLocaleString()}</span></div>
                            <div className="result-item"><span className="font-semibold">🧳 Baggage Loss/Delay:</span> <span className="value-item">${coverage.baggage.toLocaleString()}</span></div>
                            <div className="result-item"><span className="font-semibold">🤕 Personal Accident:</span> <span className="value-item">${coverage.personalAccident.toLocaleString()}</span></div>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-6">*These are illustrative suggestions. Check with your insurance provider for actual policy details.</p>
                        <div className="text-center mt-6">
                            <button onClick={() => setShowResult(false)} className="btn-primary">← Check Again</button>
                        </div>
                    </div>
                )}
                {isLoading && <div className="min-h-[200px] flex items-center justify-center"><Loader /></div>}
            </div>
        </div>
    );
};
