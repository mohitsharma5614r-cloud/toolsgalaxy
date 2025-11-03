// @ts-nocheck
import React, { useState } from 'react';
import { Toast } from '../Toast';

declare const jspdf: any;

export const ResumeToPdfFormatter: React.FC<{ title: string }> = ({ title }) => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('+1 234 567 890');
    const [address, setAddress] = useState('123 Main Street, Anytown, USA');
    const [summary, setSummary] = useState('A highly motivated and experienced software engineer with a passion for creating efficient and scalable web applications.');
    const [experience, setExperience] = useState([{ company: 'Tech Solutions Inc.', role: 'Senior Developer', years: '2020 - Present', desc: '- Led a team to develop a new client-facing portal.\n- Optimized application performance by 30%.' }]);
    const [education, setEducation] = useState([{ institution: 'State University', degree: 'B.S. in Computer Science', years: '2016 - 2020' }]);
    const [skills, setSkills] = useState('JavaScript, React, Node.js, Python, SQL');

    const handleGenerate = () => {
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const margin = 40;
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = margin;

            // Header
            doc.setFontSize(24).setFont('helvetica', 'bold').text(name, margin, y);
            y += 30;
            doc.setFontSize(10).setFont('helvetica', 'normal').text(`${email} | ${phone} | ${address}`, margin, y);
            y += 20;
            doc.setDrawColor(200).setLineWidth(1).line(margin, y, pageWidth - margin, y);
            y += 30;

            // Summary
            doc.setFontSize(12).setFont('helvetica', 'bold').text('PROFESSIONAL SUMMARY', margin, y);
            y += 15;
            const summaryLines = doc.splitTextToSize(summary, pageWidth - 2 * margin);
            doc.setFontSize(10).setFont('helvetica', 'normal').text(summaryLines, margin, y);
            y += summaryLines.length * 12 + 20;

            // Experience
            doc.setFontSize(12).setFont('helvetica', 'bold').text('EXPERIENCE', margin, y);
            y += 15;
            experience.forEach(exp => {
                doc.setFontSize(11).setFont('helvetica', 'bold').text(exp.role, margin, y);
                doc.setFontSize(10).setFont('helvetica', 'normal').text(exp.years, pageWidth - margin, y, { align: 'right' });
                y += 12;
                doc.setFontSize(10).setFont('helvetica', 'italic').text(exp.company, margin, y);
                y += 15;
                const descLines = doc.splitTextToSize(exp.desc, pageWidth - 2 * margin - 10);
                doc.text(descLines, margin + 10, y);
                y += descLines.length * 12 + 10;
            });

            // Education
            doc.setFontSize(12).setFont('helvetica', 'bold').text('EDUCATION', margin, y);
            y += 15;
            education.forEach(edu => {
                doc.setFontSize(11).setFont('helvetica', 'bold').text(edu.degree, margin, y);
                doc.setFontSize(10).setFont('helvetica', 'normal').text(edu.years, pageWidth - margin, y, { align: 'right' });
                y += 12;
                doc.setFontSize(10).setFont('helvetica', 'italic').text(edu.institution, margin, y);
                y += 20;
            });
            
             // Skills
            doc.setFontSize(12).setFont('helvetica', 'bold').text('SKILLS', margin, y);
            y += 15;
            const skillLines = doc.splitTextToSize(skills, pageWidth - 2 * margin);
            doc.setFontSize(10).setFont('helvetica', 'normal').text(skillLines, margin, y);

            doc.save('resume.pdf');
        } catch(e) {
            console.error(e);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Enter your details to create a professional PDF resume.</p>
            </div>
             <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="input-style"/>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input-style"/>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="input-style"/>
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="input-style"/>
                </div>
                 <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Professional Summary" rows={3} className="input-style w-full"/>
                 <textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="input-style w-full"/>
                 {/* ... More complex inputs for experience/education could be added here ... */}
                 <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF Resume</button>
            </div>
        </div>
    );
};
