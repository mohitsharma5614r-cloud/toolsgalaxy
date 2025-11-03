import React, { useState, useRef, MouseEvent } from 'react';

// Define the type for a single note
interface Note {
    id: number;
    text: string;
    position: { x: number; y: number };
    color: string;
}

// Color palette for the notes
const noteColors = [
    'bg-yellow-200 dark:bg-yellow-700/80 border-yellow-300 dark:border-yellow-600',
    'bg-pink-200 dark:bg-pink-700/80 border-pink-300 dark:border-pink-600',
    'bg-blue-200 dark:bg-blue-700/80 border-blue-300 dark:border-blue-600',
    'bg-green-200 dark:bg-green-700/80 border-green-300 dark:border-green-600',
    'bg-purple-200 dark:bg-purple-700/80 border-purple-300 dark:border-purple-600',
];

export const BrainstormBoardTool: React.FC<{ title: string }> = ({ title }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const boardRef = useRef<HTMLDivElement>(null);

    // State for dragging logic
    const [draggingNote, setDraggingNote] = useState<number | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText.trim()) return;

        const boardRect = boardRef.current?.getBoundingClientRect();
        const newNote: Note = {
            id: Date.now(),
            text: newNoteText,
            position: {
                x: boardRect ? Math.random() * (boardRect.width - 200) : 50,
                y: boardRect ? Math.random() * (boardRect.height - 200) : 50,
            },
            color: noteColors[Math.floor(Math.random() * noteColors.length)],
        };

        setNotes([...notes, newNote]);
        setNewNoteText('');
    };

    const handleDeleteNote = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
    };
    
    const handleClearBoard = () => {
        if (window.confirm('Are you sure you want to clear the entire board?')) {
            setNotes([]);
        }
    };

    // Drag handlers
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        // Don't start drag if clicking the delete button
        if (target.closest('button')) {
            return;
        }

        setDraggingNote(id);
        const noteElement = e.currentTarget;
        const rect = noteElement.getBoundingClientRect();

        // We use clientX/Y and the element's rect to calculate the offset
        // This is more reliable than offsetX/Y
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (draggingNote === null || !boardRef.current) return;
        
        const boardRect = boardRef.current.getBoundingClientRect();

        let newX = e.clientX - boardRect.left - offset.x;
        let newY = e.clientY - boardRect.top - offset.y;

        // Clamp positions to stay within the board
        newX = Math.max(0, Math.min(newX, boardRect.width - 192)); // 192 is w-48
        newY = Math.max(0, Math.min(newY, boardRect.height - 192)); // 192 is h-48


        setNotes(notes.map(note => {
            if (note.id === draggingNote) {
                return {
                    ...note,
                    position: { x: newX, y: newY },
                };
            }
            return note;
        }));
    };
    
    const handleMouseUp = () => {
        setDraggingNote(null);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A simple virtual board for your ideas. Add, drag, and organize your thoughts.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                        type="text"
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Type your idea here..."
                        className="flex-grow w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm">
                        Add Note
                    </button>
                </form>
                {notes.length > 0 && 
                     <button onClick={handleClearBoard} className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm mb-4">
                        Clear Board
                    </button>
                }
                
                <div 
                    ref={boardRef} 
                    className="relative w-full h-[60vh] bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <svg width="100%" height="100%" className="absolute inset-0">
                        <defs>
                            <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="1" className="fill-slate-300 dark:fill-slate-700" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                    </svg>

                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`absolute p-4 w-48 h-48 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-lg rounded-md ${note.color} text-black dark:text-slate-900 transition-shadow duration-200 hover:shadow-xl border`}
                            style={{ 
                                left: `${note.position.x}px`, 
                                top: `${note.position.y}px`,
                                transform: `rotate(${(note.id % 5) - 2.5}deg)`,
                                zIndex: draggingNote === note.id ? 10 : 1,
                            }}
                            onMouseDown={(e) => handleMouseDown(e, note.id)}
                        >
                            <p className="text-sm break-words whitespace-pre-wrap">{note.text}</p>
                            <button 
                                onClick={() => handleDeleteNote(note.id)} 
                                className="absolute top-1 right-1 w-6 h-6 bg-black/20 text-white/80 rounded-full text-xs font-bold flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                               ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};