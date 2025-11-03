
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const pdfjsLib: any;
declare const jspdf: any;

const Loader: React.FC<{ message: string, progress: number }> = ({ message, progress }) => (
    <div className="text-center">
        <div className="bg-remover-loader mx-auto">
            <div className="page"></div>
            <div className="wiper"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">{message}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 dark:bg-slate-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
    </div>
);

export const PdfBackgroundRemover: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const { jsPDF } = jspdf;
                let newPdf;

                const hexToRgb = (hex) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
                };
                const targetRgb = hexToRgb(bgColor);
                if (!targetRgb) throw new Error("Invalid background color.");

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport }).promise;

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    const tolerance = 20;
                    for (let j = 0; j < data.length; j += 4) {
                        const r = data[j]; const g = data[j + 1]; const b = data[j + 2];
                        if (Math.abs(r - targetRgb.r) < tolerance && Math.abs(g - targetRgb.g) < tolerance && Math.abs(b - targetRgb.b) < tolerance) {
                            data[j + 3] = 0; // Make transparent
                        }
                    }
                    context.putImageData(imageData, 0, 0);

                    const imgData = canvas.toDataURL('image/png');

                    if (i === 1) {
                        newPdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
                    } else {
                        newPdf.addPage([canvas.width, canvas.height], 'p');
                    }
                    newPdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                    setProgress((i / pdf.numPages) * 100);
                }

                newPdf.save(`${file.name.replace(/\.pdf$/, '')}-no-bg.pdf`);
                setIsLoading(false);
            };
        } catch (e) {
            setError("Failed to process PDF.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                .bg-remover-loader { width: 100px; height: 120px; position: relative; border: 2px solid #9ca3af; border-radius: 4px; overflow: hidden; background: #e2e8f0; }
                .dark .bg-remover-loader { background: #1e293b; border-color: #475569; }
                .page { position: absolute; inset: 5px; background: linear-gradient(45deg, #a5b4fc, #f472b6); }
                .wiper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-conic-gradient(#cbd5e1 0 25%, #e2e8f0 0 50%) 50% / 20px 20px; animation: wipe-bg 2.5s forwards; }
                .dark .wiper { background: repeating-conic-gradient(#334155 0 25%, #475569 0 50%) 50% / 20px 20px; }
                @keyframes wipe-bg { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Remove a solid background color from your PDF pages.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[250px] flex items-center justify-center"><Loader message="Removing background..." progress={progress} /></div>
                ) : (
                    <div className="space-y-6">
                        <FileUploader onFileSelected={setFile} acceptedTypes="application/pdf" label="Upload a PDF File" />
                        <div>
                            <label className="label-style">Color to Remove</label>
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-12 p-1 border rounded-md cursor-pointer" />
                        </div>
                        <button onClick={handleProcess} disabled={!file} className="w-full btn-primary text-lg">Remove Background & Download</button>
                         <p className="text-xs text-center text-slate-400">Note: This tool converts pages to images, which will remove selectable text. Best for solid color backgrounds.</p>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};
