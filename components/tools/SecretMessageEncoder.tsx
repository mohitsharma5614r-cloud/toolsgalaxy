import React, { useState } from 'react';
import { Toast } from '../Toast';

type Method = 'base64' | 'caesar' | 'binary';
type Action = 'encode' | 'decode';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="encoder-loader mx-auto">
            <div className="lock-body">
                <div className="lock-shackle"></div>
            </div>
            <div className="binary-stream s1">01011001</div>
            <div className="binary-stream s2">11010010</div>
            <div className="binary-stream s3">00101101</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Processing message...</p>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            disabled={!textToCopy}
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition-transform duration-200 hover:scale-105 disabled:bg-slate-400"
        >
            {copied ? 'Copied!' : 'Copy Result'}
        </button>
    );
};

export const SecretMessageEncoder: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [method, setMethod] = useState<Method>('base64');
    const [action, setAction] = useState<Action>('encode');
    const [caesarShift, setCaesarShift] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processText = () => {
        if (!inputText.trim()) {
            setError("Please enter a message to process.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutputText('');

        setTimeout(() => {
            try {
                let result = '';
                if (method === 'base64') {
                    result = action === 'encode' ? btoa(inputText) : atob(inputText);
                } else if (method === 'binary') {
                    if (action === 'encode') {
                        result = inputText.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                    } else {
                        result = inputText.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
                    }
                } else if (method === 'caesar') {
                    const shift = action === 'encode' ? caesarShift : -caesarShift;
                    result = inputText.replace(/[a-zA-Z]/g, (char) => {
                        const code = char.charCodeAt(0);
                        const isUpperCase = code >= 65 && code <= 90;
                        const start = isUpperCase ? 65 : 97;
                        return String.fromCharCode(((code - start + shift + 26) % 26) + start);
                    });
                }
                setOutputText(result);
            } catch (e) {
                setError("Invalid input for the selected decoding method. Please check your text.");
            } finally {
                setIsLoading(false);
            }
        }, 2000); // Simulate processing time for animation
    };
    
    const handleClear = () => {
        setInputText('');
        setOutputText('');
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Secret Message Encoder 🔐</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Encrypt and decrypt messages with various ciphers.</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                            <label className="block text-sm font-medium mb-2">Method</label>
                            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                                <button onClick={() => setMethod('base64')} className={`flex-1 btn-toggle ${method === 'base64' ? 'btn-toggle-active' : ''}`}>Base64</button>
                                <button onClick={() => setMethod('caesar')} className={`flex-1 btn-toggle ${method === 'caesar' ? 'btn-toggle-active' : ''}`}>Caesar</button>
                                <button onClick={() => setMethod('binary')} className={`flex-1 btn-toggle ${method === 'binary' ? 'btn-toggle-active' : ''}`}>Binary</button>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Action</label>
                            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                                <button onClick={() => setAction('encode')} className={`flex-1 btn-toggle ${action === 'encode' ? 'btn-toggle-active' : ''}`}>Encode</button>
                                <button onClick={() => setAction('decode')} className={`flex-1 btn-toggle ${action === 'decode' ? 'btn-toggle-active' : ''}`}>Decode</button>
                            </div>
                        </div>
                    </div>
                    
                    {method === 'caesar' && (
                        <div className="animate-fade-in">
                            <label htmlFor="caesar-shift" className="block text-sm font-medium mb-1">Caesar Shift ({caesarShift})</label>
                            <input id="caesar-shift" type="range" min="1" max="25" value={caesarShift} onChange={e => setCaesarShift(Number(e.target.value))} className="w-full" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Input</label>
                            <textarea value={inputText} onChange={e => setInputText(e.target.value)} rows={6} className="input-style font-mono" placeholder="Your message here..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Output</label>
                            <div className="h-full min-h-[156px] flex flex-col justify-center items-center p-3 input-style font-mono bg-slate-100 dark:bg-slate-900/50">
                                {isLoading ? <Loader/> : <p className="w-full h-full whitespace-pre-wrap break-words">{outputText}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button onClick={handleClear} className="w-full px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-md shadow-sm">Clear</button>
                        <CopyButton textToCopy={outputText} />
                        <button onClick={processText} disabled={isLoading} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg disabled:bg-slate-400">
                            Process Message
                        </button>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { width: 100%; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .btn-toggle { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; transition: all 0.2s; }
                .btn-toggle-active { background-color: white; color: #334155; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); }
                .dark .btn-toggle-active { background-color: #1e293b; color: white; }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .encoder-loader {
                    width: 80px; height: 80px; position: relative;
                }
                .lock-body {
                    width: 50px; height: 40px; background: #64748b; border-radius: 8px;
                    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
                }
                .lock-shackle {
                    width: 30px; height: 25px; border: 8px solid #64748b; border-bottom: 0;
                    border-radius: 15px 15px 0 0; position: absolute; top: -25px; left: 10px;
                    transform-origin: 0 100%; animation: unlock 2s infinite ease-in-out;
                }
                .dark .lock-body, .dark .lock-shackle { background-color: #94a3b8; border-color: #94a3b8; }
                
                .binary-stream {
                    position: absolute; font-family: monospace; font-size: 14px; color: #818cf8;
                    opacity: 0; animation: stream 2s infinite linear;
                }
                .s1 { top: 0; left: -20px; animation-delay: 0s; }
                .s2 { top: 30px; left: -40px; animation-delay: 0.5s; }
                .s3 { top: 60px; left: -30px; animation-delay: 1s; }

                @keyframes unlock {
                    0%, 20%, 80%, 100% { transform: rotate(0); top: -25px; }
                    40% { transform: rotate(30deg); top: -30px; }
                    60% { transform: rotate(0); top: -25px; }
                }

                @keyframes stream {
                    0% { transform: translateX(0); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateX(120px); opacity: 0; }
                }

            `}</style>
        </>
    );
};
