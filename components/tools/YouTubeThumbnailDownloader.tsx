import React, { useState } from 'react';

interface ThumbnailData {
  videoId: string;
  title: string;
  author: string;
  thumbnails: {
    maxres: string;
    standard: string;
    high: string;
    medium: string;
    default: string;
  };
}

export const YouTubeThumbnailDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData | null>(null);
  const [error, setError] = useState('');

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleFetchThumbnails = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL or Video ID');
      return;
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError('Invalid YouTube URL or Video ID');
      return;
    }

    setLoading(true);
    setError('');
    setThumbnailData(null);

    try {
      const API_URL = 'http://localhost:3002/api/youtube';
      const response = await fetch(`${API_URL}/thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch thumbnails');
      }

      setThumbnailData(data);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please make sure the YouTube server is running on port 3002.');
      } else {
        setError(err.message || 'Failed to fetch thumbnails. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadThumbnail = (imageUrl: string, quality: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `youtube_thumbnail_${thumbnailData?.videoId}_${quality}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const thumbnailQualities = thumbnailData ? [
    { name: 'Maximum Resolution', key: 'maxres', size: '1280x720', url: thumbnailData.thumbnails.maxres },
    { name: 'Standard Definition', key: 'standard', size: '640x480', url: thumbnailData.thumbnails.standard },
    { name: 'High Quality', key: 'high', size: '480x360', url: thumbnailData.thumbnails.high },
    { name: 'Medium Quality', key: 'medium', size: '320x180', url: thumbnailData.thumbnails.medium },
    { name: 'Default', key: 'default', size: '120x90', url: thumbnailData.thumbnails.default },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-youtube-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Download YouTube video thumbnails in all available resolutions
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6 border border-slate-200 dark:border-slate-700 transform hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchThumbnails()}
              placeholder="Paste YouTube URL or Video ID... (e.g., dQw4w9WgXcQ)"
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400"
              disabled={loading}
            />
            {url && (
              <button
                onClick={() => setUrl('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleFetchThumbnails}
            disabled={loading || !url.trim()}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Get Thumbnails</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-shake">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Thumbnails Display */}
      {thumbnailData && (
        <div className="space-y-6 animate-slide-up">
          {/* Video Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={thumbnailData.thumbnails.high} 
                  alt={thumbnailData.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{thumbnailData.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-2">By {thumbnailData.author}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">ID: {thumbnailData.videoId}</span>
                  <button
                    onClick={() => copyToClipboard(thumbnailData.videoId)}
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    title="Copy Video ID"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thumbnailQualities.map((quality) => (
              <div
                key={quality.key}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative aspect-video bg-slate-900">
                  <img 
                    src={quality.url} 
                    alt={`${quality.name} thumbnail`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => downloadThumbnail(quality.url, quality.key)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => copyToClipboard(quality.url)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{quality.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Resolution: {quality.size}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadThumbnail(quality.url, quality.key)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <a
                      href={quality.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center"
                      title="Open in new tab"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-2">💡 Pro Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                  <li>Maximum Resolution (1280x720) is best for HD displays</li>
                  <li>Standard Definition (640x480) works great for most uses</li>
                  <li>Click "Copy URL" to get the direct image link</li>
                  <li>All thumbnails are in JPG format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Download YouTube Thumbnails
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy Video URL or ID</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste the full YouTube URL or just the 11-character video ID.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-600 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Get Thumbnails</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Click the button to fetch all available thumbnail sizes.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Download or Copy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred resolution and download or copy the URL.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
