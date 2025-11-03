
import React, { useState } from 'react';
import { generateResumeContent, ResumeContent } from '../../services/geminiService';
import { Toast } from '../Toast';

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button 
            onClick={handleCopy} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            disabled={!textToCopy}
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
            {copied ? 'Copied!' : 'Copy Resume Text'}
        </button>
    );
};

// FIX: Add title prop to component to resolve error from App.tsx.
export const AiResumeGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [name, setName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [skills, setSkills] = useState('');
    const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!name.trim() || !jobTitle.trim() || !skills.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        setIsLoading(true);
        setResumeContent(null);
        setError(null);

        try {
            const generatedContent = await generateResumeContent(name, jobTitle, skills);
            setResumeContent(generatedContent);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatResumeForCopy = (): string => {
        if (!resumeContent) return '';
        const experienceText = resumeContent.experience.map(item => `- ${item}`).join('\n');
        return `${name}\n\nPROFESSIONAL SUMMARY\n${resumeContent.summary}\n\nKEY EXPERIENCE\n${experienceText}`;
    };
    
    const clearError = () => setError(null);

    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 📄</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a powerful, professional resume summary and key experience points in seconds.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Alex Doe" className="w-full input-style" />
                </div>
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Desired Job Title</label>
                    <input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Senior Frontend Engineer" className="w-full input-style" />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
                    <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, TypeScript, UI/UX" className="w-full input-style" />
                </div>
            </div>
            
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="mt-8 w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? 'Generating...' : 'Generate Resume'}
            </button>
            
            <div className="mt-8">
                {isLoading ? (
                    <div className="text-center min-h-[300px] flex flex-col justify-center items-center">
                        <div className="document-loader">
                            <div className="line l1"></div>
                            <div className="line l2"></div>
                            <div className="line l3"></div>
                            <div className="line l4"></div>
                            <div className="cursor"></div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Crafting your professional story...</p>
                    </div>
                ) : resumeContent ? (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in text-left">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-700 pb-2">{name}</h2>
                        <div className="mt-4">
                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Professional Summary</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">{resumeContent.summary}</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Key Experience</h3>
                            <ul className="mt-2 space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                                {resumeContent.experience.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                            <CopyButton textToCopy={formatResumeForCopy()} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <p className="mt-4 text-lg">Your generated resume will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        {error && <Toast message={error} onClose={clearError} />}
        <style>
        {`
            .input-style {
                background-color: white;
                border: 1px solid #cbd5e1; /* slate-300 */
                border-radius: 0.5rem;
                padding: 0.75rem;
                color: #0f172a; /* slate-900 */
                transition: all 0.2s;
            }
            .dark .input-style {
                background-color: rgba(15, 23, 42, 0.5); /* slate-900/50 */
                border-color: #475569; /* slate-600 */
                color: white;
            }
            .input-style:focus {
                outline: 2px solid transparent;
                outline-offset: 2px;
                box-shadow: 0 0 0 2px #6366f1; /* ring-indigo-500 */
                border-color: #6366f1; /* border-indigo-500 */
            }
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
            .document-loader {
                width: 100px;
                height: 120px;
                border: 3px solid #9ca3af; /* gray-400 */
                border-radius: 8px;
                position: relative;
                overflow: hidden;
            }
             .dark .document-loader {
                border-color: #6b7280; /* gray-500 */
            }
            .document-loader .line {
                width: 80%;
                height: 8px;
                background: #d1d5db; /* gray-300 */
                border-radius: 4px;
                margin: 12px auto;
                animation: line-writing 2s infinite ease-in-out;
            }
            .dark .document-loader .line {
                 background: #4b5563; /* gray-600 */
            }
            .document-loader .l1 { animation-delay: 0s; }
            .document-loader .l2 { animation-delay: 0.2s; }
            .document-loader .l3 { animation-delay: 0.4s; }
            .document-loader .l4 { animation-delay: 0.6s; }
            
            .document-loader .cursor {
                width: 8px;
                height: 10px;
                background: #4f46e5; /* indigo-600 */
                position: absolute;
                top: 12px;
                left: 10%;
                animation: cursor-blink 1s infinite, cursor-move 2s infinite ease-in-out;
            }
            @keyframes line-writing {
                0% { width: 0%; }
                50% { width: 80%; }
                100% { width: 80%; }
            }
            @keyframes cursor-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            @keyframes cursor-move {
                0% { top: 12px; left: 10%; }
                25% { top: 12px; left: 90%; }
                26% { top: 32px; left: 10%; }
                50% { top: 32px; left: 90%; }
                51% { top: 52px; left: 10%; }
                75% { top: 52px; left: 90%; }
                76% { top: 72px; left: 10%; }
                100% { top: 72px; left: 90%; }
            }
        `}
        </style>
        </>
    );
};
