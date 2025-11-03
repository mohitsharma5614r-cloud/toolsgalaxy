import React, { useState, useRef, useEffect } from 'react';

// TypeScript declaration for the JsBarcode library loaded from CDN
declare var JsBarcode: any;

const formats = [
    { value: 'CODE128', label: 'Code 128' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'UPC', label: 'UPC' },
    { value: 'ITF14', label: 'ITF-14' },
    { value: 'MSI', label: 'MSI' },
    { value: 'pharmacode', label: 'Pharmacode' },
    { value: 'codabar', label: 'Codabar' },
];

export const BarcodeGenerator: React.FC = () => {
    const [text, setText] = useState('9780199532159');
    const [format, setFormat] = useState('EAN13');
    const [lineWidth, setLineWidth] = useState(2);
    const [height, setHeight] = useState(100);
    const [displayValue, setDisplayValue] = useState(true);
    const [error, setError] = useState('');
    const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');


    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Observer for theme changes to update barcode color
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (canvasRef.current && text) {
            try {
                JsBarcode(canvasRef.current, text, {
                    format: format,
                    lineColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                    background: 'transparent',
                    width: lineWidth,
                    height: height,
                    displayValue: displayValue,
                    fontOptions: 'bold',
                    font: 'Poppins',
                    fontSize: 18,
                    textMargin: 5,
                    valid: (valid: boolean) => {
                        if (!valid) {
                            setError('Invalid data for the selected barcode format. Check length and character requirements.');
                        } else {
                            setError('');
                        }
                    }
                });
            } catch (e: any) {
                // This will catch errors from JsBarcode itself, e.g. unknown format
                setError('Failed to generate barcode. The data or format may be incorrect.');
            }
        }
    }, [text, format, lineWidth, height, displayValue, theme]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas && !error) {
            const link = document.createElement('a');
            link.download = `barcode-${text}.png`;
            
            // Create a temporary canvas to draw a white background for the downloaded image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
                tempCtx.fillStyle = '#FFFFFF';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.drawImage(canvas, 0, 0);
                link.href = tempCanvas.toDataURL('image/png');
            } else {
                 link.href = canvas.toDataURL('image/png');
            }
            
            link.click();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Barcode Generator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create and download custom barcodes for any need.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-fit">
                    <div>
                        <label htmlFor="text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data</label>
                        <input
                            id="text"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter barcode data"
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="format" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Format</label>
                        <select
                            id="format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            {formats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="lineWidth" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Line Width ({lineWidth}px)</label>
                        <input id="lineWidth" type="range" min="1" max="4" step="0.5" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height ({height}px)</label>
                        <input id="height" type="range" min="20" max="150" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="flex items-center">
                        <input id="displayValue" type="checkbox" checked={displayValue} onChange={e => setDisplayValue(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="displayValue" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">Display Value</label>
                    </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <div className="p-6 min-h-[250px] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                        {error ? (
                            <div className="text-center text-red-500 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <p className="font-semibold">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : (
                            <canvas ref={canvasRef} className="max-w-full" />
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