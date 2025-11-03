
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="folder-loader mx-auto">
            <div className="folder-back"></div>
            <div className="folder-paper"></div>
            <div className="folder-front"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
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

export const PdfMergeByFolder: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const pdfs = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            if (pdfs.length === 0) {
                setError("No PDF files were found in the selected folder.");
            } else {
                setFiles(pdfs);
            }
        }
    };
    
    const handleMerge = async () => {
        if (files.length < 2) {
            setError("At least two PDF files are needed to merge.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            // Sort files alphabetically for consistent merging
            const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

            for (const file of sortedFiles) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged-folder.pdf';
            a.click();
            URL.revokeObjectURL(url);
            setFiles([]);
        } catch (e) {
            setError("An error occurred during merging. Some files may be invalid.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Select a folder and merge all PDFs inside it.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? <div className="min-h-[200px] flex items-center justify-center"><Loader message="Merging files..." /></div> :
                    <div className="space-y-6">
                        <label className="btn-primary w-full text-center cursor-pointer block">
                            <span>📁 Select Folder</span>
                            <input type="file" webkitdirectory="" directory="" onChange={handleFolderSelect} className="hidden" />
                        </label>
                        {files.length > 0 && (
                             <div className="space-y-2">
                                <h3 className="font-semibold">{files.length} PDF(s) found and ready to merge:</h3>
                                <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                                    {files.map((f, i) => <p key={i} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{f.name}</p>)}
                                </div>
                            </div>
                        )}
                         <button onClick={handleMerge} disabled={files.length < 2} className="w-full btn-primary text-lg disabled:bg-slate-400">
                            Merge {files.length} Files
                        </button>
                    </div>
                }
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
