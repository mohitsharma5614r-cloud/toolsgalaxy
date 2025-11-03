// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-img">🖼️</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-pdf">P</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Creating your PDF...</p>
        <style>{`
            .doc-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
            .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
            .doc-img { background-color: #34d399; animation: pulse-img 2s infinite; }
            .doc-pdf { background-color: #d93831; animation: pulse-pdf 2s infinite; }
            .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            @keyframes pulse-img { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes pulse-pdf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        `}</style>
    </div>
);


export const ImageToPdf: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) {
            setError("Please upload at least one image.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const page = pdfDoc.addPage();
                const { width, height } = page.getSize();
                
                let imageBytes;
                if (file.type === 'image/jpeg') {
                    imageBytes = await pdfDoc.embedJpg(await file.arrayBuffer());
                } else if (file.type === 'image/png') {
                    imageBytes = await pdfDoc.embedPng(await file.arrayBuffer());
                } else {
                    continue; // Skip unsupported formats
                }

                const dims = imageBytes.scaleToFit(width, height);
                page.drawImage(imageBytes, {
                    x: (width - dims.width) / 2,
                    y: (height - dims.height) / 2,
                    width: dims.width,
                    height: dims.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError("Failed to convert images. Please ensure they are valid JPG or PNG files.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Combine JPG, PNG, and more into a single PDF.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 border-2 border-dashed rounded-xl text-center">
                            <input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
                                Select Images
                            </button>
                            <p className="text-xs text-slate-400 mt-2">Supports JPG & PNG</p>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-semibold">{files.length} image(s) selected:</h3>
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                                    {files.map((file, i) => <p key={i} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{file.name}</p>)}
                                </div>
                            </div>
                        )}
                        
                        <button onClick={handleConvert} disabled={files.length === 0} className="w-full btn-primary text-lg">
                            Convert to PDF
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};