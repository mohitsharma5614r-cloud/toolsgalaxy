import React, { useState } from 'react';
import { generateEmailResponse } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Professional', 'Friendly', 'Direct', 'Polite', 'Enthusiastic'];

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Generating smart replies...</p>
        <style>{`
            .dark .quill-body { fill: #cbd5e1; }
            .dark .quill-nib { fill: #0f172a; }
            .dark .scroll-line { stroke: #818cf8; }
            .scroll-line { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-scroll 1.5s 0.5s forwards; }
            .quill-body, .quill-nib { animation: move-quill 2s forwards; }
            @keyframes draw-scroll { to { stroke-dashoffset: 0; } }
            @keyframes move-quill {
                0% { transform: translate(-20px, 20px) rotate(15deg); }
                25% { transform: translate(0, 0) rotate(15deg); }
                100% { transform: translate(80px, 0) rotate(15deg); }
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

export const EmailResponseSuggestor: React.FC<{ title: string }> = ({ title }) => {
    const [receivedEmail, setReceivedEmail] = useState('');
    const [context, setContext] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!receivedEmail.trim() || !context.trim()) {
            setError("Please fill in both the received email and the context for your reply.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateEmailResponse(receivedEmail, context, tone);
            setSuggestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate responses.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get AI-powered suggestions for professional email replies.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <h2 className="text-xl font-bold">1. Your Inputs</h2>
                        <label>Email you received:</label>
                        <textarea value={receivedEmail} onChange={e => setReceivedEmail(e.target.value)} rows={6} placeholder="Paste the email here..." className="input-style w-full"/>
                        <label>Main point of your reply:</label>
                        <textarea value={context} onChange={e => setContext