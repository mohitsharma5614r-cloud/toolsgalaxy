// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="extractor-loader mx-auto">
            <div className="doc">
                <div className="page-out"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .extractor-loader { width: 100px; height: 100px; position: relative; }
            .doc { width: 60px; height: 80px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 10px; left: 20px; }
            .dark .doc { background: #334155; border-color: #64748b; }
            .page-out { width: 50px; height: 70px; background: #a5b4fc; border: 2px solid #6366f1; border-radius: 4px; position: absolute; top: 5px; left: 5px; animation: extract-page 2s infinite ease-in-out; }
            .dark .page-out { background: #4338ca; border-color: #818cf8; }
            @keyframes extract-page { 0% { transform: translateY(0); } 50% { transform: translateY(-30px) rotate(-10deg); } 100% { transform: translateY(0); } }
        `}</style>
    </div>
);

export const PdfPageExtractor: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExtract = async () => {
        if (!file || !range.trim()) {
            setError("Please upload a file and specify a page range.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const totalPages = pdfDoc.getPageCount();

            const pagesToCopy: number[] = [];
            const parts = range.split(',').map(r => r.trim());

            for (const part of parts) {
                 if (part.includes('-')) {
                    const [startStr, endStr] = part.split('-');
                    const start = parseInt(startStr);
                    const end = endStr.trim().toLowerCase() === 'end' ? totalPages : parseInt(endStr);
                    
                    if(isNaN(start) || isNaN(end) || start > end || start < 1) continue;

                    for (let i = start; i <= end; i++) {
                        if (i <= totalPages && !pagesToCopy.includes(i - 1)) pagesToCopy.push(i - 1);
                    }
                } else {
                    const pageNum = parseInt(part);
                    if(!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages && !pagesToCopy.includes(pageNum - 1)) {
                        pagesToCopy.push(pageNum - 1);
                    }
                }
            }
            
            if (pagesToCopy.length === 0) {
                throw new Error("No valid pages found for the given range.");
            }

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy.sort((a,b) => a-b));
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `extracted-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
            
            // Reset state
            setFile(null);
            setRange('');

        } catch (e: any) {
            setError(e.message || "Failed to extract pages. Please check the page range and file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Extract a specific range of pages from a PDF file.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Extracting pages..." /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF File" />
                         <div>
                            <label className="label-style">Pages or Range to Extract</label>
                            <input 
                                type="text" 
                                value={range} 
                                onChange={e => setRange(e.target.value)} 
                                placeholder="e.g., 2-5, 8, 10-end" 
                                className="input-style w-full font-mono"
                            />
                            <p className="text-xs text-slate-400 mt-1">Use commas to separate pages or ranges. Use 'end' for the last page.</p>
                        </div>
                        <button onClick={handleExtract} disabled={!file || !range} className="w-full btn-primary text-lg">
                            Extract and Download
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
