
import React, { useState } from 'react';
import { generatePresentation, PresentationSlide } from '../../services/geminiService';
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
            {copied ? 'Copied!' : 'Copy All'}
        </button>
    );
};

// FIX: Add title prop to component to resolve error from App.tsx.
export const AiPresentationMaker: React.FC<{ title: string }> = ({ title }) => {
    const [topic, setTopic] = useState('');
    const [slides, setSlides] = useState<PresentationSlide[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a presentation topic.");
            return;
        }
        setIsLoading(true);
        setSlides([]);
        setError(null);

        try {
            const generatedSlides = await generatePresentation(topic);
            setSlides(generatedSlides);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatSlidesForCopy = (): string => {
        return slides.map((slide, index) => {
            return `Slide ${index + 1}: ${slide.title}\n\n${slide.content}\n\n`;
        }).join('---\n\n');
    };
    
    const clearError = () => setError(null);

    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 📊</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Turn any topic into a structured slide presentation instantly.</p>
            </div>
            
            <div className="space-y-4">
                 <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presentation Topic</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                            placeholder="e.g., The History of Ancient Rome"
                            className="flex-grow w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            aria-label="Presentation Topic"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <div className="slide-loader">
                            <div className="slide"></div>
                            <div className="slide"></div>
                            <div className="slide"></div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Building your slides...</p>
                    </div>
                ) : slides.length > 0 ? (
                    <div className="space-y-6 animate-fade-in">
                        {slides.map((slide, index) => (
                            <div key={index} className="bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-left shadow-sm">
                                <h3 className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">SLIDE {index + 1}</h3>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{slide.title}</p>
                                <div className="mt-4 text-slate-600 dark:text-slate-300 whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed max-w-none">
                                    {slide.content}
                                </div>
                            </div>
                        ))}
                         <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                            <CopyButton textToCopy={formatSlidesForCopy()} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="2" y1="8" x2="22" y2="8" /></svg>
                        <p className="mt-4 text-lg">Your generated presentation will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        {error && <Toast message={error} onClose={clearError} />}
        <style>
        {`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
            .slide-loader {
                width: 80px;
                height: 60px;
                position: relative;
                perspective: 200px;
            }
            .slide-loader .slide {
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: #a5b4fc; /* indigo-300 */
                border: 2px solid #6366f1; /* indigo-500 */
                border-radius: 6px;
                transform-origin: bottom center;
                animation: flip 2.1s infinite ease-in-out;
            }
            .dark .slide-loader .slide {
                background-color: #4338ca; /* indigo-700 */
                border-color: #818cf8; /* indigo-400 */
            }
            .slide-loader .slide:nth-child(2) {
                animation-delay: 0.7s;
            }
            .slide-loader .slide:nth-child(3) {
                animation-delay: 1.4s;
            }
            @keyframes flip {
                0% { transform: rotateX(90deg); opacity: 0; }
                20% { transform: rotateX(0deg); opacity: 1; }
                80% { transform: rotateX(0deg); opacity: 1; }
                100% { transform: rotateX(90deg); opacity: 0; }
            }
        `}
        </style>
        </>
    );
};
