
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;
declare const JSZip: any;

const Loader: React.FC<{ message: string, progress: number }> = ({ message, progress }) => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-pdf">P</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-img">🖼️</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

export const BatchPdfToImageConverter: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (files.length === 0) {
            setError("Please upload at least one PDF file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const zip = new JSZip();
            
            for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                const file = files[fileIndex];
                const reader = new FileReader();
                const filePromise = new Promise((resolve, reject) => {
                    reader.onload = async (e) => {
                        try {
                            const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                            const pdf = await pdfjsLib.getDocument(typedarray).promise;
                            const folder = zip.folder(file.name.replace(/\.pdf$/, ''));

                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 2.0 });
                                const canvas = document.createElement('canvas');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;
                                const context = canvas.getContext('2d');
                                await page.render({ canvasContext: context, viewport }).promise;
                                
                                const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
                                folder.file(`page-${i}.png`, blob);
                            }
                            setProgress(((fileIndex + 1) / files.length) * 100);
                            resolve(true);
                        } catch (pdfError) {
                            reject(pdfError);
                        }
                    };
                    reader.readAsArrayBuffer(file);
                });
                await filePromise;
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pdf-to-images.zip';
            link.click();
            URL.revokeObjectURL(url);

        } catch (e) {
            setError("Failed to convert files. One or more may be corrupted.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .doc-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
                .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
                .doc-img { background-color: #34d399; }
                .doc-pdf { background-color: #d93831; }
                .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert multiple PDF files to images at once.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Converting PDFs..." progress={progress} /></div>
                ) : (
                    <div className="space-y-6">
                         <input type="file" multiple accept="application/pdf" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="input-file-style" />
                        {files.length > 0 && 
                            <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                                {files.map((f, i) => <p key={i} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{f.name}</p>)}
                            </div>
                        }
                        <button onClick={handleConvert} disabled={files.length === 0} className="w-full btn-primary text-lg">
                            Convert All and Download ZIP
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
