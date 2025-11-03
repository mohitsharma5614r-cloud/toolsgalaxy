
// @ts-nocheck
import React, { useState } from 'react';
declare const jspdf: any;

// A simple state manager for repeatable sections
const useSection = (initialState) => {
    const [items, setItems] = useState(initialState);
    const addItem = () => setItems([...items, { ...Object.keys(initialState[0]).reduce((acc, key) => ({...acc, [key]: ''}), {}) }]);
    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    return { items, addItem, updateItem, removeItem };
};


export const ResumeToPdfDesigner: React.FC<{ title: string }> = ({ title }) => {
    // State
    const [name, setName] = useState('Jane Doe');
    const [role, setRole] = useState('Senior Product Designer');
    const [contact, setContact] = useState('jane.doe@email.com | (123) 456-7890 | portfolio.com');
    const [summary, setSummary] = useState('Creative and detail-oriented product designer with 8+ years of experience...');
    const expState = useSection([{ company: 'Innovate Corp', title: 'Lead Designer', years: '2020-Present', desc: '• Led redesign of flagship product' }]);
    const eduState = useSection([{ school: 'Design University', degree: 'M.A. in Interaction Design', years: '2014-2016' }]);
    const [skills, setSkills] = useState('UX/UI Design, Prototyping, User Research, Figma, Design Systems');

    const handleGenerate = () => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = margin;
        
        // --- Header ---
        doc.setFontSize(28).setFont('helvetica', 'bold').text(name, pageWidth / 2, y, { align: 'center' });
        y += 30;
        doc.setFontSize(14).setFont('helvetica', 'normal').setTextColor(100).text(role, pageWidth / 2, y, { align: 'center' });
        y += 20;
        doc.setFontSize(10).text(contact, pageWidth / 2, y, { align: 'center' });
        y += 30;

        // --- Summary ---
        doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(0).text('SUMMARY', margin, y);
        y += 15;
        doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(80).text(doc.splitTextToSize(summary, pageWidth - 2 * margin), margin, y);
        y += doc.splitTextToSize(summary, pageWidth - 2 * margin).length * 12 + 20;

        // --- Experience ---
        doc.setFontSize(12).setFont('helvetica', 'bold').setTextColor(0).text('EXPERIENCE', margin, y);
        y += 15;
        expState.items.forEach(exp => {
             doc.setFontSize(11).setFont('helvetica', 'bold').text(exp.title, margin, y);
             doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(150).text(exp.years, pageWidth - margin, y, { align: 'right' });
             y+=12;
             doc.setFontSize(10).setFont('helvetica', 'italic').setTextColor(100).text(exp.company, margin, y);
             y+=15;
             doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(80).text(doc.splitTextToSize(exp.desc, pageWidth - 2*margin - 15), margin + 15, y);
             y += doc.splitTextToSize(exp.desc, pageWidth - 2*margin - 15).length * 12 + 10;
        });
        
        // ... Similar logic for Education and Skills
        
        doc.save(`${name}-resume.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Design a visually appealing resume in PDF format.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input-style w-full text-lg font-bold" />
                 <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" className="input-style w-full" />
                <button onClick={handleGenerate} className="w-full btn-primary text-lg">Generate PDF</button>
            </div>
        </div>
    );
};
