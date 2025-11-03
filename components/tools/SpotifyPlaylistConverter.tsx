import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="spotify-loader mx-auto">
            <div className="spotify-logo"><div></div></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Accessing playlist data...</p>
        <style>{`
            .spotify-loader {
                width: 80px;
                height: 80px;
                position: relative;
            }
            .spotify-logo {
                width: 100%;
                height: 100%;
                background-color: #1DB954; /* Spotify Green */
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .spotify-logo::before, .spotify-logo::after, .spotify-logo > div {
                content: '';
                position: absolute;
                height: 6px;
                background: black;
                border-radius: 3px;
                transform-origin: left center;
                animation: spotify-wave 1.5s infinite ease-in-out;
            }
            .dark .spotify-logo::before, .dark .spotify-logo::after, .dark .spotify-logo > div {
                background: #191414; /* Spotify Black */
            }
            .spotify-logo::before { width: 30px; top: 30px; left: 25px; animation-delay: 0s; }
            .spotify-logo::after { width: 40px; top: 45px; left: 20px; animation-delay: 0.2s; }
            .spotify-logo > div {
                 width: 50px; top: 60px; left: 15px; animation-delay: 0.4s;
            }
            @keyframes spotify-wave {
                0%, 100% { transform: scaleX(0.5); }
                50% { transform: scaleX(1); }
            }
        `}</style>
    </div>
);

export const SpotifyPlaylistConverter: React.FC<{ title: string }> = ({ title }) => {
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
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Spotify playlist you want to convert.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <form onSubmit={handleAttempt} className="space-y-4">
                <div>
                    <label htmlFor="spotify-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Spotify Playlist URL
                    </label>
                    <input
                        id="spotify-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://open.spotify.com/playlist/..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                        required
                    />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                    Convert Playlist
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
                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical & Legal Limitations</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-2">
                          <p>
                              Downloading audio from Spotify is a violation of their Terms of Service. Furthermore, the audio is encrypted and cannot be accessed directly by a web browser.
                          </p>
                          <p>
                              While it's possible to read playlist data (track names, artists) using Spotify's official API, downloading the actual audio files is not permitted and is technically infeasible from a browser-only tool.
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