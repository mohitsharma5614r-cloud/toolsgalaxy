import React, { useState, useMemo } from 'react';

// Animated number component for smooth counting effect
const AnimatedNumber = ({ value, prefix = '' }: { value: number, prefix?: string }) => {
    const [currentValue, setCurrentValue] = useState(0);

    React.useEffect(() => {
        const startValue = currentValue;
        const duration = 750; // ms
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 4);
            
            const nextValue = startValue + (value - startValue) * easeOutPercentage;
            setCurrentValue(nextValue);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [value, currentValue]);

    return <span>{prefix}{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

export const LtvCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [avgPurchase, setAvgPurchase] = useState(2500);
    const [frequency, setFrequency] = useState(4); // per month
    const [lifespan, setLifespan] = useState(3); // in years

    const ltv = useMemo(() => {
        // LTV = (Average Purchase Value * Purchase Frequency Rate) * Customer Lifespan (in months)
        return (avgPurchase * frequency) * (lifespan * 12);
    }, [avgPurchase, frequency, lifespan]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #e2e8f0; }
                .dark input[type=range] { background: #334155; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #4f46e5; cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
                .dark input[type=range]::-webkit-slider-thumb { border-color: #1e293b; }

                .ltv-animation {
                    width: 120px; height: 120px;
                    position: relative;
                }
                .customer-icon {
                    font-size: 40px;
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    animation: customer-pulse 2s infinite ease-in-out;
                }
                .value-ring {
                    position: absolute;
                    border: 4px solid;
                    border-radius: 50%;
                    opacity: 0;
                    animation: ripple 2s infinite;
                }
                .value-ring.r1 { animation-delay: 0s; border-color: #a5b4fc; }
                .value-ring.r2 { animation-delay: 0.5s; border-color: #818cf8; }
                .value-ring.r3 { animation-delay: 1s; border-color: #6366f1; }
                
                @keyframes customer-pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                }
                @keyframes ripple {
                    0% { top: 50%; left: 50%; width: 0; height: 0; opacity: 1; }
                    100% { top: 0; left: 0; width: 100%; height: 100%; opacity: 0; }
                }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate the Lifetime Value of a customer for your business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-8">
                    <div>
                        <label>Average Purchase Value: <span className="font-bold text-indigo-600">₹{avgPurchase.toLocaleString()}</span></label>
                        <input type="range" min="100" max="25000" step="100" value={avgPurchase} onChange={e => setAvgPurchase(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Purchases per Month: <span className="font-bold text-indigo-600">{frequency}</span></label>
                        <input type="range" min="1" max="30" value={frequency} onChange={e => setFrequency(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Customer Lifespan (Years): <span className="font-bold text-indigo-600">{lifespan}</span></label>
                        <input type="range" min="1" max="20" value={lifespan} onChange={e => setLifespan(Number(e.target.value))} />
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center text-center">
                    <div className="ltv-animation">
                        <div className="customer-icon">👤</div>
                        <div className="value-ring r1"></div>
                        <div className="value-ring r2"></div>
                        <div className="value-ring r3"></div>
                    </div>
                    <p className="text-lg text-slate-500 mt-4">Customer Lifetime Value (LTV)</p>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                        <AnimatedNumber value={ltv} prefix="₹ " />
                    </p>
                </div>
            </div>
        </div>
    );
};
