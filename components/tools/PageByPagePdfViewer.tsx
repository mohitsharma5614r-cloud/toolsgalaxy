
// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

export const PageByPagePdfViewer: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const renderPage = useCallback(async (pageNum) => {
        if (!pdf) return;
        setIsLoading(true);
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        setIsLoading(false);
    }, [pdf]);

    useEffect(() => {
        if (pdf) renderPage(currentPage);
    }, [pdf, currentPage, renderPage]);
    
    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        const typedarray = new Uint8Array(await selectedFile.arrayBuffer());
        const pdfDoc = await pdfjsLib.getDocument(typedarray).promise;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A simple, clean viewer for your PDF files.</p>
            </div>
            {!pdf ? (
                 <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <FileUploader onFileSelected={handleFileSelect} acceptedTypes="application/pdf" label="Upload a PDF to view" />
                 </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary">Prev</button>
                        <span>Page {currentPage} of {numPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage === numPages} className="btn-secondary">Next</button>
                    </div>
                     <div className="flex justify-center bg-slate-200 dark:bg-slate-900 p-4 rounded-xl">
                        <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg"></canvas>
                     </div>
                </div>
            )}
        </div>
    );
};
