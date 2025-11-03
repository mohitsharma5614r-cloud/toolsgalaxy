import React, { useState } from 'react';
import { generateFakeIdentity, FakeIdentity } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="fingerprint-loader mx-auto">
            <svg viewBox="0 0 100 100">
                <path d="M 50,2 A 48,48 0 0 1 50,98" />
                <path d="M 50,8 A 42,42 0 0 1 50,92" />
                <path d="M 50,14 A 36,36 0 0 1 50,86" />
                <path d="M 50,20 A 30,30 0 0 1 50,80" />
                <path d="M 50,26 A 24,24 0 0 1 50,74" />
                <path d="M 50,32 A 18,18 0 0 1 50,68" />
                <path d="M 50,38 A 12,12 0 0 1 50,62" />
                <path d="M 50,44 A 6,6 0 0 1 50,56" />
            </svg>
            <div className="scanner-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating secure identity...</p>
    </div>
);

export const FakeIdentityGenerator: React.FC = () => {
    const [identity, setIdentity] = useState<FakeIdentity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setIdentity(null);
        setError(null);
        setCopied(false);

        try {
            const result = await generateFakeIdentity();
            setIdentity(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate an identity.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatForCopy = (): string => {
        if (!identity) return '';
        return `Name: ${identity.fullName}\nDOB: ${identity.dateOfBirth} (Age ${identity.age})\nLocation: ${identity.location}\nOccupation: ${identity.occupation}\nBio: ${identity.bio}`;
    };

    const handleCopy = () => {
        const textToCopy = formatForCopy();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Fake Identity Generator 🕵️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a complete, fictional identity for creative purposes.</p>
                </div>

                <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : identity ? (
                        <div className="animate-fade-in w-full text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img src={`data:image/jpeg;base64,${identity.image}`} alt="Generated profile" className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-700" />
                                <div className="flex-grow">
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{identity.fullName}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{identity.occupation}</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p><strong className="font-semibold text-slate-600 dark:text-slate-400">Born:</strong> {identity.dateOfBirth} (Age {identity.age})</p>
                                <p><strong className="font-semibold text-slate-600 dark:text-slate-400">From:</strong> {identity.location}</p>
                                <p><strong className="font-semibold text-slate-600 dark:text-slate-400">Bio:</strong> {identity.bio}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">Click the button to generate an identity.</p>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate New Identity'}
                    </button>
                    {identity && (
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                        >
                            {copied ? 'Copied!' : 'Copy Info'}
                        </button>
                    )}
                </div>
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6">
                    This tool is for creative and entertainment purposes only (e.g., writing, role-playing). Do not use for any illicit activities.
                </p>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .fingerprint-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .fingerprint-loader svg {
                    width: 100%;
                    height: 100%;
                    stroke: #9ca3af; /* slate-400 */
                    stroke-width: 2;
                    fill: none;
                    stroke-linecap: round;
                }
                .dark .fingerprint-loader svg { stroke: #64748b; }
                .fingerprint-loader svg path {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: draw-print 2.5s ease-out forwards;
                }
                .scanner-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: #6366f1; /* indigo-500 */
                    box-shadow: 0 0 8px #6366f1;
                    animation: scan-print 2.5s ease-in-out forwards;
                }
                 .dark .scanner-line { background: #818cf8; box-shadow: 0 0 8px #818cf8; }

                @keyframes draw-print {
                    to { stroke-dashoffset: 0; }
                }

                @keyframes scan-print {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </>
    );
};
