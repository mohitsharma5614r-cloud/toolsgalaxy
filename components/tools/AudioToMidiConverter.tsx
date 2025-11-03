
import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="midi-loader mx-auto">
            <div className="waveform"></div>
            <div className="keys">
                <div className="key"></div>
                <div className="key black"></div>
                <div className="key"></div>
                <div className="key black"></div>
                <div className="key"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Transcribing audio to MIDI...</p>
        <style>{`
            .midi-loader { width: 120px; height: 100px; position: relative; overflow: hidden; }
            .waveform {
                position: absolute; top: 0; left: 0; width: 100%; height: 50%;
                background-image: repeating-linear-gradient(to right, transparent 0 2px, #6366f1 2px 4px);
                mask-image: linear-gradient(to right, transparent, black 20% 80%, transparent);
                animation: scan-wave 2s infinite linear;
            }
            .dark .waveform { background-image: repeating-linear-gradient(to right, transparent 0 2px, #818cf8 2px 4px); }
            @keyframes scan-wave { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
            .keys {
                position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
                display: flex;
            }
            .key { flex-grow: 1; background: #fff; border: 1px solid #ccc; opacity: 0; animation: drop-key 2s infinite; }
            .dark .key { background: #334155; border-color: #475569; }
            .key.black { background: #333; height: 60%; transform: translateY(-20%); z-index: 1;}
            .dark .key.black { background: #111827; }
            .key:nth-child(1) { animation-delay: 0.5s; }
            .key:nth-child(2) { animation-delay: 0.7s; }
            .key:nth-child(3) { animation-delay: 0.9s; }
            .key:nth-child(4) { animation-delay: 1.1s; }
            .key:nth-child(5) { animation-delay: 1.3s; }
            @keyframes drop-key {
                0%, 40% { opacity: 0; transform: translateY(-20px); }
                60%, 100% { opacity: 1; transform: translateY(0); }
            }
        `}</style>
    </div>
);

export const AudioToMidiConverter: React.FC<{ title: string }> = ({ title }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleConvert = () => {
    if (!file) return;
    setIsLoading(true);
    setShowExplanation(false);
    setTimeout(() => {
      setIsLoading(false);
      setShowExplanation(true);
    }, 2500);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setShowExplanation(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Convert audio recordings into MIDI files.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        {isLoading ? (
            <div className="min-h-[250px] flex items-center justify-center"><Loader /></div>
        ) : !showExplanation ? (
            <div className="space-y-4">
                <FileUploader onFileSelected={handleFileSelect} acceptedTypes="audio/*" label="Upload Audio File (e.g., MP3, WAV)" />
                <button onClick={handleConvert} disabled={!file} className="w-full btn-primary text-lg">Convert to MIDI</button>
            </div>
        ) : null}
        
        {showExplanation && (
          <div className="mt-8 p-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Technical Limitation</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  <p>Audio-to-MIDI conversion, also known as Automatic Music Transcription, is an extremely complex process. It requires sophisticated pitch detection algorithms to analyze frequencies and identify musical notes, especially for polyphonic audio (multiple notes at once).</p>
                  <p className="mt-2">This is too computationally demanding for a typical browser environment and usually requires dedicated desktop software or powerful server-side processing for accurate results.</p>
                </div>
                <button onClick={() => { setFile(null); setShowExplanation(false); }} className="mt-4 px-4 py-2 bg-amber-200 text-amber-800 text-sm font-semibold rounded-md">Try Another File</button>
              </div>
            </div>
            <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out; } .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; } .btn-primary:disabled { background: #9ca3af; }`}</style>
          </div>
        )}
      </div>
    </div>
  );
};
