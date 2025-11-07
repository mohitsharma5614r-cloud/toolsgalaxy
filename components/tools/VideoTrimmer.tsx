import React, { useState, useRef } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Trimming video...</p>
    </div>
);

export const VideoTrimmer: React.FC<{ title: string }> = ({ title }) => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setError('');
        }
    };

    const handleVideoLoad = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);
            setEndTime(dur);
        }
    };

    const handleTrim = () => {
        if (!videoFile) return;
        
        // Note: Actual video trimming requires server-side processing or FFmpeg.js
        // This is a UI demonstration
        setError('Video trimming requires server-side processing. This is a UI demo.');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-600 to-blue-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Cut out unwanted parts of your video files</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                    {/* File Upload */}
                    {!videoFile ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Video File</label>
                            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <label className="cursor-pointer">
                                    <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-sm text-slate-500">MP4, WebM, AVI, MOV</p>
                                    <input 
                                        type="file" 
                                        accept="video/*" 
                                        onChange={handleFileSelect} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Video Preview */}
                            <div className="bg-slate-900 rounded-xl overflow-hidden">
                                <video
                                    ref={videoRef}
                                    src={URL.createObjectURL(videoFile)}
                                    onLoadedMetadata={handleVideoLoad}
                                    controls
                                    className="w-full"
                                />
                            </div>

                            {/* Trim Controls */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Start Time: {formatTime(startTime)}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        step="0.1"
                                        value={startTime}
                                        onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 1))}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        End Time: {formatTime(endTime)}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        step="0.1"
                                        value={endTime}
                                        onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 1))}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Original Duration</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatTime(duration)}</p>
                                    </div>
                                    <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Trimmed Duration</p>
                                        <p className="text-lg font-semibold text-sky-600">{formatTime(endTime - startTime)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trim Button */}
                            <button 
                                onClick={handleTrim}
                                className="w-full px-6 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                </svg>
                                <span>Trim Video & Download</span>
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
