import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { findCelebrityLookAlike, CelebrityLookAlike } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="clapperboard-loader mx-auto">
            <div className="clapper-top"></div>
            <div className="clapper-bottom"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Finding your celebrity twin...</p>
    </div>
);

export const CelebrityLookAlikeFinder: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [result, setResult] = useState<CelebrityLookAlike | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setImageFile(file);
        setResult(null);
        setError(null);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
        reader.readAsDataURL(file);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const celebrityMatch = await findCelebrityLookAlike(base64, mimeType);
            setResult(celebrityMatch);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setImageFile(null);
            setImageUrl(null);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
    };


    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Celebrity Look-Alike Finder 🌟</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload your photo and let our AI find your famous doppelgänger!</p>
                </div>

                {!imageFile && (
                    <ImageUploader onImageUpload={handleImageUpload} />
                )}

                {(isLoading || result) && (
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[300px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : result && imageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    <img src={imageUrl} alt="Uploaded for look-alike" className="rounded-lg shadow-md mx-auto max-w-full h-auto max-h-80" />
                                    <div className="text-center">
                                        <p className="text-lg text-slate-500 dark:text-slate-400">It's a match!</p>
                                        <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{result.name}</p>
                                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{result.matchPercentage}% Match</p>
                                    </div>
                                </div>
                                <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                    Try Another Photo
                                </button>
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

                .clapperboard-loader {
                    width: 120px;
                    height: 100px;
                    position: relative;
                }
                .clapper-top, .clapper-bottom {
                    width: 100%;
                    height: 50%;
                    background: #1e293b;
                    border: 2px solid #9ca3af;
                    position: absolute;
                    box-sizing: border-box;
                    background-image: repeating-linear-gradient(135deg, #1e293b 0 15px, #f1f5f9 15px 30px);
                }
                .dark .clapper-top, .dark .clapper-bottom {
                     background-image: repeating-linear-gradient(135deg, #1e293b 0 15px, #475569 15px 30px);
                }

                .clapper-top {
                    top: 0;
                    border-radius: 8px 8px 0 0;
                    transform-origin: 0 100%;
                    animation: clap 1.2s infinite ease-in-out;
                }
                .clapper-bottom {
                    bottom: 0;
                    border-radius: 0 0 8px 8px;
                }

                @keyframes clap {
                    0%, 100% {
                        transform: rotate(-15deg);
                    }
                    50% {
                        transform: rotate(0deg);
                    }
                }
            `}</style>
        </>
    );
};