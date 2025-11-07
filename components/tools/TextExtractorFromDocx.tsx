import React, { useState } from 'react';
import { Toast } from '../Toast';

export const TextExtractorFromDocx: React.FC<{ title: string }> = ({ title }) => {
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
            setError('Please upload a .docx or .txt file');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            if (file.name.endsWith('.txt')) {
                // Simple text file
                const text = await file.text();
                setExtractedText(text);
            } else {
                // For DOCX, we'll use a simple extraction method
                // Note: This is a basic implementation. For full DOCX support, mammoth library would be needed
                const arrayBuffer = await file.arrayBuffer();
                const text = await extractTextFromDocx(arrayBuffer);
                setExtractedText(text);
            }
        } catch (err) {
            setError('Failed to extract text. For best results with DOCX files, try converting to TXT first.');
        } finally {
            setIsProcessing(false);
        }
    };

    const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        // Basic DOCX text extraction using ZIP parsing
        // This is a simplified version - for production, use mammoth.js library
        try {
            const JSZip = (await import('jszip')).default;
            const zip = await JSZip.loadAsync(arrayBuffer);
            const documentXml = await zip.file('word/document.xml')?.async('string');
            
            if (!documentXml) {
                throw new Error('Invalid DOCX file');
            }

            // Extract text from XML (basic parsing)
            const text = documentXml
                .replace(/<[^>]*>/g, ' ') // Remove XML tags
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim();
            
            return text || 'No text found in document';
        } catch (err) {
            throw new Error('Failed to parse DOCX file');
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(extractedText);
    };

    const downloadText = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-text.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Extract all text content from Word documents.</p>
                </div>

                <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept=".docx,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="docx-upload"
                        />
                        <label
                            htmlFor="docx-upload"
                            className="cursor-pointer inline-flex flex-col items-center"
                        >
                            <svg className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Click to upload DOCX file</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">or drag and drop</span>
                        </label>
                    </div>

                    {isProcessing && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">Extracting text...</p>
                        </div>
                    )}

                    {extractedText && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Extracted Text</h3>
                                <div className="flex gap-2">
                                    <button onClick={copyText} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Copy</button>
                                    <button onClick={downloadText} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Download</button>
                                </div>
                            </div>
                            <textarea
                                value={extractedText}
                                readOnly
                                rows={15}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-4 text-slate-900 dark:text-white font-mono text-sm"
                            />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {extractedText.split(/\s+/).length} words • {extractedText.length} characters
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </>
    );
};
