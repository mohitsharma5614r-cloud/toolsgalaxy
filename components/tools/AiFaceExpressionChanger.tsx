import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';
import { fileToBase64 } from '../../utils/fileUtils';
import { changeExpression } from '../../services/geminiService';
import { ImageComparisonSlider } from '../ImageComparisonSlider';

// Loader component with an expression-changing animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="expression-loader mx-auto">
            <div className="face">
                <div className="eye left"></div>
                <div className="eye right"></div>
                <div className="mouth"></div>
            </div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Changing expression...</p>
        <style>{`
            .expression-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .face {
                width: 100%;
                height: 100%;
                border: 5px solid #9ca3af; /* slate-400 */
                border-radius: 50%;
                position: relative;
            }
            .dark .face {
                border-color: #64748b;
            }
            .eye {
                width: 15px;
                height: 15px;
                background: #9ca3af;
                border-radius: 50%;
                position: absolute;
                top: 35px;
            }
            .dark .eye {
                background: #64748b;
            }
            .eye.left { left: 25px; }
            .eye.right { right: 25px; }
            .mouth {
                width: 50px;
                height: 25px;
                border: 5px solid #9ca3af;
                border-top-color: transparent;
                border-radius: 0 0 25px 25px;
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                animation: morph-mouth 2s infinite ease-in-out;
            }
            .dark .mouth {
                border-color: #64748b;
                border-top-color: transparent;
            }

            @keyframes morph-mouth {
                0%, 100% {
                    border-radius: 0 0 25px 25px; /* Smile */
                    transform: translateX(-50%);
                }
                50% {
                    border-radius: 25px 25px 0 0; /* Frown */
                    transform: translateX(-50%) translateY(-10px);
                }
            }
        `}</style>
    </div>
);

const expressionOptions = [
    'Happy', 'Sad', 'Surprised', 'Angry', 'Laughing', 'Thinking'
];

export const AiFaceExpressionChanger: React.FC<{ title: string }> = ({ title }) => {
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
            setError("Please select or describe an expression.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { base64, mimeType } = await fileToBase64(originalImage.file);
            const generatedImageBase64 = await changeExpression(base64, mimeType, prompt);
            
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
        link.download = `expression-change.png`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Change a person's facial expression with the power of AI.</p>
                </div>

                {!originalImage ? (
                    <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                    <div className="space-y-8">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Choose an Expression</h2>
                             <div className="flex flex-wrap gap-2">
                                {expressionOptions.map(style => (
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
                                placeholder="Or describe a custom expression (e.g., 'a slight smirk')"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                            />
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full btn-primary text-lg">
                                {isLoading ? 'Generating...' : 'Change Expression'}
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
