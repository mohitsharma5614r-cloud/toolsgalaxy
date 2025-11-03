
import React, { useState } from 'react';

// Word lists for generation
const prefixes = ['get', 'my', 'the', 'go', 'pro', 'cloud'];
const suffixes = ['ify', 'ly', 'io', 'co', 'app', 'base', 'hub', 'lab'];
const tlds = ['.com', '.io', '.dev', '.app', '.co', '.net', '.org'];

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="domain-loader mx-auto">
            <div className="globe">
                 <div className="tld t1">.com</div>
                 <div className="tld t2">.io</div>
                 <div className="tld t3">.dev</div>
                 <div className="tld t4">.app</div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Searching the web for ideas...</p>
    </div>
);

// Copy Button Component
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

// Main Component
export const DomainNameIdeaGenerator: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [domains, setDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const generateDomains = () => {
        if (!keyword.trim()) return;
        setIsLoading(true);
        setDomains([]);

        setTimeout(() => {
            const keywordBase = keyword.trim().toLowerCase().replace(/\s+/g, '');
            const generated: string[] = [];

            // Simple keyword + TLD
            tlds.slice(0, 4).forEach(tld => generated.push(`${keywordBase}${tld}`));

            // Prefix + keyword + TLD
            generated.push(`${prefixes[Math.floor(Math.random() * prefixes.length)]}${keywordBase}${tlds[0]}`);
            generated.push(`${prefixes[Math.floor(Math.random() * prefixes.length)]}${keywordBase}${tlds[1]}`);

            // Keyword + suffix + TLD
            generated.push(`${keywordBase}${suffixes[Math.floor(Math.random() * suffixes.length)]}${tlds[2]}`);
            generated.push(`${keywordBase}${suffixes[Math.floor(Math.random() * suffixes.length)]}${tlds[3]}`);
            
            // Combination
            generated.push(`the${keywordBase}hub${tlds[1]}`);
            generated.push(`${keywordBase}lab${tlds[0]}`);

            // Remove duplicates and set
            setDomains([...new Set(generated)]);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Domain Name Idea Generator 🌐</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Brainstorm ideas for your next domain name.</p>
            </div>
            
            <div className="space-y-4">
                <label htmlFor="keyword-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter a keyword</label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        id="keyword-input"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateDomains()}
                        placeholder="e.g., coffee, tech, garden"
                        className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                     <button
                        onClick={generateDomains}
                        disabled={isLoading || !keyword.trim()}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400"
                    >
                      {isLoading ? 'Generating...' : 'Generate Ideas'}
                    </button>
                </div>
            </div>
            
            <div className="mt-8 min-h-[250px] flex flex-col">
                {isLoading ? (
                    <div className="m-auto"><Loader /></div>
                ) : domains.length > 0 ? (
                    <div className="w-full space-y-3 animate-fade-in">
                        {domains.map((domain, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                <p className="text-lg font-semibold font-mono text-slate-800 dark:text-slate-200">{domain}</p>
                                <CopyButton textToCopy={domain} />
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="m-auto text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <p className="mt-4 text-lg">Your domain name ideas will appear here.</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .domain-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .globe {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #a5b4fc; /* indigo-300 */
                    border: 3px solid #6366f1;
                    animation: spin-globe 4s linear infinite;
                    overflow: hidden;
                    position: relative;
                }
                .dark .globe { background: #4f46e5; border-color: #818cf8; }

                .tld {
                    position: absolute;
                    background: rgba(255,255,255,0.8);
                    color: #4f46e5;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 2px 4px;
                    border-radius: 4px;
                    opacity: 0;
                    animation: pop-tld 2s infinite;
                }
                .dark .tld { background: rgba(0,0,0,0.5); color: #c7d2fe; }

                .tld.t1 { top: 20%; left: 10%; animation-delay: 0s; }
                .tld.t2 { top: 70%; left: 20%; animation-delay: 0.5s; }
                .tld.t3 { top: 15%; right: 15%; animation-delay: 1s; }
                .tld.t4 { top: 60%; right: 5%; animation-delay: 1.5s; }

                @keyframes spin-globe {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes pop-tld {
                    0%, 100% { transform: scale(0.5); opacity: 0; }
                    25% { transform: scale(1.2); opacity: 1; }
                    50%, 100% { transform: scale(0.5); opacity: 0; }
                }

            `}</style>
        </div>
    );
};
      