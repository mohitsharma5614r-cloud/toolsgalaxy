import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Use local worker file from public folder - permanent fix
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

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
                    // Disable worker for this document to avoid loading issues
                    const pdf = await pdfjsLib.getDocument({
                        data: typedarray,
                        useWorkerFetch: false,
                        isEvalSupported: false,
                        useSystemFonts: true
                    }).promise;
                    const zip = new JSZip();
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        if (!context) continue;
                        
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ 
                            canvasContext: context,
                            viewport: viewport,
                            intent: 'display'
                        } as any).promise;
                        
                        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                        if (blob) {
                            zip.file(`page-${i}.png`, blob);
                        }
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

                } catch (pdfError: any) {
                    console.error('PDF Processing Error:', pdfError);
                    const errorMsg = pdfError?.message || pdfError?.toString() || 'Unknown error';
                    setError(`Could not process the PDF: ${errorMsg}. Try a different PDF file.`);
                    setIsLoading(false);
                }
            };
        } catch (e) {
            setError("Failed to read the file.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Convert each page of a PDF into separate images</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[300px] flex flex-col items-center justify-center">
                        <Loader />
                        <div className="w-full max-w-md bg-slate-200 rounded-full h-3 mt-6 dark:bg-slate-700 overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                        </div>
                        <p className="text-sm mt-3 text-slate-600 dark:text-slate-400 font-medium">{Math.round(progress)}% complete</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload PDF File</label>
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                                {file ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div className="text-left">
                                            <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setFile(null)} className="ml-auto p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-slate-500">PDF files only</p>
                                        <input type="file" accept="application/pdf" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <p className="font-semibold mb-1">Output Format</p>
                                    <p>Each page will be converted to a PNG image and downloaded as a ZIP file.</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button onClick={handleConvert} disabled={!file} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Convert to Images & Download ZIP</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-6 right-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg animate-slide-up max-w-md">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
