import React, { useState } from 'react';

// --- Loader Components ---
const AgeLoader: React.FC = () => (
    <div className="text-center py-8">
        <div className="age-loader mx-auto">
            <div className="clock-face">
                <div className="hour-hand"></div>
                <div className="minute-hand"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calculating through time...</p>
    </div>
);
const BmiLoader: React.FC = () => (
    <div className="text-center py-8">
        <div className="bmi-loader mx-auto">
            <div className="scale-beam"></div>
            <div className="scale-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Balancing the scales...</p>
    </div>
);

// --- Age Calculator ---
const AgeCalculator: React.FC = () => {
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        setIsLoading(true);
        setError(null);
        setAge(null);

        setTimeout(() => {
            const day = parseInt(birthDate.day);
            const month = parseInt(birthDate.month) - 1; // JS months are 0-indexed
            const year = parseInt(birthDate.year);

            const dob = new Date(year, month, day);

            if (isNaN(dob.getTime()) || dob.getMonth() !== month || dob.getFullYear() !== year || dob.getDate() !== day || year < 1900 || dob > new Date()) {
                setError("Please enter a valid date of birth.");
                setIsLoading(false);
                return;
            }

            const today = new Date();
            let years = today.getFullYear() - dob.getFullYear();
            let months = today.getMonth() - dob.getMonth();
            let days = today.getDate() - dob.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                days += prevMonth.getDate();
            }

            if (months < 0) {
                years--;
                months += 12;
            }
            
            setAge({ years, months, days });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">Calculate Your Age</h2>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Day</label>
                    <input type="number" value={birthDate.day} onChange={e => setBirthDate({...birthDate, day: e.target.value})} placeholder="DD" className="input-style"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Month</label>
                    <input type="number" value={birthDate.month} onChange={e => setBirthDate({...birthDate, month: e.target.value})} placeholder="MM" className="input-style"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Year</label>
                    <input type="number" value={birthDate.year} onChange={e => setBirthDate({...birthDate, year: e.target.value})} placeholder="YYYY" className="input-style"/>
                </div>
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button onClick={handleCalculate} disabled={isLoading} className="w-full btn-primary">
                {isLoading ? 'Calculating...' : 'Calculate Age'}
            </button>
            {isLoading && <AgeLoader />}
            {age && !isLoading && (
                <div className="mt-6 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg animate-fade-in">
                    <h3 className="text-lg font-semibold text-center mb-4 text-slate-700 dark:text-slate-300">Your Precise Age Is</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{age.years}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Years</p>
                        </div>
                        <div>
                            <p className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{age.months}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Months</p>
                        </div>
                         <div>
                            <p className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{age.days}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Days</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- BMI Calculator ---
const BmiCalculator: React.FC = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [height, setHeight] = useState({ cm: '', ft: '', in: '' });
    const [weight, setWeight] = useState({ kg: '', lbs: '' });
    const [bmi, setBmi] = useState<{ value: number; category: string; color: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const calculateBmi = () => {
        setIsLoading(true);
        setBmi(null);
        setTimeout(() => {
            let heightMeters = 0;
            let weightKg = 0;

            if (units === 'metric') {
                heightMeters = parseFloat(height.cm) / 100;
                weightKg = parseFloat(weight.kg);
            } else {
                const heightInches = (parseFloat(height.ft || '0') * 12) + parseFloat(height.in || '0');
                heightMeters = heightInches * 0.0254;
                weightKg = parseFloat(weight.lbs) * 0.453592;
            }

            if (heightMeters > 0 && weightKg > 0) {
                const bmiValue = weightKg / (heightMeters * heightMeters);
                let category = '';
                let color = '';
                if (bmiValue < 18.5) { category = 'Underweight'; color = 'bg-sky-500'; }
                else if (bmiValue < 25) { category = 'Normal'; color = 'bg-emerald-500'; }
                else if (bmiValue < 30) { category = 'Overweight'; color = 'bg-yellow-500'; }
                else { category = 'Obesity'; color = 'bg-red-500'; }

                setBmi({ value: parseFloat(bmiValue.toFixed(1)), category, color });
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">Calculate Your BMI</h2>
            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 max-w-xs mx-auto">
                <button onClick={() => setUnits('metric')} className={`flex-1 btn-toggle ${units === 'metric' ? 'btn-toggle-active' : ''}`}>Metric</button>
                <button onClick={() => setUnits('imperial')} className={`flex-1 btn-toggle ${units === 'imperial' ? 'btn-toggle-active' : ''}`}>Imperial</button>
            </div>

            {units === 'metric' ? (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                     <div><label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Height (cm)</label><input type="number" value={height.cm} onChange={e => setHeight({...height, cm: e.target.value})} className="input-style"/></div>
                     <div><label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Weight (kg)</label><input type="number" value={weight.kg} onChange={e => setWeight({...weight, kg: e.target.value})} className="input-style"/></div>
                </div>
            ) : (
                <div className="animate-fade-in space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Height</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" value={height.ft} onChange={e => setHeight({...height, ft: e.target.value})} placeholder="ft" className="input-style"/>
                            <input type="number" value={height.in} onChange={e => setHeight({...height, in: e.target.value})} placeholder="in" className="input-style"/>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Weight (lbs)</label><input type="number" value={weight.lbs} onChange={e => setWeight({...weight, lbs: e.target.value})} className="input-style"/></div>
                </div>
            )}
            <button onClick={calculateBmi} disabled={isLoading} className="w-full btn-primary">
                {isLoading ? 'Calculating...' : 'Calculate BMI'}
            </button>
            {isLoading && <BmiLoader />}
            {bmi && !isLoading && (
                 <div className="mt-6 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg animate-fade-in text-center">
                    <p className="text-lg text-slate-500 dark:text-slate-400">Your BMI is</p>
                    <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{bmi.value}</p>
                    <div className={`inline-block px-4 py-1 rounded-full text-white font-semibold text-lg ${bmi.color}`}>
                        {bmi.category}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Export ---
export const AgeBmiCalculator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'age' | 'bmi'>('age');

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Age & BMI Calculator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Calculate your age down to the day and check your Body Mass Index.</p>
                </div>

                <div className="flex justify-center mb-8 bg-slate-200 dark:bg-slate-800 rounded-lg p-1 max-w-sm mx-auto">
                    <button 
                        onClick={() => setActiveTab('age')}
                        className={`flex-1 py-2 rounded-md font-semibold transition-colors ${activeTab === 'age' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                    >
                        🎂 Age Calculator
                    </button>
                    <button 
                        onClick={() => setActiveTab('bmi')}
                        className={`flex-1 py-2 rounded-md font-semibold transition-colors ${activeTab === 'bmi' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                    >
                        ⚖️ BMI Calculator
                    </button>
                </div>
                
                <div className="p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[400px]">
                    {activeTab === 'age' ? <AgeCalculator /> : <BmiCalculator />}
                </div>
            </div>
             <style>{`
                .input-style { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; background-color: #f1f5f9; text-align: center; font-size: 1.125rem; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 700; transition: background-color 0.2s; }
                .btn-primary:hover { background-color: #4338ca; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-toggle { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; transition: all 0.2s; }
                .btn-toggle-active { background-color: white; color: #334155; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); }
                .dark .btn-toggle-active { background-color: #1e293b; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                /* Age Loader */
                .age-loader { width: 80px; height: 80px; position: relative; }
                .clock-face { width: 100%; height: 100%; border: 6px solid #9ca3af; border-radius: 50%; position: relative; }
                .dark .clock-face { border-color: #64748b; }
                .hour-hand, .minute-hand { position: absolute; background: #334155; border-radius: 4px; transform-origin: bottom center; left: 50%; top: 10%; }
                .dark .hour-hand, .dark .minute-hand { background: #cbd5e1; }
                .hour-hand { width: 6px; height: 40%; margin-left: -3px; animation: spin-hour 2.4s linear infinite; }
                .minute-hand { width: 4px; height: 50%; margin-left: -2px; top: 0; animation: spin-minute 0.2s linear infinite; }
                @keyframes spin-hour { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spin-minute { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* BMI Loader */
                .bmi-loader { width: 120px; height: 60px; position: relative; }
                .scale-base { width: 60px; height: 10px; background: #9ca3af; border-radius: 4px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
                .scale-base::before { content:''; position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 10px 20px 10px; border-color: transparent transparent #9ca3af transparent; }
                .scale-beam { width: 100%; height: 8px; background: #64748b; border-radius: 4px; position: absolute; top: 20px; left: 0; transform-origin: center; animation: balance-scale 1.5s infinite ease-in-out; }
                .dark .scale-base, .dark .scale-base::before { background: #64748b; border-bottom-color: #64748b; }
                .dark .scale-beam { background: #9ca3af; }
                @keyframes balance-scale { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
            `}</style>
        </>
    );
};