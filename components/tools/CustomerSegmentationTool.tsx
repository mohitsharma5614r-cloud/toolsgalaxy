
import React, { useState, useMemo } from 'react';

interface CustomerData {
    id: string;
    lastPurchaseDays: number;
    purchaseCount: number;
    totalSpend: number;
}

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="segment-loader mx-auto">
            <div className="card c1"></div>
            <div className="card c2"></div>
            <div className="card c3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Segmenting customers...</p>
        <style>{`
            .segment-loader { width: 100px; height: 100px; position: relative; }
            .card { width: 50px; height: 70px; background: #cbd5e1; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 15px; left: 25px; transform-origin: bottom center; }
            .dark .card { background: #334155; border-color: #64748b; }
            .c1 { animation: fan-out-1 2s infinite ease-in-out; }
            .c2 { animation: fan-out-2 2s infinite ease-in-out; }
            .c3 { animation: fan-out-3 2s infinite ease-in-out; }
            @keyframes fan-out-1 { 0%,100%{transform:rotate(0deg)} 50%{transform:translateX(-30px) rotate(-15deg)} }
            @keyframes fan-out-2 { 0%,100%{transform:rotate(0deg)} 50%{transform:translateY(-10px) rotate(0deg)} }
            @keyframes fan-out-3 { 0%,100%{transform:rotate(0deg)} 50%{transform:translateX(30px) rotate(15deg)} }
        `}</style>
    </div>
);

const PieChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'];
    
    let cumulativePercent = 0;
    const gradients = data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const gradient = `${colors[index % colors.length]} ${cumulativePercent}% ${cumulativePercent + percent}%`;
        cumulativePercent += percent;
        return gradient;
    });

    return (
        <div className="w-56 h-56 rounded-full" style={{ background: `conic-gradient(${gradients.join(', ')})` }}></div>
    );
};


export const CustomerSegmentationTool: React.FC<{ title: string }> = ({ title }) => {
    const [csvData, setCsvData] = useState('customer_id,last_purchase_days,purchase_count,total_spend\n1,15,20,5000\n2,35,5,1200\n3,95,2,300\n4,5,30,8000\n5,180,1,150');
    const [segments, setSegments] = useState<Record<string, CustomerData[]> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const getRfmScore = (value: number, p20: number, p40: number, p60: number, p80: number, isRecency: boolean) => {
        if (isRecency) { // Lower is better for recency
            if (value <= p20) return 5;
            if (value <= p40) return 4;
            if (value <= p60) return 3;
            if (value <= p80) return 2;
            return 1;
        }
        // Higher is better for frequency and monetary
        if (value > p80) return 5;
        if (value > p60) return 4;
        if (value > p40) return 3;
        if (value > p20) return 2;
        return 1;
    };
    
    const handleSegment = () => {
        setIsLoading(true);
        setTimeout(() => {
            const lines = csvData.trim().split('\n').slice(1);
            const customers: CustomerData[] = lines.map(line => {
                const [id, lastPurchaseDays, purchaseCount, totalSpend] = line.split(',');
                return { id, lastPurchaseDays: Number(lastPurchaseDays), purchaseCount: Number(purchaseCount), totalSpend: Number(totalSpend) };
            });

            const recency = customers.map(c => c.lastPurchaseDays).sort((a,b) => a-b);
            const frequency = customers.map(c => c.purchaseCount).sort((a,b) => a-b);
            const monetary = customers.map(c => c.totalSpend).sort((a,b) => a-b);
            
            const p = (arr: number[], percentile: number) => arr[Math.floor(arr.length * percentile)];
            const r_p = [p(recency, 0.2), p(recency, 0.4), p(recency, 0.6), p(recency, 0.8)];
            const f_p = [p(frequency, 0.2), p(frequency, 0.4), p(frequency, 0.6), p(frequency, 0.8)];
            const m_p = [p(monetary, 0.2), p(monetary, 0.4), p(monetary, 0.6), p(monetary, 0.8)];

            const customerScores = customers.map(c => {
                // FIX: Pass arguments explicitly instead of using spread syntax to resolve TypeScript error.
                const r = getRfmScore(c.lastPurchaseDays, r_p[0], r_p[1], r_p[2], r_p[3], true);
                // FIX: Pass arguments explicitly instead of using spread syntax to resolve TypeScript error.
                const f = getRfmScore(c.purchaseCount, f_p[0], f_p[1], f_p[2], f_p[3], false);
                // FIX: Pass arguments explicitly instead of using spread syntax to resolve TypeScript error.
                const m = getRfmScore(c.totalSpend, m_p[0], m_p[1], m_p[2], m_p[3], false);
                return { ...c, r, f, m };
            });

            const newSegments: Record<string, CustomerData[]> = { 'Champions': [], 'Loyal': [], 'Potential': [], 'At-Risk': [], 'Lost': [] };
            customerScores.forEach(c => {
                if (c.r >= 4 && c.f >= 4 && c.m >= 4) newSegments['Champions'].push(c);
                else if (c.r >= 3 && c.f >= 3 && c.m >= 3) newSegments['Loyal'].push(c);
                else if (c.r >= 3 && c.f >= 1 && c.m >= 1) newSegments['Potential'].push(c);
                else if (c.r <= 2 && c.f >= 2 && c.m >= 2) newSegments['At-Risk'].push(c);
                else newSegments['Lost'].push(c);
            });

            setSegments(newSegments);
            setIsLoading(false);
        }, 1500);
    };

    const segmentDataForChart = useMemo(() => {
        if (!segments) return [];
        // FIX: Add explicit type to the destructured array to help TypeScript inference.
        return Object.entries(segments).map(([name, customers]: [string, CustomerData[]]) => ({ name, value: customers.length }));
    }, [segments]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Group your customers into segments based on their behavior.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                    <h2 className="text-xl font-bold">1. Paste Customer Data</h2>
                    <p className="text-sm text-slate-500">Paste CSV data with headers: <code>customer_id,last_purchase_days,purchase_count,total_spend</code></p>
                    <textarea value={csvData} onChange={e => setCsvData(e.target.value)} rows={10} className="w-full input-style font-mono text-xs"/>
                    <button onClick={handleSegment} disabled={isLoading} className="w-full btn-primary text-lg">
                        {isLoading ? 'Segmenting...' : '2. Segment Customers'}
                    </button>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold text-center mb-4">3. View Segments</h2>
                    {isLoading ? <div className="min-h-[300px] flex items-center justify-center"><Loader /></div> : 
                     segments ? (
                        <div className="flex flex-col items-center gap-6">
                            <PieChart data={segmentDataForChart} />
                            <div className="w-full space-y-2">
                                {segmentDataForChart.map((seg, i) => (
                                    <div key={seg.name} className="flex justify-between items-center text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded">
                                        <span className="flex items-center gap-2 font-semibold"><div className="w-3 h-3 rounded-full" style={{backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'][i % 5]}}></div>{seg.name}</span>
                                        <span>{seg.value} Customers</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                     ) : <p className="text-slate-400 text-center py-16">Your segments will appear here.</p>}
                </div>
            </div>
        </div>
    );
};