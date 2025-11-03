// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

export const PdfHighlightRemover: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) return;
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument, PDFName } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const annots = page.node.Annots();
                if (annots) {
                    const newAnnots = [];
                    for (let i = 0; i < annots.size(); i++) {
                        const annot = annots.get(i);
                        if (annot.get(PDFName.of('Subtype')).toString() !== '/Highlight') {
                            newAnnots.push(annot);
                        }
                    }
                    page.node.set(PDFName.of('Annots'), pdfDoc.context.obj(newAnnots));
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `no-highlights-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to remove highlights. The PDF may be protected or corrupted.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Remove all text highlights from a PDF.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                 {isLoading ? <p>Processing...</p> : (
                    <div className="space-y-4">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF" />
                        <button onClick={handleProcess} disabled={!file} className="w-full btn-primary text-lg">Remove Highlights & Download</button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
