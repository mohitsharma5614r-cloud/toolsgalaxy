
// @ts-nocheck
import React, { useState } from 'react';
declare const jspdf: any;

export const LegalDocumentFormatter: React.FC<{ title: string }> = ({ title }) => {
    const [docTitle, setDocTitle] = useState('AFFIDAVIT');
    const [body, setBody] = useState('I, the undersigned, being duly sworn, depose and state as follows:\n\n1. That I am the plaintiff in the above-entitled action.\n\n2. That I have read the foregoing complaint and know the contents thereof and that the same is true of my own knowledge...');
    
    const handleGenerate = () => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 72; // 1 inch
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = margin;
        
        // Title
        doc.setFontSize(14).setFont('times', 'bold').text(docTitle, pageWidth / 2, y, { align: 'center' });
        y += 40;
        
        // Body
        doc.setFontSize(12).setFont('times', 'normal');
        const lineHeight = 14;
        const lines = doc.splitTextToSize(body, pageWidth - 2 * margin - 20); // leave space for line numbers
        
        let lineNum = 1;
        lines.forEach(line => {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin + 20, y);
            doc.text(`${lineNum}`, margin - 20, y, { align: 'right' });
            y += lineHeight;
            lineNum++;
        });

        doc.save('legal-document.pdf');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Format documents with standard legal layouts like line numbering.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                <input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Document Title" className="input-style w-full font-bold text-center"/>
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={15} placeholder="Paste document text here..." className="input-style w-full"/>
                <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF</button>
            </div>
        </div>
    );
};
