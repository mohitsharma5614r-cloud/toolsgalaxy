import React, { useState, useRef } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Processing audio...</p>
    </div>
);

export const AudioPitchChanger: React.FC<{ title: string }> = ({ title }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [pitch, setPitch] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
            setError('');
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                // Note: Browser audio API doesn't support pitch shifting directly
                // This would require Web Audio API with more complex processing
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleDownload = () => {
        if (!audioFile) return;
        // Note: Actual pitch shifting requires advanced audio processing
        setError('Pitch shifting requires advanced audio processing. This is a UI demo.');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Change the musical pitch of your audio</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                    {/* File Upload */}
                    {!audioFile ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Audio File</label>
                            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <label className="cursor-pointer">
                                    <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-sm text-slate-500">MP3, WAV, OGG, M4A</p>
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        onChange={handleFileSelect} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Audio Player */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={handlePlayPause}
                                        className="p-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-full hover:shadow-lg transition-all"
                                    >
                                        {isPlaying ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 dark:text-white">{audioFile.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={() => setAudioFile(null)}
                                        className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg"
                                    >
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <audio ref={audioRef} src={audioFile ? URL.createObjectURL(audioFile) : ''} />
                            </div>

                            {/* Pitch Control */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Pitch Shift: {pitch > 0 ? '+' : ''}{pitch} semitones
                                    </label>
                                    <div className="flex gap-2">
                                        {[-12, -6, 0, 6, 12].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPitch(p)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                                    pitch === p
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                                }`}
                                            >
                                                {p > 0 ? '+' : ''}{p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="-12"
                                    max="12"
                                    step="1"
                                    value={pitch}
                                    onChange={(e) => setPitch(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>-12 (Lower)</span>
                                    <span>0 (Original)</span>
                                    <span>+12 (Higher)</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                        <p className="font-semibold mb-1">About Pitch Shifting:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Positive values make audio higher pitched</li>
                                            <li>Negative values make audio lower pitched</li>
                                            <li>12 semitones = 1 octave</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Download Button */}
                            <button 
                                onClick={handleDownload}
                                className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download Modified Audio</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-6 right-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 shadow-lg animate-slide-up max-w-md">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-amber-700 dark:text-amber-400 font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-amber-500 hover:text-amber-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
