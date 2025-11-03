
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

const Loader: React.FC<{ message: string, progress: number }> = ({ message, progress }) => (
    <div className="text-center">
        <div className="convert-loader mx-auto">
            <div className="icon pdf-icon">PDF</div>
            <div className="icon html-icon">&lt;/&gt;</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
    </div>
);

export const PdfToHtmlConverter: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let htmlContent = `<!DOCTYPE html><html><head><title>${file.name}</title><style>body{margin:0; background:#eee;} img{display:block; margin: 1rem auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 100%;}</style></head><body>`;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    const context = canvas.getContext('2d');
                    await page.render({ canvasContext: context, viewport }).promise;
                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    htmlContent += `<img src="${imgData}" width="${canvas.width}" height="${canvas.height}" alt="Page ${i}">`;
                    setProgress((i / pdf.numPages) * 100);
                }

                htmlContent += `</body></html>`;
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${file.name.replace(/\.pdf$/, '')}.html`;
                link.click();
                URL.revokeObjectURL(url);
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to convert PDF.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .convert-loader { width: 100px; height: 100px; position: relative; }
                .icon { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: bold; border-radius: 50%; animation: morph 3s infinite; }
                .pdf-icon { background: #ef4444; color: white; animation-delay: 0s; }
                .html-icon { background: #3b82f6; color: white; animation-delay: 1.5s; }
                @keyframes morph { 0%, 100% { opacity: 1; transform: scale(1); } 50%, 99% { opacity: 0; transform: scale(0.5); } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert your PDF into a single HTML file with images.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Converting to HTML..." progress={progress} /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF File" />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">Convert and Download HTML</button>
                        <p className="text-xs text-center text-slate-400">This tool converts each page into an image to preserve layout. Text will not be selectable.</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
