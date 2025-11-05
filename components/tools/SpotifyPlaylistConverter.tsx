import React, { useState } from 'react';

interface Track {
  name: string;
  artist: string;
  album: string;
  duration: string;
}

export const SpotifyPlaylistConverter: React.FC<{ title: string }> = ({ title }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [error, setError] = useState('');

  const extractPlaylistId = (spotifyUrl: string): string | null => {
    const patterns = [
      /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
      /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = spotifyUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTracks([]);
    
    if (!url.trim()) {
      setError('Please enter a Spotify playlist URL');
      return;
    }

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError('Invalid Spotify playlist URL. Please enter a valid URL.');
      return;
    }

    setIsLoading(true);

    // Simulated playlist data (in real app, you'd use Spotify API)
    setTimeout(() => {
      const demoTracks: Track[] = [
        { name: 'Song Title 1', artist: 'Artist Name 1', album: 'Album Name 1', duration: '3:45' },
        { name: 'Song Title 2', artist: 'Artist Name 2', album: 'Album Name 2', duration: '4:12' },
        { name: 'Song Title 3', artist: 'Artist Name 3', album: 'Album Name 3', duration: '3:28' },
      ];
      
      setPlaylistName('My Spotify Playlist');
      setTracks(demoTracks);
      setIsLoading(false);
    }, 1500);
  };
  
  const downloadCSV = () => {
    const csvContent = [
      ['Track Name', 'Artist', 'Album', 'Duration'].join(','),
      ...tracks.map(t => [t.name, t.artist, t.album, t.duration].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${playlistName.replace(/[^a-z0-9]/gi, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const downloadText = () => {
    const textContent = [
      `Playlist: ${playlistName}`,
      `Total Tracks: ${tracks.length}`,
      '',
      ...tracks.map((t, i) => `${i + 1}. ${t.name} - ${t.artist} (${t.album}) [${t.duration}]`)
    ].join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${playlistName.replace(/[^a-z0-9]/gi, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const handleReset = () => {
    setUrl('');
    setTracks([]);
    setError('');
    setPlaylistName('');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter the URL of the Spotify playlist you want to convert.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleConvert} className="space-y-6">
          <div>
            <label htmlFor="spotify-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Spotify Playlist URL
            </label>
            <div className="relative">
              <input
                id="spotify-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Paste your Spotify playlist URL to extract track information
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </span>
            ) : (
              '🎵 Convert to List'
            )}
          </button>
        </form>

        {tracks.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">
                ✅ {playlistName}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                {tracks.length} tracks found
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Track</th>
                    <th className="px-4 py-2 text-left">Artist</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr key={index} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">{track.name}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{track.artist}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-500">{track.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadCSV}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </button>
              <button
                onClick={downloadText}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download TXT
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">ℹ️ How it works:</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Paste a Spotify playlist URL</li>
            <li>Extract track information (name, artist, album, duration)</li>
            <li>Download as CSV or TXT format</li>
            <li>Note: This extracts metadata only, not audio files</li>
          </ul>
        </div>
      </div>
    </div>
  );
};