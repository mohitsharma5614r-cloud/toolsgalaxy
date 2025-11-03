
import React, { useState, useMemo } from 'react';

// Data for Questions and Personality Types
const questions = [
    { id: 1, text: 'After a long week, you prefer a:', options: [{ text: 'Large party with many people', value: 'E' }, { text: 'Quiet night with a book or close friends', value: 'I' }] },
    { id: 2, text: 'When making decisions, you rely more on:', options: [{ text: 'Logic and objective facts', value: 'T' }, { text: 'Feelings and how it impacts others', value: 'F' }] },
    { id: 3, text: 'You are more interested in:', options: [{ text: 'What is actual and present', value: 'S' }, { text: 'Future possibilities and what could be', value: 'N' }] },
    { id: 4, text: 'Your travel plans are more likely to be:', options: [{ text: 'Well-planned and scheduled', value: 'J' }, { text: 'Spontaneous and flexible', value: 'P' }] },
    { id: 5, text: 'In a group, you are more likely to:', options: [{ text: 'Initiate conversations', value: 'E' }, { text: 'Wait for others to approach you', value: 'I' }] },
    { id: 6, text: 'You find it more appealing to:', options: [{ text: 'Work with established methods', value: 'S' }, { text: 'Come up with new ways of doing things', value: 'N' }] },
    { id: 7, text: 'You would rather be seen as:', options: [{ text: 'A person of deep feelings', value: 'F' }, { text: 'A consistently rational person', value: 'T' }] },
    { id: 8, text: 'Your prefer to:', options: [{ text: 'Finish one project before starting another', value: 'J' }, { text: 'Have multiple projects open at once', value: 'P' }] },
];

const personalityTypes: { [key: string]: any } = {
    'INTJ': { title: 'The Architect', description: 'Imaginative and strategic thinkers, with a plan for everything.', strengths: ['Rational', 'Independent', 'Determined'], weaknesses: ['Arrogant', 'Overly critical', 'Clueless in romance'], famous: ['Elon Musk', 'Friedrich Nietzsche'] },
    'INTP': { title: 'The Logician', description: 'Innovative inventors with an unquenchable thirst for knowledge.', strengths: ['Analytical', 'Original', 'Open-minded'], weaknesses: ['Insensitive', 'Absent-minded', 'Condescending'], famous: ['Albert Einstein', 'Bill Gates'] },
    'ENTJ': { title: 'The Commander', description: 'Bold, imaginative and strong-willed leaders, always finding a way.', strengths: ['Efficient', 'Confident', 'Charismatic'], weaknesses: ['Stubborn', 'Impatient', 'Arrogant'], famous: ['Steve Jobs', 'Margaret Thatcher'] },
    'ENTP': { title: 'The Debater', description: 'Smart and curious thinkers who cannot resist an intellectual challenge.', strengths: ['Knowledgeable', 'Quick thinker', 'Energetic'], weaknesses: ['Argumentative', 'Insensitive', 'Intolerant'], famous: ['Mark Twain', 'Tom Hanks'] },
    'INFJ': { title: 'The Advocate', description: 'Quiet and mystical, yet very inspiring and tireless idealists.', strengths: ['Creative', 'Insightful', 'Principled'], weaknesses: ['Sensitive', 'Perfectionistic', 'Burnout prone'], famous: ['Martin Luther King Jr.', 'Taylor Swift'] },
    'INFP': { title: 'The Mediator', description: 'Poetic, kind and altruistic people, always eager to help a good cause.', strengths: ['Empathetic', 'Generous', 'Creative'], weaknesses: ['Unrealistic', 'Self-isolating', 'Too idealistic'], famous: ['William Shakespeare', 'Alicia Keys'] },
    'ENFJ': { title: 'The Protagonist', description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.', strengths: ['Tolerant', 'Reliable', 'Altruistic'], weaknesses: ['Overly idealistic', 'Too selfless', 'Struggle with tough decisions'], famous: ['Barack Obama', 'Oprah Winfrey'] },
    'ENFP': { title: 'The Campaigner', description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.', strengths: ['Curious', 'Observant', 'Excellent communicator'], weaknesses: ['Highly emotional', 'Overthinks things', 'Easily stressed'], famous: ['Robert Downey Jr.', 'Will Smith'] },
    'ISTJ': { title: 'The Logistician', description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.', strengths: ['Honest', 'Responsible', 'Calm'], weaknesses: ['Stubborn', 'Insensitive', 'Blames self'], famous: ['George Washington', 'Angela Merkel'] },
    'ISFJ': { title: 'The Defender', description: 'Very dedicated and warm protectors, always ready to defend their loved ones.', strengths: ['Supportive', 'Patient', 'Hardworking'], weaknesses: ['Shy', 'Takes things personally', 'Represses feelings'], famous: ['Beyoncé', 'Queen Elizabeth II'] },
    'ESTJ': { title: 'The Executive', description: 'Excellent administrators, unsurpassed at managing things or people.', strengths: ['Dedicated', 'Strong-willed', 'Direct'], weaknesses: ['Inflexible', 'Judgmental', 'Difficulty relaxing'], famous: ['Sonia Sotomayor', 'James Monroe'] },
    'ESFJ': { title: 'The Consul', description: 'Extraordinarily caring, social and popular people, always eager to help.', strengths: ['Strong sense of duty', 'Loyal', 'Good at connecting'], weaknesses: ['Worries about social status', 'Vulnerable to criticism', 'Inflexible'], famous: ['Jennifer Garner', 'Bill Clinton'] },
    'ISTP': { title: 'The Virtuoso', description: 'Bold and practical experimenters, masters of all kinds of tools.', strengths: ['Optimistic', 'Creative', 'Practical'], weaknesses: ['Private', 'Easily bored', 'Risk-prone'], famous: ['Michael Jordan', 'Olivia Wilde'] },
    'ISFP': { title: 'The Adventurer', description: 'Flexible and charming artists, always ready to explore and experience something new.', strengths: ['Charming', 'Imaginative', 'Passionate'], weaknesses: ['Unpredictable', 'Easily stressed', 'Overly competitive'], famous: ['Lana Del Rey', 'Britney Spears'] },
    'ESTP': { title: 'The Entrepreneur', description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.', strengths: ['Bold', 'Rational', 'Sociable'], weaknesses: ['Impatient', 'Risk-prone', 'May be insensitive'], famous: ['Madonna', 'Jack Nicholson'] },
    'ESFP': { title: 'The Entertainer', description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.', strengths: ['Original', 'Aesthetics and showmanship', 'Practical'], weaknesses: ['Conflict-averse', 'Easily bored', 'Poor long-term planner'], famous: ['Marilyn Monroe', 'Adele'] },
};

// Loader Component
const Loader: React.FC = () => (
    <div className="text-center">
        <div className="brain-loader mx-auto">
            <div className="puzzle p1"></div>
            <div className="puzzle p2"></div>
            <div className="puzzle p3"></div>
            <div className="puzzle p4"></div>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Analyzing your personality...</p>
    </div>
);


export const PersonalityTest: React.FC<{ title: string }> = ({ title }) => {
    const [status, setStatus] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [resultType, setResultType] = useState<string | null>(null);

    const progress = useMemo(() => ((currentQuestionIndex) / questions.length) * 100, [currentQuestionIndex]);

    const handleAnswer = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };
    
    const handleNext = () => {
        if(currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // End of quiz, calculate results
            setStatus('loading');
            setTimeout(() => {
                // FIX: Explicitly type the accumulator and value in the reduce callback to resolve type errors.
                const counts = Object.values(answers).reduce((acc: { [key: string]: number }, val: string) => {
                    acc[val] = (acc[val] || 0) + 1;
                    return acc;
                }, {});
                
                const type = [
                    (counts['E'] || 0) > (counts['I'] || 0) ? 'E' : 'I',
                    (counts['S'] || 0) > (counts['N'] || 0) ? 'S' : 'N',
                    (counts['T'] || 0) > (counts['F'] || 0) ? 'T' : 'F',
                    (counts['J'] || 0) > (counts['P'] || 0) ? 'P' : 'J',
                ].join('');

                setResultType(type);
                setStatus('result');
            }, 2500);
        }
    };
    
    const handleBack = () => {
        if(currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        setResultType(null);
        setStatus('start');
    };
    
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];

    if (status === 'start') {
        return (
            <div className="text-center p-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">Take our fun, non-scientific personality test to get your four-letter type and learn more about what makes you, you!</p>
                <button onClick={() => setStatus('quiz')} className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg">
                    Start the Test
                </button>
            </div>
        );
    }
    
    if (status === 'quiz') {
        return (
            <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <p className="text-sm font-semibold text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h2 className="text-2xl font-bold my-4">{currentQuestion.text}</h2>
                    <div className="space-y-4">
                        {currentQuestion.options.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${currentAnswer === option.value ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-700 hover:border-indigo-400'}`}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                     <div className="flex justify-between mt-8">
                        <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-slate-300 dark:bg-slate-600 rounded-md disabled:opacity-50">Back</button>
                        <button onClick={handleNext} disabled={!currentAnswer} className="px-6 py-2 bg-indigo-600 text-white rounded-md disabled:bg-slate-400">
                            {currentQuestionIndex === questions.length - 1 ? 'Finish & See Results' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (status === 'loading') {
         return <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>;
    }
    
    if (status === 'result' && resultType) {
        const resultData = personalityTypes[resultType];
        return (
            <div className="max-w-3xl mx-auto animate-fade-in p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400">Your Personality Type is:</h2>
                    <h1 className="text-6xl font-extrabold text-indigo-600 my-2">{resultType}</h1>
                    <p className="text-3xl font-bold">{resultData.title}</p>
                    <p className="mt-4 max-w-xl mx-auto">{resultData.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Strengths</h4>
                        <ul className="list-disc list-inside text-sm mt-2">
                            {resultData.strengths.map((s:string) => <li key={s}>{s}</li>)}
                        </ul>
                    </div>
                     <div className="p-4 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                        <h4 className="font-bold text-rose-800 dark:text-rose-300">Weaknesses</h4>
                        <ul className="list-disc list-inside text-sm mt-2">
                            {resultData.weaknesses.map((w:string) => <li key={w}>{w}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="font-bold text-center">Famous {resultType}s</h4>
                    <p className="text-center text-slate-500 text-sm">{resultData.famous.join(', ')}</p>
                </div>
                 <div className="text-center mt-8">
                    <button onClick={handleReset} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">Take the Test Again</button>
                </div>
            </div>
        );
    }

    return null;
};
<style>{`
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    .brain-loader {
        width: 80px; height: 80px; position: relative;
    }
    .puzzle {
        width: 40px; height: 40px; background-color: #a5b4fc;
        position: absolute;
        animation: solve-puzzle 2.5s infinite;
    }
    .dark .puzzle { background-color: #6366f1; }
    .puzzle.p1 { top: 0; left: 0; }
    .puzzle.p2 { top: 0; right: 0; }
    .puzzle.p3 { bottom: 0; left: 0; }
    .puzzle.p4 { bottom: 0; right: 0; }
    @keyframes solve-puzzle {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(5px, 5px); }
        50% { transform: translate(0, 0); }
        75% { transform: translate(-5px, -5px); }
    }
    .p1 { animation-delay: 0s; }
    .p2 { animation-delay: -0.6s; }
    .p3 { animation-delay: -1.2s; }
    .p4 { animation-delay: -1.8s; }
`}</style>