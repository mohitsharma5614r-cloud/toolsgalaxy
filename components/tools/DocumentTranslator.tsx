// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="translator-loader mx-auto">
            <div className="globe">
                 <div className="char c1">A</div>
                 <div className="char c2">आ</div>
                 <div className="char c3">文</div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .translator-loader { width: 100px; height: 100px; position: relative; }
            .globe { width: 100%; height: 100%; border-radius: 50%; background: #a5b4fc; border: 3px solid #6366f1; animation: spin-globe 8s linear infinite; position: relative; }
            .dark .globe { background: #4f46e5; border-color: #818cf8; }
            .char { position: absolute; font-size: 24px; font-weight: bold; color: white; opacity: 0; animation: pop-char 4s infinite; }
            .c1 { top: 20%; left: 20%; animation-delay: 0s; }
            .c2 { top: 60%; left: 30%; animation-delay: 1.3s; }
            .c3 { top: 40%; left: 70%; animation-delay: 2.6s; }
            @keyframes spin-globe { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pop-char { 0%, 100% { opacity: 0; transform: scale(0.5); } 25%, 50% { opacity: 1; transform: scale(1.2); } 75%, 100% { opacity: 0; } }
        `}</style>
    </div>
);

export const DocumentTranslator: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExtractAndTranslate = async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setOriginalText('');
        setTranslatedText('');

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
                }
                setOriginalText(fullText);
                // Mock translation
                setTranslatedText("Offline translation is a complex feature not implemented in this demo. The text has been successfully extracted from your PDF without uploading it.");
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to process the PDF file.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Translate document text without uploading your files.</p>
            </div>
            
            {!file && !isLoading && (
                 <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <FileUploader onFileSelected={handleExtractAndTranslate} acceptedTypes="application/pdf" label="Upload PDF to Translate" />
                 </div>
            )}

            {(file || isLoading) && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? (
                        <div className="min-h-[400px] flex items-center justify-center"><Loader message="Extracting text securely..." /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold mb-2">Original Text</h3>
                                <textarea readOnly value={originalText} rows={15} className="w-full input-style font-mono text-sm" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Translated Text</h3>
                                <textarea readOnly value={translatedText} rows={15} className="w-full input-style font-mono text-sm" />
                            </div>
                        </div>
                    )}
                </div>
            )}
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
