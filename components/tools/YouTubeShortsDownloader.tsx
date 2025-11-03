import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="record-loader mx-auto">
            <div className="record-dot"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Attempting to connect...</p>
        <style>{`
            .record-loader { width: 80px; height: 80px; background-color: #f1f5f9; border: 4px solid #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .dark .record-loader { background-color: #334155; border-color: #475569; }
            .record-dot { width: 30px; height: 30px; background-color: #ef4444; border-radius: 50%; animation: pulse-record 1.5s infinite; }
            @keyframes pulse-record { 0%, 100% { transform: scale(0.9); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
        `}</style>
    </div>
);

export const YouTubeShortsDownloader: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAttempt = (e: React.FormEvent) => {
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
  
  const handleReset = () => {
      setUrl('');
      setShowExplanation(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the YouTube Short you want to download.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <form onSubmit={handleAttempt} className="space-y-4">
                <div>
                    <label htmlFor="yt-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        YouTube Shorts URL
                    </label>
                    <input
                        id="yt-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/shorts/..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                        required
                    />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg">
                    Download Short
                </button>
            </form>
        ) : null}
        
        {showExplanation && (
          <div className="p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div className="ml-3">
                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Browser & Legal Limitations</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                          <p>
                             Downloading content from YouTube violates their Terms of Service. Additionally, browser security policies (CORS) prevent this website from directly accessing video data from YouTube's servers.
                          </p>
                          <p>
                              Tools that provide this service use a server to bypass these restrictions. This client-side application cannot perform that function.
                          </p>
                      </div>
                      <button onClick={handleReset} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">OK</button>
                  </div>
              </div>
              <style>{`@keyframes fade-in{from{opacity:0}to{opacity:1}}.animate-fade-in{animation:fade-in .5s ease-out}`}</style>
          </div>
        )}
      </div>
    </div>
  );
};