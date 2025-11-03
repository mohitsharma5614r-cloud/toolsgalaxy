import React, { useState, useRef } from 'react';
import { generateThumbnailOrBanner } from '../../services/geminiService';
import { Toast } from '../Toast';

type Style = 'Cute & Playful' | 'Modern & Cool' | 'Heartfelt & Warm';

const styles: { name: Style; prompt: string, textColor: string, quote: string }[] = [
    { name: 'Cute & Playful', prompt: "A cute and playful illustration of best friends, friendship day theme. Two adorable cartoon characters, vibrant pastel colors, cheerful, heartwarming.", textColor: '#334155', quote: 'Friends are the chocolate chips in the cookie of life.' },
    { name: 'Modern & Cool', prompt: "A modern, minimalist graphic design poster for friendship day. Abstract shapes representing two people, cool color palette of teal, coral, and navy blue, clean lines, stylish typography.", textColor: '#FFFFFF', quote: 'True friendship is a journey without an end.' },
    { name: 'Heartfelt & Warm', prompt: "A warm and heartfelt watercolor painting of two friends sharing a moment. Soft, warm tones of orange and yellow, gentle lighting, emotional, sentimental, friendship day theme.", textColor: '#422006', quote: 'A good friend knows all your best stories.' },
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="heart-hands-loader mx-auto">
            <div className="hand left"></div>
            <div className="hand right"></div>
            <div className="heart-sparkle s1"></div>
            <div className="heart-sparkle s2"></div>
            <div className="heart-sparkle s3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Crafting your friendship poster...</p>
    </div>
);

export const FriendshipDayPosterMaker: React.FC = () => {
    const [yourName, setYourName] = useState('');
    const [friendName, setFriendName] = useState('');
    const [style, setStyle] = useState<Style>(styles[0].name);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCanvas = (bgImage: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const selectedStyle = styles.find(s => s.name === style)!;

        // Set canvas size (poster aspect ratio 3:4)
        canvas.width = 600;
        canvas.height = 800;

        // Draw background image
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        
        // Add a subtle vignette/overlay for text readability
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 300);
        gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text styles
        ctx.fillStyle = selectedStyle.textColor;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;

        // Draw names
        ctx.font = 'bold 72px "Poppins", sans-serif';
        const nameText = `${yourName} & ${friendName}`;
        ctx.fillText(nameText, canvas.width / 2, canvas.height - 100);

        // Draw "Happy Friendship Day"
        ctx.font = 'italic 32px "Poppins", sans-serif';
        ctx.fillText("Happy Friendship Day!", canvas.width / 2, canvas.height - 50);

        // Draw Quote
        ctx.font = '24px "Poppins", sans-serif';
        ctx.fillText(selectedStyle.quote, canvas.width / 2, 80);


        setPosterUrl(canvas.toDataURL('image/jpeg', 0.9));
    };

    const handleGenerate = async () => {
        if (!yourName.trim() || !friendName.trim()) {
            setError("Please enter both names.");
            return;
        }
        setIsLoading(true);
        setPosterUrl(null);
        setError(null);
        
        try {
            const selectedStyle = styles.find(s => s.name === style)!;
            const imageBase64 = await generateThumbnailOrBanner(selectedStyle.prompt, '3:4');
            if (imageBase64) {
                const bgImage = new Image();
                bgImage.onload = () => {
                    drawCanvas(bgImage);
                    setIsLoading(false);
                };
                bgImage.src = `data:image/jpeg;base64,${imageBase64}`;
            } else {
                 throw new Error("The AI did not return an image.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate poster.");
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!posterUrl) return;
        const link = document.createElement('a');
        link.href = posterUrl;
        link.download = `friendship-poster-${yourName}-${friendName}.jpg`;
        link.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Friendship Day Poster Maker 🤗</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a unique poster to celebrate your best friend!</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Your Name" className="input-style" />
                        <input type="text" value={friendName} onChange={e => setFriendName(e.target.value)} placeholder="Friend's Name" className="input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Choose a Style</label>
                        <div className="flex flex-wrap gap-2">
                            {styles.map(s => (
                                <button key={s.name} onClick={() => setStyle(s.name)} className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${style === s.name ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>{s.name}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform hover:scale-105 disabled:bg-slate-400">
                        Create Poster
                    </button>
                </div>
                
                <div className="mt-8">
                    {isLoading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> :
                    posterUrl ? (
                        <div className="animate-fade-in text-center">
                             <img src={posterUrl} alt="Generated friendship poster" className="rounded-lg shadow-lg mx-auto max-w-full h-auto" style={{ maxHeight: '80vh' }}/>
                             {/* Hidden canvas for generation */}
                             <canvas ref={canvasRef} className="hidden"></canvas>
                             <div className="mt-6 flex flex-wrap justify-center gap-4">
                                <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105">Download Poster</button>
                                <button onClick={() => setPosterUrl(null)} className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md">Create Another</button>
                             </div>
                        </div>
                    ) : null }
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

                .heart-hands-loader { width: 100px; height: 90px; position: relative; }
                .hand {
                    position: absolute;
                    width: 40px;
                    height: 50px;
                    background-color: #fcd34d;
                    border-radius: 20px 20px 5px 5px;
                    bottom: 0;
                }
                .hand.left {
                    left: 0;
                    transform-origin: bottom right;
                    animation: left-hand-anim 2.5s infinite ease-in-out;
                }
                .hand.right {
                    right: 0;
                    transform-origin: bottom left;
                    animation: right-hand-anim 2.5s infinite ease-in-out;
                }
                .heart-sparkle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: #f87171; /* red-400 */
                    border-radius: 50%;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    animation: sparkle-anim 2.5s infinite;
                }
                .heart-sparkle.s2 { animation-delay: 0.2s; }
                .heart-sparkle.s3 { animation-delay: 0.4s; }

                @keyframes left-hand-anim {
                    0%, 100% { transform: rotate(45deg); }
                    50% { transform: rotate(10deg); }
                }
                @keyframes right-hand-anim {
                    0%, 100% { transform: rotate(-45deg); }
                    50% { transform: rotate(-10deg); }
                }
                @keyframes sparkle-anim {
                    40% { opacity: 0; }
                    50% { opacity: 1; transform: translate(-50%, -20px) scale(1.5); }
                    60%, 100% { opacity: 0; transform: translate(-50%, -40px) scale(0); }
                }
            `}</style>
        </>
    );
};