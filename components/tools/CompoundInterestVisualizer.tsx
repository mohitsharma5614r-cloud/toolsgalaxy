import React, { useState, useMemo, useEffect, useRef } from 'react';

// Chart component
const Chart: React.FC<{ data: { year: number; value: number }[] }> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [pathData, setPathData] = useState('');

    useEffect(() => {
        if (!svgRef.current || data.length < 2) return;
        
        const svg = svgRef.current;
        const { width, height } = svg.getBoundingClientRect();
        const padding = 30;

        const maxX = data[data.length - 1].year;
        const maxY = data[data.length - 1].value;

        const xScale = (width - 2 * padding) / maxX;
        const yScale = (height - 2 * padding) / maxY;

        let path = `M ${padding},${height - padding}`;
        data.forEach(point => {
            const x = padding + point.year * xScale;
            const y = height - padding - point.value * yScale;
            path += ` L ${x},${y}`;
        });
        
        setPathData(path);
    }, [data]);

    return (
        <svg ref={svgRef} className="w-full h-64">
            <path d={pathData} fill="none" stroke="#4f46e5" strokeWidth="3" className="path-animation" />
            <style>{`
                .path-animation {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: draw-path 1.5s ease-out forwards;
                }
                @keyframes draw-path {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </svg>
    );
};


export const CompoundInterestVisualizer: React.FC<{ title: string }> = ({ title }) => {
    const [principal, setPrincipal] = useState(100000);
    const [contribution, setContribution] = useState(10000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(20);

    const chartData = useMemo(() => {
        const data: { year: number; value: number }[] = [];
        let currentValue = principal;
        data.push({ year: 0, value: principal });

        for (let i = 1; i <= years; i++) {
            currentValue = (currentValue + contribution * 12) * (1 + rate / 100);
            data.push({ year: i, value: currentValue });
        }
        return data;
    }, [principal, contribution, rate, years]);
    
    const finalValue = chartData[chartData.length - 1].value;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visualize the power of compounding on your investments.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                     <div>
                        <label className="label-style">Initial: ₹{principal.toLocaleString()}</label>
                        <input type="range" min="0" max="1000000" step="10000" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label className="label-style">Monthly: ₹{contribution.toLocaleString()}</label>
                        <input type="range" min="0" max="100000" step="1000" value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label className="label-style">Rate: {rate}%</label>
                        <input type="range" min="1" max="25" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full" />
                    </div>
                     <div>
                        <label className="label-style">Years: {years}</label>
                        <input type="range" min="1" max="50" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full" />
                    </div>
                </div>
                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border flex flex-col items-center justify-center">
                    <p className="text-lg text-slate-500">In {years} years, your investment will be worth</p>
                     <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">₹{Math.round(finalValue).toLocaleString()}</p>
                    <Chart data={chartData} />
                </div>
            </div>
        </div>
    );
};
