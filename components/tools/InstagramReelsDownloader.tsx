import React, { useState } from 'react';

interface MediaData {
  success: boolean;
  type: 'reel' | 'post' | 'story' | 'highlight' | 'profile';
  username: string;
  caption?: string;
  thumbnail: string;
  mediaUrls: string[];
  isCarousel: boolean;
}

interface ProfileData {
  success: boolean;
  username: string;
  fullName: string;
  profilePicUrl: string;
  profilePicUrlHD: string;
  isPrivate: boolean;
  followers: number;
  following: number;
}

export const InstagramReelsDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [activeTab, setActiveTab] = useState<'media' | 'profile'>('media');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const API_URL = 'http://localhost:3003/api/instagram';

  const detectContentType = (url: string): string => {
    if (url.includes('/reel/')) return 'Reel';
    if (url.includes('/p/')) return 'Post';
    if (url.includes('/stories/')) return 'Story';
    if (url.includes('/highlights/')) return 'Highlight';
    return 'Content';
  };

  const handleFetchMedia = async () => {
    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    setLoading(true);
    setError('');
    setMediaData(null);
    setDownloadProgress(0);

    try {
      const response = await fetch(`${API_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setMediaData(data);
      
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
        setError('Cannot connect to server. Please make sure the Instagram server is running on port 3003.');
      } else {
        setError(err.message || 'Failed to fetch content. The post may be private or deleted.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProfile = async () => {
    if (!username.trim()) {
      setError('Please enter an Instagram username');
      return;
    }

    setLoading(true);
    setError('');
    setProfileData(null);
    setDownloadProgress(0);

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfileData(data);
      
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
        setError('Cannot connect to server. Please make sure the Instagram server is running on port 3003.');
      } else {
        setError(err.message || 'Failed to fetch profile. Please check the username.');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (fileUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Download Instagram Reels, Posts, Stories, Highlights & Profile Photos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'media'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Reels / Posts / Stories
          </div>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Photo
          </div>
        </button>
      </div>

      {/* Media Download Tab */}
      {activeTab === 'media' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6 border border-slate-200 dark:border-slate-700 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFetchMedia()}
                placeholder="Paste Instagram URL here... (Reel, Post, Story, or Highlight)"
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
              onClick={handleFetchMedia}
              disabled={loading || !url.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px]"
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
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 transition-all duration-300 ease-out"
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
      )}

      {/* Profile Photo Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6 border border-slate-200 dark:border-slate-700 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFetchProfile()}
                placeholder="Enter Instagram username (e.g., @instagram or instagram)"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400"
                disabled={loading}
              />
              {username && (
                <button
                  onClick={() => setUsername('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleFetchProfile}
              disabled={loading || !username.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Get Profile Photo</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-4">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 transition-all duration-300 ease-out"
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
      )}

      {/* Alternative Download Method */}
      {error && activeTab === 'media' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl p-8 border border-purple-200 dark:border-purple-700 animate-slide-up">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Alternative Download Methods</h3>
            <p className="text-slate-600 dark:text-slate-400">Instagram has strict API restrictions. Try these methods instead:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Method 1: Online Tools</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Use these trusted websites:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <a href="https://snapinsta.app" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">SnapInsta.app</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <a href="https://instadownloader.co" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">InstaDownloader.co</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <a href="https://igram.io" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">iGram.io</a>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Method 2: Mobile App</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Steps to download:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside text-slate-600 dark:text-slate-400">
                <li>Open Instagram app</li>
                <li>Tap ••• on the post</li>
                <li>Select "Copy Link"</li>
                <li>Use Repost apps or browser tools</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Method 3: Browser Extension</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Install browser extensions:</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Video Downloader for Instagram</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>IG Story & Reels Downloader</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Method 4: Developer Tools</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">For tech-savvy users:</p>
              <ol className="space-y-2 text-sm list-decimal list-inside text-slate-600 dark:text-slate-400">
                <li>Open post in browser</li>
                <li>Press F12 (Developer Tools)</li>
                <li>Go to Network tab</li>
                <li>Find video URL and download</li>
              </ol>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-1">💡 Why This Happens</p>
                <p className="text-blue-600 dark:text-blue-400">
                  Instagram actively blocks automated downloading to protect user content and comply with copyright laws. The methods above are legal alternatives that work within Instagram's guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Results */}
      {mediaData && activeTab === 'media' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <img 
                src={mediaData.thumbnail} 
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                    {detectContentType(url)}
                  </span>
                  {mediaData.isCarousel && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                      {mediaData.mediaUrls.length} items
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">@{mediaData.username}</h3>
                {mediaData.caption && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{mediaData.caption}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaData.mediaUrls.map((mediaUrl, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={mediaUrl} 
                    alt={`Media ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => downloadFile(mediaUrl, `instagram_${mediaData.type}_${index + 1}.jpg`)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Results */}
      {profileData && activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <img 
                src={profileData.profilePicUrlHD} 
                alt={profileData.username}
                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-gradient-to-r from-purple-600 to-pink-600"
              />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">@{profileData.username}</h2>
              {profileData.fullName && (
                <p className="text-slate-600 dark:text-slate-400 mb-4">{profileData.fullName}</p>
              )}
              <div className="flex gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(profileData.followers)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(profileData.following)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Following</div>
                </div>
              </div>
              <button
                onClick={() => downloadFile(profileData.profilePicUrlHD, `${profileData.username}_profile_photo.jpg`)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Profile Photo
              </button>
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
          How to Download from Instagram
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">📱 For Reels/Posts/Stories:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Open Instagram and find the content</li>
              <li>Tap the three dots (•••) menu</li>
              <li>Select "Copy Link"</li>
              <li>Paste the link here and click Download</li>
            </ol>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">👤 For Profile Photos:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Find the Instagram profile</li>
              <li>Copy the username (with or without @)</li>
              <li>Paste it in the Profile Photo tab</li>
              <li>Click Get Profile Photo to download</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
