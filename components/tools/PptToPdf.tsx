// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pptx: any;
declare const jspdf: any;
declare const html2canvas: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="convert-loader mx-auto">
            <div className="doc-icon doc-ppt">P</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-pdf">P</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .convert-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
            .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
            .doc-ppt { background-color: #d24726; animation: pulse-ppt 2s infinite; }
            .doc-pdf { background-color: #d93831; animation: pulse-pdf 2s infinite; }
            .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; animation: fade-arrow 2s infinite; }
            @keyframes pulse-ppt { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes pulse-pdf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes fade-arrow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        `}</style>
    </div>
);

export const PptToPdf: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const handleConvert = async () => {
        if (!file) {
            setError("Please upload a PPTX file first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const container = previewContainerRef.current;
            if (!container) throw new Error("Preview container not found.");
            
            // Render the PPTX into the hidden div
            await pptx.render(file, container, null);

            const slides = container.querySelectorAll('.pptx-viewer-slide-item');
            if (slides.length === 0) throw new Error("Could not render any slides from the file.");
            
            const { jsPDF } = jspdf;
            let pdf;

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i] as HTMLElement;
                const canvas = await html2canvas(slide, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');

                if (i === 0) {
                     pdf = new jsPDF({
                        orientation: canvas.width > canvas.height ? 'l' : 'p',
                        unit: 'px',
                        format: [canvas.width, canvas.height],
                    });
                } else {
                    pdf.addPage([canvas.width, canvas.height], canvas.width > canvas.height ? 'l' : 'p');
                }
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                setProgress(((i + 1) / slides.length) * 100);
            }
            
            pdf.save(`${file.name.replace(/\.pptx?$/, '')}.pdf`);
            container.innerHTML = ''; // Clean up

        } catch (e) {
            console.error(e);
            setError("Failed to convert file. It may be corrupted or in an unsupported format.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Turn your PowerPoint presentations into PDFs.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[250px] flex flex-col items-center justify-center">
                        <Loader message="Converting PPT to PDF..." />
                         <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                        </div>
                        <p className="text-sm mt-2 text-slate-500">{Math.round(progress)}% complete</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={setFile}
                            acceptedTypes=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                            label="Upload a .pptx file"
                        />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">
                            Convert and Download PDF
                        </button>
                        <p className="text-xs text-center text-slate-400">Note: This tool converts each slide into a non-editable image in the PDF.</p>
                    </div>
                )}
            </div>
            {/* Hidden container for rendering */}
            <div ref={previewContainerRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', background: 'white' }}></div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
