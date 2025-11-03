import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';
import { fileToBase64 } from '../../utils/fileUtils';
import { applyMakeup } from '../../services/geminiService';
import { ImageComparisonSlider } from '../ImageComparisonSlider';

// Loader component with a makeup brush animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="makeup-loader mx-auto">
            <div className="brush"></div>
            <div className="stroke"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Applying your new look...</p>
        <style>{`
            .makeup-loader {
                width: 120px;
                height: 120px;
                position: relative;
            }
            .brush {
                width: 15px;
                height: 70px;
                background: #c084fc; /* purple-400 */
                border-radius: 8px 8px 0 0;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform-origin: bottom center;
                animation: brush-swing 2.5s infinite ease-in-out;
            }
            .brush::after {
                content: '';
                position: absolute;
                top: -15px;
                left: -5px;
                width: 25px;
                height: 20px;
                background: #e879f9; /* fuchsia-400 */
                border-radius: 50% 50% 0 0;
            }
            .stroke {
                position: absolute;
                top: 50%;
                left: 10%;
                width: 80%;
                height: 20px;
                background: linear-gradient(to right, #f472b6, #ec4899, #db2777); /* pinks */
                border-radius: 10px;
                transform: scaleX(0);
                opacity: 0;
                animation: paint-stroke 2.5s infinite ease-in-out;
            }

            @keyframes brush-swing {
                0%, 100% { transform: rotate(-30deg); }
                50% { transform: rotate(30deg); }
            }
            @keyframes paint-stroke {
                0%, 100% { transform: scaleX(0); opacity: 0; }
                50% { transform: scaleX(1); opacity: 1; }
                90% { transform: scaleX(1); opacity: 0; }
            }
        `}</style>
    </div>
);

const makeupOptions = [
    'Natural Look', 'Smoky Eye', 'Bold Red Lip', 'Glamorous Evening', 'Goth Makeup', '90s Grunge'
];

export const AiMakeupGenerator: React.FC<{ title: string }> = ({ title }) => {
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
            setError("Please select or describe a makeup style.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { base64, mimeType } = await fileToBase64(originalImage.file);
            const generatedImageBase64 = await applyMakeup(base64, mimeType, prompt);
            
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
        link.download = `makeup-try-on.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Apply virtual makeup to your photos with the power of AI.</p>
                </div>

                {!originalImage ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="space-y-8">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Choose a Makeup Style</h2>
                             <div className="flex flex-wrap gap-2">
                                {makeupOptions.map(style => (
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
                                placeholder="Or describe a custom style (e.g., 'glittery eyeshadow and pink lips')"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                            />
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full btn-primary text-lg">
                                {isLoading ? 'Applying Makeup...' : 'Apply Makeup'}
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
                                <img src={originalImage.url} alt="Original" className="max-w-full h-auto max-h-[60vh] rounded-lg shadow-md" />
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; display: inline-block; cursor: pointer; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-secondary { background-color: #64748b; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </>
    );
};
