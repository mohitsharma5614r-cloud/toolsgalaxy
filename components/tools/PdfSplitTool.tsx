// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;
declare const JSZip: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="split-loader mx-auto">
            <div className="page-stack">
                <div className="page"></div>
                <div className="page"></div>
                <div className="page"></div>
            </div>
            <div className="scissors">✂️</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .split-loader { width: 100px; height: 100px; position: relative; }
            .page-stack .page { position: absolute; width: 60px; height: 80px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; transform-origin: bottom center; }
            .dark .page-stack .page { background: #334155; border-color: #64748b; }
            .page-stack .page:nth-child(1) { transform: rotate(-10deg); }
            .page-stack .page:nth-child(2) { transform: rotate(0deg); }
            .page-stack .page:nth-child(3) { transform: rotate(10deg); }
            .scissors { font-size: 40px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: cut 1.5s infinite; }
            @keyframes cut { 0%, 100% { transform: translate(-50%, -50%) rotate(20deg); } 50% { transform: translate(-50%, -50%) rotate(-20deg) scale(1.2); } }
        `}</style>
    </div>
);

export const PdfSplitTool: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [ranges, setRanges] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSplit = async () => {
        if (!file || !ranges.trim()) {
            setError("Please upload a PDF and specify page ranges to split.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const totalPages = pdfDoc.getPageCount();
            
            const rangeParts = ranges.split(',').map(r => r.trim());
            const zip = new JSZip();

            for (const range of rangeParts) {
                const newPdf = await PDFLib.PDFDocument.create();
                let pagesToCopy: number[] = [];

                if (range.includes('-')) {
                    const [startStr, endStr] = range.split('-');
                    const start = parseInt(startStr);
                    const end = endStr.trim().toLowerCase() === 'end' ? totalPages : parseInt(endStr);
                    
                    if(isNaN(start) || isNaN(end) || start > end || start < 1) continue;

                    for (let i = start; i <= end; i++) {
                        if (i <= totalPages) pagesToCopy.push(i - 1);
                    }
                } else {
                    const pageNum = parseInt(range);
                    if(!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) pagesToCopy.push(pageNum - 1);
                }
                
                if (pagesToCopy.length > 0) {
                    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
                    copiedPages.forEach(page => newPdf.addPage(page));
                    const newPdfBytes = await newPdf.save();
                    zip.file(`split_${range}.pdf`, newPdfBytes);
                }
            }

            if (Object.keys(zip.files).length === 0) {
                throw new Error("No valid pages found for the given ranges.");
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${file.name.replace(/\.pdf$/,'')}-split.zip`;
            link.click();
            URL.revokeObjectURL(url);
            setFile(null);
            setRanges('');
        } catch (e: any) {
            setError(e.message || "Failed to split PDF. Please check your page ranges.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Split a large PDF into separate files or pages.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Splitting your PDF..." /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF to Split" />
                        <div>
                            <label className="label-style">Page Ranges</label>
                            <input 
                                type="text" 
                                value={ranges} 
                                onChange={e => setRanges(e.target.value)} 
                                placeholder="e.g., 1-3, 5, 8-end" 
                                className="input-style w-full font-mono"
                            />
                            <p className="text-xs text-slate-400 mt-1">Separate pages or ranges with commas. Use 'end' for the last page.</p>
                        </div>
                        <button onClick={handleSplit} disabled={!file || !ranges} className="w-full btn-primary text-lg">
                            Split and Download ZIP
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
