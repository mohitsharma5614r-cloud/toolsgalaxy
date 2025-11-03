
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="page-content"></div>
            <div className="header-line"></div>
            <div className="footer-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .doc-loader { width: 80px; height: 100px; position: relative; border: 2px solid #9ca3af; border-radius: 4px; }
            .dark .doc-loader { border-color: #64748b; }
            .page-content { position: absolute; top: 20px; bottom: 20px; left: 10px; right: 10px; background-image: repeating-linear-gradient(#cbd5e1 0 2px, transparent 2px 10px); }
            .dark .page-content { background-image: repeating-linear-gradient(#475569 0 2px, transparent 2px 10px); }
            .header-line, .footer-line { position: absolute; left: 10px; right: 10px; height: 2px; background: #6366f1; animation: write-line 1.5s infinite; }
            .header-line { top: 10px; }
            .footer-line { bottom: 10px; animation-delay: 0.5s; }
            @keyframes write-line { 0% { width: 0; left: 10px; } 50% { width: calc(100% - 20px); left: 10px; } 100% { width: 0; left: calc(100% - 10px); } }
        `}</style>
    </div>
);

export const PdfHeaderFooterAdder: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [headerText, setHeaderText] = useState('');
    const [footerText, setFooterText] = useState('{pageNumber} of {totalPages}');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) {
            setError("Please upload a PDF file first.");
            return;
        }
        if (!headerText.trim() && !footerText.trim()) {
            setError("Please provide text for either the header or the footer.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                const pageNum = i + 1;
                const total = pages.length;
                
                const processText = (text: string) => text.replace('{pageNumber}', pageNum).replace('{totalPages}', total);

                if (headerText.trim()) {
                    page.drawText(processText(headerText), { x: width / 2, y: height - 40, font, size: 10, color: rgb(0, 0, 0), xAlign: 'center' });
                }
                if (footerText.trim()) {
                    page.drawText(processText(footerText), { x: width / 2, y: 40, font, size: 10, color: rgb(0, 0, 0), xAlign: 'center' });
                }
            }

            const newPdfBytes = await pdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `hf-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to add header/footer. The file might be corrupted.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add custom headers and footers to every page of your PDF.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Adding header & footer..." /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF File" />
                        {file && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="label-style">Header Text</label>
                                    <input value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="e.g., Company Report" className="input-style w-full" />
                                </div>
                                <div>
                                    <label className="label-style">Footer Text</label>
                                    <input value={footerText} onChange={e => setFooterText(e.target.value)} className="input-style w-full" />
                                     <p className="text-xs text-slate-400 mt-1">Use {'{pageNumber}'} and {'{totalPages}'} for automatic numbering.</p>
                                </div>
                            </div>
                        )}
                        <button onClick={handleProcess} disabled={!file} className="w-full btn-primary text-lg">Add and Download</button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
