// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toast } from '../Toast';
import { FileUploader } from '../FileUploader';

declare const PDFLib: any;
declare const pdfjsLib: any;

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">{message}</p>
    </div>
);

const SignaturePad: React.FC<{ onSave: (dataUrl: string) => void }> = ({ onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.getContext('2d').lineCap = 'round';
            canvas.getContext('2d').lineWidth = 3;
        }
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        isDrawing.current = true;
    };
    const draw = ({ nativeEvent }) => {
        if (!isDrawing.current) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };
    const stopDrawing = () => { isDrawing.current = false; };
    const clear = () => {
        const canvas = canvasRef.current;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="space-y-2">
            <canvas
                ref={canvasRef}
                width="400"
                height="200"
                className="bg-slate-100 dark:bg-slate-700 rounded-md cursor-crosshair w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            <div className="flex gap-2">
                <button onClick={clear} className="btn-secondary flex-1">Clear</button>
                <button onClick={() => onSave(canvasRef.current.toDataURL())} className="btn-primary flex-1">Use Signature</button>
            </div>
        </div>
    );
};


export const EsignPdf: React.FC<{ title: string }> = ({ title }) => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [pageImages, setPageImages] = useState<string[]>([]);
    const [signature, setSignature] = useState<string | null>(null);
    const [signaturePos, setSignaturePos] = useState<{ pageIndex: number; x: number; y: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [sigType, setSigType] = useState<'draw' | 'type' | 'upload'>('draw');
    const [typedName, setTypedName] = useState('');

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setIsLoading(true);
        try {
            const typedarray = new Uint8Array(await selectedFile.arrayBuffer());
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const images: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const context = canvas.getContext('2d');
                await page.render({ canvasContext: context, viewport }).promise;
                images.push(canvas.toDataURL());
            }
            setPageImages(images);
            setStep(2);
        } catch (e) {
            setError("Failed to load PDF preview.");
        } finally {
            setIsLoading(false);
        }
    };

    const useTypedSignature = () => {
        if (!typedName) return;
        const canvas = document.createElement('canvas');
        canvas.width = 400; canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.font = '50px "Dancing Script", cursive';
        ctx.fillText(typedName, 20, 80);
        setSignature(canvas.toDataURL());
        setStep(3);
    };

    const handlePlaceSignature = (e: React.MouseEvent, pageIndex: number) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - ((e.clientY - rect.top) / rect.height); // PDF-lib has inverted Y
        setSignaturePos({ pageIndex, x, y });
    };

    const handleApplyAndDownload = async () => {
        if (!file || !signature || !signaturePos) return;
        setIsLoading(true);
        try {
            const { PDFDocument, degrees } = PDFLib;
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const signatureBytes = await fetch(signature).then(res => res.arrayBuffer());
            const signatureImage = await pdfDoc.embedPng(signatureBytes);

            const page = pdfDoc.getPages()[signaturePos.pageIndex];
            const { width, height } = page.getSize();
            const sigWidth = 150;
            const sigHeight = (sigWidth / signatureImage.width) * signatureImage.height;

            page.drawImage(signatureImage, {
                x: signaturePos.x * width - (sigWidth / 2),
                y: signaturePos.y * height - (sigHeight / 2),
                width: sigWidth,
                height: sigHeight,
            });

            const newPdfBytes = await pdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `signed-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            // Reset
            setStep(1); setFile(null); setSignature(null); setSignaturePos(null);

        } catch (e) {
            setError("Failed to apply signature.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add your signature to any PDF document.</p>
            </div>

             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                 {isLoading && <div className="min-h-[300px] flex items-center justify-center"><Loader message="Processing..." /></div>}
                 
                 {!isLoading && step === 1 && <FileUploader onFileSelected={handleFileSelect} acceptedTypes="application/pdf" label="1. Upload PDF to Sign" />}
                
                 {!isLoading && step === 2 && (
                     <div className="space-y-4">
                         <h2 className="text-xl font-bold">2. Create Your Signature</h2>
                         <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                             <button onClick={() => setSigType('draw')} className={`tab ${sigType === 'draw' && 'tab-active'}`}>Draw</button>
                             <button onClick={() => setSigType('type')} className={`tab ${sigType === 'type' && 'tab-active'}`}>Type</button>
                             <button onClick={() => setSigType('upload')} className={`tab ${sigType === 'upload' && 'tab-active'}`}>Upload</button>
                         </div>
                         {sigType === 'draw' && <SignaturePad onSave={(data) => { setSignature(data); setStep(3); }} />}
                         {sigType === 'type' && (
                             <div className="flex gap-2">
                                 <input value={typedName} onChange={e => setTypedName(e.target.value)} placeholder="Type your name" className="input-style flex-grow font-['Dancing_Script'] text-2xl" />
                                 <button onClick={useTypedSignature} className="btn-primary">Use</button>
                             </div>
                         )}
                         {sigType === 'upload' && <input type="file" accept="image/png" onChange={async e => { if (e.target.files?.[0]) { const url = URL.createObjectURL(e.target.files[0]); setSignature(url); setStep(3); } }} className="input-file-style" />}
                     </div>
                 )}

                {!isLoading && step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">3. Place Your Signature</h2>
                        <p>Click on a page to place your signature. Click again to move it.</p>
                        <div className="max-h-[600px] overflow-y-auto space-y-4 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-md">
                            {pageImages.map((src, i) => (
                                <div key={i} className="relative cursor-pointer" onClick={(e) => handlePlaceSignature(e, i)}>
                                    <img src={src} alt={`Page ${i+1}`} className="w-full h-auto border" />
                                    {signaturePos?.pageIndex === i && signature && (
                                        <img src={signature} alt="signature" className="absolute w-[150px] pointer-events-none" style={{ left: `calc(${signaturePos.x * 100}% - 75px)`, bottom: `calc(${signaturePos.y * 100}% - 37px)` }} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleApplyAndDownload} disabled={!signaturePos} className="w-full btn-primary text-lg">Apply & Download</button>
                    </div>
                )}
             </div>
             {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};