import React, { useState, useMemo, useEffect } from 'react';

// Data structure for units and their conversion factors to a base unit
const unitsData: { [category: string]: { [unit: string]: { name: string; toBase: number } } } = {
  Length: {
    meter: { name: 'Meter', toBase: 1 },
    kilometer: { name: 'Kilometer', toBase: 1000 },
    centimeter: { name: 'Centimeter', toBase: 0.01 },
    millimeter: { name: 'Millimeter', toBase: 0.001 },
    mile: { name: 'Mile', toBase: 1609.34 },
    yard: { name: 'Yard', toBase: 0.9144 },
    foot: { name: 'Foot', toBase: 0.3048 },
    inch: { name: 'Inch', toBase: 0.0254 },
  },
  Weight: {
    gram: { name: 'Gram', toBase: 1 },
    kilogram: { name: 'Kilogram', toBase: 1000 },
    milligram: { name: 'Milligram', toBase: 0.001 },
    ton: { name: 'Metric Ton', toBase: 1000000 },
    pound: { name: 'Pound', toBase: 453.592 },
    ounce: { name: 'Ounce', toBase: 28.3495 },
  },
  Area: {
    sqmeter: { name: 'Square Meter', toBase: 1 },
    sqkilometer: { name: 'Square Kilometer', toBase: 1e6 },
    sqfoot: { name: 'Square Foot', toBase: 0.092903 },
    acre: { name: 'Acre', toBase: 4046.86 },
  },
  Volume: {
    liter: { name: 'Liter', toBase: 1 },
    milliliter: { name: 'Milliliter', toBase: 0.001 },
    gallon: { name: 'Gallon (US)', toBase: 3.78541 },
    pint: { name: 'Pint (US)', toBase: 0.473176 },
  },
  Speed: {
    mps: { name: 'Meters/sec', toBase: 1 },
    kph: { name: 'Kilometers/hour', toBase: 1 / 3.6 },
    mph: { name: 'Miles/hour', toBase: 0.44704 },
    knot: { name: 'Knot', toBase: 0.514444 },
  },
};

const tempUnits = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin',
};

// Main Component
export const UnitConverter: React.FC = () => {
    const categories = ['Length', 'Weight', 'Temperature', 'Area', 'Volume', 'Speed'];
    const [category, setCategory] = useState(categories[0]);

    const [fromUnit, setFromUnit] = useState(Object.keys(unitsData[category] || {})[0] || 'celsius');
    const [toUnit, setToUnit] = useState(Object.keys(unitsData[category] || {})[1] || 'fahrenheit');
    const [fromValue, setFromValue] = useState('1');

    const [isSwapping, setIsSwapping] = useState(false);

    // Update units when category changes
    useEffect(() => {
        if (category === 'Temperature') {
            setFromUnit('celsius');
            setToUnit('fahrenheit');
        } else {
            const unitKeys = Object.keys(unitsData[category]);
            setFromUnit(unitKeys[0]);
            setToUnit(unitKeys[1]);
        }
    }, [category]);
    
    // Perform conversion calculation
    const toValue = useMemo(() => {
        const fromNum = parseFloat(fromValue);
        if (isNaN(fromNum)) return '';

        let result: number;

        if (category === 'Temperature') {
            if (fromUnit === 'celsius') {
                if (toUnit === 'fahrenheit') result = fromNum * 9/5 + 32;
                else if (toUnit === 'kelvin') result = fromNum + 273.15;
                else result = fromNum;
            } else if (fromUnit === 'fahrenheit') {
                if (toUnit === 'celsius') result = (fromNum - 32) * 5/9;
                else if (toUnit === 'kelvin') result = (fromNum - 32) * 5/9 + 273.15;
                else result = fromNum;
            } else { // Kelvin
                if (toUnit === 'celsius') result = fromNum - 273.15;
                else if (toUnit === 'fahrenheit') result = (fromNum - 273.15) * 9/5 + 32;
                else result = fromNum;
            }
        } else {
            // Guard against transient state where units don't match category yet.
            const fromUnitData = unitsData[category]?.[fromUnit];
            const toUnitData = unitsData[category]?.[toUnit];

            if (!fromUnitData || !toUnitData) {
                return ''; // Return empty string if units are not valid for the category
            }
            
            const fromToBase = fromUnitData.toBase;
            const toFromBase = toUnitData.toBase;
            result = (fromNum * fromToBase) / toFromBase;
        }

        return parseFloat(result.toPrecision(6)).toString();

    }, [fromValue, fromUnit, toUnit, category]);

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        setFromValue(toValue);
        setIsSwapping(true);
        setTimeout(() => setIsSwapping(false), 300);
    };

    const unitOptions = category === 'Temperature' ? tempUnits : unitsData[category];

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                @keyframes result-update-anim {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-result-update {
                    animation: result-update-anim 0.3s ease-out;
                }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Unit Converter</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Quick and easy conversions for all your needs.</p>
            </div>

            <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${category === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* From Card */}
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">From</label>
                    <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg">
                        {Object.entries(unitOptions).map(([key, value]) => (
                            <option key={key} value={key}>{(typeof value === 'object' ? value.name : value)}</option>
                        ))}
                    </select>
                    <input 
                        type="number" 
                        value={fromValue} 
                        onChange={e => setFromValue(e.target.value)}
                        className="w-full p-3 text-3xl font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    />
                </div>
                
                {/* Swap Button */}
                <button onClick={handleSwap} className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 mx-auto md:mx-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''}`}>
                        <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                </button>
                
                {/* To Card */}
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">To</label>
                    <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg">
                         {Object.entries(unitOptions).map(([key, value]) => (
                            <option key={key} value={key}>{(typeof value === 'object' ? value.name : value)}</option>
                        ))}
                    </select>
                    <div key={toValue} className="w-full p-3 text-3xl font-bold text-indigo-600 dark:text-indigo-400 animate-result-update min-h-[60px]">
                        {toValue}
                    </div>
                </div>
            </div>
        </div>
    );
};