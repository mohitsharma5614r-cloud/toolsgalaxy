import React, { useState } from 'react';

export const PinterestVideoDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<{ url: string; thumbnail: string } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractPinId = (pinterestUrl: string): string | null => {
    const patterns = [
      /pinterest\.com\/pin\/(\d+)/,
      /pin\.it\/([a-zA-Z0-9]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = pinterestUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVideoInfo(null);
    
    if (!url.trim()) {
      setError('Please enter a Pinterest URL');
      return;
    }

    const pinId = extractPinId(url);
    if (!pinId) {
      setError('Invalid Pinterest URL. Please enter a valid pin URL.');
      return;
    }

    setIsLoading(true);

    try {
      // Using a third-party API service (example - you may need to replace with actual working API)
      const apiUrl = `https://api.pinterestdownloader.com/video?url=${encodeURIComponent(url)}`;
      
      // Alternative: Open in new tab with download service
      const downloadServiceUrl = `https://pinterestvideodownloader.com/?url=${encodeURIComponent(url)}`;
      window.open(downloadServiceUrl, '_blank');
      
      setVideoInfo({
        url: downloadServiceUrl,
        thumbnail: `https://i.pinimg.com/originals/${pinId.slice(0, 2)}/${pinId.slice(2, 4)}/${pinId}.jpg`
      });
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process the video. Please try again or use the manual download link.');
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setUrl('');
    setVideoInfo(null);
    setError('');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Pinterest pin containing the video.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleDownload} className="space-y-6">
          <div>
            <label htmlFor="pin-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Pinterest Pin URL
            </label>
            <div className="relative">
              <input
                id="pin-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.pinterest.com/pin/123456789 or https://pin.it/abc123"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Paste the Pinterest pin URL containing the video you want to download
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
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              '📌 Download Video'
            )}
          </button>
        </form>

        {videoInfo && (
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">Video Ready!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                  A new tab has been opened with the download service. If it didn't open, click the button below:
                </p>
                <div className="flex gap-3">
                  <a
                    href={videoInfo.url}
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
            <li>Paste a Pinterest pin URL containing a video</li>
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