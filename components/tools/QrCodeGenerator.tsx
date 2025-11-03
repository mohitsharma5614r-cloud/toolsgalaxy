import React, { useState, useRef, useEffect } from 'react';

const QrScannerAnimation: React.FC = () => (
    <div className="relative w-48 h-48">
        <div className="grid grid-cols-5 gap-1 w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-full h-full rounded-sm ${Math.random() > 0.4 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-scan"></div>
        <style>{`
            @keyframes scan-anim {
                0% { top: 0; }
                50% { top: 100%; }
                100% { top: 0; }
            }
            .animate-scan {
                animation: scan-anim 2.5s infinite cubic-bezier(0.5, 0, 0.5, 1);
            }
        `}</style>
    </div>
);

export const QrCodeGenerator: React.FC = () => {
    const [text, setText] = useState('https://aistudio.google.com/');
    const [error, setError] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Effect to handle QR code generation and theme changes
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 50; // Try for 5 seconds

        const generate = () => {
            // The library attaches itself to the window object
            const QRCode = (window as any).QRCode;
            
            if (QRCode) {
                // Library is loaded, proceed with generation
                if (canvasRef.current && text) {
                    const isDark = document.documentElement.classList.contains('dark');
                    QRCode.toCanvas(canvasRef.current, text, {
                        color: {
                            dark: isDark ? '#f1f5f9' : '#0f172a',
                            light: '#00000000', // transparent
                        },
                        width: 256,
                        margin: 2,
                        errorCorrectionLevel: 'H',
                    }, (err: any) => {
                        if (err) {
                            setError('Could not generate QR code. The data might be too long.');
                        } else {
                            setError('');
                        }
                    });
                }
            } else {
                // Library not loaded, try again after a short delay
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(generate, 100);
                } else {
                    setError("QR Code library failed to load. Please refresh the page.");
                }
            }
        };
        
        generate(); // Start the generation process (which includes the loading check)

        // Observer for theme changes to re-run generation
        const observer = new MutationObserver(generate);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Cleanup on unmount
        return () => observer.disconnect();
    }, [text]); // Re-run whenever the input text changes

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas || error) return;

        // Create a temporary canvas with a white background for download
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        const link = document.createElement('a');
        link.download = `qrcode.png`;

        if (tempCtx) {
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            link.href = tempCanvas.toDataURL('image/png');
        } else {
            // Fallback if context is not available
            link.href = canvas.toDataURL('image/png');
        }
        
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">QR Code Generator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create custom QR codes for URLs, text, and more.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-fit">
                    <div>
                        <label htmlFor="text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data (URL or Text)</label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            placeholder="Enter data for your QR code"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <div className="p-6 min-h-[300px] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                        {text && !error ? (
                            <canvas ref={canvasRef} className="max-w-full" />
                        ) : error ? (
                             <div className="text-center text-red-500 p-4">
                                <p className="font-semibold">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : (
                            <QrScannerAnimation />
                        )}
                    </div>
                     <button
                        onClick={handleDownload}
                        disabled={!!error || !text}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download as PNG
                    </button>
                </div>
            </div>
        </div>
    );
};