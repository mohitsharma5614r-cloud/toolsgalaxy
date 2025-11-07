import React, { useState } from 'react';

export const TextFormatterForPdf: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState('12');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [lineHeight, setLineHeight] = useState('1.5');
    const [alignment, setAlignment] = useState('left');

    const downloadPDF = () => {
        // This would use jsPDF or similar library
        alert('PDF generation requires jsPDF library. Feature ready for integration!');
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Format your text before converting to PDF.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Size</label>
                        <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Family</label>
                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-2">
                            <option>Arial</option>
                            <option>Times New Roman</option>
                            <option>Courier</option>
                            <option>Georgia</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Line Height</label>
                        <select value={lineHeight} onChange={(e) => setLineHeight(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-2">
                            <option value="1">Single</option>
                            <option value="1.5">1.5</option>
                            <option value="2">Double</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alignment</label>
                        <select value={alignment} onChange={(e) => setAlignment(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-2">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                            <option value="justify">Justify</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Text</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} placeholder="Type or paste your text here..." className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white" />
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Preview</h4>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg" style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight, textAlign: alignment as any }}>
                        {text || 'Your formatted text will appear here...'}
                    </div>
                </div>

                <button onClick={downloadPDF} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Convert to PDF</button>
            </div>
        </div>
    );
};
