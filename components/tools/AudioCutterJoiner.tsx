
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
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

// Helper function to encode AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
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
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return arrayBuffer;
}

export const AudioCutterJoiner: React.FC<{ title: string }> = ({ title }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const waveformRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const drawWaveform = useCallback((buffer: AudioBuffer) => {
        const canvas = waveformRef.current;
        if (!canvas || !buffer) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 100;
        const data = buffer.getChannelData(0);
        const step = Math.ceil(data.length / canvas.width);
        const amp = canvas.height / 2;

        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#4f46e5';
        ctx.beginPath();

        for (let i = 0; i < canvas.width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[(i * step) + j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            ctx.moveTo(i, (1 + min) * amp);
            ctx.lineTo(i, (1 + max) * amp);
        }
        ctx.stroke();
    }, []);

    const handleFileSelect = useCallback(async (file: File) => {
        setAudioFile(file);
        setIsLoading(true);
        setError(null);
        setAudioBuffer(null);
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            setAudioBuffer(buffer);
            setTrimStart(0);
            setTrimEnd(buffer.duration);
        } catch (e) {
            setError("Failed to decode audio file. Please use a common format like MP3, WAV, or AAC.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (audioBuffer) drawWaveform(audioBuffer);
    }, [audioBuffer, drawWaveform]);

    const handleTrim = () => {
        if (!audioBuffer || trimStart >= trimEnd) {
            setError("Invalid trim selection.");
            return;
        }

        const ctx = audioContextRef.current!;
        const startOffset = Math.floor(trimStart * audioBuffer.sampleRate);
        const endOffset = Math.ceil(trimEnd * audioBuffer.sampleRate);
        const frameCount = endOffset - startOffset;

        if (frameCount <= 0) {
            setError("Trim selection is empty.");
            return;
        }

        const newBuffer = ctx.createBuffer(
            audioBuffer.numberOfChannels,
            frameCount,
            audioBuffer.sampleRate
        );

        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            const channelData = audioBuffer.getChannelData(i);
            const newChannelData = newBuffer.getChannelData(i);
            newChannelData.set(channelData.subarray(startOffset, endOffset));
        }

        const wavBuffer = audioBufferToWav(newBuffer);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `trimmed-${audioFile?.name.split('.')[0]}.wav`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Trim audio files online. Audio joining coming soon!</p>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    {isLoading ? (
                        <div className="min-h-[250px] flex items-center justify-center"><Loader message="Decoding audio..." /></div>
                    ) : !audioBuffer ? (
                        <FileUploader onFileSelected={handleFileSelect} acceptedTypes="audio/*" label="Upload an Audio File" />
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="relative w-full">
                                <canvas ref={waveformRef} className="w-full h-24 rounded-lg" />
                                <div className="absolute top-0 bottom-0 left-0 right-0">
                                    <input type="range" min="0" max={audioBuffer.duration} step="0.1" value={trimStart} onChange={e => setTrimStart(parseFloat(e.target.value))}
                                           className="absolute w-full h-full appearance-none bg-transparent pointer-events-none slider-thumb" />
                                    <input type="range" min="0" max={audioBuffer.duration} step="0.1" value={trimEnd} onChange={e => setTrimEnd(parseFloat(e.target.value))}
                                           className="absolute w-full h-full appearance-none bg-transparent pointer-events-none slider-thumb" />
                                    
                                     <div className="absolute top-0 bottom-0 bg-black/30" style={{ left: 0, width: `${(trimStart / audioBuffer.duration) * 100}%` }}></div>
                                     <div className="absolute top-0 bottom-0 bg-black/30" style={{ right: 0, width: `${100 - (trimEnd / audioBuffer.duration) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <label className="text-sm font-semibold">Start: {trimStart.toFixed(2)}s</label>
                                </div>
                                <div className="text-center">
                                     <label className="text-sm font-semibold">End: {trimEnd.toFixed(2)}s</label>
                                </div>
                            </div>
                            <button onClick={handleTrim} className="w-full btn-primary text-lg">Trim and Download WAV</button>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .slider-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 10px;
                    height: 100px;
                    background: #ef4444;
                    cursor: ew-resize;
                    pointer-events: auto;
                    border-radius: 2px;
                }
            `}</style>
        </>
    );
};
