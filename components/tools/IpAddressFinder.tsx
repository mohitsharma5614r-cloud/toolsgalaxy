
import React, { useState } from 'react';
import { Toast } from '../Toast';

interface IpData {
    query: string;
    city: string;
    regionName: string;
    country: string;
    isp: string;
}

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="globe-loader mx-auto">
            <div className="globe">
                <div className="dot"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Searching for your IP address...</p>
        <style>{`
            .globe-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .globe {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #a5b4fc;
                border: 3px solid #6366f1;
                animation: spin-globe 4s linear infinite;
                position: relative;
            }
            .dark .globe {
                background: #4f46e5;
                border-color: #818cf8;
            }
            .dot {
                position: absolute;
                width: 12px;
                height: 12px;
                background: #f87171;
                border-radius: 50%;
                top: 30%;
                left: 30%;
                box-shadow: 0 0 10px #f87171;
                animation: pulse-dot 2s infinite ease-in-out;
            }
            @keyframes spin-globe {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes pulse-dot {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.4); }
            }
        `}</style>
    </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
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

export const IpAddressFinder: React.FC<{ title: string }> = ({ title }) => {
    const [ipData, setIpData] = useState<IpData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIpData = async () => {
        setIsLoading(true);
        setError(null);
        setIpData(null);
        try {
            const response = await fetch('http://ip-api.com/json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.status === 'fail') {
                throw new Error(data.message || 'Could not fetch IP data.');
            }
            setIpData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 📍</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find your public IP address and approximate location.</p>
                </div>

                <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : ipData ? (
                        <div className="w-full animate-fade-in space-y-4">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Your Public IP Address is</p>
                                <div className="flex items-center justify-center gap-4 my-2">
                                    <p className="text-4xl font-bold font-mono text-indigo-600 dark:text-indigo-400">{ipData.query}</p>
                                    <CopyButton text={ipData.query} />
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="info-row"><span className="info-label">City:</span> <span className="info-value">{ipData.city}</span></div>
                                <div className="info-row"><span className="info-label">Region:</span> <span className="info-value">{ipData.regionName}</span></div>
                                <div className="info-row"><span className="info-label">Country:</span> <span className="info-value">{ipData.country}</span></div>
                                <div className="info-row"><span className="info-label">ISP:</span> <span className="info-value">{ipData.isp}</span></div>
                            </div>
                            <div className="text-center pt-4">
                                 <button onClick={fetchIpData} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">Check Again</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button onClick={fetchIpData} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105">
                                Find My IP
                            </button>
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
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 1rem;
                    background-color: #f1f5f9; /* slate-100 */
                    border-radius: 0.5rem;
                }
                .dark .info-row {
                    background-color: #1e293b; /* slate-800 */
                }
                .info-label {
                    font-weight: 600;
                    color: #64748b; /* slate-500 */
                }
                .dark .info-label {
                    color: #94a3b8; /* slate-400 */
                }
                .info-value {
                    font-weight: 500;
                    color: #0f172a; /* slate-900 */
                }
                .dark .info-value {
                    color: #f1f5f9; /* slate-100 */
                }
            `}</style>
        </>
    );
};
