
// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="compare-loader mx-auto">
            <div className="page-left"></div>
            <div className="page-right"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .compare-loader { width: 120px; height: 80px; position: relative; }
            .page-left, .page-right { width: 50px; height: 70px; background: #fff; border: 2px solid #9ca3af; border-radius: 4px; position: absolute; top: 5px; animation: compare-anim 2s infinite ease-in-out; }
            .dark .page-left, .dark .page-right { background: #334155; border-color: #64748b; }
            .page-left { left: 0; } .page-right { right: 0; }
            @keyframes compare-anim { 0%,100%{transform:translateX(0)} 25%{transform:translateX(5px)} 50%{transform:translateX(0)} 75%{transform:translateX(-5px)} }
            .page-right { animation-direction: reverse; }
        `}</style>
    </div>
);

const renderPage = async (pdf, pageNum, canvas) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    return context.getImageData(0, 0, canvas.width, canvas.height);
};


export const PdfCompareTool: React.FC<{ title: string }> = ({ title }) => {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleCompare = async () => {
        if (!file1 || !file2) {
            setError("Please upload both PDF files.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setComparisonResult(null);

        try {
            const [bytes1, bytes2] = await Promise.all([file1.arrayBuffer(), file2.arrayBuffer()]);
            const [pdf1, pdf2] = await Promise.all([
                pdfjsLib.getDocument(new Uint8Array(bytes1)).promise,
                pdfjsLib.getDocument(new Uint8Array(bytes2)).promise
            ]);

            const numPages = Math.min(pdf1.numPages, pdf2.numPages);
            const canvas = canvasRef.current;
            if(!canvas) throw new Error("Canvas not found");

            const tempCanvas1 = document.createElement('canvas');
            const tempCanvas2 = document.createElement('canvas');

            const [pageData1, pageData2] = await Promise.all([
                renderPage(pdf1, 1, tempCanvas1),
                renderPage(pdf2, 1, tempCanvas2)
            ]);
            
            canvas.width = Math.max(pageData1.width, pageData2.width);
            canvas.height = Math.max(pageData1.height, pageData2.height);
            const ctx = canvas.getContext('2d');

            ctx.putImageData(pageData1, 0, 0);
            ctx.globalCompositeOperation = 'difference';
            ctx.putImageData(pageData2, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            
            // Invert the difference to make it stand out
            const diffData = ctx.getImageData(0,0,canvas.width, canvas.height);
            for(let i = 0; i < diffData.data.length; i+=4){
                if(diffData.data[i] > 0 || diffData.data[i+1] > 0 || diffData.data[i+2] > 0) {
                     diffData.data[i] = 255; // Red
                     diffData.data[i+1] = 0;
                     diffData.data[i+2] = 0;
                     diffData.data[i+3] = 255;
                }
            }
            ctx.putImageData(pageData1, 0, 0); // redraw base image
            ctx.globalAlpha = 0.5;
            ctx.putImageData(diffData, 0, 0);
            ctx.globalAlpha = 1.0;

            setComparisonResult(canvas.toDataURL());

        } catch (e) {
            setError("Failed to compare PDFs. Files may be corrupted or have different dimensions.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compare two PDF files and highlight their differences (first page only).</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Comparing documents..." /></div>
                ) : comparisonResult ? (
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Comparison Result (Differences in Red)</h2>
                        <img src={comparisonResult} alt="Comparison result" className="max-w-full h-auto border rounded-md shadow-inner" />
                        <button onClick={() => setComparisonResult(null)} className="mt-6 btn-primary">Compare Again</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileUploader onFileSelected={setFile1} acceptedTypes="application/pdf" label="Upload Original PDF" />
                            <FileUploader onFileSelected={setFile2} acceptedTypes="application/pdf" label="Upload Revised PDF" />
                        </div>
                        <button onClick={handleCompare} disabled={!file1 || !file2} className="w-full btn-primary text-lg">
                            Compare Files
                        </button>
                    </div>
                )}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
