
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const jspdf: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="doc-loader mx-auto">
            <div className="doc-icon doc-excel">X</div>
            <div className="arrow">→</div>
            <div className="doc-icon doc-pdf">P</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
    </div>
);

export const CsvToPdfConverter: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!file) {
            setError("Please upload a CSV file first.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async (e) => {
                const text = e.target.result as string;
                const rows = text.split('\n').map(row => row.split(','));
                const headers = rows.shift();

                const { jsPDF } = jspdf;
                const doc = new jsPDF();
                
                doc.autoTable({
                    head: [headers],
                    body: rows,
                    startY: 20,
                    styles: {
                        fontSize: 8,
                        cellPadding: 2,
                    },
                    headStyles: {
                        fillColor: [30, 41, 59], // slate-800
                        textColor: 255,
                        fontStyle: 'bold',
                    },
                    alternateRowStyles: {
                        fillColor: [241, 245, 249], // slate-100
                    },
                });

                doc.save(`${file.name.replace(/\.csv$/, '')}.pdf`);
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to process CSV file.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
             <style>{`
                .doc-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
                .doc-icon { width: 60px; height: 80px; border-radius: 8px; font-size: 40px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; }
                .doc-excel { background-color: #1d6f42; }
                .doc-pdf { background-color: #d93831; }
                .arrow { font-size: 40px; font-weight: bold; color: #9ca3af; }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert CSV data into a formatted PDF table.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Creating PDF table..." /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFileSelected={setFile}
                            acceptedTypes=".csv,text/csv"
                            label="Upload a .csv file"
                        />
                        <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">
                            Convert and Download PDF
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
