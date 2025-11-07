import React, { useState } from 'react';

interface PlaylistVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
}

interface PlaylistInfo {
  success: boolean;
  playlistId: string;
  title: string;
  author: string;
  thumbnail: string;
  videoCount: number;
  videos: PlaylistVideo[];
}

export const YouTubePlaylistDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [downloadingVideos, setDownloadingVideos] = useState<Set<string>>(new Set());

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

  const handleFetchPlaylist = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }

    setLoading(true);
    setError('');
    setPlaylistInfo(null);
    setDownloadProgress(0);
    setSelectedVideos(new Set());

    try {
      const response = await fetch(`${API_URL}/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch playlist information');
      }

      setPlaylistInfo(data);
      
      // Select all videos by default
      const allVideoIds = new Set(data.videos.map((v: PlaylistVideo) => v.videoId));
      setSelectedVideos(allVideoIds);
      
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
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please make sure the YouTube server is running on port 3002.');
      } else if (err.message.includes('Invalid')) {
        setError('Invalid YouTube playlist URL. Please enter a valid playlist link.');
      } else {
        setError(err.message || 'Failed to fetch playlist. Please check the URL and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoSelection = (videoId: string) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedVideos.size === playlistInfo?.videos.length) {
      setSelectedVideos(new Set());
    } else {
      const allVideoIds = new Set(playlistInfo?.videos.map(v => v.videoId));
      setSelectedVideos(allVideoIds);
    }
  };

  const handleDownloadSelected = async () => {
    if (!playlistInfo || selectedVideos.size === 0) return;
    
    const newDownloading = new Set(selectedVideos);
    setDownloadingVideos(newDownloading);

    // Download each selected video
    for (const videoId of selectedVideos) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const downloadUrl = `${API_URL}/download?url=${encodeURIComponent(videoUrl)}`;
      window.open(downloadUrl, '_blank');
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setTimeout(() => {
      setDownloadingVideos(new Set());
    }, 3000);
  };

  const handleDownloadSingle = (videoId: string) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const downloadUrl = `${API_URL}/download?url=${encodeURIComponent(videoUrl)}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-youtube-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 7H2v10h20V7zm-11 9H4V8h7v8zm9 0h-7V8h7v8z"/>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-orange-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Download entire YouTube playlists with one click
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
              onKeyPress={(e) => e.key === 'Enter' && handleFetchPlaylist()}
              placeholder="Paste YouTube playlist URL here... (e.g., https://www.youtube.com/playlist?list=...)"
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
            onClick={handleFetchPlaylist}
            disabled={loading || !url.trim()}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Get Playlist</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 ease-out animate-youtube-pulse"
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

      {/* Playlist Info & Videos */}
      {playlistInfo && (
        <div className="space-y-6 animate-slide-up">
          {/* Playlist Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={playlistInfo.thumbnail} 
                alt={playlistInfo.title}
                className="w-full md:w-64 h-48 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{playlistInfo.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">By {playlistInfo.author}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16v12H4z"/>
                    </svg>
                    <span className="font-semibold text-slate-900 dark:text-white">{playlistInfo.videoCount} videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedVideos.size} selected</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    {selectedVideos.size === playlistInfo.videos.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleDownloadSelected}
                    disabled={selectedVideos.size === 0}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    Download Selected ({selectedVideos.size})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlistInfo.videos.map((video, index) => (
              <div
                key={video.videoId}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                    #{index + 1}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDownloadSingle(video.videoId)}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedVideos.has(video.videoId)}
                      onChange={() => toggleVideoSelection(video.videoId)}
                      className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{video.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Download YouTube Playlists
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy Playlist URL</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Open YouTube playlist and copy the URL from your browser.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Select Videos</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose which videos to download or select all at once.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Download</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Click download and all selected videos will be saved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
