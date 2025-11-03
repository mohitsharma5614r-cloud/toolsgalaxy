import React, { useState } from 'react';

// Define types
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
interface CalendarEvent {
  id: number;
  subject: string;
  day: Day;
  startTime: string; // "08:00"
  endTime: string; // "09:00"
  location: string;
  color: string;
}

// Constants
const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const times = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`); // 08:00 to 18:00
const colors = [
    'bg-red-200 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200',
    'bg-orange-200 border-orange-400 text-orange-800 dark:bg-orange-900/50 dark:border-orange-700 dark:text-orange-200',
    'bg-amber-200 border-amber-400 text-amber-800 dark:bg-amber-900/50 dark:border-amber-700 dark:text-amber-200',
    'bg-yellow-200 border-yellow-400 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200',
    'bg-lime-200 border-lime-400 text-lime-800 dark:bg-lime-900/50 dark:border-lime-700 dark:text-lime-200',
    'bg-green-200 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200',
    'bg-emerald-200 border-emerald-400 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200',
    'bg-teal-200 border-teal-400 text-teal-800 dark:bg-teal-900/50 dark:border-teal-700 dark:text-teal-200',
    'bg-cyan-200 border-cyan-400 text-cyan-800 dark:bg-cyan-900/50 dark:border-cyan-700 dark:text-cyan-200',
    'bg-sky-200 border-sky-400 text-sky-800 dark:bg-sky-900/50 dark:border-sky-700 dark:text-sky-200',
];

export const ClassTimetableCreator: React.FC = () => {
    // Form State
    const [subject, setSubject] = useState('');
    const [day, setDay] = useState<Day>('Monday');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Timetable State
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const timeToRow = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = (hour - 8) * 60 + minute;
        // 2 rows per hour, plus header row
        return Math.floor(totalMinutes / 30) + 2;
    };
    
    const dayToCol = (day: Day) => {
        return days.indexOf(day) + 2; // +2 to account for time column
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!subject) {
            setError("Subject/Event name is required.");
            return;
        }
        if (startTime >= endTime) {
            setError("End time must be after start time.");
            return;
        }

        const newEvent: CalendarEvent = {
            id: Date.now(),
            subject,
            day,
            startTime,
            endTime,
            location,
            color: colors[events.length % colors.length],
        };

        setEvents([...events, newEvent]);

        // Reset form
        setSubject('');
        setLocation('');
    };

    const handleDeleteEvent = (id: number) => {
        setEvents(events.filter(event => event.id !== id));
    };

    const handlePrint = () => window.print();

    return (
        <div className="max-w-7xl mx-auto printable-area">
            <div className="text-center mb-10 no-print">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Class Timetable Creator</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Build and visualize your weekly schedule.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 no-print">
                    <form onSubmit={handleAddEvent} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4 sticky top-24">
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Add Class/Event</h2>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label className="block text-sm font-medium">Subject / Event</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Physics" className="input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Day</label>
                            <select value={day} onChange={e => setDay(e.target.value as Day)} className="input-style">
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Start Time</label>
                                <select value={startTime} onChange={e => setStartTime(e.target.value)} className="input-style">
                                    {times.slice(0, -1).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">End Time</label>
                                <select value={endTime} onChange={e => setEndTime(e.target.value)} className="input-style">
                                    {times.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Location / Room</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Room 101" className="input-style" />
                        </div>
                        <button type="submit" className="w-full btn-primary">Add to Timetable</button>
                         <div className="pt-2 flex flex-col gap-2">
                             <button type="button" onClick={handlePrint} className="w-full btn-secondary">Print Timetable</button>
                             <button type="button" onClick={() => setEvents([])} className="w-full btn-danger">Clear All</button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 printable-content">
                    <div className="relative timetable-grid">
                        {/* Time Column */}
                        {times.map((time, index) => (
                            <div key={time} className="time-label" style={{ gridRow: index * 2 + 2 }}>
                                {time}
                            </div>
                        ))}
                        {/* Day Headers */}
                        {days.map((day, index) => (
                            <div key={day} className="day-header" style={{ gridColumn: index + 2 }}>
                                {day}
                            </div>
                        ))}
                        {/* Grid Lines */}
                        {Array.from({ length: 11 * 6 }).map((_, i) => (
                            <div key={i} className="grid-cell-hour" style={{ 
                                gridRow: Math.floor(i / 6) * 2 + 2, 
                                gridColumn: (i % 6) + 2 
                            }}></div>
                        ))}
                         {Array.from({ length: 10 * 6 }).map((_, i) => (
                            <div key={i} className="grid-cell-half" style={{ 
                                gridRow: Math.floor(i / 6) * 2 + 3, 
                                gridColumn: (i % 6) + 2 
                            }}></div>
                        ))}
                        {/* Render Events */}
                        {events.map(event => {
                             const rowStart = timeToRow(event.startTime);
                             const rowEnd = timeToRow(event.endTime);
                             const col = dayToCol(event.day);
                             return (
                                 <div 
                                    key={event.id} 
                                    className={`event-block ${event.color}`}
                                    style={{ gridColumn: col, gridRow: `${rowStart} / ${rowEnd}`}}
                                 >
                                    <strong className="font-semibold text-sm leading-tight">{event.subject}</strong>
                                    <span className="text-xs">{event.location}</span>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn no-print">×</button>
                                 </div>
                             );
                        })}
                    </div>
                </div>
            </div>
            
            <style>{`
                .input-style {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.375rem;
                    border: 1px solid #cbd5e1; /* slate-300 */
                    background-color: white;
                }
                .dark .input-style {
                    background-color: rgba(15, 23, 42, 0.5); /* slate-900/50 */
                    border-color: #475569; /* slate-600 */
                    color: white;
                }
                .btn-primary {
                    background-color: #4f46e5; /* indigo-600 */
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn-primary:hover { background-color: #4338ca; }
                .btn-secondary { background-color: #475569; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }
                .btn-danger { background-color: #dc2626; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; }

                .timetable-grid {
                    display: grid;
                    grid-template-columns: 60px repeat(6, 1fr);
                    grid-template-rows: 40px repeat(22, minmax(20px, 1fr)); /* 1 header, 11 hours * 2 half-hours */
                    gap: 0;
                }
                .time-label {
                    grid-column: 1;
                    text-align: right;
                    font-size: 0.75rem;
                    padding-right: 0.5rem;
                    color: #64748b; /* slate-500 */
                    transform: translateY(-50%);
                }
                .day-header {
                    grid-row: 1;
                    text-align: center;
                    font-weight: 600;
                    padding: 0.5rem;
                    border-bottom: 2px solid #e2e8f0; /* slate-200 */
                    border-left: 1px solid #e2e8f0;
                }
                 .dark .day-header { border-color: #334155; }
                .grid-cell-hour {
                    border-left: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .grid-cell-half {
                    border-left: 1px solid #e2e8f0;
                    border-bottom: 1px dashed #e2e8f0;
                }
                .dark .grid-cell-hour, .dark .grid-cell-half { border-color: #334155; }
                
                .event-block {
                    position: relative;
                    margin: 1px;
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    border-left-width: 4px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: drop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 10;
                }
                @keyframes drop-in {
                    from { transform: scale(0.8) translateY(-20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .delete-btn {
                    position: absolute;
                    top: 2px;
                    right: 4px;
                    font-size: 1.25rem;
                    line-height: 1;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .event-block:hover .delete-btn {
                    opacity: 1;
                }
                @media print {
                  body { background-color: white !important; }
                  .no-print { display: none !important; }
                  .printable-area, .printable-content { margin: 0; padding: 0; width: 100%; max-width: 100%; box-shadow: none !important; border: none !important; }
                  .printable-content * { color: black !important; border-color: #ccc !important; }
                  .event-block { background-color: #f0f0f0 !important; border-left-color: #666 !important; }
                  .timetable-grid { grid-template-rows: 40px repeat(22, 30px); }
                }
            `}</style>
        </div>
    );
};
