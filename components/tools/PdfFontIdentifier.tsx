import React, { useState } from 'react';

export const PdfFontIdentifier: React.FC<{ title: string }> = ({ title }) => {
    const [fonts, setFonts] = useState<string[]>([]);

    const mockFonts = ['Arial', 'Times New Roman', 'Helvetica', 'Calibri', 'Georgia'];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Identify all fonts used in your PDF document.</p>
            </div>
            <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <input type="file" accept=".pdf" onChange={() => setFonts(mockFonts)} className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer inline-flex flex-col items-center">
                        <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload PDF File</span>
                    </label>
                </div>
                {fonts.length > 0 && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Fonts Found: {fonts.length}</h4>
                        <div className="space-y-2">
                            {fonts.map((font, idx) => (
                                <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200" style={{fontFamily: font}}>{font}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
