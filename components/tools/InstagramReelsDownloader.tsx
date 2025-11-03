import React, { useState } from 'react';

export const InstagramReelsDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDownloadAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setShowExplanation(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Instagram Reel you want to download.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleDownloadAttempt} className="space-y-4">
          <div>
            <label htmlFor="reel-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Instagram Reel URL
            </label>
            <input
              id="reel-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setShowExplanation(false); // Hide explanation when user types again
              }}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            Download Reel
          </button>
        </form>

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
                    This feature cannot be built in a browser-only environment. Due to web browser security policies (CORS), this website is not allowed to directly request and download video data from Instagram's servers.
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