import React, { useState } from 'react';

// Loader component for generating state
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="calendar-loader mx-auto">
            <div className="calendar-body">
                <div className="calendar-header"></div>
                <div className="calendar-grid">
                    <div className="day"></div><div className="day"></div><div className="day"></div>
                    <div className="day"></div><div className="day"></div><div className="day"></div>
                    <div className="day"></div><div className="day"></div><div className="day"></div>
                </div>
            </div>
            <div className="checkmark"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Preparing your sheet...</p>
    </div>
);

export const AttendanceSheetGenerator: React.FC = () => {
    const [className, setClassName] = useState('');
    const [numStudents, setNumStudents] = useState(25);
    const [numDays, setNumDays] = useState(10);
    const [sheetData, setSheetData] = useState<{ className: string, numStudents: number, numDays: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = () => {
        setIsLoading(true);
        setSheetData(null);

        // Simulate generation time for animation
        setTimeout(() => {
            setSheetData({
                className: className || "Class/Event Attendance",
                numStudents,
                numDays
            });
            setIsLoading(false);
        }, 1500);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="max-w-7xl mx-auto printable-area">
                <div className="text-center mb-10 no-print">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Attendance Sheet Generator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a printable attendance sheet for your classes or events.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6 no-print">
                    <input
                        type="text"
                        value={className}
                        onChange={e => setClassName(e.target.value)}
                        placeholder="Class / Event Name (e.g., Grade 5 Math)"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="numStudents" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Number of Students: {numStudents}
                            </label>
                            <input
                                id="numStudents"
                                type="range"
                                min="5"
                                max="50"
                                step="1"
                                value={numStudents}
                                onChange={e => setNumStudents(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label htmlFor="numDays" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Number of Days / Sessions: {numDays}
                            </label>
                            <input
                                id="numDays"
                                type="range"
                                min="5"
                                max="31"
                                step="1"
                                value={numDays}
                                onChange={e => setNumDays(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                    <button onClick={handleGenerate} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">
                        Generate Sheet
                    </button>
                </div>

                {/* Sheet Display */}
                <div className="mt-8">
                    {isLoading && <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>}

                    {sheetData && !isLoading && (
                        <div className="animate-fade-in printable-content">
                             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-center mb-6">{sheetData.className}</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-700">
                                                <th className="border border-slate-300 dark:border-slate-600 p-2 font-semibold w-1/4">Student Name</th>
                                                {[...Array(sheetData.numDays)].map((_, i) => (
                                                    <th key={i} className="border border-slate-300 dark:border-slate-600 p-2 font-semibold">Day {i + 1}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(sheetData.numStudents)].map((_, studentIndex) => (
                                                <tr key={studentIndex} className="odd:bg-white dark:odd:bg-slate-800 even:bg-slate-50 dark:even:bg-slate-800/50">
                                                    <td className="border border-slate-300 dark:border-slate-600 p-2 h-10"></td>
                                                    {[...Array(sheetData.numDays)].map((_, dayIndex) => (
                                                        <td key={dayIndex} className="border border-slate-300 dark:border-slate-600 p-2 text-center"></td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                             <div className="mt-6 text-center no-print">
                                 <button onClick={handlePrint} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                     Print Sheet
                                 </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .calendar-loader {
                    width: 100px;
                    height: 90px;
                    position: relative;
                }
                .calendar-body {
                    width: 100%;
                    height: 100%;
                    background: #f1f5f9;
                    border: 3px solid #64748b;
                    border-radius: 8px;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .dark .calendar-body {
                    background: #334155;
                    border-color: #94a3b8;
                }
                .calendar-header {
                    height: 15%;
                    background: #cbd5e1;
                    border-radius: 4px 4px 0 0;
                }
                .dark .calendar-header {
                    background: #475569;
                }
                .calendar-grid {
                    height: 75%;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 5px;
                    margin-top: 5px;
                }
                .day {
                    background: #e2e8f0;
                    border-radius: 2px;
                }
                .dark .day {
                    background: #475569;
                }

                .checkmark {
                    position: absolute;
                    width: 30px;
                    height: 15px;
                    border-left: 8px solid #10b981;
                    border-bottom: 8px solid #10b981;
                    transform: rotate(-45deg);
                    opacity: 0;
                    animation: check-anim 2s infinite ease-in-out;
                }

                @keyframes check-anim {
                    0%, 20% { top: 30px; left: 15px; opacity: 0; }
                    30% { opacity: 1; }
                    40%, 100% { top: 70px; left: 60px; opacity: 0; }
                }

                @media print {
                  body { background-color: white !important; }
                  .no-print { display: none !important; }
                  .printable-area { margin: 0; padding: 0; width: 100%; max-width: 100%; }
                  .printable-content, .printable-content > div {
                    box-shadow: none !important;
                    border: none !important;
                    color: black !important;
                  }
                  .printable-content * {
                    color: black !important;
                    border-color: #666 !important;
                    background-color: transparent !important;
                  }
                  .printable-content th, .printable-content td {
                      padding: 8px 4px !important;
                  }
                }
            `}</style>
        </>
    );
};
