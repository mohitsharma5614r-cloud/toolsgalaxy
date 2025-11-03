import React, { useState, useEffect, useRef } from 'react';
import { Toast } from '../Toast';

const AudioVisualizer: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => (
    <div className="flex justify-center items-center h-20 bg-slate-200 dark:bg-slate-700 rounded-lg">
        {Array.from({ length: 20 }).map((_, i) => (
            <div
                key={i}
                className={`w-2 rounded-full bg-indigo-400 mx-1 transition-all duration-300 ${isSpeaking ? 'animate-dance' : 'h-2'}`}
                style={{ animationDelay: `${i * 70}ms` }}
            ></div>
        ))}
        <style>{`
            @keyframes dance {
                0%, 100% { height: 8px; }
                50% { height: 60px; }
            }
            .animate-dance {
                animation: dance 1.5s infinite ease-in-out;
            }
        `}</style>
    </div>
);

export const TextToSpeechTool: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('Hello! This is a demonstration of the text-to-speech tool. You can type anything here and I will read it for you.');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
            if (englishVoices.length > 0) {
                setSelectedVoice(englishVoices.find(v => v.default)?.name || englishVoices[0].name);
            }
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleSpeak = () => {
        if (!text.trim() || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            setError("An error occurred during speech synthesis.");
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Listen to any text read aloud in a natural voice.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <AudioVisualizer isSpeaking={isSpeaking} />
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        rows={8}
                        placeholder="Enter text here..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                    />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                             <label className="block text-sm font-medium mb-1">Voice</label>
                             <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                {voices.map(voice => (
                                    <option key={voice.name} value={voice.name}>{voice.name} ({voice.lang})</option>
                                ))}
                            </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium mb-1">Rate: {rate}</label>
                              <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" />
                         </div>
                          <div>
                             <label className="block text-sm font-medium mb-1">Pitch: {pitch}</label>
                             <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full" />
                         </div>
                     </div>
                    <div className="flex gap-4">
                         <button onClick={handleSpeak} disabled={isSpeaking} className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md disabled:bg-slate-400">
                            {isSpeaking ? 'Speaking...' : 'Speak'}
                        </button>
                         <button onClick={handleStop} disabled={!isSpeaking} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md disabled:bg-slate-400">
                            Stop
                        </button>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};
