// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Creating your PDF...</p>
    </div>
);

export const TextToPdfConverter: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!text.trim()) {
            setError("Please enter some text to convert.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument, StandardFonts, rgb } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            let page = pdfDoc.addPage();
            
            const { width, height } = page.getSize();
            const fontSize = 12;
            const margin = 50;
            let y = height - margin;
            
            const lines = text.split('\n');

            for (const line of lines) {
                let currentLine = line;
                while(currentLine.length > 0) {
                    if (y < margin) {
                        page = pdfDoc.addPage();
                        y = height - margin;
                    }
                    let textWidth = font.widthOfTextAtSize(currentLine, fontSize);
                    let breakPoint = currentLine.length;
                    
                    while (textWidth > width - 2 * margin) {
                        breakPoint = Math.floor(breakPoint * ((width - 2 * margin) / textWidth));
                        // Find the last space before the breakpoint
                        const lastSpace = currentLine.lastIndexOf(' ', breakPoint);
                        if(lastSpace > 0) breakPoint = lastSpace;
                        textWidth = font.widthOfTextAtSize(currentLine.substring(0, breakPoint), fontSize);
                    }
                    
                    const textToDraw = currentLine.substring(0, breakPoint);
                    page.drawText(textToDraw, {
                        x: margin,
                        y,
                        font,
                        size: fontSize,
                        color: rgb(0, 0, 0),
                    });
                    
                    currentLine = currentLine.substring(breakPoint).trim();
                    y -= fontSize * 1.2; // Move to the next line
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "text-to-pdf.pdf";
            link.click();
            URL.revokeObjectURL(url);

        } catch (e) {
            setError("Failed to create PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert plain text files into PDF documents.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={15}
                            placeholder="Type or paste your text here..."
                            className="w-full input-style font-mono"
                        />
                        <button onClick={handleConvert} disabled={!text.trim()} className="w-full btn-primary text-lg">
                            Convert and Download PDF
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                 .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
            `}</style>
        </div>
    );
};
