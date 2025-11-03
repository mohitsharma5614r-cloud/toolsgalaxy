// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;
declare const jspdf: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="compress-loader mx-auto">
            <div className="arrow top-arrow"></div>
            <div className="arrow left-arrow"></div>
            <div className="file-icon">📄</div>
            <div className="arrow right-arrow"></div>
            <div className="arrow bottom-arrow"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .compress-loader { width: 80px; height: 80px; position: relative; display: flex; align-items: center; justify-content: center; }
            .file-icon { font-size: 50px; animation: squeeze 2s infinite ease-in-out; }
            .arrow { position: absolute; width: 12px; height: 12px; border-left: 4px solid #6366f1; border-bottom: 4px solid #6366f1; animation: push 2s infinite ease-in-out; }
            .dark .arrow { border-color: #818cf8; }
            .top-arrow { top: 0; left: 50%; transform: translateX(-50%) rotate(135deg); }
            .left-arrow { left: 0; top: 50%; transform: translateY(-50%) rotate(45deg); }
            .right-arrow { right: 0; top: 50%; transform: translateY(-50%) rotate(225deg); }
            .bottom-arrow { bottom: 0; left: 50%; transform: translateX(-50%) rotate(-45deg); }

            @keyframes squeeze { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); } }
            @keyframes push { 0%, 100% { opacity: 0; } 25% { opacity: 1; } 50%, 100% { opacity: 0; } }
        `}</style>
    </div>
);

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const PdfCompressor: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(0.7); // 0.1 to 1.0
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ url: string; oldSize: number; newSize: number } | null>(null);

    const handleCompress = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const { jsPDF } = jspdf;
                    let newPdf;

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for quality
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ canvasContext: context, viewport }).promise;
                        const imgData = canvas.toDataURL('image/jpeg', quality);

                        if (i === 1) {
                            newPdf = new jsPDF({
                                orientation: canvas.width > canvas.height ? 'l' : 'p',
                                unit: 'px',
                                format: [canvas.width, canvas.height]
                            });
                        } else {
                            newPdf.addPage([canvas.width, canvas.height], canvas.width > canvas.height ? 'l' : 'p');
                        }
                        newPdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
                    }

                    const blob = newPdf.output('blob');
                    const url = URL.createObjectURL(blob);
                    setResult({ url, oldSize: file.size, newSize: blob.size });

                } catch (pdfError) {
                    setError("Failed to process PDF. It may be corrupted or password-protected.");
                } finally {
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
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Reduce the file size of your PDF documents by converting pages to images.</p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Compressing your PDF..." /></div>
                ) : result ? (
                     <div className="text-center space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold">Compression Complete!</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <p className="text-sm font-semibold text-slate-500">Original Size</p>
                                <p className="text-xl font-bold">{formatBytes(result.oldSize)}</p>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <p className="text-sm font-semibold text-slate-500">New Size</p>
                                <p className="text-xl font-bold text-emerald-500">{formatBytes(result.newSize)}</p>
                            </div>
                             <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <p className="text-sm font-semibold text-slate-500">Reduction</p>
                                <p className="text-xl font-bold text-emerald-500">{(((result.oldSize - result.newSize) / result.oldSize) * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <a href={result.url} download={`compressed-${file.name}`} className="btn-primary">Download Compressed PDF</a>
                            <button onClick={() => {setFile(null); setResult(null);}} className="btn-secondary">Compress Another</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF to Compress" />
                        <div>
                            <label className="label-style">Compression Level (Lower = Smaller Size)</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setQuality(0.5)} className={`btn-toggle ${quality === 0.5 ? 'btn-selected' : ''}`}>Low</button>
                                <button onClick={() => setQuality(0.7)} className={`btn-toggle ${quality === 0.7 ? 'btn-selected' : ''}`}>Medium</button>
                                <button onClick={() => setQuality(0.9)} className={`btn-toggle ${quality === 0.9 ? 'btn-selected' : ''}`}>High</button>
                            </div>
                        </div>
                        <button onClick={handleCompress} disabled={!file} className="w-full btn-primary text-lg">Compress PDF</button>
                        <p className="text-xs text-center text-slate-400">Note: This method converts pages to images, which may reduce quality and remove selectable text.</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
