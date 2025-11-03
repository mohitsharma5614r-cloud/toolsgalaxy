// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';

// Declare global libraries
declare const PDFLib: any;
declare const JSZip: any;

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="pdf-loader mx-auto">
            <div className="page p1"></div>
            <div className="page p2"></div>
            <div className="page p3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
    </div>
);

type Tab = 'merge' | 'split' | 'compress';

export const MergeSplitCompressPdf: React.FC<{ title: string }> = ({ title }) => {
    const [activeTab, setActiveTab] = useState<Tab>('merge');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Merge State
    const [mergeFiles, setMergeFiles] = useState<File[]>([]);
    
    // Split State
    const [splitFile, setSplitFile] = useState<File | null>(null);
    const [splitRanges, setSplitRanges] = useState('');

    const handleMerge = async () => {
        if (mergeFiles.length < 2) {
            setError("Please upload at least two PDF files to merge.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (const file of mergeFiles) {
                const pdfBytes = await readFileAsArrayBuffer(file);
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
        } catch (e) {
            setError("Failed to merge PDFs. Please ensure all files are valid.");
        }
        setIsLoading(false);
    };
    
    const handleSplit = async () => {
        if (!splitFile || !splitRanges.trim()) {
            setError("Please upload a PDF and specify page ranges to split.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const pdfBytes = await readFileAsArrayBuffer(splitFile);
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const totalPages = pdfDoc.getPageCount();
            
            const ranges = splitRanges.split(',').map(r => r.trim());
            const zip = new JSZip();

            for (const range of ranges) {
                const newPdf = await PDFLib.PDFDocument.create();
                let pagesToCopy: number[] = [];

                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(p => p.trim() === 'end' ? totalPages : parseInt(p));
                    for (let i = start; i <= end; i++) {
                        if(i > 0 && i <= totalPages) pagesToCopy.push(i - 1);
                    }
                } else {
                    const pageNum = parseInt(range);
                     if(pageNum > 0 && pageNum <= totalPages) pagesToCopy.push(pageNum - 1);
                }
                
                if (pagesToCopy.length > 0) {
                    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
                    copiedPages.forEach(page => newPdf.addPage(page));
                    const newPdfBytes = await newPdf.save();
                    zip.file(`split_${range}.pdf`, newPdfBytes);
                }
            }
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'split-pages.zip';
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to split PDF. Please check your page ranges.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .pdf-loader { width: 80px; height: 100px; position: relative; }
                .page { width: 90%; height: 95%; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; }
                .dark .page { background: #334155; border-color: #64748b; }
                .page.p1 { animation: cascade-1 2s infinite; }
                .page.p2 { animation: cascade-2 2s infinite; }
                .page.p3 { animation: cascade-3 2s infinite; }
                @keyframes cascade-1 { 0%,100% {transform:translate(0,0)} 50% {transform:translate(10px,-10px)} }
                @keyframes cascade-2 { 0%,100% {transform:translate(0,0)} 50% {transform:translate(0,0)} }
                @keyframes cascade-3 { 0%,100% {transform:translate(0,0)} 50% {transform:translate(-10px,10px)} }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Merge, Split, and Compress your PDF files.</p>
            </div>
            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg flex mb-6">
                <button onClick={() => setActiveTab('merge')} className={`tab ${activeTab==='merge' && 'tab-active'}`}>Merge</button>
                <button onClick={() => setActiveTab('split')} className={`tab ${activeTab==='split' && 'tab-active'}`}>Split</button>
                <button onClick={() => setActiveTab('compress')} className={`tab ${activeTab==='compress' && 'tab-active'}`}>Compress</button>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border min-h-[400px]">
                {isLoading && <Loader message="Processing your PDFs..." />}
                
                {!isLoading && activeTab === 'merge' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Merge PDFs</h2>
                        <input type="file" multiple accept="application/pdf" onChange={e => setMergeFiles(Array.from(e.target.files || []))} className="input-file-style" />
                        <div className="space-y-2">
                            {mergeFiles.map((file, i) => <div key={i} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm">{file.name}</div>)}
                        </div>
                        <button onClick={handleMerge} className="w-full btn-primary" disabled={mergeFiles.length < 2}>Merge Files</button>
                    </div>
                )}
                
                {!isLoading && activeTab === 'split' && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold">Split PDF</h2>
                        <input type="file" accept="application/pdf" onChange={e => setSplitFile(e.target.files ? e.target.files[0] : null)} className="input-file-style" />
                         {splitFile && <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm">{splitFile.name}</div>}
                         <input type="text" value={splitRanges} onChange={e => setSplitRanges(e.target.value)} placeholder="e.g., 1-3, 5, 8-end" className="input-style w-full"/>
                         <button onClick={handleSplit} className="w-full btn-primary" disabled={!splitFile || !splitRanges}>Split PDF</button>
                    </div>
                )}

                {!isLoading && activeTab === 'compress' && (
                    <div className="text-center p-8 text-slate-500">
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Compress PDF</h2>
                        <p className="mt-2">This feature is under construction and will be available soon!</p>
                    </div>
                )}
            </div>
             {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
