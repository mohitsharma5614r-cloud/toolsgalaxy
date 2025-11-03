import React, { useState } from 'react';

const incomeSources = [
    { name: 'Salary received in India', taxable: true },
    { name: 'Salary for services in India (paid abroad)', taxable: true },
    { name: 'Rental income from property in India', taxable: true },
    { name: 'Capital gains on assets in India', taxable: true },
    { name: 'Interest from Indian bank accounts (NRO)', taxable: true },
    { name: 'Salary for services outside India (paid abroad)', taxable: false },
    { name: 'Rental income from property outside India', taxable: false },
    { name: 'Interest from foreign bank accounts', taxable: false },
    { name: 'Interest from NRE/FCNR accounts', taxable: false, note: 'Exempt from tax in India' }
];

export const NriTaxCalculator: React.FC<{ title: string }> = ({ title }) => {
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const handleToggle = (name: string) => {
        setSelectedSources(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    };

    const taxableResults = incomeSources.filter(s => selectedSources.includes(s.name) && s.taxable);
    const nonTaxableResults = incomeSources.filter(s => selectedSources.includes(s.name) && !s.taxable);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} (Simplified)</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Understand which of your income sources are taxable in India as an NRI.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!showResult ? (
                    <div className="space-y-6">
                        <p className="font-semibold">Select all your sources of income:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {incomeSources.map(source => (
                                <label key={source.name} className={`flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-all ${selectedSources.includes(source.name) ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                    <input type="checkbox" checked={selectedSources.includes(source.name)} onChange={() => handleToggle(source.name)} className="mt-1 h-4 w-4 rounded" />
                                    <span>{source.name} {source.note && `(${source.note})`}</span>
                                </label>
                            ))}
                        </div>
                        <button onClick={() => setShowResult(true)} className="w-full btn-primary text-lg">Check Taxability</button>
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-2xl font-bold text-center">Your Taxability Summary</h2>
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">✅ Taxable in India</h3>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                {taxableResults.length > 0 ? taxableResults.map(s => <li key={s.name}>{s.name}</li>) : <li>None of your selected incomes are taxable.</li>}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-500 dark:text-red-400">❌ Not Taxable in India</h3>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                 {nonTaxableResults.length > 0 ? nonTaxableResults.map(s => <li key={s.name}>{s.name} {s.note && `(${s.note})`}</li>) : <li>None of your selected incomes are non-taxable.</li>}
                            </ul>
                        </div>
                        <p className="text-xs text-slate-400 pt-4 border-t">Disclaimer: This is for informational purposes only. Tax laws are complex and subject to change. Consult a tax professional.</p>
                        <div className="text-center"><button onClick={() => setShowResult(false)} className="btn-primary">← Back</button></div>
                    </div>
                )}
            </div>
        </div>
    );
};
