// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;
declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="crop-loader mx-auto">
            <div className="crop-frame"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .crop-loader { width: 100px; height: 100px; position: relative; border: 3px solid #cbd5e1; border-radius: 4px; }
            .dark .crop-loader { border-color: #475569; }
            .crop-frame { position: absolute; border: 3px solid #4f46e5; animation: crop-anim 2s infinite ease-in-out; }
            @keyframes crop-anim { 0%,100%{top:0;left:0;right:0;bottom:0} 50%{top:20px;left:20px;right:20px;bottom:20px} }
        `}</style>
    </div>
);

export const PdfCropTool: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pagePreview, setPagePreview] = useState<{ url: string; width: number; height: number } | null>(null);
    const [cropBox, setCropBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const startPoint = useRef({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setCropBox(null);
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const context = canvas.getContext('2d');
                await page.render({ canvasContext: context, viewport }).promise;
                setPagePreview({ url: canvas.toDataURL(), width: viewport.width, height: viewport.height });
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to load PDF preview.");
            setIsLoading(false);
        }
    }, []);

    const startCrop = (e: React.MouseEvent) => {
        setIsCropping(true);
        const { left, top } = e.currentTarget.getBoundingClientRect();
        startPoint.current = { x: e.clientX - left, y: e.clientY - top };
        setCropBox({ x: e.clientX - left, y: e.clientY - top, width: 0, height: 0 });
    };

    const doCrop = (e: React.MouseEvent) => {
        if (!isCropping) return;
        const { left, top } = e.currentTarget.getBoundingClientRect();
        const currentX = e.clientX - left;
        const currentY = e.clientY - top;
        setCropBox({
            x: Math.min(startPoint.current.x, currentX),
            y: Math.min(startPoint.current.y, currentY),
            width: Math.abs(currentX - startPoint.current.x),
            height: Math.abs(currentY - startPoint.current.y),
        });
    };

    const endCrop = () => setIsCropping(false);
    
    const handleSave = async () => {
        if (!file || !cropBox || cropBox.width === 0 || cropBox.height === 0) {
            setError("Please select a crop area first.");
            return;
        }
        setIsLoading(true);
        try {
            const { PDFDocument } = PDFLib;
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            for(const page of pages) {
                const { width: pageWidth, height: pageHeight } = page.getSize();
                const scaleX = pageWidth / pagePreview.width;
                const scaleY = pageHeight / pagePreview.height;
                
                const newX = cropBox.x * scaleX;
                const newY = pageHeight - (cropBox.y + cropBox.height) * scaleY;
                const newWidth = cropBox.width * scaleX;
                const newHeight = cropBox.height * scaleY;

                page.setCropBox(newX, newY, newWidth, newHeight);
            }

            const newPdfBytes = await pdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cropped-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            setFile(null); setPagePreview(null); setCropBox(null);
        } catch (e) {
             setError("Failed to crop PDF.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Select a crop area on the first page to apply to the entire document.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && <div className="min-h-[400px] flex items-center justify-center"><Loader message="Processing..." /></div>}
                
                {!file && !isLoading && <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload PDF to Crop" />}
                
                {file && !isLoading && pagePreview && (
                    <div className="space-y-4">
                        <div className="relative w-full mx-auto select-none cursor-crosshair"
                             onMouseDown={startCrop} onMouseMove={doCrop} onMouseUp={endCrop} onMouseLeave={endCrop}
                             style={{ maxWidth: `${pagePreview.width}px` }}>
                            <img src={pagePreview.url} alt="PDF page preview" className="w-full h-auto" />
                            {cropBox && (
                                <div className="absolute border-2 border-dashed border-indigo-500 bg-indigo-500/20"
                                     style={{ left: cropBox.x, top: cropBox.y, width: cropBox.width, height: cropBox.height }}>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => { setFile(null); setPagePreview(null); }} className="btn-secondary">Change PDF</button>
                            <button onClick={handleSave} disabled={!cropBox} className="btn-primary">Crop and Download</button>
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};