import React, { useState } from 'react';

export const InfluencerCostCalculator: React.FC = () => {
    const [platform, setPlatform] = useState('instagram');
    const [followers, setFollowers] = useState('');
    const [engagementRate, setEngagementRate] = useState('');
    const [postType, setPostType] = useState('post');
    const [estimatedCost, setEstimatedCost] = useState<{min: number; max: number} | null>(null);

    const platforms = ['instagram', 'youtube', 'tiktok', 'twitter', 'facebook'];
    const postTypes = {
        instagram: ['post', 'story', 'reel', 'igtv'],
        youtube: ['video', 'short', 'community'],
        tiktok: ['video', 'live'],
        twitter: ['tweet', 'thread'],
        facebook: ['post', 'story', 'video']
    };

    const calculateCost = () => {
        const followerCount = parseFloat(followers);
        const engagement = parseFloat(engagementRate) || 3;

        if (isNaN(followerCount) || followerCount <= 0) {
            return;
        }

        let baseCostPer1k = 10;
        let multiplier = 1;

        // Platform-specific pricing
        if (platform === 'youtube') baseCostPer1k = 20;
        else if (platform === 'tiktok') baseCostPer1k = 8;
        else if (platform === 'twitter') baseCostPer1k = 6;
        else if (platform === 'facebook') baseCostPer1k = 7;

        // Post type multiplier
        if (postType === 'video' || postType === 'reel' || postType === 'igtv') multiplier = 1.5;
        else if (postType === 'story') multiplier = 0.7;
        else if (postType === 'short') multiplier = 1.2;

        // Engagement rate multiplier
        if (engagement > 5) multiplier *= 1.3;
        else if (engagement > 10) multiplier *= 1.6;
        else if (engagement < 1) multiplier *= 0.7;

        // Follower tier pricing
        let tierMultiplier = 1;
        if (followerCount >= 1000000) tierMultiplier = 1.5;
        else if (followerCount >= 500000) tierMultiplier = 1.3;
        else if (followerCount >= 100000) tierMultiplier = 1.2;
        else if (followerCount < 10000) tierMultiplier = 0.8;

        const costPer1k = baseCostPer1k * multiplier * tierMultiplier;
        const baseCost = (followerCount / 1000) * costPer1k;

        setEstimatedCost({
            min: Math.round(baseCost * 0.7),
            max: Math.round(baseCost * 1.3)
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Influencer Cost Calculator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Estimate the cost of collaborating with an influencer.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Platform</label>
                    <div className="flex flex-wrap gap-2">
                        {platforms.map(p => (
                            <button
                                key={p}
                                onClick={() => { setPlatform(p); setPostType(postTypes[p as keyof typeof postTypes][0]); }}
                                className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
                                    platform === p ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Follower Count</label>
                    <input
                        type="number"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                        placeholder="e.g., 50000"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Engagement Rate (%) - Optional</label>
                    <input
                        type="number"
                        step="0.1"
                        value={engagementRate}
                        onChange={(e) => setEngagementRate(e.target.value)}
                        placeholder="e.g., 3.5 (default: 3%)"
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Higher engagement = higher cost</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content Type</label>
                    <select
                        value={postType}
                        onChange={(e) => setPostType(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 capitalize"
                    >
                        {postTypes[platform as keyof typeof postTypes].map(type => (
                            <option key={type} value={type} className="capitalize">{type}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={calculateCost}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                    Calculate Estimated Cost
                </button>

                {estimatedCost && (
                    <div className="mt-6 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-purple-200 dark:border-purple-800 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Estimated Cost Range</h3>
                        <div className="text-center">
                            <p className="text-5xl font-extrabold text-purple-600 dark:text-purple-400">
                                ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">Per {postType} on {platform}</p>
                        </div>

                        <div className="mt-6 p-4 bg-white dark:bg-slate-900/50 rounded-lg">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">💡 Pricing Factors:</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Follower count: {parseFloat(followers).toLocaleString()}</li>
                                <li>• Engagement rate: {engagementRate || '3'}%</li>
                                <li>• Platform: {platform}</li>
                                <li>• Content type: {postType}</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">📊 Note:</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        This is an estimate based on industry averages. Actual costs vary based on niche, audience demographics, 
                        influencer reputation, and negotiation. Always discuss rates directly with influencers.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
