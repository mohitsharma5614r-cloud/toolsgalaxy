// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="unlock-loader mx-auto">
            <div className="lock-body">
                <div className="lock-shackle"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Attempting to unlock...</p>
        <style>{`
            .unlock-loader { width: 80px; height: 80px; position: relative; }
            .lock-body { width: 50px; height: 40px; background: #64748b; border-radius: 8px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
            .lock-shackle { width: 30px; height: 25px; border: 8px solid #64748b; border-bottom: 0; border-radius: 15px 15px 0 0; position: absolute; top: -25px; left: 10px; transform-origin: 0 100%; animation: unlock-anim 2s infinite ease-in-out; }
            .dark .lock-body, .dark .lock-shackle { background-color: #94a3b8; border-color: #94a3b8; }
            @keyframes unlock-anim { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(45deg) translateY(-10px); } }
        `}</style>
    </div>
);

export const PdfUnlocker: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUnlock = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        if (!password) {
            setError("Please enter the password.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            
            const pdfDoc = await PDFDocument.load(existingPdfBytes, {
                ownerPassword: password,
                userPassword: password
            });

            // The document is now loaded (decrypted). We can save it without a password.
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `unlocked-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
            
            // Reset after success
            setFile(null);
            setPassword('');

        } catch (e: any) {
             if(e.name === 'InvalidPDFDataError' && e.message.includes('password')) {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Failed to unlock PDF. It might be corrupted or use unsupported encryption.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Remove passwords and restrictions from PDF files.</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
                    ) : (
                        <div className="space-y-6">
                            <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload Locked PDF" />
                            
                            {file && (
                                <div className="animate-fade-in">
                                    <label className="label-style">PDF Password</label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        placeholder="Enter password..." 
                                        className="input-style w-full" 
                                    />
                                </div>
                            )}
                            
                            <button onClick={handleUnlock} disabled={!file || !password} className="w-full btn-primary text-lg">
                                Unlock and Download
                            </button>
                        </div>
                    )}
                </div>
                {error && <Toast message={error} onClose={() => setError(null)} />}
            </div>
             <style>{`
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1rem; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </>
    );
};
