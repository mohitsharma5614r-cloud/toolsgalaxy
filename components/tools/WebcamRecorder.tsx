import React, { useState, useRef } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Accessing webcam...</p>
    </div>
);

export const WebcamRecorder: React.FC<{ title: string }> = ({ title }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState<string>('');
    const [error, setError] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsPreviewing(true);
            }
        } catch (err: any) {
            setError(`Failed to access webcam: ${err.message}`);
        }
    };

    const startRecording = async () => {
        try {
            const stream = videoRef.current?.srcObject as MediaStream;
            if (!stream) return;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedUrl(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err: any) {
            setError(`Failed to start recording: ${err.message}`);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            
            // Stop all tracks
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
            setIsPreviewing(false);
        }
    };

    const handleDownload = () => {
        if (!recordedUrl) return;
        const link = document.createElement('a');
        link.href = recordedUrl;
        link.download = `webcam-recording-${Date.now()}.webm`;
        link.click();
    };

    const handleReset = () => {
        setRecordedUrl('');
        setIsPreviewing(false);
        setIsRecording(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-600 to-red-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Record video directly from your webcam</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                    {/* Video Preview */}
                    <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                        {!isPreviewing && !recordedUrl ? (
                            <div className="text-center p-8">
                                <svg className="w-24 h-24 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-slate-400">Webcam preview will appear here</p>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted={!recordedUrl}
                                controls={!!recordedUrl}
                                src={recordedUrl}
                                className="w-full h-full"
                            />
                        )}
                    </div>

                    {/* Recording Status */}
                    {isRecording && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                    <span className="font-semibold text-red-900 dark:text-red-300">Recording...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    {!recordedUrl ? (
                        <div className="flex gap-4">
                            {!isPreviewing ? (
                                <button 
                                    onClick={startPreview}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Start Webcam</span>
                                </button>
                            ) : !isRecording ? (
                                <button 
                                    onClick={startRecording}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="8" />
                                    </svg>
                                    <span>Start Recording</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={stopRecording}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <rect x="6" y="6" width="12" height="12" />
                                    </svg>
                                    <span>Stop Recording</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                <p className="font-semibold text-green-900 dark:text-green-300">✓ Recording Complete!</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleDownload}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>Download Video</span>
                                </button>
                                <button 
                                    onClick={handleReset}
                                    className="px-6 py-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                                >
                                    Record Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                <p className="font-semibold mb-1">Note:</p>
                                <p>Your browser will ask for permission to access your webcam and microphone.</p>
                            </div>
                        </div>
                    </div>
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
