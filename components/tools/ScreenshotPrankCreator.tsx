import React, { useState, useRef } from 'react';
import { Toast } from '../Toast';

// TypeScript Types
interface Notification {
    id: number;
    app: string;
    message: string;
}

// Loader Component
const Loader: React.FC = () => (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
        <div className="shutter-loader">
            <div className="blade"></div>
            <div className="blade"></div>
            <div className="blade"></div>
            <div className="blade"></div>
        </div>
    </div>
);


export const ScreenshotPrankCreator: React.FC = () => {
    // State for all customizable elements
    const [time, setTime] = useState('9:41');
    const [battery, setBattery] = useState(3);
    const [isCharging, setIsCharging] = useState(false);
    const [carrier, setCarrier] = useState('Carrier');
    const [signal, setSignal] = useState(4);
    const [wifi, setWifi] = useState(3);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, app: 'Mom', message: 'WHERE ARE YOU?? Call me now!!' },
        { id: 2, app: 'Bank of America', message: 'Your account balance is -$1,245.30' },
    ]);
    const [newNotif, setNewNotif] = useState({ app: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const handleAddNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if (newNotif.app.trim() && newNotif.message.trim()) {
            setNotifications([...notifications, { ...newNotif, id: Date.now() }]);
            setNewNotif({ app: '', message: '' });
        }
    };

    const handleDeleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleDownload = async () => {
        const element = previewRef.current;
        if (!element) return;
        setIsLoading(true);
        setError(null);

        setTimeout(() => {
            try {
                // We use a library-free approach by rendering the HTML to an SVG with foreignObject, then to a canvas.
                const { width, height } = element.getBoundingClientRect();
                
                let styles = '';
                for (const sheet of Array.from(document.styleSheets)) {
                    try {
                        for (const rule of Array.from(sheet.cssRules)) {
                            styles += rule.cssText;
                        }
                    } catch (e) {
                        console.warn('Cannot read styles from cross-origin stylesheet', e);
                    }
                }
                
                const svg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                        <foreignObject width="100%" height="100%">
                            <div xmlns="http://www.w3.org/1999/xhtml">
                                <style>${styles}</style>
                                ${element.outerHTML}
                            </div>
                        </foreignObject>
                    </svg>`;

                const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (!canvas) {
                        setIsLoading(false); return;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);

                    const link = document.createElement('a');
                    link.download = `screenshot-prank.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    setIsLoading(false);
                };
                img.onerror = () => {
                    setError("Failed to generate image. Try again.");
                    setIsLoading(false);
                    URL.revokeObjectURL(url);
                }
                img.src = url;

            } catch(e) {
                setError("An error occurred while creating the image.");
                setIsLoading(false);
            }
        }, 1000);
    };

    // Components for status bar icons
    const SignalIcon = ({ strength }: { strength: number }) => (
        <div className="flex items-end gap-0.5 h-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-1 rounded-sm ${i < strength ? 'bg-black dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'}`} style={{ height: `${(i + 1) * 25}%` }}></div>
            ))}
        </div>
    );
    const WifiIcon = ({ strength }: { strength: number }) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" opacity={strength > 0 ? 1 : 0.3}></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" opacity={strength > 1 ? 1 : 0.3}></path>
            <path d="M12 20h.01" opacity={strength > 2 ? 1 : 0.3}></path>
        </svg>
    );
     const BatteryIcon = ({ level, charging }: { level: number; charging: boolean }) => (
        <div className="w-6 h-3 border-2 border-black dark:border-white rounded-sm flex items-center relative">
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-black dark:bg-white rounded-r-sm"></div>
            <div className={`${level <= 20 ? 'bg-red-500' : 'bg-black dark:bg-white'} h-full rounded-sm`} style={{ width: `${level}%`}}></div>
            {charging && <svg viewBox="0 0 24 24" fill="currentColor" className="absolute w-4 h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white dark:text-black"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>}
        </div>
    );


    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Screenshot Prank Creator 📸</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a fake phone screenshot for the ultimate prank.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Status Bar Settings</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium">Time</label><input type="text" value={time} onChange={e => setTime(e.target.value)} className="input-style"/></div>
                                <div><label className="block text-sm font-medium">Carrier</label><input type="text" value={carrier} onChange={e => setCarrier(e.target.value)} className="input-style"/></div>
                            </div>
                            <div><label className="block text-sm font-medium">Battery: {battery}%</label><input type="range" min="0" max="100" value={battery} onChange={e => setBattery(Number(e.target.value))} className="w-full" /></div>
                            <div><label className="block text-sm font-medium">Signal: {signal}/4</label><input type="range" min="0" max="4" value={signal} onChange={e => setSignal(Number(e.target.value))} className="w-full" /></div>
                            <div><label className="block text-sm font-medium">WiFi: {wifi}/3</label><input type="range" min="0" max="3" value={wifi} onChange={e => setWifi(Number(e.target.value))} className="w-full" /></div>
                            <div className="flex items-center"><input type="checkbox" id="charging" checked={isCharging} onChange={e => setIsCharging(e.target.checked)} /><label htmlFor="charging" className="ml-2 text-sm">Charging</label></div>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Notifications</h2>
                             <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                                {notifications.map(n => (
                                    <div key={n.id} className="flex justify-between items-center text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                        <div><strong className="font-semibold">{n.app}:</strong> {n.message}</div>
                                        <button onClick={() => handleDeleteNotification(n.id)} className="text-red-500 font-bold p-1">&times;</button>
                                    </div>
                                ))}
                             </div>
                             <form onSubmit={handleAddNotification} className="space-y-2">
                                <input type="text" value={newNotif.app} onChange={e => setNewNotif({...newNotif, app: e.target.value})} placeholder="App Name (e.g., Mom)" className="input-style"/>
                                <input type="text" value={newNotif.message} onChange={e => setNewNotif({...newNotif, message: e.target.value})} placeholder="Message (e.g., Call me!)" className="input-style"/>
                                <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-sm">Add Notification</button>
                             </form>
                        </div>
                    </div>
                    {/* Preview */}
                    <div className="relative">
                        {isLoading && <Loader />}
                         <div ref={previewRef} className="w-full max-w-sm mx-auto aspect-[9/19.5] rounded-3xl p-2 border-4 border-slate-800 dark:border-slate-500 bg-black overflow-hidden shadow-2xl">
                            <div className="h-full w-full bg-cover bg-center rounded-[20px] relative flex flex-col" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1576673644234-924a731d167f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200)'}}>
                                {/* Status Bar */}
                                <div className="absolute top-0 left-0 right-0 h-10 px-4 flex justify-between items-center text-sm font-semibold text-black dark:text-white">
                                    <span>{time}</span>
                                    <div className="flex items-center gap-1.5">
                                        <SignalIcon strength={signal} />
                                        <span>{carrier}</span>
                                        <WifiIcon strength={wifi} />
                                        <BatteryIcon level={battery} charging={isCharging} />
                                    </div>
                                </div>
                                {/* Notifications */}
                                <div className="pt-16 px-2 space-y-2">
                                    {notifications.map(n => (
                                         <div key={n.id} className="bg-white/80 dark:bg-black/70 backdrop-blur-xl rounded-2xl p-3 text-black dark:text-white shadow-lg">
                                             <div className="flex items-center gap-2 mb-1">
                                                <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                                                <p className="text-xs font-semibold">{n.app}</p>
                                             </div>
                                             <p className="text-sm">{n.message}</p>
                                         </div>
                                    ))}
                                </div>
                            </div>
                         </div>
                         <button onClick={handleDownload} disabled={isLoading} className="mt-6 w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md">
                             Download Image
                         </button>
                    </div>
                </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden"></canvas>
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <style>{`
                .input-style { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                /* Loader */
                .shutter-loader { width: 100px; height: 100px; position: relative; overflow: hidden; }
                .blade { position: absolute; width: 150%; height: 150%; background: #0f172a; transform-origin: top left; animation: shutter-close 1.5s forwards; }
                .blade:nth-child(2) { transform-origin: top right; animation-delay: 0.1s; }
                .blade:nth-child(3) { transform-origin: bottom left; animation-delay: 0.2s; }
                .blade:nth-child(4) { transform-origin: bottom right; animation-delay: 0.3s; }
                
                @keyframes shutter-close {
                    0% { transform: scale(0); } 50% { transform: scale(1); } 100% { transform: scale(1); }
                }
            `}</style>
        </>
    );
};
