
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
declare const JSZip: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="tag-loader mx-auto">
            <div className="tag-body">
                <div className="tag-hole"></div>
            </div>
            <div className="tag-string"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Zipping and renaming files...</p>
    </div>
);

export const PdfFileRenamer: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [pattern, setPattern] = useState('doc_{n}');
    const [startNumber, setStartNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRenameAndZip = async () => {
        if (files.length === 0) {
            setError("Please select files to rename.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const zip = new JSZip();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const newName = pattern.replace('{n}', String(startNumber + i)) + '.pdf';
                zip.file(newName, file);
            }
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'renamed_pdfs.zip';
            a.click();
            URL.revokeObjectURL(url);
            setFiles([]); // Reset
        } catch (e) {
            setError("Failed to create ZIP file.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Batch rename multiple PDF files based on a pattern.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? <div className="min-h-[200px] flex items-center justify-center"><Loader /></div> :
                    <div className="space-y-6">
                        <div>
                            <label className="label-style">Upload PDFs</label>
                            <input type="file" multiple accept="application/pdf" onChange={e => setFiles(Array.from(e.target.files || []))} className="input-file-style" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label-style">Renaming Pattern</label>
                                <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g., report_{n}" className="input-style w-full" />
                                <p className="text-xs text-slate-400 mt-1">Use {'{n}'} for the counter.</p>
                            </div>
                            <div>
                                <label className="label-style">Start Number</label>
                                <input type="number" value={startNumber} onChange={e => setStartNumber(Number(e.target.value))} className="input-style w-full" />
                            </div>
                        </div>
                        <button onClick={handleRenameAndZip} disabled={files.length === 0} className="w-full btn-primary text-lg">Rename & Download ZIP</button>
                    </div>
                }
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
