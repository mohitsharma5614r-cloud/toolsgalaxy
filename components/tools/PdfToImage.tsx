// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;
declare const JSZip: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-pdf">P</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-img">🖼️</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Converting pages to images...</p>
    </div>
);

export const PdfToImage: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (uploadedFile: File) => {
        setFile(uploadedFile);
    };

    const handleConvert = async () => {
        if (!file) {
            setError("Please upload a PDF file first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const zip = new JSZip();
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        
                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                        zip.file(`page-${i}.png`, blob);
                        setProgress(((i / pdf.numPages) * 100));
                    }
                    
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    const url = URL.createObjectURL(zipBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${file.name.replace(/\.pdf$/, '')}-images.zip`;
                    link.click();
                    URL.revokeObjectURL(url);
                    setIsLoading(false);

                } catch (pdfError) {
                    console.error(pdfError);
                    setError("Could not process the PDF. It may be corrupted.");
                    setIsLoading(false);
                }
            };
        } catch (e) {
            setError("Failed to read the file.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert each page of a PDF into a separate image.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex flex-col items-center justify-center">
                        <Loader />
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                        </div>
                        <p className="text-sm mt-2 text-slate-500">{Math.round(progress)}% complete</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={handleFile}
                            acceptedTypes="application/pdf"
                            label="Upload a .pdf file"
                        />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">
                            Convert and Download as ZIP
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
