
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Removing page numbers...</p>
    </div>
);

export const PageNumberRemover: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState<'top' | 'bottom' | 'both'>('bottom');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) return;
        setIsLoading(true);
        setError(null);
        try {
            const { PDFDocument, rgb } = PDFLib;
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            for (const page of pages) {
                const { width, height } = page.getSize();
                const margin = 60; // How tall the box is
                
                if (position === 'top' || position === 'both') {
                    page.drawRectangle({ x: 0, y: height - margin, width, height: margin, color: rgb(1, 1, 1) });
                }
                if (position === 'bottom' || position === 'both') {
                    page.drawRectangle({ x: 0, y: 0, width, height: margin, color: rgb(1, 1, 1) });
                }
            }
            
            const newPdfBytes = await pdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `no-numbers-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            setFile(null);
        } catch (e) {
            setError("Failed to process PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A best-effort tool to remove page numbers by covering header/footer areas.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                 {isLoading ? <div className="min-h-[200px] flex items-center justify-center"><Loader /></div> :
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload PDF" />
                        {file && (
                             <div>
                                <label className="label-style">Area to Cover</label>
                                <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                                    <button onClick={() => setPosition('top')} className={`flex-1 btn-toggle ${position === 'top' ? 'btn-toggle-active' : ''}`}>Top</button>
                                    <button onClick={() => setPosition('bottom')} className={`flex-1 btn-toggle ${position === 'bottom' ? 'btn-toggle-active' : ''}`}>Bottom</button>
                                    <button onClick={() => setPosition('both')} className={`flex-1 btn-toggle ${position === 'both' ? 'btn-toggle-active' : ''}`}>Both</button>
                                </div>
                            </div>
                        )}
                        <button onClick={handleProcess} disabled={!file} className="w-full btn-primary text-lg">Remove & Download</button>
                    </div>
                }
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
