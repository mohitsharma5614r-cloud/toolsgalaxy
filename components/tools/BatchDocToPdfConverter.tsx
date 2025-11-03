
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const docx: any;
declare const jspdf: any;
declare const html2canvas: any;
declare const JSZip: any;

const Loader: React.FC<{ message: string, progress: number }> = ({ message, progress }) => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-word">W</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-pdf">P</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
         <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

export const BatchDocToPdfConverter: React.FC<{ title: string }> = ({ title }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (files.length === 0) {
            setError("Please upload at least one DOCX file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const zip = new JSZip();
            const docxContainer = document.createElement('div');
            docxContainer.style.position = 'absolute';
            docxContainer.style.left = '-9999px';
            document.body.appendChild(docxContainer);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                docxContainer.innerHTML = '';
                await docx.renderAsync(file, docxContainer);

                const canvas = await html2canvas(docxContainer, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = jspdf;
                const pdf = new jsPDF({
                    orientation: canvas.width > canvas.height ? 'l' : 'p',
                    unit: 'px',
                    format: [canvas.width, canvas.height],
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                const pdfBlob = pdf.output('blob');
                zip.file(`${file.name.replace(/\.docx$/, '')}.pdf`, pdfBlob);
                setProgress(((i + 1) / files.length) * 100);
            }
            
            document.body.removeChild(docxContainer);
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted-docs.zip';
            link.click();
            URL.revokeObjectURL(url);
            setFiles([]);

        } catch (e) {
            setError("Failed to convert files. One or more may be corrupted.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .doc-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
                .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
                .doc-word { background-color: #2b579a; }
                .doc-pdf { background-color: #d93831; }
                .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Batch convert multiple DOCX documents to PDF.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message={`Converting file ${Math.ceil(progress / (100 / files.length))} of ${files.length}...`} progress={progress} /></div>
                ) : (
                    <div className="space-y-6">
                        <input type="file" multiple accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="input-file-style" />
                        {files.length > 0 && 
                            <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                                {files.map((f, i) => <p key={i} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md truncate">{f.name}</p>)}
                            </div>
                        }
                        <button onClick={handleConvert} disabled={files.length === 0} className="w-full btn-primary text-lg">
                            Convert All and Download ZIP
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
