// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';
import { extractTablesFromPdfText, ExtractedTable } from '../../services/geminiService';

declare const pdfjsLib: any;
declare const JSZip: any;

interface TableResult extends ExtractedTable {
  pageNumber: number;
}

const Loader: React.FC<{ message: string; progress: number }> = ({ message, progress }) => (
    <div className="text-center">
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
        <p className="text-sm mt-2 text-slate-500">{Math.round(progress)}% complete</p>
    </div>
);

const convertToCsv = (headers: string[], rows: string[][]): string => {
    const escapeCell = (cell: string) => `"${String(cell).replace(/"/g, '""')}"`;
    const headerRow = headers.map(escapeCell).join(',');
    const bodyRows = rows.map(row => row.map(escapeCell).join(',')).join('\n');
    return `${headerRow}\n${bodyRows}`;
};

const downloadData = (data: BlobPart, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const ExtractTablesFromPdf: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedTables, setExtractedTables] = useState<TableResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleConvert = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setExtractedTables([]);
        setProgress(0);
        setLoadingMessage('Reading PDF file...');

        try {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(selectedFile);
            fileReader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const allTables: TableResult[] = [];

                    for (let i = 1; i <= pdf.numPages; i++) {
                        setLoadingMessage(`Analyzing Page ${i} of ${pdf.numPages}...`);
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map((item: any) => item.str).join(' ');

                        if (pageText.trim()) {
                            const tablesFromPage = await extractTablesFromPdfText(pageText);
                            tablesFromPage.forEach(table => {
                                allTables.push({ ...table, pageNumber: i });
                            });
                        }
                        setProgress((i / pdf.numPages) * 100);
                    }
                    
                    if (allTables.length === 0) {
                        setError("No tables could be found in this document using AI analysis.");
                    }
                    setExtractedTables(allTables);
                    setIsLoading(false);
                } catch (pdfError) {
                    console.error(pdfError);
                    setError("Could not process the PDF. It may be corrupted or image-based.");
                    setIsLoading(false);
                }
            };
        } catch (e) {
            setError("Failed to read the file.");
            setIsLoading(false);
        }
    }, []);

    const handleDownloadAll = () => {
        if (extractedTables.length === 0) return;
        const zip = new JSZip();
        extractedTables.forEach((table, index) => {
            const csvData = convertToCsv(table.headers, table.rows);
            zip.file(`table_p${table.pageNumber}_${index + 1}.csv`, csvData);
        });
        zip.generateAsync({ type: 'blob' }).then(blob => {
            downloadData(blob, `${file.name.replace(/\.pdf$/, '')}_tables.zip`, 'application/zip');
        });
    };
    
    const handleReset = () => {
        setFile(null);
        setExtractedTables([]);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Accurately extract tables from PDF to other formats.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading && <Loader message={loadingMessage} progress={progress} />}
                
                {!isLoading && extractedTables.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                             <h2 className="text-xl font-bold">Extracted Tables ({extractedTables.length})</h2>
                             <div className="flex gap-2">
                                <button onClick={handleReset} className="btn-secondary">Convert Another</button>
                                <button onClick={handleDownloadAll} className="btn-primary">Download All as ZIP</button>
                             </div>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {extractedTables.map((table, index) => (
                                <div key={index} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">Table from Page {table.pageNumber}</h3>
                                        <button onClick={() => downloadData(convertToCsv(table.headers, table.rows), `table_p${table.pageNumber}_${index + 1}.csv`, 'text/csv;charset=utf-8;')} className="text-sm btn-secondary">
                                            Download CSV
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-200 dark:bg-slate-700">
                                                <tr>{table.headers.map((h, i) => <th key={i} className="p-2">{h}</th>)}</tr>
                                            </thead>
                                            <tbody>
                                                {table.rows.slice(0, 3).map((row, i) => (
                                                    <tr key={i} className="border-b dark:border-slate-700">
                                                        {row.map((cell, j) => <td key={j} className="p-2 truncate max-w-[100px]">{cell}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {table.rows.length > 3 && <p className="text-center text-xs text-slate-400 mt-2">... and {table.rows.length - 3} more rows</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isLoading && extractedTables.length === 0 && (
                    <FileUploader onFileSelected={handleConvert} acceptedTypes="application/pdf" label="Upload a PDF file"/>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
