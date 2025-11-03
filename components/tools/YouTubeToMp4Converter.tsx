
import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="play-loader mx-auto">
            <div className="play-button"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Attempting to connect...</p>
        <style>{`
            .play-loader {
                width: 80px;
                height: 80px;
                position: relative;
                border-radius: 50%;
                border: 4px solid #e2e8f0; /* slate-200 */
                animation: spin-loader 1.5s linear infinite;
                border-top-color: #ef4444; /* red-500 */
            }
            .dark .play-loader {
                border-color: #334155; /* slate-700 */
                border-top-color: #ef4444;
            }
            .play-button {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-40%, -50%);
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 15px 0 15px 26px;
                border-color: transparent transparent transparent #4b5563; /* gray-600 */
            }
            .dark .play-button {
                border-color: transparent transparent transparent #9ca3af; /* gray-400 */
            }

            @keyframes spin-loader {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

export const YouTubeToMp4Converter: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDownloadAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setIsLoading(true);
      setShowExplanation(false);
      setTimeout(() => {
        setIsLoading(false);
        setShowExplanation(true);
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the YouTube video you want to convert.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center">
                <Loader />
            </div>
        ) : (
            <form onSubmit={handleDownloadAttempt} className="space-y-4">
            <div>
                <label htmlFor="yt-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                YouTube Video URL
                </label>
                <input
                id="yt-url"
                type="url"
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    setShowExplanation(false);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                required
                />
            </div>
            <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
            >
                Convert to MP4
            </button>
            </form>
        )}


        {showExplanation && (
          <div className="mt-8 p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Browser Limitation</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  <p>
                    This feature cannot be built in a browser-only environment. Due to web browser security policies (CORS), this website is not allowed to directly request and download video data from YouTube's servers.
                  </p>
                  <p className="mt-2">
                    Tools that provide this service use a server as a middleman to fetch the video. Building such a server is beyond the scope of this client-side application.
                  </p>
                </div>
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
        )}
      </div>
    </div>
  );
};
