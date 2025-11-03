import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
// @ts-ignore
import JSZip from 'jszip';

export const BatchImageExporter: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleExport = useCallback(async () => {
        if (files.length === 0) {
            setError("Please select at least one image file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const zip = new JSZip();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Canvas context not available");

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const image = new Image();
                image.src = URL.createObjectURL(file);
                
                await new Promise((resolve, reject) => {
                    image.onload = () => {
                        canvas.width = image.width;
                        canvas.height = image.height;
                        ctx.filter = 'grayscale(100%)';
                        ctx.drawImage(image, 0, 0);
                        
                        canvas.toBlob(blob => {
                            if (blob) {
                                zip.file(`grayscale-${file.name}`, blob);
                                setProgress(((i + 1) / files.length) * 100);
                                resolve(true);
                            } else {
                                reject(new Error('Failed to create blob from canvas'));
                            }
                        }, 'image/jpeg', 0.9);
                    };
                    image.onerror = reject;
                });
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'batch-export.zip';
            a.click();
            URL.revokeObjectURL(url);
            setFiles([]);

        } catch (e) {
            setError("An error occurred during batch processing.");
        } finally {
            setIsLoading(false);
        }
    }, [files]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Apply a grayscale filter to multiple images and download as a ZIP.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="text-center">
                        <p>Processing {files.length} images...</p>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        <p>{Math.round(progress)}%</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <label className="btn-primary w-full text-center cursor-pointer block">
                            <span>Select Images</span>
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                        {files.length > 0 && 
                            <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                                <p>{files.length} file(s) selected:</p>
                                {files.map((f, i) => <p key={i} className="text-sm p-1 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{f.name}</p>)}
                            </div>
                        }
                        <button onClick={handleExport} disabled={files.length === 0} className="w-full btn-primary text-lg">Export Grayscale as ZIP</button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
