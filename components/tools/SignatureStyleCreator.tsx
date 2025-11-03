import React, { useState, useRef, useCallback } from 'react';

const signatureFonts = [
    { name: 'Elegant', family: '"Great Vibes", cursive', size: 60 },
    { name: 'Casual', family: '"Pacifico", cursive', size: 48 },
    { name: 'Script', family: '"Dancing Script", cursive', size: 52 },
    { name: 'Flowing', family: '"Allura", cursive', size: 56 },
    { name: 'Delicate', family: '"Sacramento", cursive', size: 50 },
];

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="signature-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="pen-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="pen-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="signature-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Crafting your signatures...</p>
    </div>
);

export const SignatureStyleCreator: React.FC = () => {
    const [name, setName] = useState('');
    const [styles, setStyles] = useState<{ name: string; image: string; }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateStyles = useCallback(() => {
        if (!name.trim()) return;
        setIsLoading(true);
        setStyles([]);

        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) {
                setIsLoading(false);
                return;
            }
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsLoading(false);
                return;
            }
            
            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#f1f5f9' : '#0f172a';

            const generatedImages = signatureFonts.map(font => {
                // Adjust canvas width based on name length
                const estimatedWidth = name.length * (font.size * 0.5);
                canvas.width = Math.max(300, estimatedWidth);
                canvas.height = 150;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = textColor;
                ctx.font = `${font.size}px ${font.family}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(name, canvas.width / 2, canvas.height / 2);
                
                return { name: font.name, image: canvas.toDataURL('image/png') };
            });

            setStyles(generatedImages);
            setIsLoading(false);
        }, 1500); // Simulate generation time
    }, [name]);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Signature Style Creator ✍️</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Get creative ideas for your handwritten signature.</p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <label htmlFor="name-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter your full name</label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        id="name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateStyles()}
                        placeholder="e.g., John Doe"
                        className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={generateStyles}
                        disabled={isLoading || !name.trim()}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Styles'}
                    </button>
                </div>
            </div>

            <div className="mt-8 min-h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center"><Loader /></div>
                ) : styles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {styles.map((style, index) => (
                            <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                                <h3 className="font-semibold text-indigo-500 dark:text-indigo-400 mb-2">{style.name} Style</h3>
                                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 flex items-center justify-center">
                                    <img src={style.image} alt={`${style.name} signature style`} className="max-w-full h-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-12">
                        <p className="text-lg">Your signature styles will appear here.</p>
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden"></canvas>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

                .dark .pen-body { fill: #cbd5e1; }
                .dark .pen-nib { fill: #0f172a; }
                .dark .signature-line { stroke: #818cf8; }

                .signature-line {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: draw-sig 1.5s 0.5s forwards;
                }

                .pen-body, .pen-nib {
                    animation: move-pen 2s forwards;
                }

                @keyframes draw-sig {
                    to { stroke-dashoffset: 0; }
                }

                @keyframes move-pen {
                    0% { transform: translate(-20px, 20px); }
                    25% { transform: translate(0, 0); }
                    100% { transform: translate(80px, 0); }
                }
            `}</style>
        </div>
    );
};
