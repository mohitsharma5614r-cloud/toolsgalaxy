import React, { useState, useMemo, useEffect, useRef } from 'react';

const AnimatedNumber: React.FC<{ value: number, suffix?: string }> = ({ value, suffix }) => {
    const [current, setCurrent] = useState(0);
    // FIX: Removed `current` from dependency array to prevent infinite re-renders.
    useEffect(() => {
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
    }, [value]);

    return <span>{current.toFixed(1)}{suffix}</span>;
};

const RetentionChart: React.FC<{ data: { percent: number, viewers: number }[] }> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [pathData, setPathData] = useState('');
    const [points, setPoints] = useState<{x: number, y: number}[]>([]);

    useEffect(() => {
        if (!svgRef.current || data.length < 2) return;
        
        const svg = svgRef.current;
        const { width, height } = svg.getBoundingClientRect();
        const padding = 20;

        const xScale = (width - 2 * padding) / 100; // x-axis is 0-100%
        const yScale = (height - 2 * padding) / 100; // y-axis is 0-100%

        let path = `M ${padding},${height - padding - data[0].viewers * yScale}`;
        const pointCoords = [];

        data.forEach(point => {
            const x = padding + point.percent * xScale;
            const y = height - padding - point.viewers * yScale;
            path += ` L ${x},${y}`;
            pointCoords.push({x, y});
        });
        
        setPathData(path);
        setPoints(pointCoords);
    }, [data]);

    return (
        <div className="relative">
            <svg ref={svgRef} className="w-full h-64">
                <path d={pathData} fill="none" stroke="#4f46e5" strokeWidth="3" className="path-animation" />
                {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4f46e5" />)}
            </svg>
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
        </div>
    );
};

// FIX: Define the missing InputRow component.
const InputRow: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
        <input
            type="number"
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600"
        />
    </div>
);

export const ViewerRetentionCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [viewers, setViewers] = useState({ start: 1000, p25: 750, p50: 600, p75: 400, end: 250 });

    const { chartData, avgDuration, dropOff } = useMemo(() => {
        const startViewers = viewers.start || 0;
        if (startViewers === 0) return { chartData: [], avgDuration: 0, dropOff: 0 };

        const data = [
            { percent: 0, viewers: 100 },
            { percent: 25, viewers: (viewers.p25 / startViewers) * 100 },
            { percent: 50, viewers: (viewers.p50 / startViewers) * 100 },
            { percent: 75, viewers: (viewers.p75 / startViewers) * 100 },
            { percent: 100, viewers: (viewers.end / startViewers) * 100 },
        ].filter(d => !isNaN(d.viewers)); // filter out NaNs if startViewers is 0
        
        // Simplified average view duration (area under the curve)
        let area = 0;
        for(let i=0; i<data.length -1; i++){
            area += (data[i].viewers + data[i+1].viewers)/2 * (data[i+1].percent - data[i].percent);
        }
        const avg = area / 100;
        
        const drop = data[0].viewers > 0 ? (1 - data[data.length-1].viewers / data[0].viewers) * 100 : 0;

        return { chartData: data, avgDuration: avg, dropOff: drop };

    }, [viewers]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate and analyze your video's viewer retention rates.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">Viewer Counts</h2>
                    <InputRow label="Start (0%)" value={viewers.start} onChange={v => setViewers({...viewers, start: v})} />
                    <InputRow label="at 25%" value={viewers.p25} onChange={v => setViewers({...viewers, p25: v})} />
                    <InputRow label="at 50%" value={viewers.p50} onChange={v => setViewers({...viewers, p50: v})} />
                    <InputRow label="at 75%" value={viewers.p75} onChange={v => setViewers({...viewers, p75: v})} />
                    <InputRow label="End (100%)" value={viewers.end} onChange={v => setViewers({...viewers, end: v})} />
                </div>
                <div className="md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-bold text-center mb-2">Retention Curve</h2>
                    <RetentionChart data={chartData} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm font-semibold text-slate-500">Avg. View Duration</p>
                            <p className="text-2xl font-bold text-indigo-600"><AnimatedNumber value={avgDuration} suffix="%" /></p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm font-semibold text-slate-500">Total Drop-off</p>
                            <p className="text-2xl font-bold text-red-500"><AnimatedNumber value={dropOff} suffix="%" /></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
