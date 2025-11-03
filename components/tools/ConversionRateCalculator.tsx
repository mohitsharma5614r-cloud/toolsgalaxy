import React, { useState, useMemo, useEffect } from 'react';

const AnimatedNumber: React.FC<{ value: number, suffix?: string }> = ({ value, suffix }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 500;
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

    return <span>{current.toFixed(2)}{suffix}</span>;
};

const ConversionGauge: React.FC<{ rate: number }> = ({ rate }) => {
    const angle = (rate / 25) * 180; // Scale to 25% max for a better visual
    const getStatusColor = (r: number) => {
        if (r < 2) return 'text-red-500';
        if (r < 5) return 'text-yellow-500';
        return 'text-emerald-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 overflow-hidden">
                <div className="absolute w-full h-full border-[16px] border-slate-200 dark:border-slate-700 rounded-t-full border-b-0"></div>
                <div className="absolute w-full h-full border-[16px] border-transparent rounded-t-full border-b-0" style={{ background: `conic-gradient(from 180deg at 50% 100%, #ef4444 0 8%, #f59e0b 9% 20%, #10b981 21% 100%)` }}></div>
                <div className="absolute w-full h-full bg-white dark:bg-slate-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 55%, 0 55%)' }}></div>
                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-32 bg-slate-800 dark:bg-white rounded-t-full transform-origin-bottom transition-transform duration-700 ease-out" style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}></div>
            </div>
            <p className={`-mt-8 text-6xl font-extrabold ${getStatusColor(rate)}`}>
                <AnimatedNumber value={rate} suffix="%" />
            </p>
        </div>
    );
};

export const ConversionRateCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [visitors, setVisitors] = useState(10000);
    const [conversions, setConversions] = useState(350);

    const conversionRate = useMemo(() => {
        return visitors > 0 ? (conversions / visitors) * 100 : 0;
    }, [visitors, conversions]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the conversion rate of your campaigns or website.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-8">
                    <div>
                        <label>Number of Visitors: <span className="font-bold text-indigo-600">{visitors.toLocaleString()}</span></label>
                        <input type="range" min="100" max="100000" step="100" value={visitors} onChange={e => setVisitors(Number(e.target.value))} className="w-full mt-2" />
                    </div>
                     <div>
                        <label>Number of Conversions: <span className="font-bold text-indigo-600">{conversions.toLocaleString()}</span></label>
                        <input type="range" min="0" max={visitors} step="1" value={conversions} onChange={e => setConversions(Number(e.target.value))} className="w-full mt-2" />
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Conversion Rate</h2>
                    <ConversionGauge rate={conversionRate} />
                </div>
            </div>
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
            `}</style>
        </div>
    );
};
