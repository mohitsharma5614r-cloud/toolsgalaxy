
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const PDFLib: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="stamp-loader mx-auto">
            <div className="stamp-handle"></div>
            <div className="stamp-base"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Creating your document...</p>
        <style>{`
            .stamp-loader { width: 80px; height: 100px; position: relative; }
            .stamp-handle { width: 60px; height: 30px; background: #64748b; border-radius: 15px 15px 0 0; position: absolute; top: 0; left: 10px; }
            .stamp-base { width: 100%; height: 50px; background: #9ca3af; border-radius: 8px; position: absolute; top: 30px; animation: stamp-anim 1.5s infinite ease-in-out; }
            .dark .stamp-handle { background: #94a3b8; }
            .dark .stamp-base { background: #cbd5e1; }
            @keyframes stamp-anim { 0%,100% {transform:translateY(0)} 50% {transform:translateY(20px) scaleY(0.9)} }
        `}</style>
    </div>
);

export const LetterheadTemplateCreator: React.FC<{ title: string }> = ({ title }) => {
    const [logo, setLogo] = useState<File | null>(null);
    const [company, setCompany] = useState('Your Company Inc.');
    const [address, setAddress] = useState('123 Business Rd, Suite 456, Commerce City, 12345');
    const [contact, setContact] = useState('contact@yourcompany.com | (123) 456-7890');
    const [body, setBody] = useState('Dear [Recipient Name],\n\nThis is the main body of your letter. You can write your content here.\n\nSincerely,\n\n[Your Name]');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { PDFDocument, StandardFonts, rgb } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            
            let logoImage;
            if (logo) {
                const logoBytes = await logo.arrayBuffer();
                logoImage = await pdfDoc.embedPng(logoBytes);
            }
            
            const drawHeader = async (page) => {
                 const { width, height } = page.getSize();
                 const margin = 60;
                 let headerY = height - margin;

                 if (logoImage) {
                    const logoDims = logoImage.scale(0.25);
                    page.drawImage(logoImage, { x: margin, y: headerY - logoDims.height + 10, width: logoDims.width, height: logoDims.height });
                 }
            
                page.drawText(company, { x: width - margin, y: headerY, font: boldFont, size: 16, color: rgb(0.1, 0.1, 0.1), xAlign: 'right' });
                headerY -= 20;
                page.drawText(address, { x: width - margin, y: headerY, font: font, size: 10, color: rgb(0.3, 0.3, 0.3), xAlign: 'right' });
                headerY -= 15;
                page.drawText(contact, { x: width - margin, y: headerY, font: font, size: 10, color: rgb(0.3, 0.3, 0.3), xAlign: 'right' });

                page.drawLine({ start: { x: margin, y: headerY - 20 }, end: { x: width - margin, y: headerY - 20 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
                return headerY - 50; // Return starting Y for body
            };
            
            let page = pdfDoc.addPage();
            let y = await drawHeader(page);
            const { width, height } = page.getSize();
            const margin = 60;
            const fontSize = 11;
            const lineHeight = fontSize * 1.4;

            const lines = body.split('\n');
            for (const line of lines) {
                if (y < margin) {
                    page = pdfDoc.addPage();
                    y = await drawHeader(page);
                }
                page.drawText(line, { x: margin, y, font, size: fontSize });
                y -= lineHeight;
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `letterhead.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            
        } catch (e) {
            console.error(e);
            setError("Failed to generate PDF. Please ensure the logo is a valid PNG file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a custom letterhead for your PDFs.</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                {isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company Name" className="input-style"/>
                            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact Info" className="input-style"/>
                        </div>
                        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="input-style w-full"/>
                        <div>
                            <label className="label-style">Logo (Optional, PNG only)</label>
                            <input type="file" accept="image/png" onChange={e => setLogo(e.target.files ? e.target.files[0] : null)} className="input-file-style" />
                        </div>
                        <div>
                            <label className="label-style">Letter Body</label>
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10} className="input-style w-full font-serif"/>
                        </div>
                        <button onClick={handleGenerate} className="w-full btn-primary text-lg">
                            Generate PDF
                        </button>
                    </div>
                )}
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                 .input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: #1e293b; border-color: #475569; color: white; }
                .label-style { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
                .input-file-style { font-size: 0.875rem; }
            `}</style>
        </div>
    );
};
