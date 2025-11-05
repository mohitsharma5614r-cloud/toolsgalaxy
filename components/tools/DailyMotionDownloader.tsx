import React, { useState } from 'react';

export const DailyMotionDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string } | null>(null);
  const [error, setError] = useState('');

  const validateDailyMotionUrl = (dmUrl: string): boolean => {
    return /dailymotion\.com\/video\//.test(dmUrl) || /dai\.ly\//.test(dmUrl);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDownloadInfo(null);
    
    if (!url.trim()) {
      setError('Please enter a DailyMotion video URL');
      return;
    }

    if (!validateDailyMotionUrl(url)) {
      setError('Invalid DailyMotion URL. Please enter a valid video URL.');
      return;
    }

    setIsLoading(true);

    try {
      const downloadServiceUrl = `https://dailymotiondownloader.com/download?url=${encodeURIComponent(url)}`;
      window.open(downloadServiceUrl, '_blank');
      
      setDownloadInfo({ url: downloadServiceUrl });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process the video. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setUrl('');
    setDownloadInfo(null);
    setError('');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Download videos from DailyMotion.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleDownload} className="space-y-6">
          <div>
            <label htmlFor="dm-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              DailyMotion Video URL
            </label>
            <div className="relative">
              <input
                id="dm-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.dailymotion.com/video/x123456"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.551 11.485c-1.027-.188-1.535-.852-1.535-1.613 0-.761.508-1.424 1.535-1.613V5.4c-2.02.198-3.605 1.913-3.605 4.012 0 2.099 1.585 3.814 3.605 4.012v-1.939zm9.449-8.485h-22v19h22v-19zm-11 14c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Paste the DailyMotion video URL
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              '🎥 Download Video'
            )}
          </button>
        </form>

        {downloadInfo && (
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">Download Ready!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                  A new tab has been opened. If it didn't open, click below:
                </p>
                <div className="flex gap-3">
                  <a
                    href={downloadInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Open Download Page
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-colors"
                  >
                    Download Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">ℹ️ How it works:</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Paste a DailyMotion video URL</li>
            <li>Click download button</li>
            <li>Third-party service opens in new tab</li>
            <li>Follow instructions to download</li>
          </ul>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
