// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="extractor-loader mx-auto">
            <div className="page"></div>
            <div className="line l1"></div>
            <div className="line l2"></div>
            <div className="line l3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Extracting text...</p>
    </div>
);

export const PdfTextExtractor: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (uploadedFile: File) => {
        setFile(uploadedFile);
        setExtractedText(''); // Clear previous results
    };

    const handleExtract = async () => {
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
                    setExtractedText(fullText);
                    setIsLoading(false);
                } catch (pdfError) {
                    console.error(pdfError);
                    setError("Could not read text from the PDF. It may be an image-only PDF or corrupted.");
                    setIsLoading(false);
                }
            };
        } catch (e) {
            setError("Failed to process the file.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Extract all text content from a PDF file locally.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                <FileUploader
                    onFileSelected={handleFile}
                    acceptedTypes="application/pdf"
                    label="Upload a .pdf file"
                />
                <button onClick={handleExtract} disabled={!file || isLoading} className="w-full btn-primary text-lg">
                    {isLoading ? 'Extracting...' : 'Extract Text'}
                </button>
            </div>

            {(isLoading || extractedText) && (
                <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold mb-4">Extracted Text</h2>
                    {isLoading ? (
                         <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                    ) : (
                        <textarea
                            readOnly
                            value={extractedText}
                            rows={15}
                            className="w-full input-style font-mono"
                        />
                    )}
                </div>
            )}
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
