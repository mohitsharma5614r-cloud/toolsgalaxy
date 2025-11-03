// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-pdf">P</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-word">W</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Extracting text...</p>
        <style>{`
            .doc-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
            .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
            .doc-word { background-color: #2b579a; animation: pulse-word 2s infinite; }
            .doc-pdf { background-color: #d93831; animation: pulse-pdf 2s infinite; }
            .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            @keyframes pulse-word { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes pulse-pdf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        `}</style>
    </div>
);

export const PdfToWord: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
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

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n\n';
                    }

                    const blob = new Blob([fullText], { type: 'application/msword' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${file.name.replace(/\.pdf$/, '')}.doc`;
                    link.click();
                    URL.revokeObjectURL(url);
                    setIsLoading(false);

                } catch (pdfError) {
                    console.error(pdfError);
                    setError("Could not read text from the PDF. It may be image-based or corrupted.");
                    setIsLoading(false);
                }
            };
        } catch (e) {
            console.error(e);
            setError("Failed to process the file.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Extract text from your PDF into an editable Word document.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={handleFile}
                            acceptedTypes="application/pdf"
                            label="Upload a .pdf file"
                        />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">
                            Convert and Download DOC
                        </button>
                        <p className="text-xs text-center text-slate-400">Note: This tool extracts text only. Formatting, images, and complex layouts will not be preserved.</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
