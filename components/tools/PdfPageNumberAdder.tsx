// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="pdf-loader mx-auto">
             <div className="page-number">1</div>
             <div className="page-number">2</div>
             <div className="page-number">3</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Adding page numbers...</p>
        <style>{`
            .pdf-loader { width: 80px; height: 100px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: relative; overflow: hidden; }
            .dark .pdf-loader { background: #334155; border-color: #64748b; }
            .page-number { position: absolute; bottom: 5px; right: 5px; font-size: 12px; font-weight: bold; color: #64748b; animation: count-up 3s infinite steps(3, end); }
            .page-number:nth-child(2) { animation-delay: 1s; }
            .page-number:nth-child(3) { animation-delay: 2s; }
            @keyframes count-up { 0% { content: "1"; opacity: 1; } 33% { content: "2"; } 66% { content: "3"; } 100% { opacity: 0; } }
            .pdf-loader::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(#f1f5f9 2px, transparent 2px); background-size: 100% 10px; }
            .dark .pdf-loader::before { background: linear-gradient(#1e293b 2px, transparent 2px); background-size: 100% 10px; }
        `}</style>
    </div>
);

export const PdfPageNumberAdder: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState('bottom-center');
    const [startNumber, setStartNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (uploadedFile: File) => {
        setFile(uploadedFile);
    };

    const handleAddNumbers = async () => {
        if (!file) {
            setError("Please upload a PDF file first.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                const pageNumber = (i + startNumber).toString();

                let x, y;
                const margin = 50;
                
                if (position.includes('bottom')) y = margin;
                if (position.includes('top')) y = height - margin;
                if (position.includes('center')) x = width / 2;
                if (position.includes('left')) x = margin;
                if (position.includes('right')) x = width - margin;

                page.drawText(pageNumber, {
                    x,
                    y,
                    font: helveticaFont,
                    size: 12,
                    color: rgb(0, 0, 0),
                    // Adjust alignment based on position
                    xAlign: position.includes('center') ? 'center' : position.includes('left') ? 'left' : 'right'
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `numbered-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
            
        } catch (e) {
            console.error(e);
            setError("Failed to add page numbers. The PDF might be corrupted or protected.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add automatic page numbering to your PDF files.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={handleFile}
                            acceptedTypes="application/pdf"
                            label="Upload a .pdf file"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label-style">Position</label>
                                <select value={position} onChange={e => setPosition(e.target.value)} className="input-style w-full">
                                    <option value="bottom-center">Bottom Center</option>
                                    <option value="bottom-right">Bottom Right</option>
                                    <option value="bottom-left">Bottom Left</option>
                                    <option value="top-center">Top Center</option>
                                    <option value="top-right">Top Right</option>
                                    <option value="top-left">Top Left</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-style">Start Number</label>
                                <input type="number" min="1" value={startNumber} onChange={e => setStartNumber(Number(e.target.value))} className="input-style w-full" />
                            </div>
                        </div>
                        <button onClick={handleAddNumbers} disabled={!file} className="w-full btn-primary text-lg">
                            Add Numbers and Download
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
