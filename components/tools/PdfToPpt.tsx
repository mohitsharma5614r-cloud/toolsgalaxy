// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;
declare const PptxGenJS: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="convert-loader mx-auto">
            <div className="doc-icon doc-pdf">P</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-ppt">P</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .convert-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
            .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
            .doc-pdf { background-color: #d93831; animation: pulse-pdf 2s infinite; }
            .doc-ppt { background-color: #d24726; animation: pulse-ppt 2s infinite; }
            .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; animation: fade-arrow 2s infinite; }
            @keyframes pulse-pdf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes pulse-ppt { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes fade-arrow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        `}</style>
    </div>
);

export const PdfToPpt: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

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
                    const pptx = new PptxGenJS();
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        
                        const imgData = canvas.toDataURL('image/png');
                        const slide = pptx.addSlide();
                        slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
                        setProgress(((i / pdf.numPages) * 100));
                    }
                    
                    pptx.writeFile({ fileName: `${file.name.replace(/\.pdf$/, '')}.pptx` });
                    setIsLoading(false);

                } catch (pdfError) {
                    console.error(pdfError);
                    setError("Could not process the PDF. It may be corrupted or protected.");
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
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert each page of a PDF into an image on a PPT slide.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[250px] flex flex-col items-center justify-center">
                        <Loader message="Converting PDF to PPT..." />
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                        </div>
                        <p className="text-sm mt-2 text-slate-500">{Math.round(progress)}% complete</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={setFile}
                            acceptedTypes="application/pdf"
                            label="Upload a .pdf file"
                        />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">
                            Convert and Download PPTX
                        </button>
                        <p className="text-xs text-center text-slate-400">Note: This tool converts each PDF page into a non-editable image on a slide.</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
