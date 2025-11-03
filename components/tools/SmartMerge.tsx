
// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Toast } from '../Toast';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="smart-merge-loader mx-auto">
            <div className="file f1"></div>
            <div className="file f2"></div>
            <div className="file f3"></div>
            <div className="arrow">→</div>
            <div className="merged-file"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Sorting and merging files...</p>
        <style>{`
            .smart-merge-loader { width: 120px; height: 100px; position: relative; }
            .file { position: absolute; width: 40px; height: 50px; background: #cbd5e1; border: 2px solid #9ca3af; border-radius: 4px; }
            .dark .file { background: #334155; border-color: #64748b; }
            .f1 { top: 0; left: 0; animation: gather 2s infinite ease-in-out; }
            .f2 { top: 25px; left: 15px; animation: gather 2s 0.2s infinite ease-in-out; }
            .f3 { top: 50px; left: 0; animation: gather 2s 0.4s infinite ease-in-out; }
            .arrow { position: absolute; font-size: 30px; top: 35px; left: 50px; opacity: 0; animation: show-merge-arrow 2s infinite; }
            .merged-file { width: 50px; height: 65px; background: #6366f1; border: 2px solid #4338ca; border-radius: 4px; position: absolute; top: 17.5px; right: 0; transform: scale(0); opacity: 0; animation: show-merged 2s infinite; }
            .dark .merged-file { background: #818cf8; border-color: #a5b4fc; }

            @keyframes gather { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(20px); } }
            @keyframes show-merge-arrow { 0%, 40%, 60%, 100% { opacity: 0; } 50% { opacity: 1; } }
            @keyframes show-merged { 0%, 50% { transform: scale(0); opacity: 0; } 75%, 100% { transform: scale(1); opacity: 1; } }
        `}</style>
    </div>
);

export const SmartMerge: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sortedFiles = useMemo(() => {
        if (files.length === 0) return [];
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        return [...files].sort((a, b) => collator.compare(a.name, b.name));
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const pdfs = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            if (pdfs.length > 0) {
                 setFiles(pdfs);
            }
        }
    };

    const handleMerge = async () => {
        if (sortedFiles.length < 2) {
            setError("Please select at least two PDF files to merge.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (const file of sortedFiles) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'smart-merged.pdf';
            link.click();
            URL.revokeObjectURL(url);
            setFiles([]);
        } catch (e) {
            setError("Failed to merge PDFs. One or more files may be invalid or protected.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Merge PDFs and intelligently sort them by name (e.g., page-1, page-2, page-10).</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="btn-primary w-full text-center cursor-pointer block">
                                <span>+ Add PDF Files to Merge</span>
                                <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>

                        {files.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">Original Order</h3>
                                    <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                                        {files.map((file, i) => <p key={i} className="text-xs p-1 bg-slate-100 dark:bg-slate-700 rounded truncate">{file.name}</p>)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-2 text-indigo-600 dark:text-indigo-400">Sorted Order for Merging</h3>
                                     <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                                        {sortedFiles.map((file, i) => <p key={i} className="text-xs p-1 bg-indigo-50 dark:bg-indigo-900/50 rounded truncate">{i + 1}. {file.name}</p>)}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={handleMerge} disabled={files.length < 2} className="w-full btn-primary text-lg disabled:bg-slate-400">
                            Smart Merge and Download
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                 .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
            `}</style>
        </div>
    );
};
