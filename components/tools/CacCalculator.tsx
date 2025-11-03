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
    
    if (!isFinite(value)) {
        return <span>{prefix}0</span>;
    }

    return <span>{prefix}{Math.round(currentValue).toLocaleString('en-IN')}</span>;
};

export const CacCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [spend, setSpend] = useState(100000);
    const [customers, setCustomers] = useState(50);

    const cac = useMemo(() => {
        return customers > 0 ? spend / customers : 0;
    }, [spend, customers]);

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .cac-animation {
                    width: 120px; height: 120px;
                    position: relative;
                }
                .funnel {
                    width: 100%; height: 100%;
                    clip-path: polygon(0 0, 100% 0, 75% 100%, 25% 100%);
                    background: linear-gradient(to right, #a5b4fc, #6366f1);
                    position: relative;
                }
                .dollar, .customer {
                    position: absolute;
                    font-size: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    animation-duration: 2.5s;
                    animation-iteration-count: infinite;
                    opacity: 0;
                }
                .dollar {
                    animation-name: fall-in;
                }
                .customer {
                    animation-name: emerge-out;
                    animation-delay: 1.25s;
                }

                @keyframes fall-in {
                    0% { top: -20px; opacity: 1; }
                    50% { top: 50px; opacity: 0; }
                    100% { top: 50px; opacity: 0; }
                }
                @keyframes emerge-out {
                     0% { bottom: 50px; opacity: 0; }
                    50% { bottom: -30px; opacity: 1; }
                    100% { bottom: -30px; opacity: 0; }
                }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your Customer Acquisition Cost.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-8">
                    <div>
                        <label>Total Marketing & Sales Spend: <span className="font-bold text-indigo-600">₹{spend.toLocaleString()}</span></label>
                        <input type="range" min="1000" max="1000000" step="1000" value={spend} onChange={e => setSpend(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>New Customers Acquired: <span className="font-bold text-indigo-600">{customers}</span></label>
                        <input type="range" min="1" max="1000" value={customers} onChange={e => setCustomers(Number(e.target.value))} />
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center text-center">
                    <div className="cac-animation">
                        <div className="funnel">
                            <div className="dollar">💰</div>
                            <div className="customer">👤</div>
                        </div>
                    </div>
                    <p className="text-lg text-slate-500 mt-4">Customer Acquisition Cost (CAC)</p>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                        <AnimatedNumber value={cac} prefix="₹ " />
                    </p>
                </div>
            </div>
        </div>
    );
};
