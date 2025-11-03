// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    rotation: number;
}

export const PdfPageRotator: React.FC<{ title: string }> = ({ title }) => {
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
                const pagePromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(
                        pdf.getPage(i).then(page => {
                            const viewport = page.getViewport({ scale: 1.0 });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            return page.render({ canvasContext: context, viewport: viewport }).promise.then(() => ({
                                imageUrl: canvas.toDataURL(),
                                rotation: page.rotate,
                            }));
                        })
                    );
                }
                const renderedPages = await Promise.all(pagePromises);
                setPages(renderedPages);
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to load PDF pages.");
            setIsLoading(false);
        }
    }, []);

    const handleRotate = (index: number, angle: number) => {
        setPages(prev => prev.map((p, i) => i === index ? { ...p, rotation: (p.rotation + angle + 360) % 360 } : p));
    };

    const handleSave = async () => {
        if (!file) return;
        setIsLoading(true);
        setLoadingMessage('Applying rotations...');
        try {
            const { PDFDocument, degrees } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pdfPages = pdfDoc.getPages();

            pages.forEach((pageInfo, index) => {
                if (index < pdfPages.length) {
                    pdfPages[index].setRotation(degrees(pageInfo.rotation));
                }
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `rotated-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to save the rotated PDF.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Rotate pages in your PDF to the correct orientation.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? (
                    <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF file" />
                ) : isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center"><Loader message={loadingMessage} /></div>
                ) : (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {pages.map((page, index) => (
                                <div key={index} className="relative group border rounded-md p-1">
                                    <img src={page.imageUrl} alt={`Page ${index + 1}`} className="w-full h-auto rounded-sm transition-transform" style={{ transform: `rotate(${page.rotation}deg)` }} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => handleRotate(index, -90)} className="btn-rotate">↺</button>
                                        <button onClick={() => handleRotate(index, 90)} className="btn-rotate">↻</button>
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
        </div>
    );
};