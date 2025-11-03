// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const JSZip: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="folder-loader mx-auto">
            <div className="folder-back"></div>
            <div className="folder-paper"></div>
            <div className="folder-front"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Organizing and zipping files...</p>
        <style>{`
            .folder-loader { width: 100px; height: 80px; position: relative; }
            .folder-back, .folder-front { width: 100%; height: 100%; background: #fbbf24; border-radius: 8px; position: absolute; }
            .dark .folder-back, .dark .folder-front { background: #f59e0b; }
            .folder-back::before { content: ''; position: absolute; top: -10px; left: 10px; width: 40px; height: 10px; background: #fbbf24; border-radius: 4px 4px 0 0; }
            .dark .folder-back::before { background: #f59e0b; }
            .folder-paper { width: 90%; height: 70%; background: #f1f5f9; border-radius: 4px; position: absolute; top: 5px; left: 5%; animation: file-in-folder 2s infinite ease-in-out; }
            @keyframes file-in-folder { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        `}</style>
    </div>
);

export const PdfToZipAutoOrganizer: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [pattern, setPattern] = useState('{YYYY}/{MM}/{filename}');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const pdfs = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            setFiles(pdfs);
        }
    };
    
    const handleOrganize = async () => {
        if (files.length === 0) {
            setError("Please select at least one PDF file.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const zip = new JSZip();
            for (const file of files) {
                const date = new Date(file.lastModified);
                const path = pattern
                    .replace('{YYYY}', date.getFullYear().toString())
                    .replace('{MM}', String(date.getMonth() + 1).padStart(2, '0'))
                    .replace('{DD}', String(date.getDate()).padStart(2, '0'))
                    .replace('{alpha}', file.name[0].toUpperCase())
                    .replace('{filename}', file.name);
                
                zip.file(path, file);
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'organized_pdfs.zip';
            a.click();
            URL.revokeObjectURL(url);
            setFiles([]);
        } catch (e) {
            setError("An error occurred while creating the ZIP file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Organize PDFs into folders within a ZIP file based on a pattern.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? <div className="min-h-[200px] flex items-center justify-center"><Loader /></div> :
                    <div className="space-y-6">
                        <div>
                            <label className="btn-primary w-full text-center cursor-pointer block">
                                <span>📁 Select PDFs to Organize</span>
                                <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                        {files.length > 0 && 
                            <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                                <p className="text-sm font-semibold">{files.length} file(s) selected.</p>
                                {files.map((f, i) => <p key={i} className="text-xs p-1 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{f.name}</p>)}
                            </div>
                        }
                        <div>
                            <label className="label-style">Folder Pattern</label>
                            <input value={pattern} onChange={e => setPattern(e.target.value)} className="input-style w-full font-mono"/>
                             <p className="text-xs text-slate-400 mt-1">Use: {'{YYYY}'}, {'{MM}'}, {'{DD}'}, {'{alpha}'}, {'{filename}'}</p>
                        </div>
                        <button onClick={handleOrganize} disabled={files.length === 0} className="w-full btn-primary text-lg disabled:bg-slate-400">
                            Organize & Download ZIP
                        </button>
                    </div>
                }
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
