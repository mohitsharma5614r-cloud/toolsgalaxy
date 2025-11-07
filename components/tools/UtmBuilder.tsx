import React, { useState, useEffect } from 'react';
import { Toast } from '../Toast';

export const UtmBuilder: React.FC = () => {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [source, setSource] = useState('');
    const [medium, setMedium] = useState('');
    const [campaign, setCampaign] = useState('');
    const [term, setTerm] = useState('');
    const [content, setContent] = useState('');
    const [finalUrl, setFinalUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        buildUrl();
    }, [websiteUrl, source, medium, campaign, term, content]);

    const buildUrl = () => {
        if (!websiteUrl.trim()) {
            setFinalUrl('');
            return;
        }

        try {
            const url = new URL(websiteUrl);
            const params = new URLSearchParams();

            if (source) params.append('utm_source', source);
            if (medium) params.append('utm_medium', medium);
            if (campaign) params.append('utm_campaign', campaign);
            if (term) params.append('utm_term', term);
            if (content) params.append('utm_content', content);

            const paramString = params.toString();
            setFinalUrl(paramString ? `${url.origin}${url.pathname}?${paramString}` : websiteUrl);
            setError(null);
        } catch (e) {
            setFinalUrl('');
        }
    };

    const copyToClipboard = () => {
        if (finalUrl) {
            navigator.clipboard.writeText(finalUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const clearAll = () => {
        setWebsiteUrl('');
        setSource('');
        setMedium('');
        setCampaign('');
        setTerm('');
        setContent('');
        setFinalUrl('');
    };

    const presets = {
        facebook: { source: 'facebook', medium: 'social' },
        instagram: { source: 'instagram', medium: 'social' },
        twitter: { source: 'twitter', medium: 'social' },
        linkedin: { source: 'linkedin', medium: 'social' },
        google: { source: 'google', medium: 'cpc' },
        email: { source: 'newsletter', medium: 'email' },
    };

    const applyPreset = (preset: keyof typeof presets) => {
        setSource(presets[preset].source);
        setMedium(presets[preset].medium);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">UTM Builder</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create UTM parameters to track your campaign URLs.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Website URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://www.example.com/page"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Campaign Source <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                placeholder="e.g., google, facebook, newsletter"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Where the traffic comes from</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Campaign Medium <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={medium}
                                onChange={(e) => setMedium(e.target.value)}
                                placeholder="e.g., cpc, email, social"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Marketing medium</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                            placeholder="e.g., spring_sale, product_launch"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Campaign identifier</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Term (Optional)</label>
                            <input
                                type="text"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                placeholder="e.g., running+shoes"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Paid keywords</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Content (Optional)</label>
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="e.g., logolink, textlink"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Differentiate ads/links</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quick Presets</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(presets).map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => applyPreset(preset as keyof typeof presets)}
                                    className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors capitalize"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {finalUrl && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-green-200 dark:border-green-800 animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Generated URL</h3>
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-green-300 dark:border-green-700">
                                <p className="text-sm text-slate-700 dark:text-slate-300 break-all font-mono">{finalUrl}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    {copied ? '✓ Copied!' : 'Copy URL'}
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 UTM Best Practices:</h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Use lowercase and underscores instead of spaces</li>
                            <li>• Be consistent with naming conventions</li>
                            <li>• Required: source, medium, and campaign</li>
                            <li>• Use term for paid keywords, content for A/B testing</li>
                        </ul>
                    </div>
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
