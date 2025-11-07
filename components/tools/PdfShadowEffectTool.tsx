import React, { useState } from 'react';

export const PdfShadowEffectTool: React.FC<{ title: string }> = ({ title }) => {
    const [shadowSize, setShadowSize] = useState('10');
    const [shadowColor, setShadowColor] = useState('#000000');

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add shadow effects to PDF pages for depth.</p>
            </div>
            <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <input type="file" accept=".pdf" className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer inline-flex flex-col items-center">
                        <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload PDF File</span>
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Shadow Size: {shadowSize}px</label>
                        <input type="range" min="0" max="50" value={shadowSize} onChange={(e) => setShadowSize(e.target.value)} className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Shadow Color</label>
                        <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-full h-12 rounded-lg" />
                    </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Preview</h4>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg" style={{boxShadow: `${shadowSize}px ${shadowSize}px ${parseInt(shadowSize) * 2}px ${shadowColor}`}}>
                        <p className="text-center text-slate-600 dark:text-slate-400">Sample PDF page with shadow effect</p>
                    </div>
                </div>
                <button className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Apply Shadow Effect</button>
            </div>
        </div>
    );
};
