import React, { useState } from 'react';

interface VideoInfo {
  success: boolean;
  videoId: string;
  title: string;
  author: string;
  channelUrl: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes?: number;
  description: string;
  uploadDate?: string;
  qualityOptions: QualityOption[];
  audioOptions: AudioOption[];
}

interface QualityOption {
  quality: string;
  itag: number;
  container: string;
  filesize?: string;
  fps?: number;
  bitrate?: number;
}

interface AudioOption {
  quality: string;
  itag: number;
  container: string;
  filesize?: string;
}

export const YouTubeToMp4Converter: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const API_URL = 'http://localhost:3002/api/youtube';

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000000) return (views / 1000000000).toFixed(1) + 'B';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  const handleFetchInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);
    setDownloadProgress(0);

    try {
      const response = await fetch(`${API_URL}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video information');
      }

      setVideoInfo(data);
      
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
      // Better error messages
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please make sure the YouTube server is running on port 3002. Run: npm run youtube-server');
      } else if (err.message.includes('Invalid YouTube URL')) {
        setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      } else {
        setError(err.message || 'Failed to fetch video. Please check the URL and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (quality?: string) => {
    if (!videoInfo) return;
    
    const downloadUrl = quality 
      ? `${API_URL}/download?url=${encodeURIComponent(url)}&quality=${quality}`
      : `${API_URL}/download?url=${encodeURIComponent(url)}`;
    
    window.open(downloadUrl, '_blank');
  };

  const handleDownloadAudio = () => {
    if (!videoInfo) return;
    const downloadUrl = `${API_URL}/download-audio?url=${encodeURIComponent(url)}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-youtube-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Download YouTube videos in MP4 format with multiple quality options
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
              onKeyPress={(e) => e.key === 'Enter' && handleFetchInfo()}
              placeholder="Paste YouTube video URL here... (e.g., https://www.youtube.com/watch?v=...)"
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400"
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
            onClick={handleFetchInfo}
            disabled={loading || !url.trim()}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px]"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Get Video</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-300 ease-out animate-youtube-pulse"
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

      {/* Video Info & Download Options */}
      {videoInfo && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Video Preview */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video group">
                <img 
                  src={videoInfo.thumbnail} 
                  alt={videoInfo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{videoInfo.title}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>{videoInfo.author}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                  {formatDuration(videoInfo.duration)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">
                    {formatViews(videoInfo.views)}
                  </div>
                  <div className="text-xs text-slate-500">Views</div>
                </div>
                {videoInfo.likes && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">👍</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {formatViews(videoInfo.likes)}
                    </div>
                    <div className="text-xs text-slate-500">Likes</div>
                  </div>
                )}
              </div>
            </div>

            {/* Download Options */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Download Options</h3>
              
              {/* Video Quality Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Video (MP4)</h4>
                {videoInfo.qualityOptions.slice(0, 5).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownload(option.itag.toString())}
                    className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold flex items-center justify-between group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold">{option.quality} {option.fps ? `${option.fps}fps` : ''}</div>
                        <div className="text-sm text-white/80">{option.container.toUpperCase()}</div>
                      </div>
                    </div>
                    <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Audio Only Option */}
              {videoInfo.audioOptions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Audio Only</h4>
                  <button
                    onClick={handleDownloadAudio}
                    className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-between group transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold">MP3 Audio</div>
                        <div className="text-sm text-white/80">Highest Quality</div>
                      </div>
                    </div>
                    <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
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
                      <li>Higher quality = larger file size</li>
                      <li>Downloads open in a new tab</li>
                      <li>Audio-only for music/podcasts</li>
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
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Download YouTube Videos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy YouTube URL</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Open YouTube, find your video, click Share, and copy the link.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Paste & Get Info</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paste the URL above and click "Get Video" to see available options.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Choose & Download</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Select your preferred quality and click download to save the video.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
