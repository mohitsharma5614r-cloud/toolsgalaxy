import React, { useState } from 'react';
import { Toast } from '../Toast';

export const AiHollywoodLookFilter: React.FC<{ title: string }> = ({ title }) => {
    const [image, setImage] = useState<string | null>(null);
    const [filterStyle, setFilterStyle] = useState('glamorous');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Apply a glamorous Hollywood-style filter to your photos.</p>
            </div>
            <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer inline-flex flex-col items-center">
                        <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Upload Your Photo</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Filter Style</label>
                    <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)} className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3">
                        <option value="glamorous">Glamorous</option>
                        <option value="vintage">Vintage Hollywood</option>
                        <option value="modern">Modern Celebrity</option>
                        <option value="red-carpet">Red Carpet</option>
                    </select>
                </div>
                {image && <img src={image} alt="Preview" className="w-full max-w-md mx-auto rounded-lg" />}
                {image && <button className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">Apply Hollywood Filter</button>}
            </div>
        </div>
    );
};
