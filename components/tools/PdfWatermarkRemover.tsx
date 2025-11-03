// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;
declare const jspdf: any;

export const PdfWatermarkRemover: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) return;
        setIsLoading(true);
        setError(null);
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const { jsPDF } = jspdf;
                let newPdf;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport }).promise;

                    const imgData = canvas.toDataURL('image/jpeg', 0.95);

                    if (i === 1) {
                        newPdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
                    } else {
                        newPdf.addPage([canvas.width, canvas.height], 'p');
                    }
                    newPdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
                }
                newPdf.save(`${file.name.replace(/\.pdf$/, '')}-no-watermark.pdf`);
                setIsLoading(false);
            };
        } catch(e) {
            setError("Failed to process PDF.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Attempt to remove simple watermarks from PDF files.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? <p>Processing...</p> : (
                    <div className="space-y-4">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload PDF" />
                        <button onClick={handleProcess} disabled={!file} className="w-full btn-primary text-lg">Attempt Removal & Download</button>
                        <p className="text-xs text-slate-400">Disclaimer: This tool converts pages to images, which removes selectable text and may not work on complex watermarks. For simple, overlaid watermarks only.</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
