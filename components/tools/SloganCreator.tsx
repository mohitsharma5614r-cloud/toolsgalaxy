import React, { useState } from 'react';
import { generateSlogans } from '../../services/geminiService';
import { Toast } from '../Toast';

const tones = ['Professional', 'Playful', 'Catchy', 'Modern', 'Inspirational'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="lightbulb-loader mx-auto">
            <div className="lightbulb"></div>
            <div className="spark s1"></div>
            <div className="spark s2"></div>
            <div className="spark s3"></div>
            <div className="spark s4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating slogans...</p>
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
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const SloganCreator: React.FC = () => {
    const [productInfo, setProductInfo] = useState('');
    const [tone, setTone] = useState(tones[2]); // Default to 'Catchy'
    const [slogans, setSlogans] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!productInfo.trim()) {
            setError("Please enter a product, brand, or keywords.");
            return;
        }
        setIsLoading(true);
        setSlogans([]);
        setError(null);

        try {
            const result = await generateSlogans(productInfo, tone);
            setSlogans(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate slogans.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Slogan Creator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Instantly create catchy slogans for your business or campaign.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="productInfo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product/Brand or Keywords</label>
                        <input
                            id="productInfo"
                            type="text"
                            value={productInfo}
                            onChange={(e) => setProductInfo(e.target.value)}
                            placeholder="e.g., Nova Coffee, sustainable tech"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Desired Tone</label>
                         <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !productInfo.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Generating...' : 'Generate Slogans'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : slogans.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {slogans.map((slogan, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{slogan}</p>
                                    <CopyButton textToCopy={slogan} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <p className="mt-4 text-lg">Your catchy slogans will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                
                .lightbulb-loader {
                    position: relative;
                    width: 80px;
                    height: 80px;
                }
                .lightbulb {
                    width: 30px;
                    height: 30px;
                    background: #f1c40f;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: light-flicker 2s infinite;
                }
                .lightbulb::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 15px;
                    height: 10px;
                    background: #bdc3c7;
                    border-radius: 3px;
                }
                .spark {
                    position: absolute;
                    width: 4px;
                    height: 12px;
                    background: #f1c40f;
                    border-radius: 2px;
                    opacity: 0;
                }
                .s1 { animation: spark-animation 2s infinite; animation-delay: 0s; top: 10px; left: 50%; transform-origin: 50% 100%; }
                .s2 { animation: spark-animation 2s infinite; animation-delay: 0.5s; top: 50%; left: 90%; transform-origin: 0 50%; }
                .s3 { animation: spark-animation 2s infinite; animation-delay: 1s; bottom: 10px; left: 50%; transform-origin: 50% 0; }
                .s4 { animation: spark-animation 2s infinite; animation-delay: 1.5s; top: 50%; right: 90%; transform-origin: 100% 50%; }

                @keyframes light-flicker {
                    0%, 100% { box-shadow: 0 0 5px #f1c40f, 0 0 10px #f1c40f; opacity: 0.8; }
                    50% { box-shadow: 0 0 20px #f1c40f, 0 0 30px #f1c40f, 0 0 40px #f39c12; opacity: 1; }
                }
                @keyframes spark-animation {
                    0% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
                    20% { transform: scaleY(1) rotate(var(--angle, 0deg)); opacity: 1; }
                    50% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
                    100% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
                }
                
                .s1 { --angle: 0deg; }
                .s2 { --angle: 90deg; }
                .s3 { --angle: 180deg; }
                .s4 { --angle: 270deg; }

            `}</style>
        </>
    );
};
