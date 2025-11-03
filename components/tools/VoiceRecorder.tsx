import React, { useState, useRef } from 'react';

type RecordingStatus = 'inactive' | 'recording' | 'paused' | 'finished';

// FIX: Add title prop to component.
export const VoiceRecorder: React.FC<{ title: string }> = ({ title }) => {
    const [status, setStatus] = useState<RecordingStatus>('inactive');
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    
    const startRecording = async () => {
        setError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setStatus('recording');
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    setAudioURL(url);
                    audioChunksRef.current = [];
                    stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
                };
                mediaRecorder.start();
            } catch (err) {
                console.error('Error accessing microphone:', err);
                setError('Could not access the microphone. Please check your browser permissions.');
                setStatus('inactive');
            }
        } else {
             setError('Your browser does not support audio recording.');
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setStatus('finished');
        }
    };

    const resetRecording = () => {
        setStatus('inactive');
        setAudioURL(null);
        setError(null);
    };

    const renderControls = () => {
        switch (status) {
            case 'recording':
                return (
                    <button onClick={stopRecording} className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg shadow-lg animate-pulse transition-transform hover:scale-105">
                        Stop Recording
                    </button>
                );
            case 'finished':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <audio src={audioURL ?? ''} controls className="w-full max-w-sm"/>
                        <div className="flex gap-4 mt-4">
                            <a href={audioURL ?? ''} download="recording.wav" className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                Download
                            </a>
                            <button onClick={resetRecording} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">
                                Record Again
                            </button>
                        </div>
                    </div>
                );
            default: // inactive
                return (
                    <button onClick={startRecording} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform hover:scale-105">
                        Start Recording
                    </button>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-10">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Record, play, and download audio directly in your browser.</p>
            </div>
            <div className="min-h-[150px] flex flex-col items-center justify-center">
                {error ? <p className="text-red-500 dark:text-red-400">{error}</p> : renderControls()}
            </div>
        </div>
    );
};