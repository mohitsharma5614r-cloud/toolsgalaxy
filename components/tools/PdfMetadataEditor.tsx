import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';

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
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Edit title, author, subject, and keywords of your PDF</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {!file ? (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload PDF File</label>
                        <div className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-green-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <label className="cursor-pointer">
                                <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-slate-600 dark:text-slate-400 mb-2 text-lg">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-500">PDF files only</p>
                                <input type="file" accept="application/pdf" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" />
                            </label>
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        {/* File Info */}
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button onClick={() => setFile(null)} className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Metadata Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Title
                                </label>
                                <input 
                                    type="text"
                                    value={metadata.title} 
                                    onChange={e => setMetadata({...metadata, title: e.target.value})} 
                                    placeholder="Enter PDF title"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Author
                                </label>
                                <input 
                                    type="text"
                                    value={metadata.author} 
                                    onChange={e => setMetadata({...metadata, author: e.target.value})} 
                                    placeholder="Enter author name"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Subject
                                </label>
                                <input 
                                    type="text"
                                    value={metadata.subject} 
                                    onChange={e => setMetadata({...metadata, subject: e.target.value})} 
                                    placeholder="Enter subject or description"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Keywords
                                </label>
                                <input 
                                    type="text"
                                    value={metadata.keywords} 
                                    onChange={e => setMetadata({...metadata, keywords: e.target.value})} 
                                    placeholder="Enter keywords separated by commas"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-1">Example: PDF, Document, Report, 2024</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button 
                            onClick={handleSave} 
                            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            <span>Save Metadata & Download</span>
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
