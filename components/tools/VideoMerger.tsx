import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Merging videos...</p>
    </div>
);

export const VideoMerger: React.FC<{ title: string }> = ({ title }) => {
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setVideoFiles(Array.from(e.target.files));
            setError('');
        }
    };

    const removeVideo = (index: number) => {
        setVideoFiles(videoFiles.filter((_, i) => i !== index));
    };

    const moveVideo = (index: number, direction: 'up' | 'down') => {
        const newVideos = [...videoFiles];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < videoFiles.length) {
            [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
            setVideoFiles(newVideos);
        }
    };

    const handleMerge = () => {
        if (videoFiles.length < 2) {
            setError('Please upload at least 2 videos to merge');
            return;
        }
        setError('Video merging requires server-side processing with FFmpeg. This is a UI demo.');
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Combine multiple video clips into a single video</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Multiple Videos</label>
                        <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-fuchsia-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <label className="cursor-pointer">
                                <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-500">Select multiple video files (MP4, WebM, AVI, MOV)</p>
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    multiple
                                    onChange={handleFileSelect} 
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Video List */}
                    {videoFiles.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Videos to Merge ({videoFiles.length})
                            </h3>
                            <div className="space-y-3">
                                {videoFiles.map((video, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800 rounded-xl">
                                        <div className="flex items-center justify-center w-10 h-10 bg-fuchsia-600 text-white font-bold rounded-lg">
                                            {index + 1}
                                        </div>
                                        <svg className="w-6 h-6 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{video.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => moveVideo(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => moveVideo(index, 'down')}
                                                disabled={index === videoFiles.length - 1}
                                                className="p-2 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => removeVideo(index)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                                            >
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    {videoFiles.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <p className="font-semibold mb-1">Tips:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Videos will be merged in the order shown</li>
                                        <li>Use arrow buttons to reorder videos</li>
                                        <li>All videos should have similar resolution for best results</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Merge Button */}
                    <button 
                        onClick={handleMerge}
                        disabled={videoFiles.length < 2}
                        className="w-full px-6 py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        <span>Merge Videos & Download</span>
                    </button>
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
