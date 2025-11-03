import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';
import { fileToBase64 } from '../../utils/fileUtils';
import { swapFaces } from '../../services/geminiService';

// Loader component specific to this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="faceswap-loader mx-auto">
            <div className="face face1"></div>
            <div className="face face2"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Performing AI face transplant...</p>
        <style>{`
            .faceswap-loader {
                width: 100px;
                height: 100px;
                position: relative;
            }
            .face {
                width: 60px;
                height: 80px;
                border: 3px solid #a5b4fc; /* indigo-300 */
                border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
                position: absolute;
                top: 10px;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-timing-function: ease-in-out;
            }
            .dark .face {
                border-color: #6366f1; /* indigo-600 */
            }
            .face1 {
                left: 0;
                animation-name: morph-left;
            }
            .face2 {
                right: 0;
                animation-name: morph-right;
            }

            @keyframes morph-left {
                0%, 100% { transform: translateX(0) rotate(-5deg); }
                50% { transform: translateX(20px) rotate(5deg) scale(0.9); }
            }
            @keyframes morph-right {
                0%, 100% { transform: translateX(0) rotate(5deg); }
                50% { transform: translateX(-20px) rotate(-5deg) scale(0.9); }
            }
        `}</style>
    </div>
);


export const AiFaceSwapTool: React.FC<{ title: string }> = ({ title }) => {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [targetFile, setTargetFile] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSwap = useCallback(async () => {
        if (!sourceFile || !targetFile) {
            setError("Please upload both a source face and a target image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultUrl(null);

        try {
            const [source, target] = await Promise.all([
                fileToBase64(sourceFile),
                fileToBase64(targetFile)
            ]);

            const resultBase64 = await swapFaces(source.base64, source.mimeType, target.base64, target.mimeType);
            
            if (resultBase64) {
                setResultUrl(`data:image/png;base64,${resultBase64}`);
            } else {
                throw new Error("The AI did not return an image. Please try different images.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [sourceFile, targetFile]);

    const handleReset = () => {
        setSourceFile(null);
        setTargetFile(null);
        setResultUrl(null);
        setError(null);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Swap a face from one photo onto another with AI.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Input Column */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">1. Upload Source Face</h2>
                            <ImageUploader onImageUpload={setSourceFile} />
                            <p className="text-xs text-slate-400 text-center mt-2">Upload a clear photo of the face you want to use.</p>
                        </div>
                        {sourceFile && !resultUrl && (
                            <div>
                                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">2. Upload Target Image</h2>
                                <ImageUploader onImageUpload={setTargetFile} />
                                <p className="text-xs text-slate-400 text-center mt-2">Upload the photo you want to put the face onto.</p>
                            </div>
                        )}
                        {sourceFile && targetFile && !resultUrl && (
                            <button onClick={handleSwap} disabled={isLoading} className="w-full btn-primary text-lg !mt-8">
                                {isLoading ? 'Swapping...' : 'Swap Faces'}
                            </button>
                        )}
                    </div>

                    {/* Output Column */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">3. View Result</h2>
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                                {isLoading ? (
                                    <Loader />
                                ) : resultUrl ? (
                                    <div className="text-center space-y-4 animate-fade-in">
                                        <img src={resultUrl} alt="Face swap result" className="max-w-full h-auto max-h-[60vh] rounded-lg shadow-lg" />
                                        <div className="flex gap-4 justify-center">
                                             <a href={resultUrl} download="face-swap-result.png" className="btn-primary">Download Image</a>
                                             <button onClick={handleReset} className="btn-secondary">Start Over</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 dark:text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
                                        <p className="mt-4 text-lg">Your swapped image will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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