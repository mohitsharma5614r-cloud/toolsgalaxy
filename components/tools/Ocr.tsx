import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { extractTextFromImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="ocr-loader mx-auto">
            <div className="scanner-line"></div>
            <div className="text-line t1"></div>
            <div className="text-line t2"></div>
            <div className="text-line t3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Reading text from image...</p>
        <style>{`
            .ocr-loader { width: 100px; height: 80px; position: relative; border: 3px solid #9ca3af; border-radius: 4px; overflow: hidden; }
            .dark .ocr-loader { border-color: #64748b; }
            .scanner-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #6366f1; box-shadow: 0 0 10px #6366f1; animation: ocr-scan 2.5s infinite ease-in-out; }
            .dark .scanner-line { background: #818cf8; box-shadow: 0 0 10px #818cf8; }
            .text-line { position: absolute; left: 10%; height: 5px; background: #cbd5e1; border-radius: 2px; }
            .dark .text-line { background: #475569; }
            .t1 { top: 20%; width: 80%; }
            .t2 { top: 45%; width: 60%; }
            .t3 { top: 70%; width: 70%; }
            @keyframes ocr-scan { 0%, 100% { top: 0; } 50% { top: 100%; } }
        `}</style>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            disabled={!textToCopy}
            className="w-full px-4 py-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md"
        >
            {copied ? 'Copied!' : 'Copy Text'}
        </button>
    );
};

// FIX: Added title prop to component
export const Ocr: React.FC<{ title: string }> = ({ title }) => {
    const [image, setImage] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setImage(file);
        setIsLoading(true);
        setError(null);
        setExtractedText('');

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const text = await extractTextFromImage(base64, mimeType);
            setExtractedText(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Extract text from any image with AI.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ImageUploader onImageUpload={handleImageUpload} />
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">Extracted Text</h2>
                        <div className="min-h-[250px] bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full"><Loader /></div>
                            ) : (
                                <textarea
                                    readOnly
                                    value={extractedText}
                                    rows={10}
                                    className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-mono text-sm"
                                    placeholder="Text from your image will appear here..."
                                />
                            )}
                        </div>
                        <CopyButton textToCopy={extractedText} />
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};