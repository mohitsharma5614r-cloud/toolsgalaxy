import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { predictBabyFace } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { Toast } from '../Toast';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="mobile-loader mx-auto">
            <div className="mobile-top"></div>
            <div className="mobile-arm arm1">
                <div className="mobile-shape star">⭐</div>
            </div>
            <div className="mobile-arm arm2">
                 <div className="mobile-shape moon">🌙</div>
            </div>
            <div className="mobile-arm arm3">
                 <div className="mobile-shape cloud">☁️</div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-12">Predicting the future...</p>
    </div>
);

export const BabyFacePredictor: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [babyImageUrl, setBabyImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setOriginalFile(file);
        setBabyImageUrl(null);
        setError(null);
        setIsLoading(true);

        try {
            const { base64, mimeType } = await fileToBase64(file);
            const generatedImageBase64 = await predictBabyFace(base64, mimeType);
            if (generatedImageBase64) {
                setBabyImageUrl(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI failed to generate a baby picture. Please try another photo.");
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
        setBabyImageUrl(null);
        setError(null);
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!babyImageUrl) return;
        const link = document.createElement('a');
        link.href = babyImageUrl;
        link.download = `baby-prediction-${Date.now()}.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Baby Face Predictor 👶</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Predict what your future baby might look like (just for fun!).</p>
                </div>

                {!originalFile && !isLoading ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : babyImageUrl ? (
                            <div className="animate-fade-in text-center space-y-6">
                                <img src={babyImageUrl} alt="Generated baby face" className="rounded-lg shadow-lg mx-auto max-w-full h-auto max-h-[70vh]" />
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

                .mobile-loader {
                    width: 120px;
                    height: 120px;
                    position: relative;
                    animation: rotate-mobile 8s linear infinite;
                }
                .mobile-top {
                    width: 6px;
                    height: 6px;
                    background: #9ca3af;
                    border-radius: 50%;
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .mobile-top::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 10px;
                    background: #9ca3af;
                }
                .mobile-arm {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 60px;
                    height: 2px;
                    background: #cbd5e1;
                    transform-origin: 0 50%;
                }
                .dark .mobile-arm { background: #475569; }
                .mobile-arm.arm1 { transform: rotate(0deg); }
                .mobile-arm.arm2 { transform: rotate(120deg); }
                .mobile-arm.arm3 { transform: rotate(240deg); }

                .mobile-shape {
                    position: absolute;
                    right: 0;
                    top: -15px;
                    font-size: 24px;
                    animation: rotate-shape 8s linear infinite reverse;
                }
                .mobile-arm::before {
                    content: '';
                    position: absolute;
                    width: 2px;
                    height: 15px;
                    background: #cbd5e1;
                    right: 5px;
                    top: 2px;
                }
                 .dark .mobile-arm::before { background: #475569; }

                @keyframes rotate-mobile {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotate-shape {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};
