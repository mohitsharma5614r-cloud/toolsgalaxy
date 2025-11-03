import React, { useState } from 'react';
import { generateAdCopy, AdCopy } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Persuasive', 'Urgent', 'Professional', 'Friendly', 'Humorous'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="cart-loader mx-auto">
            <div className="cart-body"></div>
            <div className="cart-wheels"></div>
            <div className="item i1"></div>
            <div className="item i2"></div>
            <div className="item i3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Writing persuasive copy...</p>
        <style>{`
            .cart-loader {
                width: 100px;
                height: 80px;
                position: relative;
                animation: move-cart 2.5s infinite linear;
            }
            .cart-body {
                width: 80%;
                height: 70%;
                background: #cbd5e1;
                border-radius: 8px;
                position: absolute;
                bottom: 20px;
            }
            .dark .cart-body { background: #475569; }
            .cart-wheels {
                position: absolute;
                bottom: 0;
                left: 10px;
                width: 60px;
                display: flex;
                justify-content: space-between;
            }
            .cart-wheels::before, .cart-wheels::after {
                content: '';
                width: 20px;
                height: 20px;
                background: #64748b;
                border-radius: 50%;
                animation: spin-wheels 0.5s infinite linear;
            }
            .dark .cart-wheels::before, .dark .cart-wheels::after { background: #94a3b8; }

            .item {
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                top: 0;
                left: 50%;
                opacity: 0;
                animation: drop-item 2.5s infinite;
            }
            .i1 { background: #ef4444; animation-delay: 0.2s; }
            .i2 { background: #3b82f6; animation-delay: 0.8s; }
            .i3 { background: #22c55e; animation-delay: 1.4s; }

            @keyframes move-cart {
                0%, 100% { transform: translateX(-20px); }
                50% { transform: translateX(20px); }
            }
            @keyframes spin-wheels {
                from { transform: rotate(0deg); } to { transform: rotate(360deg); }
            }
            @keyframes drop-item {
                0%, 100% { opacity: 0; top: 0; }
                20% { opacity: 1; }
                40% { top: 25px; opacity: 0; }
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
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const AdCopyGenerator: React.FC = () => {
    const [productInfo, setProductInfo] = useState('');
    const [tone, setTone] = useState(tones[0]);
    const [adCopy, setAdCopy] = useState<AdCopy | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!productInfo.trim()) {
            setError("Please describe your product.");
            return;
        }
        setIsLoading(true);
        setAdCopy(null);
        setError(null);

        try {
            const result = await generateAdCopy(productInfo, tone);
            setAdCopy(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate ad copy.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Ad Copy Generator 📢</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create persuasive copy for your advertisements.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product/Service Description</label>
                        <textarea rows={4} value={productInfo} onChange={e => setProductInfo(e.target.value)} placeholder="e.g., A smart coffee mug that keeps your drink at the perfect temperature for hours." className="w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ad Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || !productInfo.trim()} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                        {isLoading ? 'Generating...' : 'Generate Ad Copy'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : adCopy ? (
                        <div className="w-full space-y-4 animate-fade-in">
                            <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-slate-500 dark:text-slate-400">Headline</h3>
                                    <CopyButton textToCopy={adCopy.headline} />
                                </div>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{adCopy.headline}</p>
                            </div>
                            <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-slate-500 dark:text-slate-400">Body</h3>
                                    <CopyButton textToCopy={adCopy.body} />
                                </div>
                                <p className="text-md text-slate-600 dark:text-slate-300">{adCopy.body}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400 p-10">
                            <p className="text-lg">Your ad copy will appear here.</p>
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
