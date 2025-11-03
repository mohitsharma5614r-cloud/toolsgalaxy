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

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="gender-loader mx-auto">
            <div className="symbol male">♂</div>
            <div className="symbol female">♀</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing... please wait.</p>
    </div>
);

export const GenderGuesser: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [result, setResult] = useState<'Male' | 'Female' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback((file: File) => {
        setImageFile(file);
        setResult(null);
        setError(null);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target?.result as string);
        reader.readAsDataURL(file);

        // Simulate AI processing
        setTimeout(() => {
            try {
                const hash = stringToHash(file.name + file.size);
                const prediction = hash % 2 === 0 ? 'Female' : 'Male';
                setResult(prediction);
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
        setResult(null);
        setError(null);
        setIsLoading(false);
    };


    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Gender Guesser 👩‍🦰👨‍🦱</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload a photo and let our AI predict the gender (for fun!).</p>
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
                                    <img src={imageUrl} alt="Uploaded for gender prediction" className="rounded-lg shadow-md mx-auto max-w-full h-auto max-h-80" />
                                    <div className="text-center">
                                        <p className="text-lg text-slate-500 dark:text-slate-400">Our AI predicts:</p>
                                        <p className="text-7xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">{result}</p>
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

                .gender-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .symbol {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    font-size: 80px;
                    line-height: 100px;
                    text-align: center;
                }
                .symbol.male {
                    color: #60a5fa; /* blue-400 */
                    animation: fade-male 2.5s infinite;
                }
                .symbol.female {
                    color: #f472b6; /* pink-400 */
                    animation: fade-female 2.5s infinite;
                }

                @keyframes fade-male {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0; transform: scale(0.8); }
                }
                @keyframes fade-female {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
};
