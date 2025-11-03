import React, { useState, useRef, useCallback } from 'react';
import { generateQuoteBackground } from '../../services/geminiService';
import { Toast } from '../Toast';

// Pre-defined styles and their corresponding AI prompts
const backgroundStyles = [
    { name: 'Galaxy', prompt: 'A beautiful, serene galaxy background with nebulae and stars, deep space, vibrant colors' },
    { name: 'Nature', prompt: 'A tranquil nature scene, misty forest with sunbeams, lush greenery' },
    { name: 'Abstract', prompt: 'A vibrant abstract watercolor painting with flowing colors and soft textures' },
    { name: 'Minimalist', prompt: 'A minimalist background with a simple, clean gradient of soft pastel colors' },
    { name: 'Vintage', prompt: 'An old, textured paper background, vintage parchment style, with subtle grunge elements' },
    { name: 'Ocean', prompt: 'A calming underwater scene with gentle light rays filtering through the water surface' },
];

const fontStyles = [
    { name: 'Elegant', family: '"Merriweather", serif' },
    { name: 'Modern', family: '"Poppins", sans-serif' },
    { name: 'Playful', family: '"Pacifico", cursive' },
];


const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quote-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="pen-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="pen-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="quote-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Generating your masterpiece...</p>
    </div>
);

// Function to wrap text on canvas
const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    const totalHeight = lines.length * lineHeight;
    let currentY = y - totalHeight / 2;

    lines.forEach(l => {
        context.fillText(l.trim(), x, currentY);
        currentY += lineHeight;
    });
};

export const QuoteMaker: React.FC = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [bgStyle, setBgStyle] = useState(backgroundStyles[0].name);
    const [fontStyle, setFontStyle] = useState(fontStyles[0].name);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawOnCanvas = (bgImage: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const CANVAS_SIZE = 1080;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        // 1. Draw background
        ctx.drawImage(bgImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 2. Draw overlay for readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 3. Setup text style
        const selectedFont = fontStyles.find(f => f.name === fontStyle)!;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 15;
        
        // 4. Draw quote text
        ctx.font = `italic 60px ${selectedFont.family}`;
        wrapText(ctx, `“${quote}”`, CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE - 120, 80);

        // 5. Draw author text
        if (author) {
            ctx.font = `40px ${selectedFont.family}`;
            const quoteHeight = Math.ceil(quote.length / 20) * 80; // Rough estimation
            const authorY = (CANVAS_SIZE / 2) + (quoteHeight / 2) + 60;
            ctx.fillText(`- ${author}`, CANVAS_SIZE / 2, authorY);
        }

        setGeneratedImage(canvas.toDataURL('image/jpeg', 0.9));
        setIsLoading(false);
    };


    const handleGenerate = async () => {
        if (!quote.trim()) {
            setError("Please enter a quote.");
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);
        
        const selectedBg = backgroundStyles.find(b => b.name === bgStyle)!;

        try {
            const imageBase64 = await generateQuoteBackground(selectedBg.prompt);
            if (imageBase64) {
                const bgImage = new Image();
                bgImage.crossOrigin = "anonymous";
                bgImage.onload = () => {
                    drawOnCanvas(bgImage);
                };
                bgImage.onerror = () => {
                    setError("Failed to load the generated background image.");
                    setIsLoading(false);
                }
                bgImage.src = `data:image/jpeg;base64,${imageBase64}`;
            } else {
                 throw new Error("The AI did not return an image.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate the quote image.");
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `quote-${author || 'image'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Quote Maker 📝</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create beautiful, shareable quote images with AI backgrounds.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quote</label>
                                <textarea rows={4} value={quote} onChange={e => setQuote(e.target.value)} placeholder="The journey of a thousand miles begins with a single step." className="input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Author (Optional)</label>
                                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Lao Tzu" className="input-style" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Background Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {backgroundStyles.map(s => <button key={s.name} onClick={() => setBgStyle(s.name)} className={`btn-style ${bgStyle === s.name ? 'btn-selected' : 'btn-unselected'}`}>{s.name}</button>)}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Font Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {fontStyles.map(f => <button key={f.name} onClick={() => setFontStyle(f.name)} className={`btn-style ${fontStyle === f.name ? 'btn-selected' : 'btn-unselected'}`}>{f.name}</button>)}
                                </div>
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full btn-primary mt-4">Generate Image</button>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="min-h-[400px] flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                             {isLoading ? <Loader /> : generatedImage ? (
                                <div className="text-center animate-fade-in">
                                    <img src={generatedImage} alt="Generated quote" className="max-w-full h-auto rounded-lg shadow-lg" />
                                    <button onClick={handleDownload} className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md">
                                        Download Image
                                    </button>
                                </div>
                             ) : (
                                <div className="text-center text-slate-500 dark:text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                    <p className="mt-4 text-lg">Your quote image will appear here.</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

            </div>
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden"></canvas>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; background-color: white; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .btn-style { padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; }
                .btn-selected { background-color: #4f46e5; color: white; }
                .btn-unselected { background-color: #e2e8f0; color: #334155; }
                .dark .btn-unselected { background-color: #334155; color: #e2e8f0; }
                .btn-primary { background-color: #4f46e5; color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 700; transition: background-color 0.2s; width: 100%; }
                .btn-primary:hover { background-color: #4338ca; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }

                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                .dark .pen-body { fill: #cbd5e1; }
                .dark .pen-nib { fill: #0f172a; }
                .dark .quote-line { stroke: #818cf8; }

                .quote-line {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: draw-quote 1.5s 0.5s forwards;
                }

                .pen-body, .pen-nib {
                    animation: move-quote-pen 2s forwards;
                }

                @keyframes draw-quote {
                    to { stroke-dashoffset: 0; }
                }

                @keyframes move-quote-pen {
                    0% { transform: translate(-20px, 20px) rotate(15deg); }
                    25% { transform: translate(0, 0) rotate(15deg); }
                    100% { transform: translate(80px, 0) rotate(15deg); }
                }
            `}</style>
        </>
    );
};
