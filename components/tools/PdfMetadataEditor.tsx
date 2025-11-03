// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="metadata-loader mx-auto">
            <div className="tag">Title: ...</div>
            <div className="tag">Author: ...</div>
            <div className="tag">Subject: ...</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Reading and writing metadata...</p>
    </div>
);

export const PdfMetadataEditor: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({ title: '', author: '', subject: '', keywords: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            if (!file) return;
            setIsLoading(true);
            try {
                const { PDFDocument } = PDFLib;
                const existingPdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                
                setMetadata({
                    title: pdfDoc.getTitle() || '',
                    author: pdfDoc.getAuthor() || '',
                    subject: pdfDoc.getSubject() || '',
                    keywords: pdfDoc.getKeywords() || '',
                });
            } catch (e) {
                setError("Could not read metadata from this PDF.");
            }
            setIsLoading(false);
        };
        fetchMetadata();
    }, [file]);

    const handleSave = async () => {
        if (!file) {
            setError("Please upload a PDF file first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            pdfDoc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `metadata-edited-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to save metadata.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Edit the Title, Author, Subject, and Keywords of your PDF.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? (
                    <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload PDF to View Metadata" />
                ) : isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Editing Metadata for: {file.name}</h2>
                        <div>
                            <label className="label-style">Title</label>
                            <input value={metadata.title} onChange={e => setMetadata({...metadata, title: e.target.value})} className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Author</label>
                            <input value={metadata.author} onChange={e => setMetadata({...metadata, author: e.target.value})} className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Subject</label>
                            <input value={metadata.subject} onChange={e => setMetadata({...metadata, subject: e.target.value})} className="input-style w-full"/>
                        </div>
                         <div>
                            <label className="label-style">Keywords (comma separated)</label>
                            <input value={metadata.keywords} onChange={e => setMetadata({...metadata, keywords: e.target.value})} className="input-style w-full"/>
                        </div>
                        <button onClick={handleSave} className="w-full btn-primary text-lg mt-6">Save and Download</button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
