import React, { useState } from 'react';

export const PdfTextReplacer: React.FC<{ title: string }> = ({ title }) => {
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find and replace text throughout your PDF document.</p>
            </div>
            <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <input type="file" accept=".pdf" className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer inline-flex flex-col items-center">
                        <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload PDF File</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Find Text</label>
                        <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Text to find..." className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Replace With</label>
                        <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replacement text..." className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} id="case-sensitive" className="w-4 h-4" />
                    <label htmlFor="case-sensitive" className="text-sm text-slate-700 dark:text-slate-300">Case sensitive</label>
                </div>
                <button className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Find and Replace</button>
            </div>
        </div>
    );
};
