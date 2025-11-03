
import React, { useState, useRef, useCallback } from 'react';
import { FileUploader } from '../FileUploader';
import { Toast } from '../Toast';

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8">
        <div className="waveform-loader mx-auto">
            {Array.from({ length: 20 }).map((_, i) => <div key={i} className="bar" style={{ animationDelay: `${i * 50}ms` }}></div>)}
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <style>{`
            .waveform-loader { width: 120px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
            .bar { width: 4px; height: 10px; background-color: #6366f1; border-radius: 2px; animation: wave 1.2s infinite ease-in-out; }
            @keyframes wave { 0%, 100% { height: 10px; } 50% { height: 60px; } }
        `}</style>
    </div>
);

export const AudioSpectrumVisualizer: React.FC<{ title: string }> = ({ title }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationFrameId = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    const draw = (analyser: AnalyserNode, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawLoop = () => {
            animationFrameId.current = requestAnimationFrame(drawLoop);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                const r = barHeight + (25 * (i / bufferLength));
                const g = 250 * (i / bufferLength);
                const b = 50;
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
        };
        drawLoop();
    };
    
    const handleGenerateVideo = async () => {
        if (!audioFile) {
            setError("Please select an audio file first.");
            return;
        }
        
        setIsLoading(true);
        setLoadingMessage("Generating video... this may take a while.");

        try {
            if (!audioContextRef.current) {
                 audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const audioContext = audioContextRef.current;
            const arrayBuffer = await audioFile.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            const analyser = audioContext.createAnalyser();
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d')!;

            const dest = audioContext.createMediaStreamDestination();
            source.connect(analyser);
            analyser.connect(dest);
            
            draw(analyser, ctx, canvas);

            const videoStream = canvas.captureStream(30); // 30 FPS
            const audioStream = dest.stream;
            const combinedStream = new MediaStream([...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()]);

            mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
            recordedChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `visualizer-${audioFile.name}.webm`;
                a.click();
                URL.revokeObjectURL(url);
                setIsLoading(false);
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            };

            mediaRecorderRef.current.start();
            source.start(0);

            source.onended = () => {
                if(mediaRecorderRef.current) mediaRecorderRef.current.stop();
            };

        } catch (e) {
            setError("Failed to process audio or generate video.");
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setAudioFile(null);
        setError(null);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a dynamic video animation from your audio file.</p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center">
                        <Loader message={loadingMessage} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {!audioFile ? (
                             <FileUploader onFileSelected={setAudioFile} acceptedTypes="audio/*" label="Upload an Audio File" />
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <canvas ref={canvasRef} className="w-full h-48 rounded-lg bg-slate-100 dark:bg-slate-900" />
                                 <div className="flex gap-4">
                                     <button onClick={handleReset} className="w-full btn-secondary">Change Audio</button>
                                     <button onClick={handleGenerateVideo} className="w-full btn-primary">Generate Video (WebM)</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};
