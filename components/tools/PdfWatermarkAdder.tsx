// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

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
            const { PDFDocument, rgb, degrees } = PDFLib;
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            let watermarkImage, watermarkDims;
            if (watermarkType === 'image' && imageFile) {
                const imageBytes = await imageFile.arrayBuffer();
                watermarkImage = await pdfDoc.embedPng(imageBytes);
                watermarkDims = watermarkImage.scale(0.5);
            }

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                if (watermarkType === 'text') {
                    page.drawText(text, {
                        x: width / 2,
                        y: height / 2,
                        size: 50,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity: opacity,
                        rotate: degrees(-45),
                        xAlign: 'center',
                        yAlign: 'center'
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
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Overlay text or an image as a watermark on your PDF.</p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload PDF" />
                        
                        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setWatermarkType('text')} className={`tab ${watermarkType==='text' && 'tab-active'}`}>Text Watermark</button>
                            <button onClick={() => setWatermarkType('image')} className={`tab ${watermarkType==='image' && 'tab-active'}`}>Image Watermark</button>
                        </div>

                        {watermarkType === 'text' ? (
                            <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Watermark Text" className="input-style w-full" />
                        ) : (
                            <input type="file" accept="image/png, image/jpeg" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="input-file-style" />
                        )}

                        <div>
                            <label className="label-style">Opacity: {Math.round(opacity * 100)}%</label>
                            <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full" />
                        </div>
                        
                        <button onClick={handleProcess} disabled={!file} className="w-full btn-primary text-lg">
                            Apply Watermark & Download
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
