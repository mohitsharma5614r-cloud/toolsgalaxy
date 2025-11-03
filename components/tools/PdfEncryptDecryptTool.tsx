
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

export const PdfEncryptDecryptTool: React.FC<{ title: string }> = ({ title }) => {
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) { setError("Please upload a PDF file."); return; }
        if (!password) { setError("Please enter a password."); return; }
        if (mode === 'encrypt' && password !== confirmPassword) { setError("Passwords do not match."); return; }
        
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            let pdfDoc;

            if (mode === 'decrypt') {
                pdfDoc = await PDFDocument.load(existingPdfBytes, { ownerPassword: password, userPassword: password });
            } else { // encrypt
                pdfDoc = await PDFDocument.load(existingPdfBytes);
            }
            
            let pdfBytes;
            if(mode === 'encrypt') {
                pdfBytes = await pdfDoc.save({ userPassword: password, ownerPassword: password });
            } else {
                pdfBytes = await pdfDoc.save();
            }

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${mode}ed-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            // Reset
            setFile(null); setPassword(''); setConfirmPassword('');

        } catch (e) {
            setError(mode === 'decrypt' && e.message.includes('password') ? "Incorrect password." : `Failed to ${mode} PDF.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Encrypt or decrypt PDF files with passwords.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                 <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 mb-6">
                    <button onClick={() => setMode('encrypt')} className={`flex-1 btn-toggle ${mode === 'encrypt' ? 'btn-toggle-active' : ''}`}>Encrypt (Add Password)</button>
                    <button onClick={() => setMode('decrypt')} className={`flex-1 btn-toggle ${mode === 'decrypt' ? 'btn-toggle-active' : ''}`}>Decrypt (Remove Password)</button>
                </div>
                {isLoading ? <p>Processing...</p> : (
                    <div className="space-y-4">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label={`Upload PDF to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`} />
                        {file && (
                            <>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" className="input-style w-full" />
                                {mode === 'encrypt' && <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="input-style w-full" />}
                            </>
                        )}
                        <button onClick={handleProcess} disabled={!file || !password} className="w-full btn-primary text-lg">
                            {mode.charAt(0).toUpperCase() + mode.slice(1)} & Download
                        </button>
                    </div>
                )}
             </div>
             {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
