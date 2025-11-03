import React, { useState, useMemo } from 'react';

export const ImportCostEstimator: React.FC<{ title: string }> = ({ title }) => {
    const [fob, setFob] = useState(100000);
    const [freight, setFreight] = useState(10000);
    const [insurance, setInsurance] = useState(2000);
    const [dutyRate, setDutyRate] = useState(10);
    const [gstRate, setGstRate] = useState(18);

    const { landedCost, totalTax } = useMemo(() => {
        const cif = fob + freight + insurance;
        const duty = cif * (dutyRate / 100);
        const assessableValueForGst = cif + duty;
        const gst = assessableValueForGst * (gstRate / 100);
        const tax = duty + gst;
        const cost = cif + tax;
        return { landedCost: cost, totalTax: tax };
    }, [fob, freight, insurance, dutyRate, gstRate]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate the total landed cost of imported products.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <label>FOB Value: ₹{fob.toLocaleString()}</label><input type="range" min="10000" max="1000000" step="10000" value={fob} onChange={e => setFob(Number(e.target.value))} />
                    <label>Freight Charges: ₹{freight.toLocaleString()}</label><input type="range" min="1000" max="100000" step="1000" value={freight} onChange={e => setFreight(Number(e.target.value))} />
                    <label>Insurance: ₹{insurance.toLocaleString()}</label><input type="range" min="0" max="50000" step="500" value={insurance} onChange={e => setInsurance(Number(e.target.value))} />
                    <label>Customs Duty Rate: {dutyRate}%</label><input type="range" min="0" max="50" step="1" value={dutyRate} onChange={e => setDutyRate(Number(e.target.value))} />
                    <label>GST Rate: {gstRate}%</label><input type="range" min="0" max="28" step="1" value={gstRate} onChange={e => setGstRate(Number(e.target.value))} />
                </div>
                 <div className="space-y-4 text-center">
                    <div className="result-card bg-red-100"><p>Total Taxes & Duties</p><p className="value text-red-700">₹{Math.round(totalTax).toLocaleString()}</p></div>
                    <div className="result-card bg-indigo-100"><p>Total Landed Cost</p><p className="value text-indigo-700 text-4xl">₹{Math.round(landedCost).toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );
};
