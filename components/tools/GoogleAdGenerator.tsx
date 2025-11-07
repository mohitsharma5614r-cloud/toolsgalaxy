import React, { useState } from 'react';
import { generateGoogleAds } from '../../services/geminiService';
import { Toast } from '../Toast';

export const GoogleAdGenerator: React.FC = () => {
    const [product, setProduct] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [keywords, setKeywords] = useState('');
    const [adType, setAdType] = useState('search');
    const [ads, setAds] = useState<{headline1: string; headline2: string; headline3: string; description1: string; description2: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!product.trim()) {
            setError("Please enter a product or service.");
            return;
        }
        setIsLoading(true);
        setAds([]);
        setError(null);

        try {
            const result = await generateGoogleAds(product, targetAudience, keywords, adType);
            setAds(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate ads.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyAd = (ad: any) => {
        const text = `Headline 1: ${ad.headline1}\nHeadline 2: ${ad.headline2}\nHeadline 3: ${ad.headline3}\nDescription 1: ${ad.description1}\nDescription 2: ${ad.description2}`;
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Google Ad Generator</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create effective ad copy for Google Ads campaigns.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product/Service</label>
                        <input
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder="e.g., Cloud Storage Solution"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience (Optional)</label>
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g., Small business owners"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords (Optional)</label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g., cloud storage, file backup"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ad Type</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setAdType('search')}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${adType === 'search' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                                Search
                            </button>
                            <button
                                onClick={() => setAdType('display')}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${adType === 'display' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                                Display
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !product.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Google Ads'}
                    </button>
                </div>

                <div className="mt-8 min-h-[250px]">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">Generating ad copy...</p>
                        </div>
                    ) : ads.length > 0 ? (
                        <div className="space-y-4 animate-fade-in">
                            {ads.map((ad, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Ad Variation {idx + 1}</h3>
                                        <button
                                            onClick={() => copyAd(ad)}
                                            className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Headline 1 (30 chars)</p>
                                            <p className="text-blue-600 dark:text-blue-400 font-semibold">{ad.headline1}</p>
                                            <p className="text-xs text-slate-400">{ad.headline1.length}/30</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Headline 2 (30 chars)</p>
                                            <p className="text-blue-600 dark:text-blue-400 font-semibold">{ad.headline2}</p>
                                            <p className="text-xs text-slate-400">{ad.headline2.length}/30</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Headline 3 (30 chars)</p>
                                            <p className="text-blue-600 dark:text-blue-400 font-semibold">{ad.headline3}</p>
                                            <p className="text-xs text-slate-400">{ad.headline3.length}/30</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description 1 (90 chars)</p>
                                            <p className="text-slate-700 dark:text-slate-300">{ad.description1}</p>
                                            <p className="text-xs text-slate-400">{ad.description1.length}/90</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description 2 (90 chars)</p>
                                            <p className="text-slate-700 dark:text-slate-300">{ad.description2}</p>
                                            <p className="text-xs text-slate-400">{ad.description2.length}/90</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <p className="text-lg">Your Google Ads will appear here.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Google Ads Best Practices:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Headlines: Max 30 characters each</li>
                        <li>• Descriptions: Max 90 characters each</li>
                        <li>• Include keywords naturally</li>
                        <li>• Add a clear call-to-action</li>
                        <li>• Test multiple variations</li>
                    </ul>
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
            `}</style>
        </>
    );
};
