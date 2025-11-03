import React, { useState } from 'react';
import { Toast } from '../Toast';

interface Flashcard {
    id: number;
    front: string;
    back: string;
}

export const FlashcardMaker: React.FC<{ title: string }> = ({ title }) => {
    const [cards, setCards] = useState<Flashcard[]>([
        { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces.' },
        { id: 2, front: 'What is JSX?', back: 'A syntax extension for JavaScript, used with React to describe what the UI should look like.' }
    ]);
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [mode, setMode] = useState<'edit' | 'study'>('edit');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!frontText.trim() || !backText.trim()) {
            setError('Both front and back of the card must have content.');
            return;
        }
        const newCard: Flashcard = {
            id: Date.now(),
            front: frontText,
            back: backText,
        };
        setCards([newCard, ...cards]);
        setFrontText('');
        setBackText('');
    };

    const handleDeleteCard = (id: number) => {
        setCards(cards.filter(card => card.id !== id));
    };

    const handleStartStudy = () => {
        if (cards.length === 0) {
            setError('Add at least one card to start studying.');
            return;
        }
        setMode('study');
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const handleExitStudy = () => {
        setMode('edit');
    };

    const handleFlipCard = () => {
        setIsFlipped(!isFlipped);
    };
    
    const handleNextCard = () => {
        if (isFlipped) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentCardIndex(prev => (prev + 1) % cards.length);
            }, 300); // wait for card to flip back
        } else {
            setCurrentCardIndex(prev => (prev + 1) % cards.length);
        }
    };
    
    const handlePrevCard = () => {
        if (isFlipped) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length);
            }, 300);
        } else {
            setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length);
        }
    };

    if (mode === 'study') {
        const currentCard = cards[currentCardIndex];
        return (
             <div className="max-w-4xl mx-auto animate-fade-in">
                 <style>{`
                    .perspective { perspective: 1000px; }
                    .card-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transition: transform 0.6s;
                        transform-style: preserve-3d;
                    }
                    .flipped {
                        transform: rotateY(180deg);
                    }
                    .card-face {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        text-align: center;
                        border-radius: 1rem;
                    }
                    .card-front {
                        background-color: white;
                        border: 1px solid #e2e8f0;
                    }
                    .dark .card-front {
                         background-color: #1e293b; /* slate-800 */
                         border-color: #334155;
                    }
                    .card-back {
                        background-color: #eef2ff; /* indigo-100 */
                        border: 1px solid #c7d2fe;
                        transform: rotateY(180deg);
                    }
                    .dark .card-back {
                        background-color: #3730a3; /* indigo-800 */
                        border-color: #4f46e5;
                    }
                `}</style>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Study Mode</h2>
                    <button onClick={handleExitStudy} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-sm font-semibold rounded-lg">Exit</button>
                </div>
                
                <div className="perspective h-80 w-full cursor-pointer" onClick={handleFlipCard}>
                    <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                        <div className="card-face card-front shadow-lg">
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{currentCard.front}</p>
                        </div>
                        <div className="card-face card-back shadow-lg">
                             <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200">{currentCard.back}</p>
                        </div>
                    </div>
                </div>

                 <div className="flex justify-between items-center mt-6">
                    <button onClick={handlePrevCard} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md">Previous</button>
                    <p className="font-semibold text-slate-500">{currentCardIndex + 1} / {cards.length}</p>
                    <button onClick={handleNextCard} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md">Next</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create digital flashcards for effective learning.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <form onSubmit={handleAddCard} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <h2 className="text-xl font-bold">Create a New Card</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Front (Term/Question)</label>
                                <textarea value={frontText} onChange={e => setFrontText(e.target.value)} rows={3} className="w-full input-style" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Back (Definition/Answer)</label>
                                <textarea value={backText} onChange={e => setBackText(e.target.value)} rows={3} className="w-full input-style" />
                            </div>
                            <button type="submit" className="w-full btn-primary">Add Card</button>
                        </form>
                         <button onClick={handleStartStudy} disabled={cards.length === 0} className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-lg shadow-lg disabled:bg-slate-400">
                           Study Deck ({cards.length} cards)
                        </button>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Your Deck</h2>
                        {cards.length > 0 ? (
                             <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {cards.map((card) => (
                                     <div key={card.id} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md group relative">
                                        <p className="font-semibold text-sm">{card.front}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.back}</p>
                                        <button onClick={() => handleDeleteCard(card.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 text-center">
                                <p>Your deck is empty. Add some cards to get started!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background-color: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background-color: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.75rem 1.5rem; transition: background-color 0.2s; }
                 @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </>
    );
};
