
import React, { useState } from 'react';
import { generateIdeas, Idea } from '../../services/geminiService';
import { Toast } from '../Toast';

const ideaCategories = [
    { name: 'Tech Startups', emoji: '💻' },
    { name: 'Mobile Apps', emoji: '📱' },
    { name: 'Eco-Friendly Businesses', emoji: '🌿' },
    { name: 'Creative Projects', emoji: '🎨' },
];

// FIX: Add title prop to component to resolve error from App.tsx.
export const AiIdeaGenerator: React.FC<{ title: string }> = ({ title }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(ideaCategories[0].name);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setIdeas([]);
        setError(null);

        try {
            const generatedIdeas = await generateIdeas(selectedCategory);
            setIdeas(generatedIdeas);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const clearError = () => setError(null);

    return (
        <>
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             <div className="text-center mb-8">
                {/* FIX: Use title prop for the heading. */}
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title} 💡</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Spark your next big project with AI-powered creativity.</p>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-center text-slate-700 dark:text-slate-300 mb-4">Choose a category:</label>
                    <div className="flex flex-wrap justify-center gap-3">
                        {ideaCategories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'}`}
                            >
                                {cat.emoji} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoading ? 'Generating...' : 'Generate Ideas'}
                </button>
            </div>
            
            <div className="mt-8">
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <div className="lightbulb-loader">
                            <div className="lightbulb"></div>
                            <div className="spark s1"></div>
                            <div className="spark s2"></div>
                            <div className="spark s3"></div>
                            <div className="spark s4"></div>
                        </div>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Sparking creativity...</p>
                    </div>
                ) : ideas.length > 0 ? (
                    <div className="space-y-4 animate-fade-in">
                        {ideas.map((idea, index) => (
                            <div key={index} className="bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-5 text-left shadow-sm">
                                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{idea.name}</h3>
                                <p className="mt-1 text-slate-600 dark:text-slate-300">{idea.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-slate-500"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        <p className="mt-4 text-lg">Your generated ideas will appear here.</p>
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
            
            .lightbulb-loader {
                position: relative;
                width: 80px;
                height: 80px;
            }
            .lightbulb {
                width: 30px;
                height: 30px;
                background: #f1c40f;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: light-flicker 2s infinite;
            }
            .lightbulb::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 15px;
                height: 10px;
                background: #bdc3c7;
                border-radius: 3px;
            }
            .spark {
                position: absolute;
                width: 4px;
                height: 12px;
                background: #f1c40f;
                border-radius: 2px;
                opacity: 0;
            }
            .s1 { animation: spark-animation 2s infinite; animation-delay: 0s; top: 10px; left: 50%; transform-origin: 50% 100%; }
            .s2 { animation: spark-animation 2s infinite; animation-delay: 0.5s; top: 50%; left: 90%; transform-origin: 0 50%; }
            .s3 { animation: spark-animation 2s infinite; animation-delay: 1s; bottom: 10px; left: 50%; transform-origin: 50% 0; }
            .s4 { animation: spark-animation 2s infinite; animation-delay: 1.5s; top: 50%; right: 90%; transform-origin: 100% 50%; }

            @keyframes light-flicker {
                0%, 100% { box-shadow: 0 0 5px #f1c40f, 0 0 10px #f1c40f; opacity: 0.8; }
                50% { box-shadow: 0 0 20px #f1c40f, 0 0 30px #f1c40f, 0 0 40px #f39c12; opacity: 1; }
            }
            @keyframes spark-animation {
                0% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
                20% { transform: scaleY(1) rotate(var(--angle, 0deg)); opacity: 1; }
                50% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
                100% { transform: scaleY(0) rotate(var(--angle, 0deg)); opacity: 0; }
            }
            
            .s1 { --angle: 0deg; }
            .s2 { --angle: 90deg; }
            .s3 { --angle: 180deg; }
            .s4 { --angle: 270deg; }

        `}
        </style>
        </>
    );
};
