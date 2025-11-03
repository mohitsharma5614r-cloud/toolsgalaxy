import React, { useState, useRef } from 'react';
import { ImageUploader } from '../ImageUploader';
import { Toast } from '../Toast';

// Loader component for this tool
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="symmetry-loader mx-auto">
            <div className="face">
                <div className="left-half"></div>
                <div className="right-half"></div>
            </div>
            <div className="scan-line"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing facial symmetry...</p>
    </div>
);

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


export const FaceSymmetryChecker: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [leftSymmetryImage, setLeftSymmetryImage] = useState<string | null>(null);
    const [rightSymmetryImage, setRightSymmetryImage] = useState<string | null>(null);
    const [symmetryScore, setSymmetryScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const processImage = (file: File) => {
        setIsLoading(true);
        setError(null);
        setOriginalImage(file);
        setLeftSymmetryImage(null);
        setRightSymmetryImage(null);
        setSymmetryScore(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setOriginalImageUrl(imageUrl);

            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) {
                    setIsLoading(false);
                    setError("Canvas element not found.");
                    return;
                }
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) {
                    setIsLoading(false);
                    setError("Could not get canvas context.");
                    return;
                }
                
                const w = img.width;
                const h = img.height;
                canvas.width = w;
                canvas.height = h;

                // --- Create Left Symmetrical Image ---
                ctx.clearRect(0, 0, w, h);
                // Draw left half
                ctx.drawImage(img, 0, 0, w / 2, h, 0, 0, w / 2, h);
                // Flip context and draw left half again
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, w / 2, h, -w, 0, w / 2, h);
                ctx.restore();
                setLeftSymmetryImage(canvas.toDataURL());

                // --- Create Right Symmetrical Image ---
                ctx.clearRect(0, 0, w, h);
                // Draw right half
                ctx.drawImage(img, w / 2, 0, w / 2, h, w / 2, 0, w / 2, h);
                // Flip context and draw right half again
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(img, w / 2, 0, w / 2, h, -w / 2, 0, w / 2, h);
                ctx.restore();
                setRightSymmetryImage(canvas.toDataURL());

                // Calculate fun symmetry score
                const hash = stringToHash(file.name);
                const score = 70 + (hash % 29); // 70-98%
                setSymmetryScore(score);

                setIsLoading(false);
            };
            img.onerror = () => {
                 setError("Failed to load the image for processing.");
                 setIsLoading(false);
            }
            img.src = imageUrl;
        };
        reader.onerror = () => {
             setError("Failed to read the image file.");
             setIsLoading(false);
        }
        reader.readAsDataURL(file);
    };

    const handleReset = () => {
        setOriginalImage(null);
        setOriginalImageUrl(null);
        setLeftSymmetryImage(null);
        setRightSymmetryImage(null);
        setSymmetryScore(null);
        setError(null);
    };

    return (
        <>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Face Symmetry Checker 🧍‍♂️</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">See what you'd look like with a perfectly symmetrical face (for fun!).</p>
                </div>

                {!originalImage && !isLoading ? (
                    <ImageUploader onImageUpload={processImage} />
                ) : (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {isLoading ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : (
                            <div className="animate-fade-in text-center">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="text-center">
                                        <h3 className="font-bold mb-2">Left-Symmetrical</h3>
                                        <img src={leftSymmetryImage!} alt="Left-symmetrical face" className="rounded-lg shadow-md mx-auto max-w-full" />
                                    </div>
                                    <div className="text-center">
                                         <h3 className="font-bold mb-2">Original</h3>
                                        <img src={originalImageUrl!} alt="Original face" className="rounded-lg shadow-lg mx-auto max-w-full border-4 border-indigo-500" />
                                    </div>
                                    <div className="text-center">
                                         <h3 className="font-bold mb-2">Right-Symmetrical</h3>
                                        <img src={rightSymmetryImage!} alt="Right-symmetrical face" className="rounded-lg shadow-md mx-auto max-w-full" />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-lg text-slate-500 dark:text-slate-400">Symmetry Score:</p>
                                    <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">{symmetryScore}%</p>
                                </div>
                                <button onClick={handleReset} className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">
                                    Try Another Photo
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden"></canvas>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                .symmetry-loader {
                    width: 120px;
                    height: 120px;
                    position: relative;
                }
                .face {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                    position: relative;
                    border: 4px solid #9ca3af; /* slate-400 */
                }
                .dark .face { border-color: #64748b; }
                .left-half, .right-half {
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    background-color: #e2e8f0; /* slate-200 */
                }
                 .dark .left-half, .dark .right-half { background-color: #334155; }
                .right-half {
                    right: 0;
                    animation: mirror-right 2.5s infinite ease-in-out;
                }
                .left-half {
                    left: 0;
                    animation: mirror-left 2.5s infinite ease-in-out;
                }
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 4px;
                    height: 100%;
                    background: #6366f1; /* indigo-500 */
                    box-shadow: 0 0 10px #6366f1;
                    animation: scan-middle 2.5s infinite linear;
                }
                .dark .scan-line { background: #818cf8; box-shadow: 0 0 10px #818cf8; }

                @keyframes scan-middle {
                    0%, 100% { left: 0%; }
                    50% { left: 100%; }
                }
                @keyframes mirror-left {
                    0%, 50% { background-color: #e2e8f0; } /* slate-200 */
                    51%, 100% { background-color: #f1f5f9; } /* slate-100 */
                }
                .dark @keyframes mirror-left {
                     0%, 50% { background-color: #334155; } /* slate-700 */
                    51%, 100% { background-color: #1e293b; } /* slate-800 */
                }
                 @keyframes mirror-right {
                    0%, 50% { background-color: #f1f5f9; }
                    51%, 100% { background-color: #e2e8f0; }
                }
                .dark @keyframes mirror-right {
                    0%, 50% { background-color: #1e293b; }
                    51%, 100% { background-color: #334155; }
                }

            `}</style>
        </>
    );
};