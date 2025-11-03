import React, { useState } from 'react';
import { generateReportCardComment } from '../../services/geminiService';
import { Toast } from '../Toast';

interface Grade { subject: string; grade: string; }
interface Student { id: number; name: string; grades: Grade[]; }

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="report-loader mx-auto">
            <div className="pencil"></div>
            <div className="paper"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating report card...</p>
        <style>{`
            .report-loader { width: 100px; height: 100px; position: relative; }
            .paper { width: 80%; height: 100%; background: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 4px; position: absolute; left: 10%; }
            .dark .paper { background: #1e293b; border-color: #475569; }
            .pencil { width: 20px; height: 80px; background: #fcd34d; border-radius: 4px; position: absolute; top: 0; left: 0; transform-origin: bottom center; animation: writing 2s infinite ease-in-out; }
            .pencil::after { content:''; position:absolute; top: 100%; left:0; width:0; height:0; border-style:solid; border-width: 10px 10px 0 10px; border-color: #334155 transparent transparent transparent; }
            @keyframes writing { 0%, 100% { transform: rotate(15deg); } 25% { transform: rotate(10deg) translateY(10px); } 50% { transform: rotate(-5deg); } 75% { transform: rotate(10deg) translateY(10px); } }
        `}</style>
    </div>
);


export const StudentReportCardGenerator: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([{ id: 1, name: "Sample Student", grades: [{ subject: "Math", grade: "A" }] }]);
    const [newStudentName, setNewStudentName] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(1);
    const [newGrade, setNewGrade] = useState({ subject: '', grade: '' });
    const [report, setReport] = useState<{ student: Student; comment: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedStudent = students.find(s => s.id === selectedStudentId);

    const addStudent = () => {
        if (!newStudentName.trim()) return;
        const newStudent = { id: Date.now(), name: newStudentName.trim(), grades: [] };
        setStudents([...students, newStudent]);
        setSelectedStudentId(newStudent.id);
        setNewStudentName('');
    };

    const addGrade = () => {
        if (!newGrade.subject.trim() || !newGrade.grade.trim() || !selectedStudentId) return;
        setStudents(students.map(s =>
            s.id === selectedStudentId ? { ...s, grades: [...s.grades, newGrade] } : s
        ));
        setNewGrade({ subject: '', grade: '' });
    };

    const deleteGrade = (subject: string) => {
        if (!selectedStudentId) return;
        setStudents(students.map(s =>
            s.id === selectedStudentId ? { ...s, grades: s.grades.filter(g => g.subject !== subject) } : s
        ));
    };

    const handleGenerateReport = async () => {
        if (!selectedStudent || selectedStudent.grades.length === 0) {
            setError("Please add at least one grade for the selected student.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const comment = await generateReportCardComment(selectedStudent.name, selectedStudent.grades);
            setReport({ student: selectedStudent, comment });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate comment.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => window.print();

    if (isLoading) {
        return <div className="max-w-4xl mx-auto"><div className="min-h-[400px] flex items-center justify-center"><Loader /></div></div>;
    }
    
    if (report) {
        return (
            <div className="max-w-4xl mx-auto printable-area">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border printable-content">
                    <header className="text-center mb-6">
                        <h1 className="text-3xl font-bold">Student Report Card</h1>
                        <p className="text-slate-500">Academic Year 2023-2024</p>
                    </header>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <p><strong>Student:</strong> {report.student.name}</p>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr><th className="p-2">Subject</th><th className="p-2">Grade/Mark</th></tr>
                        </thead>
                        <tbody>
                            {report.student.grades.map((g, i) => (
                                <tr key={i} className="border-b dark:border-slate-700">
                                    <td className="p-2 font-semibold">{g.subject}</td><td className="p-2">{g.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6">
                        <h3 className="font-bold">Teacher's Comments:</h3>
                        <p className="italic mt-1">{report.comment}</p>
                    </div>
                </div>
                <div className="mt-6 text-center no-print flex gap-4 justify-center">
                    <button onClick={() => setReport(null)} className="btn-secondary">Back to Editor</button>
                    <button onClick={handlePrint} className="btn-primary">Print Report Card</button>
                </div>
                 <style>{`@media print { .no-print { display:none } .printable-area {margin:0;padding:0} .printable-content * { color: black !important; border-color: #ccc !important; background: transparent !important; } }`}</style>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Student Report Card Generator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage students, enter grades, and generate report cards with AI comments.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">Manage Students</h2>
                        <select value={selectedStudentId || ''} onChange={e => setSelectedStudentId(Number(e.target.value))} className="input-style w-full mb-4">
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="New Student Name" className="input-style flex-grow" />
                            <button onClick={addStudent} className="btn-primary px-4">+</button>
                        </div>
                    </div>
                     <button onClick={handleGenerateReport} disabled={!selectedStudent || selectedStudent.grades.length === 0} className="w-full btn-primary text-lg">Generate Report Card</button>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border">
                    <h2 className="text-xl font-bold mb-4">Grades for {selectedStudent?.name || "..."}</h2>
                    <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                        {selectedStudent?.grades.map(g => (
                            <div key={g.subject} className="flex justify-between items-center text-sm p-2 bg-slate-100 dark:bg-slate-700/50 rounded">
                                <span><strong>{g.subject}:</strong> {g.grade}</span>
                                <button onClick={() => deleteGrade(g.subject)} className="text-red-500 font-bold">&times;</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                        <input value={newGrade.subject} onChange={e => setNewGrade({...newGrade, subject: e.target.value})} placeholder="Subject" className="input-style w-1/2"/>
                        <input value={newGrade.grade} onChange={e => setNewGrade({...newGrade, grade: e.target.value})} placeholder="Grade" className="input-style w-1/2"/>
                        <button onClick={addGrade} className="btn-primary px-4">+</button>
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1rem;}
                .btn-secondary { background: #64748b; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1rem;}
            `}</style>
        </div>
    );
};