import React, { useState } from 'react';

export const PdfDpiEnhancer: React.FC<{ title: string }> = ({ title }) => {
    const [dpi, setDpi] = useState('300');

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Increase the DPI of images within your PDF for better print quality.</p>
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target DPI</label>
                    <select value={dpi} onChange={(e) => setDpi(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3">
                        <option value="150">150 DPI (Screen)</option>
                        <option value="300">300 DPI (Standard Print)</option>
                        <option value="600">600 DPI (High Quality)</option>
                        <option value="1200">1200 DPI (Professional)</option>
                    </select>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 DPI Guide:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• 150 DPI: Web/Screen viewing</li>
                        <li>• 300 DPI: Standard printing (recommended)</li>
                        <li>• 600 DPI: High-quality prints</li>
                        <li>• 1200 DPI: Professional/Commercial printing</li>
                    </ul>
                </div>
                <button className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Enhance PDF DPI</button>
            </div>
        </div>
    );
};
