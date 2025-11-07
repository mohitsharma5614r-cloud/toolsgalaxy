import React, { useState, useRef } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Processing video...</p>
    </div>
);

export const VideoFrameCapture: React.FC<{ title: string }> = ({ title }) => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [capturedFrame, setCapturedFrame] = useState<string>('');
    const [error, setError] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setVideoFile(file);
            setCapturedFrame('');
            setError('');
        }
    };

    const handleVideoLoad = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleTimeChange = (time: number) => {
        setCurrentTime(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const captureFrame = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        setCapturedFrame(dataUrl);
    };

    const handleDownload = () => {
        if (!capturedFrame) return;
        const link = document.createElement('a');
        link.href = capturedFrame;
        link.download = `frame-${currentTime.toFixed(2)}s.png`;
        link.click();
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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Extract a specific frame from a video as an image</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                    {/* File Upload */}
                    {!videoFile ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Video File</label>
                            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-pink-500 hover:bg-slate-50 dark:hover:bg-slate-700">
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
                                    className="w-full"
                                    controls
                                />
                            </div>

                            {/* Time Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Select Frame Time: {formatTime(currentTime)}
                                    </label>
                                    <span className="text-sm text-slate-500">Duration: {formatTime(duration)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    step="0.1"
                                    value={currentTime}
                                    onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-600"
                                />
                            </div>

                            {/* Capture Button */}
                            <button 
                                onClick={captureFrame}
                                className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Capture Current Frame</span>
                            </button>

                            {/* Captured Frame */}
                            {capturedFrame && (
                                <div className="space-y-4">
                                    <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
                                        <p className="font-semibold text-pink-900 dark:text-pink-300 mb-3">✓ Frame Captured!</p>
                                        <img src={capturedFrame} alt="Captured frame" className="w-full rounded-lg" />
                                    </div>
                                    <button 
                                        onClick={handleDownload}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span>Download Frame</span>
                                    </button>
                                </div>
                            )}

                            {/* Reset Button */}
                            <button 
                                onClick={() => { setVideoFile(null); setCapturedFrame(''); }}
                                className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                            >
                                Upload Different Video
                            </button>
                        </>
                    )}

                    {/* Hidden Canvas */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-6 right-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg animate-slide-up max-w-md">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
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
