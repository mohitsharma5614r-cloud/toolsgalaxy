import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="reddit-loader mx-auto">
            <div className="snoo-head">
                <div className="snoo-antenna"></div>
            </div>
            <div className="snoo-body"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Fetching from Reddit...</p>
        <style>{`
            .reddit-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .snoo-head {
                width: 60px;
                height: 60px;
                background: white;
                border: 4px solid #FF4500; /* Reddit Orange */
                border-radius: 50%;
                position: absolute;
                bottom: 20px;
                left: 10px;
            }
            .snoo-head::before, .snoo-head::after { /* Ears */
                content: '';
                position: absolute;
                width: 20px;
                height: 30px;
                background: white;
                border: 4px solid #FF4500;
                border-radius: 50%;
                top: -10px;
            }
            .snoo-head::before { left: 0; }
            .snoo-head::after { right: 0; }
            .snoo-antenna {
                width: 4px;
                height: 20px;
                background: #FF4500;
                position: absolute;
                top: -15px;
                left: 50%;
                transform-origin: bottom center;
                animation: antenna-sway 1s infinite ease-in-out;
            }
            .snoo-antenna::before {
                content: '';
                position: absolute;
                top: -8px;
                left: -6px;
                width: 16px;
                height: 16px;
                background: #FF4500;
                border-radius: 50%;
            }
            @keyframes antenna-sway {
                0%, 100% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
            }
        `}</style>
    </div>
);

export const RedditVideoDownloader: React.FC<{ title: string }> = ({ title }) => {
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
  
  const handleReset = () => {
      setUrl('');
      setShowExplanation(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Reddit post containing the video.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <form onSubmit={handleAttempt} className="space-y-4">
                <div>
                    <label htmlFor="reddit-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Reddit Post URL
                    </label>
                    <input
                        id="reddit-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.reddit.com/r/..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                        required
                    />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                    Download Video
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
                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Browser Limitation</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                          <p>
                              This feature cannot be fully implemented in a browser-only environment. Due to web browser security policies (CORS), this website is not allowed to directly request and download media data from another website's servers.
                          </p>
                          <p>
                              Tools that provide this service use a server as a middleman to fetch the content, which is beyond the scope of this client-side application. This also often violates the platform's terms of service.
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