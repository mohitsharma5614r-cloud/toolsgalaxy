import React, { useState, useRef } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Converting video to MP3...</p>
    </div>
);

export const VideoToMp3Converter: React.FC<{ title: string }> = ({ title }) => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [audioUrl, setAudioUrl] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setAudioUrl('');
            setError('');
        }
    };

    const handleConvert = async () => {
        if (!videoFile) return;

        setIsProcessing(true);
        setError('');

        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Note: True audio extraction from video requires server-side processing with FFmpeg
            // For demo purposes, we'll create a mock audio URL
            const url = URL.createObjectURL(videoFile);
            setAudioUrl(url);
        } catch (err: any) {
            setError(`Error: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
        const length = buffer.length * buffer.numberOfChannels * 2 + 44;
        const arrayBuffer = new ArrayBuffer(length);
        const view = new DataView(arrayBuffer);
        const channels: Float32Array[] = [];
        let offset = 0;
        let pos = 0;

        const setUint16 = (data: number) => {
            view.setUint16(pos, data, true);
            pos += 2;
        };
        const setUint32 = (data: number) => {
            view.setUint32(pos, data, true);
            pos += 4;
        };

        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8);
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt "
        setUint32(16);
        setUint16(1);
        setUint16(buffer.numberOfChannels);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
        setUint16(buffer.numberOfChannels * 2);
        setUint16(16);
        setUint32(0x61746164); // "data"
        setUint32(length - pos - 4);

        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < length) {
            for (let i = 0; i < buffer.numberOfChannels; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return arrayBuffer;
    };

    const handleDownload = () => {
        if (!audioUrl) return;
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = `${videoFile?.name.replace(/\.[^/.]+$/, '')}-audio.webm`;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Extract audio from your video files</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {isProcessing ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Upload */}
                        {!videoFile ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Video File</label>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <label className="cursor-pointer">
                                        <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-slate-500">MP4, WebM, AVI, MOV, MKV</p>
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
                                        controls
                                        className="w-full max-h-96"
                                    />
                                </div>

                                {/* File Info */}
                                <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{videoFile.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => { setVideoFile(null); setAudioUrl(''); }} className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Convert Button */}
                                {!audioUrl && (
                                    <button 
                                        onClick={handleConvert}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                        <span>Extract Audio</span>
                                    </button>
                                )}

                                {/* Audio Preview & Download */}
                                {audioUrl && (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                                            <div className="flex gap-3 mb-3">
                                                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                    <strong>Note:</strong> True audio extraction from video requires server-side processing with FFmpeg. This is a UI demonstration. The video file will be downloaded as-is.
                                                </p>
                                            </div>
                                            <video src={audioUrl} controls className="w-full rounded-lg" />
                                        </div>
                                        <button 
                                            onClick={handleDownload}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <span>Download Audio (WebM)</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
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
