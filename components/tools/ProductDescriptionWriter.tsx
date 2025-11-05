
import React, { useState } from 'react';
import { generateProductDescription } from '../../services/geminiService';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="tag-loader mx-auto">
            <div className="tag-body">
                <div className="tag-hole"></div>
            </div>
            <div className="tag-string"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing persuasive copy...</p>
        <style>{`
            .tag-loader {
                width: 80px;
                height: 120px;
                position: relative;
            }
            .tag-body {
                width: 100%;
                height: 100px;
                background: #f1f5f9; /* slate-100 */
                border: 3px solid #9ca3af; /* slate-400 */
                border-radius: 8px 8px 20px 20px;
                position: absolute;
                bottom: 0;
            }
            .dark .tag-body { background: #334155; border-color: #64748b; }
            .tag-hole {
                width: 12px;
                height: 12px;
                border: 3px solid #9ca3af;
                border-radius: 50%;
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            }
            .dark .tag-hole { border-color: #64748b; }
            .tag-string {
                width: 30px;
                height: 30px;
                border: 3px solid #9ca3af;
                border-radius: 50%;
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%) rotate(45deg);
                border-color: transparent #9ca3af #9ca3af transparent;
                animation: swing-tag 2s infinite ease-in-out;
            }
            .dark .tag-string { border-color: transparent #64748b #64748b transparent; }

            @keyframes swing-tag {
                0%, 100% { transform: translateX(-50%) rotate(45deg); }
                50% { transform: translateX(-50%) rotate(-15deg); }
            }
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
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md"
        >
            {copied ? 'Copied!' : 'Copy Description'}
        </button>
    );
};

export const ProductDescriptionWriter: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [features, setFeatures] = useState('');
    const [description, setDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!productName.trim() || !features.trim()) {
            setError("Please fill in both product name and features.");
            return;
        }
        setIsLoading(true);
        setDescription(null);
        setError(null);

        try {
            const result = await generateProductDescription(productName, features);
            setDescription(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate a description.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Product Description Writer 🛍️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Write compelling product descriptions that sell.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                        <input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., Artisan Roasted Coffee Beans" className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Features / Keywords</label>
                        <textarea rows={3} value={features} onChange={e => setFeatures(e.target.value)} placeholder="e.g., Single-origin, ethically sourced, dark roast, notes of chocolate and cherry" className="w-full input-style" />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !productName.trim() || !features.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        {isLoading ? 'Generating...' : 'Generate Description'}
                    </button>
                </div>

                <div className="mt-8 min-h-[300px] flex flex-col p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : description ? (
                        <div className="w-full animate-fade-in text-center">
                            <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-w-none text-left">
                                {description}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <CopyButton textToCopy={description} />
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your product description will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
