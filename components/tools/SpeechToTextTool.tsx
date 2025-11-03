import React, { useState, useEffect, useRef } from 'react';
import { Toast } from '../Toast';

// FIX: Cast window to `any` to access non-standard properties.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const MicIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
    <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        {isListening && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-500 rounded-full animate-pulse-mic opacity-50"></div>
            </div>
        )}
         <style>{`
            @keyframes pulse-mic {
                0% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.2); opacity: 0.2; }
                100% { transform: scale(0.8); opacity: 0.5; }
            }
            .animate-pulse-mic {
                animation: pulse-mic 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
            }
        `}</style>
    </div>
);

export const SpeechToTextTool: React.FC<{ title: string }> = ({ title }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setTranscript(interim);
            if(final) {
                setFinalTranscript(prev => prev + final + '. ');
            }
        };

        recognition.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };
        
        recognition.onend = () => {
             setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setFinalTranscript(''); // Clear previous results on new start
            recognitionRef.current?.start();
        }
        setIsListening(!isListening);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(finalTranscript);
    };


    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Transcribe your speech to text in real-time using your microphone.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                    <button
                        onClick={toggleListening}
                        disabled={!SpeechRecognition}
                        className={`mx-auto flex flex-col items-center justify-center w-32 h-32 rounded-full transition-colors duration-300 ${isListening ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                    >
                        <MicIcon isListening={isListening} />
                        <span className="mt-2 font-semibold text-sm">{isListening ? 'Stop Listening' : 'Start Listening'}</span>
                    </button>
                    
                    <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg min-h-[200px] text-left">
                        <p className="whitespace-pre-wrap">{finalTranscript}<span className="text-slate-400">{transcript}</span></p>
                    </div>
                    
                    <button onClick={handleCopy} disabled={!finalTranscript} className="mt-4 px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md disabled:bg-slate-300">
                        Copy Text
                    </button>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </>
    );
};
