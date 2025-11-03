import React, { useState } from 'react';

const resolutions = [
    "Read 12 books this year, one for each month.",
    "Start a daily journal to clear your thoughts.",
    "Exercise at least three times a week.",
    "Learn a new, valuable skill (like coding or a new language).",
    "Drink more water every day.",
    "Save a specific percentage of your income each month.",
    "Practice mindfulness or meditation for 5 minutes daily.",
    "Volunteer for a cause you care about.",
    "Disconnect from screens for one hour before bed.",
    "Cook a new recipe every week.",
    "Spend more quality time with family and friends.",
    "Declutter your home and digital life.",
];

// Loader component with a party popper animation
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="popper-loader mx-auto">
            <div className="popper-body"></div>
            <div className="popper-top"></div>
            <div className="confetti c1"></div>
            <div className="confetti c2"></div>
            <div className="confetti c3"></div>
            <div className="confetti c4"></div>
            <div className="confetti c5"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-8">Generating your goal...</p>
    </div>
);

export const NewYearResolutionGenerator: React.FC = () => {
    const [resolution, setResolution] = useState<string>('Click the button to get your resolution for the year!');
    const [isLoading, setIsLoading] = useState(false);

    const generateResolution = () => {
        setIsLoading(true);
        setTimeout(() => {
            let newResolution = resolution;
            // Ensure a new resolution is generated
            while (newResolution === resolution) {
                newResolution = resolutions[Math.floor(Math.random() * resolutions.length)];
            }
            setResolution(newResolution);
            setIsLoading(false);
        }, 2000); // Animation duration
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">New Year Resolution Generator 🎉</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Let's find an inspiring goal for your year ahead!</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <p className="text-xl italic text-center text-slate-800 dark:text-slate-100 animate-fade-in">
                            "{resolution}"
                        </p>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                     <button
                        onClick={generateResolution}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate New Resolution'}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .popper-loader {
                    width: 80px;
                    height: 100px;
                    position: relative;
                    animation: shake-popper 2s infinite cubic-bezier(.36,.07,.19,.97);
                }
                .popper-body {
                    width: 100%;
                    height: 80px;
                    background: linear-gradient(45deg, #ef4444, #f97316);
                    position: absolute;
                    bottom: 0;
                    border-radius: 40px 40px 10px 10px;
                }
                .popper-top {
                    width: 90px;
                    height: 25px;
                    background: #f59e0b;
                    position: absolute;
                    top: 0;
                    left: -5px;
                    border-radius: 8px;
                }
                
                .confetti {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: #34d399; /* emerald-500 */
                    opacity: 0;
                    animation: pop-confetti 2s infinite;
                }
                .c1 { top: 20%; left: 20%; animation-delay: 0.8s; background-color: #3b82f6; }
                .c2 { top: 30%; left: 80%; animation-delay: 0.9s; background-color: #ec4899; }
                .c3 { top: 10%; left: 50%; animation-delay: 1.0s; background-color: #facc15; }
                .c4 { top: 40%; left: 10%; animation-delay: 1.1s; background-color: #8b5cf6; }
                .c5 { top: 25%; left: 60%; animation-delay: 1.2s; background-color: #14b8a6; }

                @keyframes shake-popper {
                    0%, 100% { transform: rotate(0); }
                    25% { transform: rotate(5deg); }
                    50% { transform: rotate(-5deg); }
                    75% { transform: rotate(2deg); }
                }
                
                @keyframes pop-confetti {
                    0%, 40% { opacity: 0; }
                    50% { opacity: 1; transform: translate(var(--tx, 0), var(--ty, 0)) scale(1.5); }
                    100% { opacity: 0; transform: translate(var(--tx, 0), var(--ty, 0)) scale(0); }
                }
                .c1 { --tx: -40px; --ty: -40px; }
                .c2 { --tx: 40px; --ty: -30px; }
                .c3 { --tx: 0px; --ty: -60px; }
                .c4 { --tx: -50px; --ty: -10px; }
                .c5 { --tx: 30px; --ty: -50px; }
            `}</style>
        </>
    );
};
