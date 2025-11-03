import React, { useState, useEffect, useRef } from 'react';
import { Toast } from '../Toast';

const AudioVisualizer: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => (
    <div className="flex justify-center items-center h-24">
        {Array.from({ length: 7 }).map((_, i) => (
            <div
                key={i}
                className={`w-3 rounded-full bg-indigo-400 mx-1 transition-all duration-300 ${isSpeaking ? 'animate-dance' : 'h-3'}`}
                style={{ animationDelay: `${i * 100}ms` }}
            ></div>
        ))}
        <style>{`
            @keyframes dance {
                0%, 100% { height: 12px; }
                50% { height: 80px; }
            }
            .animate-dance {
                animation: dance 1.2s infinite ease-in-out;
            }
        `}</style>
    </div>
);

export const EnglishPronunciationHelper: React.FC<{ title: string }> = ({ title }) => {
    const [text, setText] = useState('Hello, world!');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            // Filter for English voices if possible
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
            if (englishVoices.length > 0) {
                setSelectedVoice(englishVoices.find(v => v.default)?.name || englishVoices[0].name);
            }
        };

        // Voices are loaded asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleSpeak = () => {
        if (!text.trim()) {
            setError("Please enter some text to pronounce.");
            return;
        }
        if (!('speechSynthesis' in window)) {
            setError("Your browser does not support text-to-speech.");
            return;
        }

        window.speechSynthesis.cancel(); // Cancel any ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            setError("An error occurred during speech synthesis.");
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 🔊</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Hear the correct pronunciation of English words and phrases.</p>
                </div>

                <div className="space-y-6">
                    <AudioVisualizer isSpeaking={isSpeaking} />
                    <div className="space-y-4">
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={3}
                            placeholder="Enter text to pronounce..."
                            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white text-lg"
                        />
                        <select
                            value={selectedVoice}
                            onChange={e => setSelectedVoice(e.target.value)}
                            className="w-full p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg"
                        >
                            {voices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg disabled:bg-slate-400"
                    >
                        {isSpeaking ? 'Speaking...' : 'Pronounce'}
                    </button>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};
