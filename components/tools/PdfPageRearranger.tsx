// @ts-nocheck
import React, { useState, useCallback, useRef } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;
declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="rearrange-loader mx-auto">
            <div className="page p1"></div>
            <div className="page p2"></div>
            <div className="page p3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .rearrange-loader { width: 100px; height: 100px; position: relative; }
            .page { width: 60px; height: 80px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 10px; left: 20px; transform-origin: center; }
            .dark .page { background: #334155; border-color: #64748b; }
            .p1 { animation: shuffle-1 2.5s infinite ease-in-out; }
            .p2 { animation: shuffle-2 2.5s infinite ease-in-out; }
            .p3 { animation: shuffle-3 2.5s infinite ease-in-out; }
            @keyframes shuffle-1 { 0%,100%{transform:translate(0,0) rotate(0)} 33%{transform:translate(-20px,0) rotate(-5deg)} 66%{transform:translate(20px,0) rotate(5deg)} }
            @keyframes shuffle-2 { 0%,100%{transform:translate(0,0) rotate(0)} 33%{transform:translate(20px,0) rotate(5deg)} 66%{transform:translate(-20px,0) rotate(-5deg)} }
            @keyframes shuffle-3 { 0%,100%{transform:translate(0,0) rotate(0)} 33%{transform:translate(0,5px) rotate(0)} 66%{transform:translate(0,-5px) rotate(0)} }
        `}</style>
    </div>
);

interface PageInfo {
    id: number;
    imageUrl: string;
    originalIndex: number;
}

export const PdfPageRearranger: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const processFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setLoadingMessage('Loading PDF pages...');
        setError(null);
        setPages([]);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const pagePromises: Promise<PageInfo>[] = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(
                        pdf.getPage(i).then(async (page) => {
                            const viewport = page.getViewport({ scale: 0.5 }); // smaller scale for thumbnails
                            const canvas = document.createElement('canvas');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            const context = canvas.getContext('2d');
                            await page.render({ canvasContext: context, viewport: viewport }).promise;
                            return {
                                id: i,
                                imageUrl: canvas.toDataURL(),
                                originalIndex: i - 1,
                            };
                        })
                    );
                }
                const renderedPages = await Promise.all(pagePromises);
                setPages(renderedPages);
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to load PDF pages. The file may be corrupted.");
            setIsLoading(false);
        }
    }, []);

    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const _pages = [...pages];
        const draggedItemContent = _pages.splice(dragItem.current, 1)[0];
        _pages.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setPages(_pages);
    };

    const handleSave = async () => {
        if (!file) return;
        setIsLoading(true);
        setLoadingMessage('Rearranging pages...');
        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
            const newPdf = await PDFDocument.create();
            const pageIndices = pages.map(p => p.originalIndex);
            
            const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reordered-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
            
            // Reset state
            setFile(null);
            setPages([]);

        } catch (e) {
            setError("Failed to save the reordered PDF.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Drag and drop pages to change their order.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? (
                    <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF file" />
                ) : isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center"><Loader message={loadingMessage} /></div>
                ) : (
                    <div>
                        <p className="text-center mb-4 font-semibold">Drag pages to reorder them.</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {pages.map((page, index) => (
                                <div key={page.id} 
                                     className="relative border rounded-md p-1 bg-slate-100 dark:bg-slate-700 cursor-grab"
                                     draggable
                                     onDragStart={() => (dragItem.current = index)}
                                     onDragEnter={() => (dragOverItem.current = index)}
                                     onDragEnd={handleSort}
                                     onDragOver={(e) => e.preventDefault()}>
                                    <img src={page.imageUrl} alt={`Page ${page.originalIndex + 1}`} className="w-full h-auto rounded-sm" />
                                    <span className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">{index + 1}</span>
                                    <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">Orig: {page.originalIndex + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setFile(null)} className="btn-secondary">Change PDF</button>
                            <button onClick={handleSave} className="btn-primary">Save and Download</button>
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};