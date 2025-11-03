import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';
import { fileToBase64 } from '../../utils/fileUtils';
import { applyBeardStyle } from '../../services/geminiService';
import { ImageComparisonSlider } from '../ImageComparisonSlider';

// Loader component with a shaving razor animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="razor-loader mx-auto">
            <div className="razor-handle"></div>
            <div className="razor-head">
                <div className="razor-blade"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Applying beard style...</p>
        <style>{`
            .razor-loader {
                width: 100px;
                height: 100px;
                position: relative;
                animation: shave 2s infinite ease-in-out;
            }
            .razor-handle {
                width: 15px;
                height: 70px;
                background: #9ca3af; /* slate-400 */
                border-radius: 4px;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
            .razor-head {
                width: 60px;
                height: 25px;
                background: #e2e8f0; /* slate-200 */
                border-radius: 4px;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                border: 2px solid #9ca3af;
            }
            .dark .razor-handle { background: #475569; }
            .dark .razor-head { background: #334155; border-color: #64748b; }
            .razor-blade {
                width: 100%;
                height: 5px;
                background: #cbd5e1; /* slate-300 */
                position: absolute;
                bottom: 3px;
            }
            .dark .razor-blade { background: #475569; }

            @keyframes shave {
                0%, 100% { transform: translateX(-20px) rotate(-15deg); }
                50% { transform: translateX(20px) rotate(15deg); }
            }
        `}</style>
    </div>
);

const beardOptions = [
    'Full Beard', 'Goatee', 'Stubble', 'Van Dyke', 'Anchor Beard', 'Balbo'
];

export const AiBeardTryOnTool: React.FC<{ title: string }> = ({ title }) => {
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string } | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            setOriginalImage({ file, url });
            setResultImage(null);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = useCallback(async () => {
        if (!originalImage) {
            setError("Please upload an image first.");
            return;
        }
        if (!prompt.trim()) {
            setError("Please select or describe a beard style.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { base64, mimeType } = await fileToBase64(originalImage.file);
            const generatedImageBase64 = await applyBeardStyle(base64, mimeType, prompt);
            
            if (generatedImageBase64) {
                setResultImage(`data:image/png;base64,${generatedImageBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try a different prompt or image.");
            }
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, prompt]);

    const handleReset = () => {
        setOriginalImage(null);
        setResultImage(null);
        setPrompt('');
        setError(null);
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = `beard-try-on.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Virtually try on different beard styles with AI.</p>
                </div>

                {!originalImage ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="space-y-8">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Choose a Beard Style</h2>
                             <div className="flex flex-wrap gap-2">
                                {beardOptions.map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setPrompt(style)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${prompt === style ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                            <input 
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Or describe a custom style (e.g., 'short Viking beard')"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                            />
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full btn-primary text-lg">
                                {isLoading ? 'Applying Style...' : 'Try On Beard'}
                            </button>
                        </div>
                        
                         <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            {isLoading ? (
                                <Loader />
                            ) : resultImage ? (
                                <div className="w-full space-y-4 animate-fade-in">
                                    <ImageComparisonSlider
                                        beforeImageUrl={originalImage.url}
                                        afterImageUrl={resultImage}
                                    />
                                    <div className="flex justify-center gap-4">
                                        <button onClick={handleDownload} className="btn-primary">Download</button>
                                        <button onClick={handleReset} className="btn-secondary">Start Over</button>
                                    </div>
                                </div>
                            ) : (
                                <img src={originalImage.url} alt="Original" className="max-w-full