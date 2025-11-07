import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Creating PDF from images...</p>
    </div>
);

export const ImageToPdfConverter: React.FC<{ title: string }> = ({ title }) => {
    const [images, setImages] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(files);
            setError('');

            // Create previews
            const previewUrls = await Promise.all(
                files.map(file => {
                    return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                })
            );
            setPreviews(previewUrls);
        }
    };

    const handleConvert = async () => {
        if (images.length === 0) {
            setError('Please select at least one image');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const pdfDoc = await PDFDocument.create();

            for (const imageFile of images) {
                const imageBytes = await imageFile.arrayBuffer();
                let image;

                // Embed image based on type
                if (imageFile.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else {
                    // Convert other formats to PNG first using canvas
                    const img = await createImageBitmap(imageFile);
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const pngBlob = await new Promise<Blob>((resolve) => {
                            canvas.toBlob((blob) => resolve(blob!), 'image/png');
                        });
                        const pngBytes = await pngBlob.arrayBuffer();
                        image = await pdfDoc.embedPng(pngBytes);
                    } else {
                        continue;
                    }
                }

                // Create page with image dimensions
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'images-to-pdf.pdf';
            link.click();
            URL.revokeObjectURL(url);

        } catch (err: any) {
            setError(`Failed to create PDF: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        const newImages = [...images];
        const newPreviews = [...previews];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < images.length) {
            [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
            [newPreviews[index], newPreviews[newIndex]] = [newPreviews[newIndex], newPreviews[index]];
            setImages(newImages);
            setPreviews(newPreviews);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Combine JPG, PNG, and more into a single PDF</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Images</label>
                            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-cyan-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <label className="cursor-pointer">
                                    <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-sm text-slate-500">JPG, PNG, GIF, BMP, WebP (multiple files)</p>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        onChange={handleImageSelect} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Selected Images ({images.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all">
                                            <img 
                                                src={previews[index]} 
                                                alt={image.name}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => moveImage(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-2 bg-white/90 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Move up"
                                                >
                                                    <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => moveImage(index, 'down')}
                                                    disabled={index === images.length - 1}
                                                    className="p-2 bg-white/90 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Move down"
                                                >
                                                    <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="p-2 bg-red-500/90 rounded-lg hover:bg-red-500"
                                                    title="Remove"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-slate-800">
                                                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{image.name}</p>
                                                <p className="text-xs text-slate-500">{(image.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <div className="absolute top-2 left-2 bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Info */}
                        {images.length > 0 && (
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-cyan-700 dark:text-cyan-300">
                                        <p className="font-semibold mb-1">Tips</p>
                                        <ul className="list-disc list-inside space-y-1 text-cyan-600 dark:text-cyan-400">
                                            <li>Images will appear in PDF in the order shown</li>
                                            <li>Use arrow buttons to reorder images</li>
                                            <li>Each image will be on a separate page</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button 
                            onClick={handleConvert}
                            disabled={images.length === 0}
                            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Convert to PDF & Download</span>
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
