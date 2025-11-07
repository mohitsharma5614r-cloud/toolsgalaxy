import React, { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="watermark-loader mx-auto">
            <div className="page-content"></div>
            <div className="watermark-text">DRAFT</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Applying watermark...</p>
    </div>
);

export const PdfWatermarkAdder: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
    const [text, setText] = useState('CONFIDENTIAL');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [opacity, setOpacity] = useState(0.3);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        if (watermarkType === 'text' && !text.trim()) {
            setError("Please enter watermark text.");
            return;
        }
        if (watermarkType === 'image' && !imageFile) {
            setError("Please upload a watermark image.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            let watermarkImage, watermarkDims;
            if (watermarkType === 'image' && imageFile) {
                const imageBytes = await imageFile.arrayBuffer();
                const imageType = imageFile.type;
                watermarkImage = imageType.includes('png') 
                    ? await pdfDoc.embedPng(imageBytes)
                    : await pdfDoc.embedJpg(imageBytes);
                watermarkDims = watermarkImage.scale(0.5);
            }

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                if (watermarkType === 'text') {
                    const textWidth = font.widthOfTextAtSize(text, 50);
                    const textHeight = font.heightAtSize(50);
                    page.drawText(text, {
                        x: width / 2 - textWidth / 2,
                        y: height / 2 - textHeight / 2,
                        size: 50,
                        font: font,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity: opacity,
                        rotate: degrees(-45)
                    });
                } else if (watermarkImage) {
                    page.drawImage(watermarkImage, {
                        x: width / 2 - watermarkDims.width / 2,
                        y: height / 2 - watermarkDims.height / 2,
                        width: watermarkDims.width,
                        height: watermarkDims.height,
                        opacity: opacity,
                        rotate: degrees(-45),
                    });
                }
            }

            const newPdfBytes = await pdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `watermarked-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to add watermark. The file might be corrupted or protected.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Overlay text or image watermark on your PDF</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        {/* PDF Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload PDF File</label>
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                file ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                                {file ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div className="text-left">
                                            <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setFile(null)} className="ml-auto p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        {/* Watermark Type Tabs */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Watermark Type</label>
                            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                                <button 
                                    onClick={() => setWatermarkType('text')} 
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                        watermarkType === 'text' 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Text Watermark
                                </button>
                                <button 
                                    onClick={() => setWatermarkType('image')} 
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                        watermarkType === 'image' 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Image Watermark
                                </button>
                            </div>
                        </div>

                        {/* Watermark Input */}
                        {watermarkType === 'text' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Watermark Text</label>
                                <input 
                                    type="text" 
                                    value={text} 
                                    onChange={e => setText(e.target.value)} 
                                    placeholder="Enter watermark text (e.g., CONFIDENTIAL)" 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Watermark Image</label>
                                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                    imageFile ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-pink-500'
                                }`}>
                                    {imageFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-medium text-slate-900 dark:text-white">{imageFile.name}</span>
                                            <button onClick={() => setImageFile(null)} className="ml-auto p-1 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded">
                                                <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <svg className="w-12 h-12 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">PNG or JPG image</p>
                                            <input type="file" accept="image/png, image/jpeg" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Opacity Slider */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Opacity: <span className="text-purple-600 font-semibold">{Math.round(opacity * 100)}%</span>
                            </label>
                            <input 
                                type="range" 
                                min="0.1" 
                                max="1" 
                                step="0.1" 
                                value={opacity} 
                                onChange={e => setOpacity(parseFloat(e.target.value))} 
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Action Button */}
                        <button 
                            onClick={handleProcess} 
                            disabled={!file} 
                            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            <span>Apply Watermark & Download</span>
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
