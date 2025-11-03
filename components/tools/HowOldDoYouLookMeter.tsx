import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';

// Fun, deterministic hash function
const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="age-scanner-loader mx-auto">
            <div className="face-icon">👤</div>
            <div className="magnifying-glass">
                <div className="glass"></div>
                <div className="handle"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing photo for age markers...</p>
    </div>
);

export const HowOldDoYouLookMeter: React.FC = () => {
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

        // Simulate AI processing
        setTimeout(() => {
            try {
                const hash = stringToHash(file.name + file.size);
                // Fun "prediction" - will always give a youthful age between 20 and 35
                const age = 20 + (hash % 16);
                setPredictedAge(age);
            } catch (err) {
                 setError("Could not process the image.");
                 setImageFile(null);
                 setImageUrl(null);
            } finally {
                setIsLoading(false);
            }
        }, 2500);

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
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">“How Old Do You Look?” Meter 👀</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A fun tool that "guesses" your age from a photo (it will be kind!).</p>
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
                                    <img src={imageUrl} alt="Uploaded for age guessing" className="rounded-lg shadow-md mx-auto max-w-full h-auto max-h-80" />
                                    <div className="text-center">
                                        <p className="text-lg text-slate-500 dark:text-slate-400">Our analysis suggests you look...</p>
                                        <p className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{predictedAge}!</p>
                                        <p className="text-md italic text-slate-600 dark:text-slate-300">Looking great!</p>
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

                .age-scanner-loader {
                    width: 120px;
                    height: 120px;
                    position: relative;
                }
                .face-icon {
                    font-size: 100px;
                    line-height: 120px;
                    text-align: center;
                    color: #e2e8f0; /* slate-200 */
                }
                .dark .face-icon {
                    color: #334155; /* slate-700 */
                }
                .magnifying-glass {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 70px;
                    height: 70px;
                    animation: scan-face 2.5s infinite ease-in-out;
                }
                .glass {
                    width: 100%;
                    height: 100%;
                    border: 8px solid #6366f1; /* indigo-500 */
                    border-radius: 50%;
                }
                 .dark .glass {
                     border-color: #818cf8;
                 }
                .handle {
                    position: absolute;
                    width: 10px;
                    height: 35px;
                    background: #6366f1;
                    bottom: -25px;
                    right: -5px;
                    transform: rotate(-45deg);
                }
                 .dark .handle {
                     background: #818cf8;
                 }

                @keyframes scan-face {
                    0% { transform: translate(0, 40px) rotate(0deg); }
                    25% { transform: translate(40px, 0) rotate(20deg); }
                    50% { transform: translate(60px, 50px) rotate(-10deg); }
                    75% { transform: translate(10px, 70px) rotate(30deg); }
                    100% { transform: translate(0, 40px) rotate(0deg); }
                }

            `}</style>
        </>
    );
};
