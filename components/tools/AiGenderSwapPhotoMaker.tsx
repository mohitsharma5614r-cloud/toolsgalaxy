import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';
import { fileToBase64 } from '../../utils/fileUtils';
import { genderSwapImage } from '../../services/geminiService';

// Loader component with a gender symbol morphing animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="gender-swap-loader mx-auto">
            <div className="symbol male">♂</div>
            <div className="symbol female">♀</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Performing AI transformation...</p>
        <style>{`
            .gender-swap-loader {
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
                animation-duration: 2.5s;
                animation-iteration-count: infinite;
            }
            .symbol.male {
                color: #60a5fa; /* blue-400 */
                animation-name: fade-male;
            }
            .symbol.female {
                color: #f472b6; /* pink-400 */
                animation-name: fade-female;
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
    </div>
);

export const AiGenderSwapPhotoMaker: React.FC<{ title: string }> = ({ title }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = useCallback(async (targetGender: 'male' | 'female') => {
        if (!imageFile) {
            setError("Please upload an image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultUrl(null);

        try {
            const { base64, mimeType } = await fileToBase64(imageFile);
            const resultBase64 = await genderSwapImage(base64, mimeType, targetGender);

            if (resultBase64) {
                setResultUrl(`data:image/png;base64,${resultBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try a different photo.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setResultUrl(null);
        setError(null);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">See what you would look like as a different gender with AI.</p>
                </div>
                
                {!imageFile && !isLoading && !resultUrl && (
                    <ImageUploader onImageUpload={handleImageUpload} />
                )}

                {(imageFile || isLoading || resultUrl) && (
                    <div className="space-y-8">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            {resultUrl ? (
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Result</h2>
                                    <div className="animate-fade-in space-y-4">
                                        <img src={resultUrl} alt="Gender swap result" className="max-w-full h-auto max-h-[60vh] rounded-lg shadow-lg mx-auto" />
                                        <div className="flex gap-4 justify-center">
                                             <a href={resultUrl} download="gender-swap-result.png" className="btn-primary">Download Image</a>
                                             <button onClick={handleReset} className="btn-secondary">Start Over</button>
                                        </div>
                                    </div>
                                </div>
                            ) : isLoading ? (
                                <div className="min-h-[300px] flex items-center justify-center">
                                    <Loader />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">1. Your Image</h2>
                                        {imageUrl && <img src={imageUrl} alt="Uploaded for gender swap" className="max-w-full h-auto max-h-80 rounded-lg shadow-md mx-auto" />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">2. Choose Transformation</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button onClick={() => handleGenerate('female')} disabled={isLoading} className="btn-transform bg-pink-500 hover:bg-pink-600">
                                                <span className="text-4xl">♀️</span>
                                                <span>Transform to Female</span>
                                            </button>
                                            <button onClick={() => handleGenerate('male')} disabled={isLoading} className="btn-transform bg-blue-500 hover:bg-blue-600">
                                                <span className="text-4xl">♂️</span>
                                                <span>Transform to Male</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .btn-transform {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1.5rem 1rem;
                    border-radius: 0.75rem;
                    color: white;
                    font-weight: 700;
                    text-align: center;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
                .btn-transform:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
                }
                .btn-transform:disabled {
                    background-color: #9ca3af;
                    cursor: not-allowed;
                }
                 .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; display: inline-block; cursor: pointer; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </>
    );
};