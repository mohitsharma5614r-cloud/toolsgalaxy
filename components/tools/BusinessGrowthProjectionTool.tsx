import React, { useState, useMemo, useEffect, useRef } from 'react';

const AnimatedNumber: React.FC<{ value: number, prefix?: string }> = ({ value, prefix }) => {
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

    return <span>{prefix}{Math.round(current).toLocaleString('en-IN')}</span>;
};

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="rocket-loader mx-auto">
            <div className="rocket">🚀</div>
            <div className="smoke s1"></div><div className="smoke s2"></div><div className="smoke s3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Projecting future growth...</p>
        <style>{`
            .rocket-loader { width: 80px; height: 120px; position: relative; }
            .rocket { font-size: 50px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); animation: take-off 2s infinite ease-in-out; }
            .smoke { position: absolute; bottom: -10px; left: 50%; width: 15px; height: 15px; background: #e2e8f0; border-radius: 50%; transform: translateX(-50%); opacity: 0; animation: puff 2s infinite; }
            .dark .smoke { background: #475569; }
            .s1 { animation-delay: 0s; } .s2 { animation-delay: 0.3s; } .s3 { animation-delay: 0.6s; }
            @keyframes take-off { 0% { bottom: 0; } 100% { bottom: 120px; opacity: 0; } }
            @keyframes puff { 0% { transform: translate(-50%, 0) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, 20px) scale(3); opacity: 0; } }
        `}</style>
    </div>
);

export const BusinessGrowthProjectionTool: React.FC<{ title: string }> = ({ title }) => {
    const [startRevenue, setStartRevenue] = useState(50000);
    const [growthRate, setGrowthRate] = useState(10); // Monthly %
    const [months, setMonths] = useState(24);
    const [isLoading, setIsLoading] = useState(true);
    const svgRef = useRef<SVGSVGElement>(null);
    const [pathData, setPathData] = useState('');

    React.useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);
    
    const projection = useMemo(() => {
        const data = [];
        let currentRevenue = startRevenue;
        for (let i = 0; i <= months; i++) {
            data.push({ month: i, revenue: currentRevenue });
            currentRevenue *= (1 + growthRate / 100);
        }
        return data;
    }, [startRevenue, growthRate, months]);

    useEffect(() => {
        if (!svgRef.current || projection.length < 2) return;
        
        const svg = svgRef.current;
        const { width, height } = svg.getBoundingClientRect();
        const padding = 20;

        const maxX = projection[projection.length - 1].month;
        const maxY = projection[projection.length - 1].revenue;

        const xScale = (width - 2 * padding) / maxX;
        const yScale = (height - 2 * padding) / maxY;

        let path = `M ${padding},${height - padding - projection[0].revenue * yScale}`;
        projection.forEach(point => {
            const x = padding + point.month * xScale;
            const y = height - padding - point.revenue * yScale;
            path += ` L ${x},${y}`;
        });
        setPathData(path);

    }, [projection]);

    const finalRevenue = projection[projection.length - 1]?.revenue || 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Project your business's future growth based on key metrics.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold">Inputs</h2>
                    <div>
                        <label>Starting Monthly Revenue: <span className="font-bold text-indigo-600">₹{startRevenue.toLocaleString()}</span></label>
                        <input type="range" min="1000" max="1000000" step="1000" value={startRevenue} onChange={e => setStartRevenue(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Monthly Growth Rate: <span className="font-bold text-indigo-600">{growthRate}%</span></label>
                        <input type="range" min="1" max="50" step="0.5" value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} />
                    </div>
                     <div>
                        <label>Projection Period (Months): <span className="font-bold text-indigo-600">{months}</span></label>
                        <input type="range" min="6" max="60" step="1" value={months} onChange={e => setMonths(Number(e.target.value))} />
                    </div>
                </div>
                
                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold text-center mb-2">Growth Projection</h2>
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> :
                    (
                        <div className="animate-fade-in">
                            <div className="relative h-64 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                <svg ref={svgRef} className="w-full h-full">
                                    <path d={pathData} fill="none" stroke="#4f46e5" strokeWidth="3" className="path-animation" />
                                </svg>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-slate-500">Projected Monthly Revenue in {months} months:</p>
                                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                    <AnimatedNumber value={finalRevenue} prefix="₹ " />
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .path-animation {
                    stroke-dasharray: 2000;
                    stroke-dashoffset: 2000;
                    animation: draw-path 1.5s ease-out forwards;
                }
                @keyframes draw-path {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};
