// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="merge-loader mx-auto">
            <div className="page p-left"></div>
            <div className="page p-right"></div>
            <div className="arrow">→</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .merge-loader { width: 120px; height: 80px; position: relative; }
            .page { width: 50px; height: 70px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 5px; }
            .dark .page { background: #334155; border-color: #64748b; }
            .p-left { left: 0; animation: merge-left 2s infinite ease-in-out; }
            .p-right { right: 0; animation: merge-right 2s infinite ease-in-out; }
            .arrow { font-size: 40px; color: #6366f1; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0; animation: show-arrow 2s infinite; }
            @keyframes merge-left { 0%, 100% { left: 0; } 50% { left: 25px; } }
            @keyframes merge-right { 0%, 100% { right: 0; } 50% { right: 25px; } }
            @keyframes show-arrow { 0%, 40%, 60%, 100% { opacity: 0; } 50% { opacity: 1; } }
        `}</style>
    </div>
);

export const PdfMergeTool: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dragItem = React.useRef<number | null>(null);
    const dragOverItem = React.useRef<number | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please select at least two PDF files to merge.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (const file of files) {
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
            link.download = 'merged.pdf';
            link.click();
            URL.revokeObjectURL(url);
            setFiles([]); // Reset after download
        } catch (e) {
            setError("Failed to merge PDFs. One or more files may be invalid or protected.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSort = () => {
        const _files = [...files];
        const draggedItemContent = _files.splice(dragItem.current, 1)[0];
        _files.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFiles(_files);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Combine multiple PDF files into a single document.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Merging your PDFs..." /></div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="btn-primary w-full text-center cursor-pointer block">
                                <span>+ Add PDF Files</span>
                                <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="hidden" />
                            </label>
                            <p className="text-xs text-center mt-2 text-slate-400">Drag and drop files to reorder them.</p>
                        </div>

                        <div className="min-h-[150px] space-y-2">
                            {files.map((file, i) => (
                                <div 
                                    key={i} 
                                    className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-between cursor-grab"
                                    draggable
                                    onDragStart={() => (dragItem.current = i)}
                                    onDragEnter={() => (dragOverItem.current = i)}
                                    onDragEnd={handleSort}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <span className="font-semibold text-sm">{i + 1}. {file.name}</span>
                                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-500 font-bold text-lg">&times;</button>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleMerge} disabled={files.length < 2} className="w-full btn-primary text-lg disabled:bg-slate-400">
                            Merge and Download
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
