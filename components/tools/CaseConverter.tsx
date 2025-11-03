import React, { useState } from 'react';

const toTitleCase = (str: string) => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
const toSentenceCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const toAlternatingCase = (str: string) => str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');

// FIX: Add title prop to component.
export const CaseConverter: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [convertedText, setConvertedText] = useState('');

    const handleConvert = (conversionType: 'upper' | 'lower' | 'title' | 'sentence' | 'alternating') => {
        switch (conversionType) {
            case 'upper':
                setConvertedText(text.toUpperCase());
                break;
            case 'lower':
                setConvertedText(text.toLowerCase());
                break;
            case 'title':
                setConvertedText(toTitleCase(text));
                break;
            case 'sentence':
                setConvertedText(toSentenceCase(text));
                break;
            case 'alternating':
                setConvertedText(toAlternatingCase(text));
                break;
        }
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(convertedText);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Easily convert text between different letter cases.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label htmlFor="input-text" className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Your Text</label>
                    <textarea
                        id="input-text"
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste your text here..."
                        className="w-full flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
                 <div className="flex flex-col">
                    <label htmlFor="output-text" className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Converted Text</label>
                    <textarea
                        id="output-text"
                        rows={10}
                        value={convertedText}
                        readOnly
                        placeholder="Result will appear here..."
                        className="w-full flex-grow bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => handleConvert('upper')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">UPPER CASE</button>
                <button onClick={() => handleConvert('lower')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">lower case</button>
                <button onClick={() => handleConvert('title')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">Title Case</button>
                <button onClick={() => handleConvert('sentence')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">Sentence case</button>
                <button onClick={() => handleConvert('alternating')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">aLtErNaTiNg cAsE</button>
            </div>
             <div className="mt-6 flex justify-center gap-4">
                <button onClick={copyToClipboard} disabled={!convertedText} className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                    Copy
                </button>
                 <button onClick={() => {setText(''); setConvertedText('');}} className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    Clear
                </button>
            </div>
        </div>
    );
};