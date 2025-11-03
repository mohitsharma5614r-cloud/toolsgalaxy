import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { predictAgeFromImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="face-scanner-loader mx-auto">
            <div className="face-icon">
                <div className="eye left"></div>
                <div className="eye right"></div>
                <div className="mouth"></div>
            </div>
            <div className="scan-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing facial features...</p>
    </div>
);

export const AiAgePredictor: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [predictedAge, setPredictedAge] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setImageFile(file);
        setPredictedAge(null);
        setError(null);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
        reader.readAsDataURL(file);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const age = await predictAgeFromImage(base64, mimeType);
            setPredictedAge(age);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            // Reset on error
            setImageFile(null);
            setImageUrl(null);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setPredictedAge(null);
        setError(null);
        setIsLoading(false);
    };


    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">AI Age Predictor 📸</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload a photo and let our AI guess the age (for entertainment only!).</p>
                </div>

                {!imageFile && (
                    <ImageUploader onImageUpload={handleImageUpload} />
                )}

                {(isLoading || predictedAge) && (
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[300px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : predictedAge && imageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    <img src={imageUrl} alt="Uploaded for age prediction" className="rounded-lg shadow-md mx-auto max-w-full h-auto max-h-80" />
                                    <div className="text-center">
                                        <p className="text-lg text-slate-500 dark:text-slate-400">Our AI predicts an age of...</p>
                                        <p className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{predictedAge}</p>
                                        <p className="text-sm text-slate-400">(Give or take a few decades)</p>
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

                .face-scanner-loader {
                    width: 120px;
                    height: 120px;
                    position: relative;
                    overflow: hidden;
                }
                .face-icon {
                    width: 100%;
                    height: 100%;
                    border: 4px solid #9ca3af; /* slate-400 */
                    border-radius: 50%;
                    position: relative;
                }
                .dark .face-icon { border-color: #64748b; }
                .eye {
                    width: 15px; height: 15px;
                    background: #9ca3af;
                    border-radius: 50%;
                    position: absolute;
                    top: 40px;
                }
                .dark .eye { background: #64748b; }
                .eye.left { left: 30px; }
                .eye.right { right: 30px; }
                .mouth {
                    width: 40px; height: 20px;
                    border: 4px solid #9ca3af;
                    border-top-color: transparent;
                    border-radius: 0 0 20px 20px;
                    position: absolute;
                    bottom: 25px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .dark .mouth { border-color: #64748b; border-top-color: transparent; }
                
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: #6366f1; /* indigo-500 */
                    box-shadow: 0 0 10px #6366f1;
                    animation: scan 2.5s infinite ease-in-out;
                }
                .dark .scan-line { background: #818cf8; box-shadow: 0 0 10px #818cf8; }

                @keyframes scan {
                    0%, 100% { top: 0; }
                    50% { top: 100%; }
                }
            `}</style>
        </>
    );
};