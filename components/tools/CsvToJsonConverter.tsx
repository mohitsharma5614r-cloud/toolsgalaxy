
import React, { useState, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

// Loader component for this tool
const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="data-loader mx-auto">
            <div className="grid">
                <div className="cell"></div><div className="cell"></div>
                <div className="cell"></div><div className="cell"></div>
            </div>
            <div className="arrow">→</div>
            <div className="json-obj">{"{ }"}</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .data-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
            .grid { display: grid; grid-template-columns: repeat(2, 20px); gap: 5px; animation: pulse-grid 2s infinite ease-in-out; }
            .cell { width: 20px; height: 20px; background-color: #cbd5e1; }
            .dark .cell { background-color: #475569; }
            .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            .json-obj { font-size: 40px; font-weight: bold; font-family: monospace; color: #6366f1; animation: pulse-json 2s infinite ease-in-out; }
            .dark .json-obj { color: #818cf8; }
            @keyframes pulse-grid { 0%,100%{transform:scale(1)} 50%{transform:scale(0.9)} }
            @keyframes pulse-json { 0%,100%{transform:scale(0.9)} 50%{transform:scale(1)} }
        `}</style>
    </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="btn-secondary">
            {copied ? 'Copied!' : 'Copy JSON'}
        </button>
    );
};

const DownloadButton: React.FC<{ text: string, fileName: string }> = ({ text, fileName }) => {
    const handleDownload = () => {
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace(/\.csv$/, '.json');
        a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <button onClick={handleDownload} className="btn-primary">
            Download .json File
        </button>
    );
};

// Robust CSV row parser to handle quotes
const parseCsvRow = (row: string): string[] => {
    const values: string[] = [];
    let currentVal = '';
    let inQuote = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"' && (i === 0 || row[i - 1] !== '\\')) {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            values.push(currentVal.trim());
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal.trim());
    return values.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
};


export const CsvToJsonConverter: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [jsonOutput, setJsonOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = useCallback((selectedFile: File) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsLoading(true);
        setError(null);
        setJsonOutput('');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                if (!text) {
                    throw new Error("File is empty.");
                }
                const lines = text.trim().split(/\r?\n/);
                const headers = parseCsvRow(lines[0]);
                const result = [];

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    const values = parseCsvRow(lines[i]);
                    const obj: { [key: string]: string } = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    result.push(obj);
                }

                setJsonOutput(JSON.stringify(result, null, 2));

            } catch (err) {
                console.error(err);
                setError("Failed to parse CSV. Please ensure it's a valid CSV file.");
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
            setIsLoading(false);
        };
        reader.readAsText(selectedFile);
    }, []);

    const handleReset = () => {
        setFile(null);
        setJsonOutput('');
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert your CSV files to JSON format locally in your browser.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isLoading && (
                    <div className="min-h-[250px] flex items-center justify-center">
                        <Loader message="Converting..." />
                    </div>
                )}

                {!isLoading && !jsonOutput && (
                    <FileUploader
                        onFileSelected={handleConvert}
                        acceptedTypes=".csv,text/csv"
                        label="Upload a .csv file"
                    />
                )}

                {!isLoading && jsonOutput && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Conversion Successful!</h2>
                        <textarea
                            readOnly
                            value={jsonOutput}
                            rows={15}
                            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 font-mono text-xs"
                        />
                        <div className="flex flex-wrap justify-center gap-4">
                            <CopyButton text={jsonOutput} />
                            <DownloadButton text={jsonOutput} fileName={file?.name || 'data.csv'} />
                            <button onClick={handleReset} className="btn-secondary">Convert Another</button>
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
