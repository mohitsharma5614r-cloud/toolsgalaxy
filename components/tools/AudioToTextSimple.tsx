import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Transcribing audio...</p>
    </div>
);

export const AudioToTextSimple: React.FC<{ title: string }> = ({ title }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [error, setError] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
            setTranscription('');
            setError('');
        }
    };

    const handleTranscribe = async () => {
        if (!audioFile) return;

        setIsProcessing(true);
        setError('');

        // Simulate transcription (mock implementation)
        setTimeout(() => {
            const mockTranscriptions = [
                "Hello, this is a sample transcription of your audio file. The actual transcription would require a speech-to-text API service.",
                "Welcome to the audio transcription tool. This is a demonstration of how the transcribed text would appear in this interface.",
                "This tool provides a simple interface for converting audio to text. For real transcription, integrate with services like Google Speech-to-Text or OpenAI Whisper.",
                "Audio transcription complete. The text shown here is a mock example. Real implementation would use advanced speech recognition technology.",
            ];
            
            const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
            setTranscription(randomTranscription);
            setIsProcessing(false);
        }, 2000);
    };

    const handleCopyText = () => {
        navigator.clipboard.writeText(transcription);
    };

    const handleDownloadText = () => {
        const blob = new Blob([transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transcription-${audioFile?.name.replace(/\.[^/.]+$/, '')}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">A mock tool to transcribe audio to text</p>
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
                        {!audioFile ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Audio File</label>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <label className="cursor-pointer">
                                        <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
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
                                {/* File Info */}
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{audioFile.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => { setAudioFile(null); setTranscription(''); }} className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Transcribe Button */}
                                {!transcription && (
                                    <button 
                                        onClick={handleTranscribe}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Transcribe Audio</span>
                                    </button>
                                )}

                                {/* Transcription Result */}
                                {transcription && (
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">Transcription</h3>
                                                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">Mock Demo</span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{transcription}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={handleCopyText}
                                                className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>Copy Text</span>
                                            </button>
                                            <button 
                                                onClick={handleDownloadText}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                <span>Download TXT</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Info Note */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    <strong>Note:</strong> This is a mock demonstration. Real audio transcription requires integration with speech-to-text APIs like Google Cloud Speech-to-Text, OpenAI Whisper, or similar services.
                                </p>
                            </div>
                        </div>
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
