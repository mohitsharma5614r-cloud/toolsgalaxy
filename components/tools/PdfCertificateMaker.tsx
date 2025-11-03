// @ts-nocheck
import React, { useState } from 'react';

declare const PDFLib: any;

export const PdfCertificateMaker: React.FC<{ title: string }> = ({ title }) => {
    const [recipient, setRecipient] = useState('Jane Doe');
    const [course, setCourse] = useState('Advanced Web Development');
    const [issuer, setIssuer] = useState('Creator\'s Toolbox Academy');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleGenerate = async () => {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape
        const { width, height } = page.getSize();
        
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Border
        page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: rgb(0.8, 0.6, 0.2), borderWidth: 2 });

        // Content
        page.drawText('Certificate of Completion', { x: width / 2, y: height - 80, font: helveticaBold, size: 40, color: rgb(0.1, 0.1, 0.1), xAlign: 'center' });
        page.drawText('This certifies that', { x: width / 2, y: height - 150, font: timesRoman, size: 24, color: rgb(0.3, 0.3, 0.3), xAlign: 'center' });
        page.drawText(recipient, { x: width / 2, y: height - 220, font: helveticaBold, size: 36, color: rgb(0.8, 0.6, 0.2), xAlign: 'center' });
        page.drawText('has successfully completed the course', { x: width / 2, y: height - 280, font: timesRoman, size: 24, color: rgb(0.3, 0.3, 0.3), xAlign: 'center' });
        page.drawText(course, { x: width / 2, y: height - 330, font: helveticaBold, size: 28, color: rgb(0.1, 0.1, 0.1), xAlign: 'center' });

        // Footer
        page.drawText(date, { x: 150, y: 100, font: helvetica, size: 14, xAlign: 'center' });
        page.drawLine({ start: { x: 80, y: 80 }, end: { x: 220, y: 80 }, thickness: 1 });
        page.drawText('Date', { x: 150, y: 65, font: helvetica, size: 10, xAlign: 'center' });

        page.drawText(issuer, { x: width - 150, y: 100, font: helvetica, size: 14, xAlign: 'center' });
        page.drawLine({ start: { x: width - 220, y: 80 }, end: { x: width - 80, y: 80 }, thickness: 1 });
        page.drawText('Issued By', { x: width - 150, y: 65, font: helvetica, size: 10, xAlign: 'center' });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificate-${recipient}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate custom certificates in PDF format.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient's Name" className="input-style w-full"/>
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course/Achievement Name" className="input-style w-full"/>
                <input value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="Issued By" className="input-style w-full"/>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-style w-full"/>
                <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate Certificate</button>
            </div>
        </div>
    );
};
