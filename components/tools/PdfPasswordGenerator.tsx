import React, { useState, useEffect } from 'react';
import { Toast } from '../Toast';

export const PdfPasswordGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const generatePassword = () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let charset = lower + upper;
        if (includeNumbers) charset += numbers;
        if (includeSymbols) charset += symbols;

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
    };

    useEffect(() => {
        generatePassword();
    }, [length, includeNumbers, includeSymbols]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setToastMessage("Password copied to clipboard!");
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a strong, secure password for your PDF.</p>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        value={password}
                        readOnly
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-4 pr-24 text-2xl font-mono text-center"
                    />
                    <button onClick={handleCopy} className="absolute top-1/2 right-3 -translate-y-1/2 btn-secondary text-sm">Copy</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="label-style">Length: {length}</label>
                        <input type="range" min="8" max="32" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full range-style" />
                    </div>
                    <div className="flex justify-around">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} className="h-5 w-5 rounded" />
                            Include Numbers (0-9)
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} className="h-5 w-5 rounded" />
                            Include Symbols (!@#)
                        </label>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button onClick={generatePassword} className="btn-primary">
                        Generate New Password
                    </button>
                </div>
            </div>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
             <style>{`
                 .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                 .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
            `}</style>
        </>
    );
};