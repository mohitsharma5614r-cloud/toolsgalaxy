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

const getAttractivenessMessage = (score: number): string => {
    if (score < 90) return "Looking great! The camera loves you.";
    if (score < 95) return "Wow! You're practically a model.";
    if (score < 99) return "Stunning! The algorithm is impressed.";
    return "Perfection! Are you a work of art?";
};

// Loader component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="attractiveness-loader mx-auto">
            <div className="face-outline"></div>
            <div className="heart-scanner">❤️</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Calibrating Attractiveness Matrix...</p>
    </div>
);

export const AttractivenessMeter: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setImageFile(file);
        setScore(null);
        setError(null);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
        reader.readAsDataURL(file);

        // Simulate AI processing
        setTimeout(() => {
            try {
                // Generate a fun, high score based on file name and size
                const hash = stringToHash(file.name + file.size);
                const calculatedScore = 85 + (hash % 15); // Score between 85 and 99
                setScore(calculatedScore);
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
        setScore(null);
        setError(null);
        setIsLoading(false);
    };


    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Attractiveness Meter 😎</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A totally accurate, 100% scientific meter to rate attractiveness from a photo.</p>
                </div>

                {!imageFile && (
                    <ImageUploader onImageUpload={handleImageUpload} />
                )}

                {(isLoading || score) && (
                     <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[300px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : score && imageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    <img src={imageUrl} alt="Uploaded for attractiveness rating" className="rounded-lg shadow-md mx-auto max-w-full h-auto max-h-80" />
                                    <div className="text-center">
                                        <p className="text-lg text-slate-500 dark:text-slate-400">Attractiveness Score:</p>
                                        <p className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{score}%</p>
                                        <p className="text-md italic text-slate-600 dark:text-slate-300">{getAttractivenessMessage(score)}</p>
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

                .attractiveness-loader {
                    width: 120px;
                    height: 120px;
                    position: relative;
                }
                .face-outline {
                    width: 100%;
                    height: 100%;
                    border: 4px solid #9ca3af; /* slate-400 */
                    border-radius: 50%;
                    position: relative;
                }
                 .dark .face-outline { border-color: #64748b; }
                .face-outline::before { /* chin */
                    content: '';
                    position: absolute;
                    width: 60%;
                    height: 60%;
                    border: 4px solid transparent;
                    border-bottom-color: #9ca3af; /* slate-400 */
                    border-radius: 50%;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .dark .face-outline::before { border-bottom-color: #64748b; }

                .heart-scanner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 40px;
                    animation: heart-pulse 1.5s infinite;
                }
                
                @keyframes heart-pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                }
            `}</style>
        </>
    );
};
