
import React, { useState, useRef, useCallback } from 'react';
import { Toast } from '../Toast';

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="record-loader mx-auto">
            <div className="record-dot"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .record-loader {
                width: 80px; height: 80px;
                background-color: #f1f5f9;
                border: 4px solid #cbd5e1;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dark .record-loader {
                 background-color: #334155;
                 border-color: #475569;
            }
            .record-dot {
                width: 30px; height: 30px;
                background-color: #ef4444;
                border-radius: 50%;
                animation: pulse-record 1.5s infinite;
            }
            @keyframes pulse-record {
                0%, 100% { transform: scale(0.9); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }
        `}</style>
    </div>
);

const RecordIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);


export const ScreenRecorder: React.FC<{ title: string }> = ({ title }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    }, []);

    const startRecording = useCallback(async () => {
        setRecordedUrl(null);
        setError(null);

        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" } as any, // Cast to any to allow mediaSource
                audio: true,
            });
            
            let combinedStream: MediaStream;

            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({
                     audio: { echoCancellation: true, noiseSuppression: true }
                });
                const [videoTrack] = displayStream.getVideoTracks();
                const audioTracks = audioStream.getAudioTracks();
                const displayAudioTracks = displayStream.getAudioTracks();
                
                combinedStream = new MediaStream([videoTrack, ...audioTracks, ...displayAudioTracks]);
            } catch (audioErr) {
                console.warn("Microphone access denied or unavailable. Recording screen without mic audio.");
                combinedStream = displayStream;
            }
            
            streamRef.current = combinedStream;
            const [videoTrack] = combinedStream.getVideoTracks();

            videoTrack.onended = () => stopRecording();

            const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedUrl(url);
                recordedChunksRef.current = [];
            };
            
            recorder.start();
            setIsRecording(true);

        } catch (err) {
            console.error("Error starting screen recording:", err);
            setError("Could not start screen recording. Please grant permissions and try again.");
            setIsRecording(false);
        }
    }, [stopRecording]);

    const handleReset = () => {
        setRecordedUrl(null);
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Record your screen, system audio, and microphone directly in your browser.</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {recordedUrl ? (
                         <div className="animate-fade-in text-center space-y-4">
                            <h2 className="text-2xl font-bold">Your Recording is Ready!</h2>
                            <video src={recordedUrl} controls className="w-full rounded-lg shadow-md" />
                            <div className="flex gap-4 justify-center">
                                <a href={recordedUrl} download={`screen-recording-${Date.now()}.webm`} className="btn-primary">Download</a>
                                <button onClick={handleReset} className="btn-secondary">Record Again</button>
                            </div>
                         </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[250px] space-y-6">
                            {isRecording ? <Loader message="Recording..." /> : <RecordIcon />}
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`px-8 py-4 font-bold text-lg rounded-full shadow-lg transition-all ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                            <p className="text-sm text-slate-400 text-center">Your browser will ask for permission to share your screen and microphone.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </>
    );
};
