
// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const jspdf: any;
declare const html2canvas: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
         <div className="convert-loader mx-auto">
            <div className="icon html-icon">&lt;/&gt;</div>
            <div className="icon pdf-icon">PDF</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
    </div>
);

export const HtmlToPdfConverter: React.FC<{ title: string }> = ({ title }) => {
    const [htmlContent, setHtmlContent] = useState('<h1>Hello World</h1><p>This is some sample HTML content. You can paste your own here.</p>');
    const [mode, setMode] = useState<'paste' | 'upload'>('paste');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleFileSelect = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => setHtmlContent(e.target.result as string);
        reader.readAsText(file);
    };
    
    const handleConvert = async () => {
        if (!htmlContent.trim()) {
            setError("Please provide some HTML content.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { jsPDF } = jspdf;
            const content = previewRef.current;
            if(!content) throw new Error("Preview element not found.");

            const canvas = await html2canvas(content, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save("converted.pdf");
        } catch(e) {
            setError("Failed to convert HTML. There might be an issue with the content.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .convert-loader { width: 100px; height: 100px; position: relative; }
                .icon { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: bold; border-radius: 50%; animation: morph 3s infinite; }
                .pdf-icon { background: #ef4444; color: white; animation-delay: 1.5s; }
                .html-icon { background: #3b82f6; color: white; animation-delay: 0s; }
                @keyframes morph { 0%, 100% { opacity: 1; transform: scale(1); } 50%, 99% { opacity: 0; transform: scale(0.5); } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert web pages or HTML files to PDF.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Converting HTML to PDF..." /></div>
                ) : (
                    <div className="space-y-6">
                         <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                            <button onClick={() => setMode('paste')} className={`tab ${mode === 'paste' && 'tab-active'}`}>Paste Code</button>
                            <button onClick={() => setMode('upload')} className={`tab ${mode === 'upload' && 'tab-active'}`}>Upload File</button>
                        </div>
                        {mode === 'paste' ? (
                            <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)} rows={10} placeholder="Paste your HTML here" className="w-full input-style font-mono" />
                        ) : (
                            <FileUploader onFileSelected={handleFileSelect} acceptedTypes=".html,.htm" label="Upload .html File" />
                        )}
                        <button onClick={handleConvert} disabled={!htmlContent.trim()} className="w-full btn-primary text-lg">Convert and Download PDF</button>
                    </div>
                )}
            </div>
            {/* Hidden div for rendering HTML to be captured */}
            <div className="absolute -left-[9999px] top-0 p-4 bg-white" style={{ width: '8.5in' }} ref={previewRef} dangerouslySetInnerHTML={{__html: htmlContent}} />
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
