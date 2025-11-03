import React, { useState, useMemo } from 'react';

export const SalaryBreakdownTool: React.FC<{ title: string }> = ({ title }) => {
    const [ctc, setCtc] = useState(1200000);

    const breakdown = useMemo(() => {
        const basic = ctc * 0.50;
        const hra = basic * 0.40; // Assuming non-metro
        const pf = Math.min(basic * 0.12, 1800); // Employer PF
        const specialAllowance = ctc - basic - hra - pf;
        const monthlyCtc = ctc / 12;
        const monthlyBasic = basic / 12;
        const monthlyHra = hra / 12;
        const monthlyPf = pf; // PF is monthly
        const monthlySpecial = specialAllowance / 12;

        return { basic, hra, pf, specialAllowance, monthlyCtc, monthlyBasic, monthlyHra, monthlyPf, monthlySpecial };
    }, [ctc]);

    const Row = ({ label, monthly, yearly }: { label: string, monthly: number, yearly: number }) => (
        <tr className="border-b dark:border-slate-700">
            <td className="p-3 font-semibold">{label}</td>
            <td className="p-3 text-right">₹{Math.round(monthly).toLocaleString()}</td>
            <td className="p-3 text-right">₹{Math.round(yearly).toLocaleString()}</td>
        </tr>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Break down your CTC into its various components.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                <div>
                    <label className="label-style">Your Annual CTC: <span className="font-bold text-indigo-600">₹{ctc.toLocaleString('en-IN')}</span></label>
                    <input type="range" min="300000" max="10000000" step="50000" value={ctc} onChange={e => setCtc(Number(e.target.value))} className="w-full range-style" />
                </div>
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="p-3">Component</th>
                                <th className="p-3 text-right">Monthly</th>
                                <th className="p-3 text-right">Annually</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Row label="Basic Salary" monthly={breakdown.monthlyBasic} yearly={breakdown.basic} />
                            <Row label="House Rent Allowance (HRA)" monthly={breakdown.monthlyHra} yearly={breakdown.hra} />
                            <Row label="Employer's PF Contribution" monthly={breakdown.monthlyPf} yearly={breakdown.pf * 12} />
                            <Row label="Special Allowance" monthly={breakdown.monthlySpecial} yearly={breakdown.specialAllowance} />
                            <tr className="bg-slate-200 dark:bg-slate-700 font-bold">
                                <td className="p-3">Gross Salary (CTC)</td>
                                <td className="p-3 text-right">₹{Math.round(breakdown.monthlyCtc).toLocaleString()}</td>
                                <td className="p-3 text-right">₹{Math.round(ctc).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-xs text-slate-400 mt-4">*Based on a standard structure (Basic 50%, HRA 40% of Basic). Actual breakdown may vary by company.</p>
                </div>
            </div>
        </div>
    );
};
