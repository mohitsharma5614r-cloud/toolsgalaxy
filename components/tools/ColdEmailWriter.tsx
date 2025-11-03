import React, { useState } from 'react';
import { generateColdEmails, Email } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="email-loader mx-auto">
            <div className="envelope">
                <div className="envelope-flap"></div>
                <div className="email-paper"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing your cold emails...</p>
        <style>{`
            .email-loader { width: 100px; height: 100px; position: relative; }
            .envelope {
                width: 100px; height: 60px;
                background: #cbd5e1; /* slate-300 */
                position: absolute;
                bottom: 0;
                border-radius: 4px;
            }
            .dark .envelope { background: #475569; }
            .envelope-flap {
                width: 0; height: 0;
                border-style: solid;
                border-width: 30px 50px 0 50px;
                border-color: #94a3b8 transparent transparent transparent; /* slate-400 */
                position: absolute;
                top: 0;
                transform-origin: 50% 0;
                animation: open-flap 2.5s infinite;
            }
            .dark .envelope-flap { border-color: #64748b transparent transparent transparent; }
            .email-paper {
                width: 90px; height: 50px;
                background: white;
                border-radius: 4px;
                position: absolute;
                bottom: 2px; left: 5px;
                animation: send-email 2.5s infinite;
            }
            .dark .email-paper { background: #1e293b; }

            @keyframes open-flap {
                0%, 100% { transform: rotateX(0deg); }
                50% { transform: rotateX(180deg); }
            }
            @keyframes send-email {
                0%, 40%, 100% { transform: translateY(0); }
                90% { transform: translateY(-70px); }
            }
        `}</style>
    </div>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const ColdEmailWriter: React.FC<{ title: string }> = ({ title }) => {
    const [myName, setMyName] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [myProduct, setMyProduct] = useState('');
    const [theirPainPoint, setTheirPainPoint] = useState('');
    const [goal, setGoal] = useState('Book a 15-minute meeting');
    
    const [emails, setEmails] = useState<Email[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!myName || !recipientName || !myProduct || !theirPainPoint || !goal) {
            setError("Please fill out all fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateColdEmails(myName, recipientName, myProduct, theirPainPoint, goal);
            setEmails(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate emails.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate effective cold emails to reach out to prospects.</p>
                </div>
                 <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> :
                     emails ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-center">Your Cold Email Variations</h2>
                            {emails.map((email, index) => (
                                <div key={index} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Subject: {email.subject}</h3>
                                        <CopyButton textToCopy={`Subject: ${email.subject}\n\n${email.body}`} />
                                    </div>
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{email.body}</pre>
                                </div>
                            ))}
                             <div className="text-center pt-4"><button onClick={() => setEmails(null)} className="btn-primary">Create New Emails</button></div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={myName} onChange={e => setMyName(e.target.value)} placeholder="Your Name/Company" className="input-style w-full"/>
                                <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Recipient's Name/Company" className="input-style w-full"/>
                            </div>
                            <input value={myProduct} onChange={e => setMyProduct(e.target.value)} placeholder="Your Product/Service" className="input-style w-full"/>
                            <textarea value={theirPainPoint} onChange={e => setTheirPainPoint(e.target.value)} rows={3} placeholder="Their potential pain point you solve" className="input-style w-full"/>
                            <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Your goal (e.g., book a meeting)" className="input-style w-full"/>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg !mt-6">Write Emails</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};