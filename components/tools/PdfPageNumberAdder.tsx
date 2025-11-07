import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="pdf-loader mx-auto">
             <div className="page-number">1</div>
             <div className="page-number">2</div>
             <div className="page-number">3</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Adding page numbers...</p>
        <style>{`
            .pdf-loader { width: 80px; height: 100px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: relative; overflow: hidden; }
            .dark .pdf-loader { background: #334155; border-color: #64748b; }
            .page-number { position: absolute; bottom: 5px; right: 5px; font-size: 12px; font-weight: bold; color: #64748b; animation: count-up 3s infinite steps(3, end); }
            .page-number:nth-child(2) { animation-delay: 1s; }
            .page-number:nth-child(3) { animation-delay: 2s; }
            @keyframes count-up { 0% { content: "1"; opacity: 1; } 33% { content: "2"; } 66% { content: "3"; } 100% { opacity: 0; } }
            .pdf-loader::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(#f1f5f9 2px, transparent 2px); background-size: 100% 10px; }
            .dark .pdf-loader::before { background: linear-gradient(#1e293b 2px, transparent 2px); background-size: 100% 10px; }
        `}</style>
    </div>
);

export const PdfPageNumberAdder: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState('bottom-center');
    const [startNumber, setStartNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (uploadedFile: File) => {
        setFile(uploadedFile);
    };

    const handleAddNumbers = async () => {
        if (!file) {
            setError("Please upload a PDF file first.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                const pageNumber = (i + startNumber).toString();

                let x, y;
                const margin = 50;
                
                if (position.includes('bottom')) y = margin;
                if (position.includes('top')) y = height - margin;
                if (position.includes('center')) x = width / 2;
                if (position.includes('left')) x = margin;
                if (position.includes('right')) x = width - margin;

                const textWidth = helveticaFont.widthOfTextAtSize(pageNumber, 12);
                let finalX = x;
                if (position.includes('center')) finalX = x - textWidth / 2;
                if (position.includes('right')) finalX = x - textWidth;
                
                page.drawText(pageNumber, {
                    x: finalX,
                    y,
                    font: helveticaFont,
                    size: 12,
                    color: rgb(0, 0, 0)
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `numbered-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
            
        } catch (e) {
            console.error(e);
            setError("Failed to add page numbers. The PDF might be corrupted or protected.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Add automatic page numbering to your PDF files</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload PDF File</label>
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                file ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-red-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                                {file ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div className="text-left">
                                            <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setFile(null)} className="ml-auto p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        {/* Settings */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Position</label>
                                <select value={position} onChange={e => setPosition(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all">
                                    <option value="bottom-center">Bottom Center</option>
                                    <option value="bottom-right">Bottom Right</option>
                                    <option value="bottom-left">Bottom Left</option>
                                    <option value="top-center">Top Center</option>
                                    <option value="top-right">Top Right</option>
                                    <option value="top-left">Top Left</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Number</label>
                                <input type="number" min="1" value={startNumber} onChange={e => setStartNumber(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all" />
                            </div>
                        </div>

                        {/* Action Button */}
                        <button onClick={handleAddNumbers} disabled={!file} className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            <span>Add Page Numbers & Download</span>
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
