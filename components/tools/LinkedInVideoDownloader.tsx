import React, { useState } from 'react';

export const LinkedInVideoDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string } | null>(null);
  const [error, setError] = useState('');

  const validateLinkedInUrl = (liUrl: string): boolean => {
    return /linkedin\.com\/posts\//.test(liUrl) || /linkedin\.com\/feed\/update/.test(liUrl);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDownloadInfo(null);
    
    if (!url.trim()) {
      setError('Please enter a LinkedIn post URL');
      return;
    }

    if (!validateLinkedInUrl(url)) {
      setError('Invalid LinkedIn URL. Please enter a valid post URL.');
      return;
    }

    setIsLoading(true);

    try {
      const downloadServiceUrl = `https://linkedin-video-downloader.com/?url=${encodeURIComponent(url)}`;
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
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Download videos from LinkedIn.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleDownload} className="space-y-6">
          <div>
            <label htmlFor="li-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              LinkedIn Post URL
            </label>
            <div className="relative">
              <input
                id="li-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.linkedin.com/posts/username_activity-123456789"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Paste the LinkedIn post URL containing the video
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
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              '💼 Download Video'
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
            <li>Paste a LinkedIn post URL with video</li>
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
