import React, { useState } from 'react';
import { generateUsernames } from '../../services/geminiService';
import { Toast } from '../Toast';

const styles = ['Professional', 'Gaming', 'Cool/Mysterious', 'Cute/Aesthetic'];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="username-loader mx-auto">
            <div className="user-icon">👤</div>
            <div className="char char1">a</div>
            <div className="char char2">_</div>
            <div className="char char3">7</div>
            <div className="char char4">z</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating usernames...</p>
    </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

export const UsernameCreator: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [style, setStyle] = useState(styles[0]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!keyword.trim()) {
            setError("Please enter a name or keyword.");
            return;
        }
        setIsLoading(true);
        setUsernames([]);
        setError(null);

        try {
            const result = await generateUsernames(keyword, style);
            setUsernames(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate usernames.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Username Creator 👤</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate unique usernames for your social media.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name or a Keyword</label>
                        <input
                            id="keyword"
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g., Alex, Starlight, Coder"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username Style</label>
                         <div className="flex flex-wrap gap-2">
                            {styles.map(s => (
                                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${style === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !keyword.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Generating...' : 'Generate Usernames'}
                    </button>
                </div>
                
                <div className="mt-8 min-h-[250px] flex flex-col">
                    {isLoading ? (
                        <div className="m-auto"><Loader /></div>
                    ) : usernames.length > 0 ? (
                        <div className="w-full space-y-3 animate-fade-in">
                            {usernames.map((name, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold font-mono text-slate-800 dark:text-slate-200">{name}</p>
                                    <CopyButton textToCopy={name} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            <p className="mt-4 text-lg">Your unique usernames will appear here.</p>
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
                .username-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .user-icon {
                    font-size: 50px;
                    color: #6366f1; /* indigo-500 */
                }
                .dark .user-icon {
                    color: #818cf8; /* indigo-400 */
                }
                .char {
                    position: absolute;
                    font-size: 20px;
                    font-weight: bold;
                    color: #a5b4fc; /* indigo-300 */
                    animation: orbit-char 3s infinite linear;
                }
                .char.char1 { animation-delay: 0s; }
                .char.char2 { animation-delay: -0.75s; }
                .char.char3 { animation-delay: -1.5s; }
                .char.char4 { animation-delay: -2.25s; }

                @keyframes orbit-char {
                    0% { transform: rotate(0deg) translateX(50px) rotate(0deg) scale(0.5); opacity: 0; }
                    25% { opacity: 1; }
                    75% { opacity: 1; }
                    100% { transform: rotate(360deg) translateX(50px) rotate(-360deg) scale(1); opacity: 0; }
                }
            `}</style>
        </>
    );
};
