
// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const jspdf: any;

const Loader: React.FC = () => (
    <div className="text-center">
        <svg className="quill-loader" width="120" height="120" viewBox="0 0 120 120">
            <path className="quill-body" d="M100 20 L110 30 L40 100 L30 90 Z" fill="#9ca3af"/>
            <path className="quill-nib" d="M30 90 L35 95 L40 100 Z" fill="#334155"/>
            <path className="scroll-line" d="M20,80 Q40,60 60,80 T100,80" stroke="#6366f1" strokeWidth="3" fill="none" />
        </svg>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-4">Formatting your letter...</p>
        <style>{`
            .dark .quill-body { fill: #cbd5e1; }
            .dark .quill-nib { fill: #0f172a; }
            .dark .scroll-line { stroke: #818cf8; }

            .scroll-line {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw-scroll 1.5s 0.5s forwards;
            }

            .quill-body, .quill-nib {
                animation: move-quill 2s forwards;
            }

            @keyframes draw-scroll {
                to { stroke-dashoffset: 0; }
            }

            @keyframes move-quill {
                0% { transform: translate(-20px, 20px) rotate(15deg); }
                25% { transform: translate(0, 0) rotate(15deg); }
                100% { transform: translate(80px, 0) rotate(15deg); }
            }
        `}</style>
    </div>
);

export const CoverLetterFormatter: React.FC<{ title: string }> = ({ title }) => {
    const [yourInfo, setYourInfo] = useState('John Doe\n123 Main St\nAnytown, USA 12345\njohn.doe@email.com');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    const [recipientInfo, setRecipientInfo] = useState('Hiring Manager\nInnovate Corp\n456 Business Ave\nTech City, USA 54321');
    const [body, setBody] = useState('Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the Software Engineer position I saw advertised on [Platform]. Given my [Number] years of experience in developing and deploying scalable web applications, I am confident I possess the skills and qualifications you are seeking.\n\nIn my previous role at [Previous Company], I was responsible for [mention a key achievement or responsibility]. This experience has equipped me with a strong proficiency in [mention a key skill, e.g., React, Node.js] and a deep understanding of the full software development lifecycle.\n\nI am particularly drawn to [Company Name] because of [mention something specific, e.g., your commitment to innovation, your company culture, a specific product]. I am eager to contribute my skills to a team that is making a real impact in the industry.\n\nThank you for your time and consideration. I have attached my resume for your review and look forward to the possibility of discussing this exciting opportunity with you further.');
    const [closing, setClosing] = useState('Sincerely,');
    const [yourName, setYourName] = useState('John Doe');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = () => {
        setIsLoading(true);
        setError(null);
        try {
            setTimeout(() => {
                const { jsPDF } = jspdf;
                const doc = new jsPDF('p', 'pt', 'a4');
                const margin = 72; // 1 inch
                const pageWidth = doc.internal.pageSize.getWidth();
                let y = margin;
                const lineHeight = 14;

                doc.setFontSize(11).setFont('times', 'normal');
                
                // Your info
                const yourInfoLines = doc.splitTextToSize(yourInfo, pageWidth - 2 * margin);
                doc.text(yourInfoLines, margin, y);
                y += yourInfoLines.length * lineHeight + 30;
                
                // Date
                doc.text(date, margin, y);
                y += 30;

                // Recipient info
                const recipientLines = doc.splitTextToSize(recipientInfo, pageWidth - 2 * margin);
                doc.text(recipientLines, margin, y);
                y += recipientLines.length * lineHeight + 30;

                // Body
                const bodyParagraphs = body.split('\n\n');
                bodyParagraphs.forEach(para => {
                    const lines = doc.splitTextToSize(para, pageWidth - 2 * margin);
                    if (y + lines.length * lineHeight > doc.internal.pageSize.getHeight() - margin) {
                        doc.addPage();
                        y = margin;
                    }
                    doc.text(lines, margin, y);
                    y += lines.length * lineHeight + lineHeight; // Add extra space for paragraph break
                });

                // Closing
                y += 10;
                doc.text(closing, margin, y);
                y += 40; // Space for signature
                doc.text(yourName, margin, y);

                doc.save('cover-letter.pdf');
                setIsLoading(false);
            }, 1000); // Simulate processing for loader
        } catch(e) {
            setError("Failed to generate PDF. Please check your inputs.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter your details to generate a classic, professional PDF cover letter.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    {isLoading ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <textarea value={yourInfo} onChange={e => setYourInfo(e.target.value)} rows={4} placeholder="Your Info" className="input-style"/>
                                <textarea value={recipientInfo} onChange={e => setRecipientInfo(e.target.value)} rows={4} placeholder="Recipient Info" className="input-style"/>
                            </div>
                            <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="Date" className="input-style w-full"/>
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={15} placeholder="Letter Body..." className="input-style w-full"/>
                             <div className="grid grid-cols-2 gap-4">
                                 <input value={closing} onChange={e => setClosing(e.target.value)} placeholder="Closing (e.g., Sincerely,)" className="input-style"/>
                                 <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Your Name" className="input-style"/>
                            </div>
                            <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF</button>
                        </>
                    )}
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; width: 100%; }
                .dark .input-style { background-color: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
                .btn-primary:hover { background-color: #4338ca; }
            `}</style>
        </>
    );
};
