
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Remove currentValue from dependency array to prevent infinite re-renders.
    useEffect(() => {
        let frameId: number;
        const startValue = currentValue;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            setCurrentValue(startValue + (value - startValue) * easeOut);
            if (progress < duration) { frameId = requestAnimationFrame(animate); }
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value]);
    return <span>{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

// Loader
const Loader = () => (
    <div className="health-loader mx-auto">
        <div className="heart">❤️</div>
        <div className="cross">+</div>
    </div>
);

export const HealthInsurancePlanner: React.FC<{ title: string }> = ({ title }) => {
    const [age, setAge] = useState(30);
    const [city, setCity] = useState<'Metro' | 'Non-Metro'>('Metro');
    const [family, setFamily] = useState<'Individual' | 'Couple' | 'Family of 4'>('Couple');

    const suggestedCover = useMemo(() => {
        let baseCover = 500000; // 5 Lakhs
        if (city === 'Metro') baseCover *= 1.5;
        if (age > 45) baseCover *= 1.5;
        if (family === 'Couple') baseCover *= 1.8;
        if (family === 'Family of 4') baseCover *= 2.5;
        return Math.floor(baseCover / 100000) * 100000; // Round to nearest lakh
    }, [age, city, family]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .health-loader { width: 100px; height: 100px; position: relative; }
                .heart { font-size: 80px; text-align: center; line-height: 100px; color: #ef4444; animation: heart-beat 1.2s infinite; }
                .cross { font-size: 40px; font-weight: bold; color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
                @keyframes heart-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your health insurance coverage based on your family and lifestyle.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="label-style">Eldest Member's Age: <span className="font-bold text-indigo-600">{age}</span></label>
                        <input type="range" min="18" max="70" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div>
                        <label className="label-style">City Type</label>
                        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setCity('Metro')} className={`flex-1 btn-toggle ${city === 'Metro' ? 'btn-toggle-active' : ''}`}>Metro</button>
                            <button onClick={() => setCity('Non-Metro')} className={`flex-1 btn-toggle ${city === 'Non-Metro' ? 'btn-toggle-active' : ''}`}>Non-Metro</button>
                        </div>
                    </div>
                    <div>
                        <label className="label-style">Family Size</label>
                        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setFamily('Individual')} className={`flex-1 btn-toggle ${family === 'Individual' ? 'btn-toggle-active' : ''}`}>Individual</button>
                            <button onClick={() => setFamily('Couple')} className={`flex-1 btn-toggle ${family === 'Couple' ? 'btn-toggle-active' : ''}`}>Couple</button>
                            <button onClick={() => setFamily('Family of 4')} className={`flex-1 btn-toggle ${family === 'Family of 4' ? 'btn-toggle-active' : ''}`}>Family of 4</button>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <Loader />
                    <div className="mt-8">
                        <p className="text-lg text-slate-500 dark:text-slate-400">Suggested Sum Insured</p>
                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">₹ <AnimatedNumber value={suggestedCover} /></p>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">*This is a simplified estimate. Healthcare costs vary. Consider top-up plans for higher coverage.</p>
                </div>
            </div>
        </div>
    );
};
