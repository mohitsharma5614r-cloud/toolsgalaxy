
// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="bookmark-loader mx-auto">
            <div className="page-edge"></div>
            <div className="bookmark b1"></div>
            <div className="bookmark b2"></div>
            <div className="bookmark b3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .bookmark-loader { width: 80px; height: 100px; position: relative; }
            .page-edge { width: 100%; height: 100%; background: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 4px; }
            .dark .page-edge { background: #334155; border-color: #475569; }
            .bookmark { position: absolute; width: 15px; height: 25px; right: -10px; background: #ef4444; animation: slide-out 2s infinite ease-in-out; }
            .b1 { top: 10px; background: #f97316; animation-delay: 0s; }
            .b2 { top: 40px; background: #eab308; animation-delay: 0.2s; }
            .b3 { top: 70px; background: #84cc16; animation-delay: 0.4s; }
            @keyframes slide-out { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        `}</style>
    </div>
);

const BookmarkItem: React.FC<{ item: any }> = ({ item }) => (
    <li className="ml-4">
        <span className="text-sm">{item.title}</span>
        {item.children && item.children.length > 0 && (
            <ul className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                {item.children.map((child, index) => <BookmarkItem key={index} item={child} />)}
            </ul>
        )}
    </li>
);


export const PdfBookmarkManager: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setBookmarks([]);
        
        try {
            const { PDFDocument } = PDFLib;
            const pdfBytes = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const outlines = pdfDoc.getOutlines();

            const buildTree = (nodes) => {
                if (!nodes || nodes.length === 0) return [];
                return nodes.map(node => ({
                    title: node.getTitle(),
                    children: buildTree(node.children),
                }));
            };

            const bookmarkTree = buildTree(outlines);
            
            if (bookmarkTree.length === 0) {
                 setError("No bookmarks (outline) found in this PDF.");
            } else {
                 setBookmarks(bookmarkTree);
            }
        } catch (e) {
            setError("Failed to read bookmarks. The PDF might be corrupted or not have a standard outline structure.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">View the bookmarks (outline) of your PDF document.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Reading bookmarks..." /></div>
                )}

                {!isLoading && !file && (
                    <FileUploader onFileSelected={processFile} acceptedTypes="application/pdf" label="Upload a PDF with Bookmarks" />
                )}

                {!isLoading && file && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Bookmarks for: {file.name}</h2>
                        <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto">
                            {bookmarks.length > 0 ? (
                                <ul className="space-y-1">
                                    {bookmarks.map((item, index) => <BookmarkItem key={index} item={item} />)}
                                </ul>
                            ) : (
                                <p className="text-slate-500">No bookmarks were found in this document.</p>
                            )}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button onClick={() => { setFile(null); setBookmarks([]); }} className="btn-secondary">Check Another PDF</button>
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
