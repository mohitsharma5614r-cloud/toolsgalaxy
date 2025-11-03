import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="twitch-loader mx-auto">
            <div className="glitch" data-text="TWITCH">TWITCH</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Grabbing your clip...</p>
        <style>{`
            .twitch-loader {
                width: 140px;
                height: 60px;
            }
            .glitch {
                font-size: 2.5rem;
                font-weight: bold;
                position: relative;
                color: #9146FF; /* Twitch Purple */
                animation: glitch-anim 1s infinite steps(2, end);
            }
            .glitch::before, .glitch::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white; /* Match background */
            }
            .dark .glitch::before, .dark .glitch::after {
                background: #1e293b; /* slate-800 */
            }
            .glitch::before {
                left: 2px;
                text-shadow: -2px 0 #ff0000;
                clip-path: inset(50% 0 30% 0);
                animation: glitch-anim-2 1s infinite steps(2, end);
            }
            .glitch::after {
                left: -2px;
                text-shadow: -2px 0 #00ffff;
                clip-path: inset(10% 0 70% 0);
                animation: glitch-anim-3 1s infinite steps(2, end);
            }
            @keyframes glitch-anim { 0%,100% {transform:translateX(0)} 50% {transform:translateX(2px)} }
            @keyframes glitch-anim-2 { 0%,100%{clip-path:inset(50% 0 30% 0)} 25%{clip-path:inset(10% 0 80% 0)} 50%{clip-path:inset(90% 0 5% 0)} 75%{clip-path:inset(40% 0 40% 0)} }
            @keyframes glitch-anim-3 { 0%,100%{clip-path:inset(70% 0 10% 0)} 25%{clip-path:inset(20% 0 50% 0)} 50%{clip-path:inset(5% 0 90% 0)} 75%{clip-path:inset(60% 0 20% 0)} }
        `}</style>
    </div>
);

export const TwitchClipDownloader: React.FC<{ title: string }> = ({ title }) => {
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
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Twitch clip you want to download.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[150px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <form onSubmit={handleAttempt} className="space-y-4">
                <div>
                    <label htmlFor="twitch-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Twitch Clip URL
                    </label>
                    <input
                        id="twitch-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.twitch.tv/..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                        required
                    />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                    Download Clip
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