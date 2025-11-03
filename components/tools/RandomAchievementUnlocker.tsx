import React, { useState } from 'react';

// Data for achievements
const achievements = [
    { icon: '🏆', title: 'Participation Award', description: 'You showed up. That\'s something, right?' },
    { icon: '🌍', title: 'Gravity Check', description: 'Successfully discovered the ground. The hard way.' },
    { icon: '🖱️', title: 'Professional Googler', description: 'Found the answer on the second page of search results.' },
    { icon: '🐛', title: 'It\'s Not a Bug...', description: '...it\'s an undocumented feature.' },
    { icon: '💨', title: 'Manual Breather', description: 'You are now aware of your breathing. You\'re welcome.' },
    { icon: '🚪', title: 'Existential Crisis', description: 'Pushed a door that said "Pull".' },
    { icon: '🔋', title: 'Living on the Edge', description: 'Used your phone with less than 5% battery.' },
    { icon: '🧊', title: 'Master of Hydration', description: 'Drank a glass of water.' },
    { icon: ' procrastinator', title: 'I\'ll Do It Later', description: 'Decided to generate another achievement instead of working.' },
    { icon: '✔️', title: 'Checked a Box', description: 'You successfully clicked a button. Congratulations.' }
];

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="achievement-loader mx-auto">
            <div className="trophy">🏆</div>
            <div className="sparkle s1">✨</div>
            <div className="sparkle s2">✨</div>
            <div className="sparkle s3">✨</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Unlocking achievement...</p>
    </div>
);

export const RandomAchievementUnlocker: React.FC = () => {
    const [achievement, setAchievement] = useState<{ icon: string; title: string; description: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [achievementKey, setAchievementKey] = useState(0);

    const generateAchievement = () => {
        setIsLoading(true);
        setTimeout(() => {
            let newAchievement = achievement;
            // Make sure we get a new one
            while (newAchievement === achievement) {
                newAchievement = achievements[Math.floor(Math.random() * achievements.length)];
            }
            setAchievement(newAchievement);
            setIsLoading(false);
            setAchievementKey(prev => prev + 1); // Trigger re-animation
        }, 2000); // Animation duration
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Random Achievement Unlocker 🏆</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Unlock a random, funny achievement for your daily accomplishments.</p>
                </div>

                <div className="min-h-[150px] flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {isLoading ? (
                        <Loader />
                    ) : achievement ? (
                        <div key={achievementKey} className="achievement-toast animate-slide-in">
                            <div className="achievement-icon">{achievement.icon}</div>
                            <div className="achievement-text">
                                <p className="achievement-title">{achievement.title}</p>
                                <p className="achievement-desc">{achievement.description}</p>
                            </div>
                        </div>
                    ) : (
                         <p className="text-slate-500 dark:text-slate-400">Click the button to get started!</p>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                     <button
                        onClick={generateAchievement}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        {isLoading ? 'Unlocking...' : 'Unlock Achievement'}
                    </button>
                </div>
            </div>
            <style>{`
                .achievement-toast {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background-color: #1e293b; /* slate-800 */
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    border-left: 5px solid #f59e0b; /* amber-500 */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .dark .achievement-toast {
                     background-color: #334155; /* slate-700 */
                }
                .achievement-icon {
                    font-size: 2.5rem;
                }
                .achievement-title {
                    font-weight: 700;
                    font-size: 1.125rem;
                }
                .achievement-desc {
                    font-size: 0.875rem;
                    color: #9ca3af; /* slate-400 */
                }

                @keyframes slide-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                .achievement-loader {
                    width: 100px;
                    height: 100px;
                    position: relative;
                }
                .trophy {
                    font-size: 80px;
                    line-height: 1;
                    text-align: center;
                    animation: trophy-pop 2s infinite ease-in-out;
                }
                .sparkle {
                    position: absolute;
                    font-size: 24px;
                    opacity: 0;
                    animation: sparkle-pop 2s infinite;
                }
                .sparkle.s1 { top: 0; left: 10%; animation-delay: 0.2s; }
                .sparkle.s2 { top: 20%; left: 80%; animation-delay: 0.6s; }
                .sparkle.s3 { top: 70%; left: 20%; animation-delay: 1s; }
                
                @keyframes trophy-pop {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                @keyframes sparkle-pop {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); }
                    60% { opacity: 0; }
                }
            `}</style>
        </>
    );
};