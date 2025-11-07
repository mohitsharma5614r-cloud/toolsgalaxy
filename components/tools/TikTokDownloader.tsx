import React, { useState } from 'react';

interface VideoData {
  success: boolean;
  videoUrl: string;
  videoUrlNoWatermark: string;
  musicUrl?: string;
  coverUrl?: string;
  title: string;
  author: string;
  duration?: number;
  stats?: {
    likes?: number;
    comments?: number;
    shares?: number;
    plays?: number;
  };
}

export const TikTokDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const API_URL = 'http://localhost:3001/api/tiktok/download';

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter a TikTok URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);
    setDownloadProgress(0);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video');
      }

      setVideoData(data);
      
      // Simulate progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setDownloadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

    } catch (err: any) {
      setError(err.message || 'Failed to download video. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileUrl: string, filename: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download file. Please try again.');
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Download TikTok videos without watermark in HD quality
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
              onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
              placeholder="Paste TikTok video URL here..."
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400"
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
            onClick={handleDownload}
            disabled={loading || !url.trim()}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 transition-all duration-300 ease-out"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

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

      {/* Video Preview & Download Options */}
      {videoData && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Video Preview */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[9/16] max-h-[600px] group">
                {videoData.coverUrl && (
                  <img 
                    src={videoData.coverUrl} 
                    alt="Video cover"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg mb-1">{videoData.title}</h3>
                    <p className="text-sm text-slate-300">@{videoData.author}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {videoData.duration ? `${Math.floor(videoData.duration)}s` : 'Video'}
                </div>
              </div>

              {/* Stats */}
              {videoData.stats && (
                <div className="grid grid-cols-4 gap-3">
                  {videoData.stats.plays !== undefined && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">👁️</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatNumber(videoData.stats.plays)}
                      </div>
                      <div className="text-xs text-slate-500">Views</div>
                    </div>
                  )}
                  {videoData.stats.likes !== undefined && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">❤️</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatNumber(videoData.stats.likes)}
                      </div>
                      <div className="text-xs text-slate-500">Likes</div>
                    </div>
                  )}
                  {videoData.stats.comments !== undefined && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">💬</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatNumber(videoData.stats.comments)}
                      </div>
                      <div className="text-xs text-slate-500">Comments</div>
                    </div>
                  )}
                  {videoData.stats.shares !== undefined && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">🔄</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatNumber(videoData.stats.shares)}
                      </div>
                      <div className="text-xs text-slate-500">Shares</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Download Options */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Download Options</h3>
              
              {/* No Watermark Video */}
              <button
                onClick={() => downloadFile(videoData.videoUrlNoWatermark, `tiktok_${Date.now()}.mp4`)}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-xl font-semibold flex items-center justify-between group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">HD Video (No Watermark)</div>
                    <div className="text-sm text-white/80">Best quality without TikTok logo</div>
                  </div>
                </div>
                <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Original Video */}
              <button
                onClick={() => downloadFile(videoData.videoUrl, `tiktok_original_${Date.now()}.mp4`)}
                className="w-full p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-semibold flex items-center justify-between group transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Original Video</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">With watermark</div>
                  </div>
                </div>
                <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Audio Only */}
              {videoData.musicUrl && (
                <button
                  onClick={() => downloadFile(videoData.musicUrl!, `tiktok_audio_${Date.now()}.mp3`)}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-between group transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Audio Only (MP3)</div>
                      <div className="text-sm text-white/80">Extract music from video</div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">Download Tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                      <li>HD quality available for most videos</li>
                      <li>No watermark option preserves original quality</li>
                      <li>Audio extraction available for music lovers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Download TikTok Videos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy TikTok URL</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Open TikTok app, find the video you want, tap Share, and copy the link.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Paste & Download</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste the URL in the input box above and click the Download button.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Save Video</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred quality and format, then save to your device.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

// Add custom animations to your global CSS
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
`;
