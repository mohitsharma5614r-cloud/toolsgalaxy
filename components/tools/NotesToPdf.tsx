
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af" />
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155" />
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Creating your PDF...</p>
        <style>{`
            .dark .quill-body { fill: #cbd5e1; }
            .dark .quill-nib { fill: #0f172a; }
            .dark .scroll-line { stroke: #818cf8; }

            .scroll-line {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-scroll 1.5s 0.5s forwards;
            }

            .quill-body, .quill-nib {
                animation: move-quill 2s forwards;
            }

            @keyframes draw-scroll {
                to { stroke-dashoffset: 0; }
            }

            @keyframes move-quill {
                0% { transform: translate(-20px, 20px) rotate(15deg); }
                25% { transform: translate(0, 0) rotate(15deg); }
                100% { transform: translate(80px, 0) rotate(15deg); }
            }
        `}</style>
    </div>
);

export const NotesToPdf: React.FC<{ title: string }> = ({ title }) => {
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
            const lineHeight = fontSize * 1.4;
            
            const lines = text.split('\n');

            for (const line of lines) {
                let currentLine = line;
                while(currentLine.length > 0) {
                    if (y < margin) {
                        page = pdfDoc.addPage();
                        y = height - margin;
                    }
                    let breakPoint = currentLine.length;
                    let textWidth = font.widthOfTextAtSize(currentLine, fontSize);
                    
                    if (textWidth > width - 2 * margin) {
                        let approxBreakPoint = Math.floor(currentLine.length * ((width - 2 * margin) / textWidth));
                        let lastSpace = currentLine.lastIndexOf(' ', approxBreakPoint);
                        breakPoint = lastSpace > 0 ? lastSpace : approxBreakPoint;
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
                    if(currentLine.length === 0){
                         y -= lineHeight;
                    }
                }
                 if(line.length === 0){
                    if (y < margin) {
                        page = pdfDoc.addPage();
                        y = height - margin;
                    }
                    y -= lineHeight;
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "notes.pdf";
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
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Turn your plain text notes into a PDF document.</p>
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
                            placeholder="Type or paste your notes here..."
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
                 .input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
            `}</style>
        </div>
    );
};
