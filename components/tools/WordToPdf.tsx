// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const docx: any;
declare const jspdf: any;
declare const html2canvas: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-word">W</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-pdf">P</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Converting to PDF...</p>
        <style>{`
            .doc-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
            .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
            .doc-word { background-color: #2b579a; animation: pulse-word 2s infinite; }
            .doc-pdf { background-color: #d93831; animation: pulse-pdf 2s infinite; }
            .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            @keyframes pulse-word { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
            @keyframes pulse-pdf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        `}</style>
    </div>
);

export const WordToPdf: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const docxContainerRef = useRef<HTMLDivElement>(null);

    const handleFile = (uploadedFile: File) => {
        setFile(uploadedFile);
    };

    const handleConvert = async () => {
        if (!file) {
            setError("Please upload a DOCX file first.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const docxContainer = docxContainerRef.current;
            if (!docxContainer) throw new Error("Preview container not found.");
            
            docxContainer.innerHTML = ''; // Clear previous render

            // Render the docx file into the hidden div
            await docx.renderAsync(file, docxContainer);

            // Use html2canvas to capture the rendered content
            const canvas = await html2canvas(docxContainer, {
                scale: 2, // Improve quality
                useCORS: true,
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'l' : 'p',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${file.name.replace(/\.docx$/, '')}.pdf`);

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
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Turn your Word documents into PDFs while preserving layout.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={handleFile}
                            acceptedTypes=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            label="Upload a .docx file"
                        />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">
                            Convert and Download PDF
                        </button>
                    </div>
                )}
            </div>
            {/* Hidden container for rendering */}
            <div ref={docxContainerRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', background: 'white', padding: '1in' }}></div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
