// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;
declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="rotate-loader mx-auto">
            <div className="page">PDF</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .rotate-loader { width: 100px; height: 100px; position: relative; }
            .page { width: 60px; height: 80px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #9ca3af; position: absolute; top: 10px; left: 20px; transform-origin: center; animation: rotate-page 2s infinite ease-in-out; }
            .dark .page { background: #334155; border-color: #64748b; color: #64748b; }
            @keyframes rotate-page { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(360deg); } }
        `}</style>
    </div>
);

interface PageInfo {
    imageUrl: string;
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
}

export const PageOrientationChanger: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

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
                        pdf.getPage(i).then(async page => {
                            const viewport = page.getViewport({ scale: 0.5 }); // smaller scale for thumbnails
                            const canvas = document.createElement('canvas');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            const context = canvas.getContext('2d');
                            await page.render({ canvasContext: context, viewport }).promise;
                            return {
                                imageUrl: canvas.toDataURL(),
                                width: page.view[2] - page.view[0],
                                height: page.view[3] - page.view[1],
                                orientation: page.view[3] > page.view[2] ? 'portrait' : 'landscape',
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

    const toggleOrientation = (index: number) => {
        setPages(prev => prev.map((p, i) => i === index ? { ...p, orientation: p.orientation === 'portrait' ? 'landscape' : 'portrait' } : p));
    };

    const handleSave = async () => {
        if (!file) return;
        setIsLoading(true);
        setLoadingMessage('Applying changes...');
        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
            const newPdfDoc = await PDFDocument.create();

            for (let i = 0; i < pages.length; i++) {
                const pageInfo = pages[i];
                const originalPage = pdfDoc.getPage(i);
                const { width, height } = originalPage.getSize();
                
                const needsChange = (width > height && pageInfo.orientation === 'portrait') || (height > width && pageInfo.orientation === 'landscape');

                if (needsChange) {
                    const [embeddedPage] = await newPdfDoc.embedPdf(pdfDoc, [i]);
                    const newPage = newPdfDoc.addPage([height, width]);
                    const newDims = newPage.getSize();
                    const embeddedDims = embeddedPage.scaleToFit(newDims.width, newDims.height);
                    
                    newPage.drawPage(embeddedPage, {
                        ...embeddedDims,
                        x: newPage.getWidth() / 2 - embeddedDims.width / 2,
                        y: newPage.getHeight() / 2 - embeddedDims.height / 2,
                    });
                } else {
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                    newPdfDoc.addPage(copiedPage);
                }
            }

            const pdfBytes = await newPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `oriented-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            setError("Failed to save the modified PDF.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Switch individual pages between portrait and landscape.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? (
                    <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF file" />
                ) : isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center"><Loader message={loadingMessage} /></div>
                ) : (
                    <div>
                        <p className="text-center mb-4 font-semibold">Click a page to toggle its orientation.</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {pages.map((page, index) => (
                                <div key={index} className="relative cursor-pointer group" onClick={() => toggleOrientation(index)}>
                                    <img 
                                        src={page.imageUrl} 
                                        alt={`Page ${index + 1}`} 
                                        className={`w-full h-auto rounded-md border-4 transition-all ${page.orientation === 'portrait' ? 'aspect-[2/3]' : 'aspect-[3/2]'} object-contain bg-slate-200 dark:bg-slate-700 border-indigo-500`}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl font-bold">
                                        {page.orientation === 'portrait' ? '↔️' : '↕️'}
                                    </div>
                                    <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">{index + 1}</span>
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
             <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
            `}</style>
        </div>
    );
};
