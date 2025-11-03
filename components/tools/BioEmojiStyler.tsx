import React, { useState } from 'react';
import { generateBioEmojis } from '../../services/geminiService';
import { Toast } from '../Toast';

// FIX: Defined props interface and used React.FC to correctly type the component,
// allowing special props like `key` to be used without TypeScript errors.
interface EmojiButtonProps {
    emoji: string;
}

// Copy button for individual emojis
const EmojiButton: React.FC<EmojiButtonProps> = ({ emoji }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(emoji);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="relative p-3 text-3xl bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-transform hover:scale-110" title={`Copy ${emoji}`}>
            {emoji}
            {copied && (
                <span className="absolute -top-2 -right-2 text-xs bg-emerald-500 text-white rounded-full px-1.5 py-0.5">✓</span>
            )}
        </button>
    );
};


export const BioEmojiStyler: React.FC<{ title: string }> = ({ title }) => {
    const [bioText, setBioText] = useState('');
    const [emojis, setEmojis] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!bioText.trim()) {
            setError("Please enter some text for your bio.");
            return;
        }
        setIsLoading(true);
        setEmojis([]);
        setError(null);

        try {
            const result = await generateBioEmojis(bioText);
            // Split emoji string into an array of individual emojis
            setEmojis([...result]); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate emojis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Let AI find the perfect emojis to make your bio pop.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="bioText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Bio Text</label>
                        <textarea
                            id="bioText"
                            rows={3}
                            value={bioText}
                            onChange={(e) => setBioText(e.target.value)}
                            placeholder="e.g., Building cool projects with code. Coffee lover. Exploring the world one city at a time."
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !bioText.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Generating...' : 'Find Emojis'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[150px] flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="emoji-loader mx-auto">
                                <div className="base-emoji">🤔</div>
                                <div className="pop-emoji e1">💡</div>
                                <div className="pop-emoji e2">✨</div>
                                <div className="pop-emoji e3">🚀</div>
                                <div className="pop-emoji e4">✅</div>
                            </div>
                            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding perfect emojis...</p>
                        </div>
                    ) : emojis.length > 0 ? (
                        <div className="w-full animate-fade-in text-center">
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Click an emoji to copy it!</h3>
                            <div className="flex flex-wrap gap-4 justify-center bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                                {emojis.map((emoji, index) => (
                                    <EmojiButton key={index} emoji={emoji} />
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <p className="text-lg">Your emoji suggestions will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                
                .emoji-loader {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }
                .base-emoji {
                    font-size: 80px;
                    line-height: 1;
                    animation: think-bobble 2.5s infinite ease-in-out;
                }
                .pop-emoji {
                    position: absolute;
                    font-size: 30px;
                    opacity: 0;
                    animation: pop-out 2.5s infinite;
                }
                .e1 { top: -20px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
                .e2 { top: 50%; left: -20px; transform: translateY(-50%); animation-delay: 0.5s; }
                .e3 { top: 50%; right: -20px; transform: translateY(-50%); animation-delay: 1s; }
                .e4 { bottom: -10px; left: 50%; transform: translateX(-50%); animation-delay: 1.5s; }

                @keyframes think-bobble {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-5px) scale(1.05); }
                }
                
                @keyframes pop-out {
                    0%, 20%, 100% { opacity: 0; transform: scale(0.5) translate(var(--tx, 0), var(--ty, 0)); }
                    40% { opacity: 1; transform: scale(1.2) translate(var(--tx, 0), var(--ty, 0)); }
                    60% { opacity: 0; transform: scale(0.5) translate(var(--tx, 0), var(--ty, 0)); }
                }
                .e1 { --ty: -15px; }
                .e2 { --tx: -15px; }
                .e3 { --tx: 15px; }
                .e4 { --ty: 15px; }
            `}</style>
        </>
    );
};
