import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Toast } from '../Toast';

// Using html2canvas from CDN
declare const html2canvas: any;

const googleFonts = [
    { name: 'Poppins', family: "'Poppins', sans-serif" },
    { name: 'Merriweather', family: "'Merriweather', serif" },
    { name: 'Pacifico', family: "'Pacifico', cursive" },
];

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="palette-loader mx-auto">
            <div className="swatch s1"></div>
            <div className="swatch s2"></div>
            <div className="swatch s3"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your guide...</p>
        <style>{`
            .palette-loader { width: 100px; height: 100px; position: relative; }
            .swatch {
                width: 40px; height: 60px;
                border-radius: 8px;
                position: absolute;
                top: 50%; left: 50%;
                transform-origin: center center;
                animation: fan-out 2s infinite ease-in-out;
            }
            .s1 { background: #6366f1; animation-delay: 0s; }
            .s2 { background: #a5b4fc; animation-delay: 0.2s; }
            .s3 { background: #e0e7ff; animation-delay: 0.4s; }
            @keyframes fan-out {
                0%, 100% { transform: translate(-50%, -50%) rotate(0deg) translateX(0); }
                50% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(30px); }
            }
            .s1 { --angle: -30deg; }
            .s2 { --angle: 0deg; }
            .s3 { --angle: 30deg; }
        `}</style>
    </div>
);

export const BrandStyleGuideGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [brandName, setBrandName] = useState('YourBrand');
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [accentColor, setAccentColor] = useState('#f59e0b');
    const [headingFont, setHeadingFont] = useState(googleFonts[0].family);
    const [bodyFont, setBodyFont] = useState(googleFonts[1].family);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const guideRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!guideRef.current) return;
        setIsLoading(true);
        try {
            const canvas = await html2canvas(guideRef.current, {
                scale: 2,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `${brandName}-style-guide.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            setError("Failed to generate image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate a basic style guide for your brand identity.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                        <h2 className="text-xl font-bold">Brand Details</h2>
                        <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Brand Name" className="input-style w-full"/>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Primary Color</label><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-10 p-1 border rounded"/></div>
                            <div><label>Accent Color</label><input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-full h-10 p-1 border rounded"/></div>
                        </div>
                        <div>
                            <label>Heading Font</label>
                            <select value={headingFont} onChange={e => setHeadingFont(e.target.value)} className="input-style w-full">
                                {googleFonts.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Body Font</label>
                             <select value={bodyFont} onChange={e => setBodyFont(e.target.value)} className="input-style w-full">
                                {googleFonts.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
                            </select>
                        </div>
                        <button onClick={handleDownload} disabled={isLoading} className="w-full btn-primary !mt-6 text-lg">
                            {isLoading ? 'Generating...' : 'Download Style Guide'}
                        </button>
                    </div>
                    <div className="lg:col-span-2 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border">
                        {isLoading && <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center"><Loader /></div>}
                        <div ref={guideRef} className="space-y-8">
                            <h2 className="text-3xl font-bold border-b-4 pb-2" style={{ borderColor: primaryColor }}>Brand Style Guide</h2>
                            {/* Logo */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Logo</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">Logo</div>
                                    <div style={{ fontFamily: headingFont, fontSize: '3rem' }}>{brandName}</div>
                                </div>
                            </div>
                            {/* Colors */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Color Palette</h3>
                                <div className="flex gap-4">
                                    <div className="text-center"><div className="w-20 h-20 rounded-lg" style={{ backgroundColor: primaryColor }}></div><p className="text-xs mt-1">{primaryColor}</p></div>
                                    <div className="text-center"><div className="w-20 h-20 rounded-lg" style={{ backgroundColor: accentColor }}></div><p className="text-xs mt-1">{accentColor}</p></div>
                                    <div className="text-center"><div className="w-20 h-20 rounded-lg bg-slate-800 dark:bg-slate-200"></div><p className="text-xs mt-1">Dark</p></div>
                                    <div className="text-center"><div className="w-20 h-20 rounded-lg bg-slate-100 border dark:border-slate-600"></div><p className="text-xs mt-1">Light</p></div>
                                </div>
                            </div>
                            {/* Typography */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Typography</h3>
                                <div>
                                    <p className="text-xs text-slate-500">Heading Font: {headingFont.split(',')[0].replace(/'/g, '')}</p>
                                    <p style={{ fontFamily: headingFont, fontSize: '2.5rem' }}>Aa - The quick brown fox.</p>
                                </div>
                                <div className="mt-4">
                                     <p className="text-xs text-slate-500">Body Font: {bodyFont.split(',')[0].replace(/'/g, '')}</p>
                                     <p style={{ fontFamily: bodyFont, fontSize: '1rem' }}>Aa - The quick brown fox jumps over the lazy dog.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; }
            `}</style>
        </>
    );
};