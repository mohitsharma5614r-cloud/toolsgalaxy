import React, { useState } from 'react';

export const PdfPageColorAdjuster: React.FC<{ title: string }> = ({ title }) => {
    const [brightness, setBrightness] = useState('100');
    const [contrast, setContrast] = useState('100');
    const [saturation, setSaturation] = useState('100');

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Adjust color balance, brightness, and contrast of PDF pages.</p>
            </div>
            <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <input type="file" accept=".pdf" className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer inline-flex flex-col items-center">
                        <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload PDF File</span>
                    </label>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Brightness: {brightness}%</label>
                        <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contrast: {contrast}%</label>
                        <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Saturation: {saturation}%</label>
                        <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full" />
                    </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Preview</h4>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg" style={{filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`}}>
                        <p className="text-center text-slate-600 dark:text-slate-400">Sample PDF page preview with adjusted colors</p>
                    </div>
                </div>
                <button className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Apply Color Adjustments</button>
            </div>
        </div>
    );
};
