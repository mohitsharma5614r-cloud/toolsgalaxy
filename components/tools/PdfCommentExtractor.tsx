
// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="comment-loader mx-auto">
            <div className="page-lines"></div>
            <div className="comment-bubble"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .comment-loader { width: 80px; height: 100px; position: relative; }
            .page-lines { position: absolute; inset: 0; background-image: repeating-linear-gradient(#cbd5e1 0 2px, transparent 2px 10px); border: 2px solid #cbd5e1; border-radius: 4px; }
            .dark .page-lines { background-image: repeating-linear-gradient(#475569 0 2px, transparent 2px 10px); border-color: #475569; }
            .comment-bubble { width: 50px; height: 40px; background: #f59e0b; border-radius: 50% / 40% 40% 60% 60%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pop-bubble 2s infinite ease-in-out; }
            .dark .comment-bubble { background: #fcd34d; }
            @keyframes pop-bubble { 0%, 100% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 50% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        `}</style>
    </div>
);

export const PdfCommentExtractor: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [comments, setComments] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setComments([]);
        
        try {
            const { PDFDocument, PDFName } = PDFLib;
            const pdfBytes = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const extractedComments: string[] = [];

            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const annots = page.node.Annots();
                if (annots) {
                    for (let j = 0; j < annots.size(); j++) {
                        const annot = annots.lookup(j);
                        const subtype = annot.get(PDFName.of('Subtype'));
                        if (subtype === PDFName.of('Text')) { // '/Text' annotations are comments
                            const content = annot.get(PDFName.of('Contents'));
                            if (content) {
                                extractedComments.push(`Page ${i + 1}: ${content.toString()}`);
                            }
                        }
                    }
                }
            }
            
            if (extractedComments.length === 0) {
                 setError("No text comments found in this PDF.");
            } else {
                 setComments(extractedComments);
            }
        } catch (e) {
            setError("Failed to read comments. The PDF may be protected or use an unsupported format.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Extract all text comments and annotations from a PDF into a list.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Extracting comments..." /></div>
                )}

                {!isLoading && comments.length === 0 && (
                    <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF with Comments" />
                )}

                {!isLoading && comments.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Extracted Comments</h2>
                        <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto space-y-2">
                           {comments.map((comment, i) => <p key={i} className="text-sm p-2 border-b dark:border-slate-700">{comment}</p>)}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button onClick={() => { setFile(null); setComments([]); }} className="btn-secondary">Check Another PDF</button>
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
