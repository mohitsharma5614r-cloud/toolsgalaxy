import React, { useState, useMemo, useEffect, useRef } from 'react';

const AnimatedNumber = ({ value }: { value: number }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let frameId: number;
        const start = current;
        const duration = 1000;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setCurrent(start + (value - start) * easeOut);
            if (progress < duration) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, current]);
    return <span>{Math.round(current).toLocaleString('en-IN')}</span>;
};

export const FranchiseCostEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [franchiseFee, setFranchiseFee] = useState(2000000);
    const [initialInvestment, setInitialInvestment] = useState(5000000);
    const [royaltyFee, setRoyaltyFee] = useState(6);
    const [marketingFee, setMarketingFee] = useState(2);
    const [annualRevenue, setAnnualRevenue] = useState(8000000);

    const { totalInitialCost, firstYearCost } = useMemo(() => {
        const initial = franchiseFee + initialInvestment;
        const ongoingRoyalties = annualRevenue * (royaltyFee / 100);
        const ongoingMarketing = annualRevenue * (marketingFee / 100);
        const firstYear = initial + ongoingRoyalties + ongoingMarketing;
        return { totalInitialCost: initial, firstYearCost: firstYear };
    }, [franchiseFee, initialInvestment, royaltyFee, marketingFee, annualRevenue]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate the initial and ongoing costs of buying a franchise.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold">Initial Costs</h2>
                    <label>Franchise Fee: ₹{franchiseFee.toLocaleString()}</label>
                    <input type="range" min="500000" max="10000000" step="100000" value={franchiseFee} onChange={e => setFranchiseFee(Number(e.target.value))} />
                    <label>Initial Investment (Fit-out, etc.): ₹{initialInvestment.toLocaleString()}</label>
                    <input type="range" min="1000000" max="50000000" step="500000" value={initialInvestment} onChange={e => setInitialInvestment(Number(e.target.value))} />
                    
                    <h2 className="text-xl font-bold pt-4 border-t">Ongoing Costs</h2>
                     <label>Estimated Annual Revenue: ₹{annualRevenue.toLocaleString()}</label>
                    <input type="range" min="2500000" max="100000000" step="500000" value={annualRevenue} onChange={e => setAnnualRevenue(Number(e.target.value))} />
                    <label>Royalty Fee: {royaltyFee}% of revenue</label>
                    <input type="range" min="0" max="15" step="0.5" value={royaltyFee} onChange={e => setRoyaltyFee(Number(e.target.value))} />
                    <label>Marketing Fee: {marketingFee}% of revenue</label>
                    <input type="range" min="0" max="10" step="0.5" value={marketingFee} onChange={e => setMarketingFee(Number(e.target.value))} />
                </div>
                <div className="space-y-6 text-center">
                    <div className="result-card bg-indigo-100/50">
                        <p className="result-label">Total Initial Investment</p>
                        <p className="value text-indigo-700 text-4xl">₹ <AnimatedNumber value={totalInitialCost} /></p>
                    </div>
                     <div className="result-card bg-emerald-100/50">
                        <p className="result-label">Estimated First Year Total Cost</p>
                        <p className="value text-emerald-700 text-4xl">₹ <AnimatedNumber value={firstYearCost} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};