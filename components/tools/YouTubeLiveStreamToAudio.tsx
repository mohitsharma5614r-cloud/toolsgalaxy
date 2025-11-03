
import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="yt-live-loader mx-auto">
            <div className="yt-logo">▶</div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Connecting to live stream...</p>
        <style>{`
            .yt-live-loader { width: 100px; height: 70px; position: relative; }
            .yt-logo {
                width: 100%; height: 100%;
                background-color: #ff0000;
                color: white;
                font-size: 40px;
                border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
            }
            .wave {
                position: absolute; top: 50%; left: 50%;
                width: 100px; height: 100px;
                border: 3px solid #ff0000;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                animation: ripple-yt 2s infinite;
            }
            .wave:nth-child(2) { animation-delay: 0.5s; }
            .wave:nth-child(3) { animation-delay: 1s; }
            @keyframes ripple-yt {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
            }
        `}</style>
    </div>
);

export const YouTubeLiveStreamToAudio: React.FC<{ title: string }> = ({ title }) => {
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
      }, 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the YouTube live stream.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <form onSubmit={handleAttempt} className="space-y-4">
            <div>
                <label htmlFor="yt-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                YouTube Live URL
                </label>
                <input
                id="yt-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                required
                />
            </div>
            <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
            >
                Start Recording Audio
            </button>
            </form>
        ) : null}

        {showExplanation && (
          <div className="mt-8 p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Feature Not Possible</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  <p>Downloading or recording audio from YouTube streams directly in a browser is not possible due to several reasons:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Terms of Service:</strong> It violates YouTube's Terms of Service to download or record content without their explicit permission.</li>
                    <li><strong>Browser Security (CORS):</strong> Web browsers prevent websites from accessing data from other domains (like youtube.com) for security reasons.</li>
                    <li><strong>Technical Complexity:</strong> Live streams use specialized protocols (DASH/HLS) that are difficult to process in a browser.</li>
                  </ul>
                </div>
                <button onClick={() => { setUrl(''); setShowExplanation(false); }} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">OK</button>
              </div>
            </div>
            <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; }`}</style>
          </div>
        )}
      </div>
    </div>
  );
};
