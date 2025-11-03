// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="resize-loader mx-auto">
            <div className="page"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .resize-loader { width: 100px; height: 100px; position: relative; }
            .page { width: 60px; height: 80px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 10px; left: 20px; animation: resize-page 2s infinite ease-in-out; }
            .dark .page { background: #334155; border-color: #64748b; }
            @keyframes resize-page { 0%,100%{transform:scale(1)} 50%{transform:scale(0.8)} }
        `}</style>
    </div>
);

const pageSizes = ['Letter', 'Legal', 'A3', 'A4', 'A5'];

export const PdfPageSizeChanger: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [targetSize, setTargetSize] = useState('A4');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument, PageSizes } = PDFLib;
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const newPdfDoc = await PDFDocument.create();

            const newPageSize = PageSizes[targetSize];
            if (!newPageSize) throw new Error("Invalid page size selected.");

            const pageIndices = pdfDoc.getPageIndices();
            for (const pageIndex of pageIndices) {
                const embeddedPage = await newPdfDoc.embedPage(pdfDoc, pageIndex);
                const newPage = newPdfDoc.addPage(newPageSize);
                const { width, height } = newPage.getSize();
                const scale = Math.min(width / embeddedPage.width, height / embeddedPage.height);
                newPage.drawPage(embeddedPage, {
                    x: (width - embeddedPage.width * scale) / 2,
                    y: (height - embeddedPage.height * scale) / 2,
                    width: embeddedPage.width * scale,
                    height: embeddedPage.height * scale,
                });
            }

            const newPdfBytes = await newPdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resized-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);

            setFile(null);
        } catch (e) {
            setError("Failed to change page size. The PDF might be corrupted.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Adjust the page size of your PDF document to standard formats.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Resizing pages..." /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF File" />
                        {file && (
                             <div className="animate-fade-in">
                                <label className="label-style">Target Page Size</label>
                                <select value={targetSize} onChange={e => setTargetSize(e.target.value)} className="input-style w-full">
                                    {pageSizes.map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </div>
                        )}
                        <button onClick={handleSave} disabled={!file} className="w-full btn-primary text-lg">
                            Change Size and Download
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};