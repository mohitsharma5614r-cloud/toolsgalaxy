// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;
declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="remover-loader mx-auto">
            <div className="page p1"></div>
            <div className="page p2"></div>
            <div className="page p3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .remover-loader { width: 100px; height: 100px; position: relative; }
            .page { width: 60px; height: 80px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 10px; left: 20px; }
            .dark .page { background: #334155; border-color: #64748b; }
            .p1 { z-index: 3; }
            .p2 { z-index: 2; transform: rotate(5deg); }
            .p3 { z-index: 1; transform: rotate(10deg); animation: remove-page 2s infinite ease-in-out; }
            @keyframes remove-page { 0%, 50% { transform: rotate(10deg) translateX(0); opacity: 1; } 100% { transform: rotate(15deg) translateX(50px); opacity: 0; } }
        `}</style>
    </div>
);


export const PdfPageRemover: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pageImages, setPageImages] = useState<string[]>([]);
    const [pagesToRemove, setPagesToRemove] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const processFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setLoadingMessage('Loading PDF pages...');
        setError(null);
        setPageImages([]);
        setPagesToRemove(new Set());

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const pagePromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(
                        pdf.getPage(i).then(page => {
                            const viewport = page.getViewport({ scale: 1.0 });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            return page.render({ canvasContext: context, viewport: viewport }).promise.then(() => canvas.toDataURL());
                        })
                    );
                }
                const renderedPages = await Promise.all(pagePromises);
                setPageImages(renderedPages);
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to load PDF pages. The file may be corrupted.");
            setIsLoading(false);
        }
    }, []);

    const handleTogglePage = (index: number) => {
        const newSet = new Set(pagesToRemove);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setPagesToRemove(newSet);
    };

    const handleRemove = async () => {
        if (pagesToRemove.size === 0) {
            setError("Please select at least one page to remove.");
            return;
        }
        if (pagesToRemove.size === pageImages.length) {
            setError("You can't remove all pages from the document.");
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Removing pages...');
        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
            // Remove pages in descending order to avoid index shifting issues
            const indicesToRemove = Array.from(pagesToRemove).sort((a, b) => b - a);
            indicesToRemove.forEach(index => pdfDoc.removePage(index));

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `removed-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
            
            // Reset state after successful download
            setFile(null);
            setPageImages([]);
            setPagesToRemove(new Set());

        } catch (e) {
            setError("Failed to remove pages from the PDF.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Delete specific pages from a PDF document.</p>
            </div>
            
             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? (
                     <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF file" />
                ) : isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center"><Loader message={loadingMessage} /></div>
                ) : (
                    <div>
                        <p className="text-center mb-4 font-semibold">Click on pages to select/deselect them for removal.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {pageImages.map((imgSrc, index) => (
                                <div key={index} className="relative cursor-pointer" onClick={() => handleTogglePage(index)}>
                                    <img src={imgSrc} alt={`Page ${index + 1}`} className={`w-full h-auto rounded-md border-4 ${pagesToRemove.has(index) ? 'border-red-500' : 'border-transparent'}`} />
                                    {pagesToRemove.has(index) && (
                                        <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center text-white text-4xl font-bold">✕</div>
                                    )}
                                     <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">{index + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setFile(null)} className="btn-secondary">Change PDF</button>
                            <button onClick={handleRemove} className="btn-primary" disabled={pagesToRemove.size === 0}>Remove {pagesToRemove.size} Page(s)</button>
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
            `}</style>
        </div>
    );
};
