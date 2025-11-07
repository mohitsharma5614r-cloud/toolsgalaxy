import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type TabType = 'merge' | 'split' | 'compress';

const Loader: React.FC<{ action: string }> = ({ action }) => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{action}...</p>
    </div>
);

export const PdfMergeSplitCompress: React.FC<{ title: string }> = ({ title }) => {
    const [activeTab, setActiveTab] = useState<TabType>('merge');
    const [files, setFiles] = useState<File[]>([]);
    const [splitRange, setSplitRange] = useState('1-5');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setError('');
        }
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please upload at least 2 PDF files to merge');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'merged.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Failed to merge PDFs: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSplit = async () => {
        if (files.length === 0) {
            setError('Please upload a PDF file to split');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const arrayBuffer = await files[0].arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            
            // Parse range (e.g., "1-5" or "1,3,5")
            const ranges = splitRange.split(',').map(r => r.trim());
            
            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                const newPdf = await PDFDocument.create();
                
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(n => parseInt(n.trim()) - 1);
                    for (let pageNum = start; pageNum <= end && pageNum < pdf.getPageCount(); pageNum++) {
                        const [copiedPage] = await newPdf.copyPages(pdf, [pageNum]);
                        newPdf.addPage(copiedPage);
                    }
                } else {
                    const pageNum = parseInt(range) - 1;
                    if (pageNum >= 0 && pageNum < pdf.getPageCount()) {
                        const [copiedPage] = await newPdf.copyPages(pdf, [pageNum]);
                        newPdf.addPage(copiedPage);
                    }
                }

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `split-${i + 1}.pdf`;
                link.click();
                URL.revokeObjectURL(url);
            }
        } catch (err: any) {
            setError(`Failed to split PDF: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompress = async () => {
        if (files.length === 0) {
            setError('Please upload a PDF file to compress');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const arrayBuffer = await files[0].arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            
            // Basic compression by re-saving
            const pdfBytes = await pdf.save({
                useObjectStreams: true,
                addDefaultPage: false,
            });

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compressed-${files[0].name}`;
            link.click();
            URL.revokeObjectURL(url);

            const originalSize = files[0].size;
            const compressedSize = pdfBytes.length;
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            
            if (compressedSize >= originalSize) {
                setError('PDF is already optimized. No further compression possible.');
            }
        } catch (err: any) {
            setError(`Failed to compress PDF: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = () => {
        if (activeTab === 'merge') handleMerge();
        else if (activeTab === 'split') handleSplit();
        else if (activeTab === 'compress') handleCompress();
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Merge, split, and compress your PDF files</p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-6">
                    <button 
                        onClick={() => { setActiveTab('merge'); setFiles([]); setError(''); }} 
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                            activeTab === 'merge' 
                                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        📄 Merge PDFs
                    </button>
                    <button 
                        onClick={() => { setActiveTab('split'); setFiles([]); setError(''); }} 
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                            activeTab === 'split' 
                                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        ✂️ Split PDF
                    </button>
                    <button 
                        onClick={() => { setActiveTab('compress'); setFiles([]); setError(''); }} 
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                            activeTab === 'compress' 
                                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        🗜️ Compress PDF
                    </button>
                </div>

                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <Loader action={activeTab === 'merge' ? 'Merging PDFs' : activeTab === 'split' ? 'Splitting PDF' : 'Compressing PDF'} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {activeTab === 'merge' ? 'Upload Multiple PDFs' : 'Upload PDF File'}
                            </label>
                            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-orange-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <label className="cursor-pointer">
                                    <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-sm text-slate-500">
                                        {activeTab === 'merge' ? 'Select multiple PDF files' : 'PDF files only'}
                                    </p>
                                    <input 
                                        type="file" 
                                        accept="application/pdf" 
                                        multiple={activeTab === 'merge'}
                                        onChange={handleFileSelect} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Selected Files */}
                        {files.length > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Selected Files:</h3>
                                <div className="space-y-2">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-slate-700 dark:text-slate-300">{file.name}</span>
                                            <span className="text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Split Range Input */}
                        {activeTab === 'split' && files.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Page Range
                                </label>
                                <input 
                                    type="text"
                                    value={splitRange}
                                    onChange={(e) => setSplitRange(e.target.value)}
                                    placeholder="e.g., 1-5 or 1,3,5 or 1-3,5-7"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Examples: "1-5" (pages 1 to 5), "1,3,5" (specific pages), "1-3,5-7" (multiple ranges)
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button 
                            onClick={handleAction}
                            disabled={files.length === 0}
                            className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>
                                {activeTab === 'merge' && 'Merge PDFs & Download'}
                                {activeTab === 'split' && 'Split PDF & Download'}
                                {activeTab === 'compress' && 'Compress PDF & Download'}
                            </span>
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
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
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
