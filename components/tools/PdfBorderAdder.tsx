import React, { useState } from 'react';
import { Toast } from '../Toast';

export const PdfBorderAdder: React.FC<{ title: string }> = ({ title }) => {
    const [borderColor, setBorderColor] = useState('#000000');
    const [borderWidth, setBorderWidth] = useState('2');
    const [borderStyle, setBorderStyle] = useState('solid');
    const [error, setError] = useState<string | null>(null);

    const handleProcess = () => {
        setError('PDF Border Adder requires pdf-lib library. Feature coming soon!');
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add custom borders to your PDF pages.</p>
                </div>

                <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                        <input type="file" accept=".pdf" className="hidden" id="pdf-upload" />
                        <label htmlFor="pdf-upload" className="cursor-pointer inline-flex flex-col items-center">
                            <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload PDF File</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Border Color</label>
                            <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-12 rounded-lg border border-slate-300 dark:border-slate-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Border Width (px)</label>
                            <input type="number" value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Border Style</label>
                            <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3">
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleProcess} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Add Border to PDF</button>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Preview:</h4>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg" style={{ border: `${borderWidth}px ${borderStyle} ${borderColor}` }}>
                            <p className="text-center text-slate-600 dark:text-slate-400">Your PDF pages will have this border</p>
                        </div>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};
