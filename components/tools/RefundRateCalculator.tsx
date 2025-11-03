import React, { useState, useMemo } from 'react';

// Animated Number Component
const AnimatedNumber: React.FC<{ value: number, suffix?: string }> = ({ value, suffix }) => {
    const [current, setCurrent] = useState(0);
    React.useEffect(() => {
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

    return <span>{current.toFixed(2)}{suffix}</span>;
};

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="refund-loader mx-auto">
            <div className="box"></div>
            <div className="arrow">↑</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating...</p>
        <style>{`
            .refund-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .box {
                width: 80px;
                height: 60px;
                background: #a1887f;
                border: 3px solid #5d4037;
                position: absolute;
                bottom: 0;
                left: 10px;
            }
            .dark .box {
                 background: #bcaaa4;
                 border-color: #8d6e63;
            }
            .arrow {
                font-size: 40px;
                font-weight: bold;
                color: #ef4444; /* red-500 */
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: return-arrow 2s infinite ease-out;
            }
            @keyframes return-arrow {
                0% { transform: translate(-50%, 20px) scale(0.8); opacity: 0; }
                50% { transform: translate(-50%, -40px) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -40px) scale(1.2); opacity: 0; }
            }
        `}</style>
    </div>
);


export const RefundRateCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [sales, setSales] = useState(1000);
    const [refunds, setRefunds] = useState(50);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const refundRate = useMemo(() => {
        return sales > 0 ? (refunds / sales) * 100 : 0;
    }, [sales, refunds]);

    const getStatus = (rate: number) => {
        if (rate <= 2) return { text: 'Excellent', color: 'text-emerald-500' };
        if (rate <= 5) return { text: 'Good', color: 'text-yellow-500' };
        if (rate <= 10) return { text: 'Concerning', color: 'text-orange-500' };
        return { text: 'High', color: 'text-red-500' };
    };

    const status = getStatus(refundRate);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the refund rate for your products or services.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
                    <div>
                        <label>Total Sales: <span className="font-bold text-indigo-600">{sales.toLocaleString()}</span></label>
                        <input type="range" min="1" max="50000" step="1" value={sales} onChange={e => setSales(Number(e.target.value))} className="w-full" />
                    </div>
                    <div>
                        <label>Total Refunds: <span className="font-bold text-indigo-600">{refunds.toLocaleString()}</span></label>
                        <input type="range" min="0" max={sales} step="1" value={refunds} onChange={e => setRefunds(Number(e.target.value))} className="w-full" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center min-h-[250px]">
                    {isLoading ? <Loader/> : (
                         <div className="animate-fade-in w-full">
                            <p className="text-lg text-slate-500 dark:text-slate-400">Your Refund Rate is</p>
                            <p className={`text-7xl font-extrabold my-2 ${status.color}`}>
                                <AnimatedNumber value={refundRate} suffix="%" />
                            </p>
                            <p className={`text-xl font-bold ${status.color}`}>{status.text}</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                 @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
};