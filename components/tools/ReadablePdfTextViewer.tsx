// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

export const ReadablePdfTextViewer: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        setIsLoading(true);
        setError(null);
        try {
            const typedarray = new Uint8Array(await file.arrayBuffer());
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += `--- PAGE ${i} ---\n`;
                fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n\n';
            }
            setText(fullText);
        } catch(e) {
            setError("Failed to extract text from PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">View the text of a PDF in a clean format.</p>
            </div>
            <div className="space-y-4">
                 <FileUploader onFileSelected={handleFile} acceptedTypes="application/pdf" label="Upload a PDF" />
                 {isLoading && <p>Loading...</p>}
                 {text && (
                     <textarea readOnly value={text} rows={20} className="w-full input-style font-mono" />
                 )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
