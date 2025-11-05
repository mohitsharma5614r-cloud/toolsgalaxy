import React, { useState } from 'react';

export const FacebookVideoDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string } | null>(null);
  const [error, setError] = useState('');

  const validateFacebookUrl = (fbUrl: string): boolean => {
    const patterns = [
      /facebook\.com\/.*\/videos\//,
      /fb\.watch\//,
      /facebook\.com\/watch/,
      /facebook\.com\/.*\/posts\//,
    ];
    return patterns.some(pattern => pattern.test(fbUrl));
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDownloadInfo(null);
    
    if (!url.trim()) {
      setError('Please enter a Facebook video URL');
      return;
    }

    if (!validateFacebookUrl(url)) {
      setError('Invalid Facebook URL. Please enter a valid video URL.');
      return;
    }

    setIsLoading(true);

    try {
      // Using third-party download service
      const downloadServiceUrl = `https://fdown.net/download.php?url=${encodeURIComponent(url)}`;
      window.open(downloadServiceUrl, '_blank');
      
      setDownloadInfo({ url: downloadServiceUrl });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process the video. Please try again or use the manual download link.');
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
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Facebook video you want to download.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleDownload} className="space-y-6">
          <div>
            <label htmlFor="fb-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Facebook Video URL
            </label>
            <div className="relative">
              <input
                id="fb-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.facebook.com/watch/?v=123456789 or fb.watch/abc"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Paste the Facebook video URL (supports watch, posts, and fb.watch links)
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
              '📹 Download Video'
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
                  A new tab has been opened with the download service. If it didn't open, click the button below:
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
            <li>Paste a Facebook video URL</li>
            <li>Click the download button</li>
            <li>A third-party service will open in a new tab</li>
            <li>Follow the instructions on that page to download your video</li>
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