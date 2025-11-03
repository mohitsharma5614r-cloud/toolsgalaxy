
// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';
import { extractTextFromImage } from '../../services/geminiService';

declare const pdfjsLib: any;

const Loader: React.FC<{ message: string; progress: number }> = ({ message, progress }) => (
    <div className="text-center">
        <div className="ocr-loader mx-auto">
            <div className="scanner-line"></div>
            <div className="text-line t1"></div>
            <div className="text-line t2"></div>
            <div className="text-line t3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
    </div>
);

export const ScannedPdfToSearchablePdf: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleProcess = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setExtractedText('');
        setProgress(0);
        
        try {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(selectedFile);
            fileReader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        setLoadingMessage(`Processing Page ${i} of ${pdf.numPages}...`);
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 });
                        const canvas = document.createElement('canvas');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        const context = canvas.getContext('2d');
                        await page.render({ canvasContext: context, viewport }).promise;
                        
                        const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
                        const textFromPage = await extractTextFromImage(base64, 'image/jpeg');
                        
                        fullText += `--- Page ${i} ---\n${textFromPage}\n\n`;
                        setProgress((i / pdf.numPages) * 100);
                    }
                    
                    setExtractedText(fullText);
                } catch (pdfError) {
                    setError("Could not process the PDF. It may be corrupted or encrypted.");
                } finally {
                    setIsLoading(false);
                }
            };
        } catch (e) {
            setError("Failed to read the file.");
            setIsLoading(false);
        }
    }, []);

    const handleDownload = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/, '')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Make scanned documents searchable by extracting all text with AI OCR.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message={loadingMessage} progress={progress} /></div>
                ) : extractedText ? (
                    <div className="space-y-4">
                         <h2 className="text-xl font-bold">Extracted Text</h2>
                         <textarea readOnly value={extractedText} rows={15} className="w-full input-style font-mono text-sm" />
                         <div className="flex gap-4">
                            <button onClick={handleDownload} className="btn-primary">Download as .txt</button>
                            <button onClick={() => { setFile(null); setExtractedText('')}} className="btn-secondary">Convert Another</button>
                         </div>
                    </div>
                ) : (
                    <FileUploader onFileSelected={handleProcess} acceptedTypes="application/pdf" label="Upload a Scanned PDF" />
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .ocr-loader { width: 100px; height: 80px; position: relative; border: 3px solid #9ca3af; border-radius: 4px; overflow: hidden; }
                .dark .ocr-loader { border-color: #64748b; }
                .scanner-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #6366f1; box-shadow: 0 0 10px #6366f1; animation: ocr-scan 2.5s infinite ease-in-out; }
                .dark .scanner-line { background: #818cf8; box-shadow: 0 0 10px #818cf8; }
                .text-line { position: absolute; left: 10%; height: 5px; background: #cbd5e1; border-radius: 2px; }
                .dark .text-line { background: #475569; }
                .t1 { top: 20%; width: 80%; } .t2 { top: 45%; width: 60%; } .t3 { top: 70%; width: 70%; }
                @keyframes ocr-scan { 0%, 100% { top: 0; } 50% { top: 100%; } }
            `}</style>
        </div>
    );
};
