
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
declare const JSZip: any;

export const PdfToZipCompressor: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files).filter(f => f.type === 'application/pdf'));
        }
    };

    const handleCreateZip = async () => {
        if (files.length === 0) {
            setError("Please select at least one PDF file.");
            return;
        }
        setIsLoading(true);
        try {
            const zip = new JSZip();
            for (const file of files) {
                zip.file(file.name, file);
            }
            const zipBlob = await zip.generateAsync({ type: 'blob', compression: "DEFLATE", compressionOptions: { level: 9 } });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compressed-pdfs.zip';
            a.click();
            URL.revokeObjectURL(url);
            setFiles([]);
        } catch(e) {
            setError("Failed to create ZIP file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Compress one or more PDF documents into a ZIP file.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                 <button onClick={() => fileInputRef.current?.click()} className="w-full btn-primary">Select PDFs</button>
                 <input type="file" multiple accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                 {files.length > 0 && 
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                        {files.map((f, i) => <p key={i} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{f.name}</p>)}
                    </div>
                }
                 <button onClick={handleCreateZip} disabled={isLoading || files.length === 0} className="w-full btn-primary text-lg">Compress & Download ZIP</button>
             </div>
             {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
