// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;

export const PageToImageSnapshotTool: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pagePreviews, setPagePreviews] = useState<string[]>([]);
    const [selectedPage, setSelectedPage] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setPagePreviews([]);
        setSelectedPage(null);

        try {
            const typedarray = new Uint8Array(await selectedFile.arrayBuffer());
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const previews: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 }); // Low-res for thumbnails
                const canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const context = canvas.getContext('2d');
                await page.render({ canvasContext: context, viewport }).promise;
                previews.push(canvas.toDataURL());
            }
            setPagePreviews(previews);
        } catch (e) {
            setError("Failed to load PDF preview.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleDownload = async () => {
        if (selectedPage === null || !file) return;
        setIsLoading(true);
        try {
            const typedarray = new Uint8Array(await file.arrayBuffer());
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(selectedPage + 1);
            const viewport = page.getViewport({ scale: 3.0 }); // High-res for download
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');
            await page.render({ canvasContext: context, viewport }).promise;
            
            const link = document.createElement('a');
            link.download = `${file.name}-page-${selectedPage + 1}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch(e) {
            setError("Failed to create snapshot.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Take a high-quality snapshot of any PDF page.</p>
            </div>
             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {!file ? <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF" /> :
                 isLoading ? <div className="min-h-[200px] flex items-center justify-center">Loading...</div> :
                 (
                    <div>
                        <p className="text-center font-semibold mb-4">Select a page to take a snapshot:</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                            {pagePreviews.map((src, i) => (
                                <img key={i} src={src} onClick={() => setSelectedPage(i)} className={`cursor-pointer rounded border-4 ${selectedPage === i ? 'border-indigo-500' : 'border-transparent'}`} />
                            ))}
                        </div>
                        {selectedPage !== null && (
                            <div className="text-center mt-6">
                                <button onClick={handleDownload} className="btn-primary text-lg">Download Snapshot of Page {selectedPage + 1}</button>
                            </div>
                        )}
                    </div>
                 )
                }
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
