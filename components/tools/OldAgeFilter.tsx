import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { applyOldAgeFilter } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="aging-loader mx-auto">
            <div className="clock-face">
                <div className="hour-hand"></div>
                <div className="minute-hand"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Advancing through time...</p>
    </div>
);

export const OldAgeFilter: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [agedImageUrl, setAgedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setOriginalFile(file);
        setAgedImageUrl(null);
        setError(null);
        setIsLoading(true);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const generatedImageBase64 = await applyOldAgeFilter(base64, mimeType);
            if (generatedImageBase64) {
                setAgedImageUrl(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI failed to generate an aged image. Please try another photo.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setOriginalFile(null); // Reset on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReset = () => {
        setOriginalFile(null);
        setAgedImageUrl(null);
        setError(null);
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!agedImageUrl) return;
        const link = document.createElement('a');
        link.href = agedImageUrl;
        link.download = `old-age-filter-${Date.now()}.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Old Age Filter 👴</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">See what you might look like when you're older (just for fun!).</p>
                </div>

                {!originalFile && !isLoading ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : agedImageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <img src={agedImageUrl} alt="Generated aged face" className="rounded-lg shadow-lg mx-auto max-w-full h-auto max-h-[70vh]" />
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">
                                        Download Image
                                    </button>
                                    <button onClick={handleReset} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">
                                        Try Another
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .aging-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .clock-face {
                    width: 100%;
                    height: 100%;
                    border: 6px solid #9ca3af; /* slate-400 */
                    border-radius: 50%;
                    position: relative;
                }
                .dark .clock-face {
                    border-color: #64748b; /* slate-500 */
                }
                .hour-hand, .minute-hand {
                    position: absolute;
                    background: #334155; /* slate-700 */
                    border-radius: 4px;
                    transform-origin: bottom center;
                    left: 50%;
                    top: 10%;
                }
                .dark .hour-hand, .dark .minute-hand {
                    background: #cbd5e1; /* slate-300 */
                }
                .hour-hand {
                    width: 6px;
                    height: 40%;
                    margin-left: -3px;
                    animation: spin-hour 2.4s linear infinite;
                }
                .minute-hand {
                    width: 4px;
                    height: 50%;
                    margin-left: -2px;
                    top: 0;
                    animation: spin-minute 0.2s linear infinite;
                }

                @keyframes spin-hour {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-minute {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};
