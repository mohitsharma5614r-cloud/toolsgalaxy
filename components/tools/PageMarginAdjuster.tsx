import React, { useState } from 'react';

export const PageMarginAdjuster: React.FC<{ title: string }> = ({ title }) => {
    const [top, setTop] = useState('20');
    const [right, setRight] = useState('20');
    const [bottom, setBottom] = useState('20');
    const [left, setLeft] = useState('20');
    const [unit, setUnit] = useState('mm');

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Adjust PDF page margins for printing or formatting.</p>
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

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3">
                        <option value="mm">Millimeters (mm)</option>
                        <option value="in">Inches (in)</option>
                        <option value="pt">Points (pt)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Top Margin</label>
                        <input type="number" value={top} onChange={(e) => setTop(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Right Margin</label>
                        <input type="number" value={right} onChange={(e) => setRight(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bottom Margin</label>
                        <input type="number" value={bottom} onChange={(e) => setBottom(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Left Margin</label>
                        <input type="number" value={left} onChange={(e) => setLeft(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Margin Preview</h4>
                    <div className="bg-white dark:bg-slate-800 rounded-lg" style={{ padding: `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`, border: '2px solid #6366f1' }}>
                        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded">
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Content Area</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-1">Top: {top}{unit} | Right: {right}{unit} | Bottom: {bottom}{unit} | Left: {left}{unit}</p>
                        </div>
                    </div>
                </div>

                <button className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Apply Margins to PDF</button>
            </div>
        </div>
    );
};
