import React, { useState, useRef, useEffect } from 'react';
import { Toast } from '../Toast';

// TypeScript Types
type Platform = 'whatsapp' | 'instagram';
interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
}
interface Contact {
    name: string;
    status: string;
    avatar: string | null;
}

// Loader with camera shutter animation
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

// Main Component
export const FakeChatMaker: React.FC = () => {
    const [platform, setPlatform] = useState<Platform>('whatsapp');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hey! Check out this tool, it's awesome!", sender: 'them', time: '10:41 AM' },
        { id: 2, text: "Wow, this looks so real! 🤯", sender: 'me', time: '10:42 AM' },
    ]);
    const [contact, setContact] = useState<Contact>({
        name: 'Bestie ❤️',
        status: 'online',
        avatar: null,
    });
    const [newMessageText, setNewMessageText] = useState('');
    const [newMessageSender, setNewMessageSender] = useState<'me' | 'them'>('me');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleAddMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageText.trim()) return;
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage: Message = {
            id: Date.now(),
            text: newMessageText,
            sender: newMessageSender,
            time: newTime,
        };
        setMessages([...messages, newMessage]);
        setNewMessageText('');
    };

    const handleDeleteMessage = (id: number) => {
        setMessages(messages.filter(msg => msg.id !== id));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setContact(prev => ({ ...prev, avatar: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleDownload = async () => {
        const element = previewRef.current;
        if (!element) return;
        setIsLoading(true);

        // This is a complex operation, so we simulate it with a timeout for the animation
        setTimeout(() => {
            // A common method to render HTML to canvas is using SVG's foreignObject.
            // This has limitations (e.g., with external CSS), but works for self-contained components.
            const { width, height } = element.getBoundingClientRect();
            
            // Get all styles used in the document to inline them
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
                    setIsLoading(false);
                    return;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);

                const link = document.createElement('a');
                link.download = `fake-chat-${platform}.png`;
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

        }, 1500); // Wait for animation
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Fake Chat Maker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create realistic chat screenshots for WhatsApp or Instagram.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                             <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Controls</h2>
                             {/* Platform Switch */}
                             <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                                <button onClick={() => setPlatform('whatsapp')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${platform === 'whatsapp' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>WhatsApp</button>
                                <button onClick={() => setPlatform('instagram')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${platform === 'instagram' ? 'bg-white dark:bg-slate-800 shadow' : 'text-slate-500'}`}>Instagram</button>
                             </div>
                              {/* Header Controls */}
                             <div>
                                <label className="block text-sm font-medium">Contact Name</label>
                                <input type="text" value={contact.name} onChange={e => setContact(prev => ({ ...prev, name: e.target.value }))} className="input-style"/>
                             </div>
                             <div>
                                <label className="block text-sm font-medium">Status</label>
                                <input type="text" value={contact.status} onChange={e => setContact(prev => ({ ...prev, status: e.target.value }))} className="input-style"/>
                             </div>
                             <div>
                                <label className="block text-sm font-medium">Avatar</label>
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="input-file-style"/>
                             </div>
                        </div>
                        
                        {/* Message List */}
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                             <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex items-start gap-2 p-2 rounded ${msg.sender === 'me' ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-slate-50 dark:bg-slate-700/30'}`}>
                                        <div className="flex-grow">
                                            <p className="text-sm break-words">{msg.text}</p>
                                            <p className="text-xs text-slate-400">{msg.sender === 'me' ? 'You' : contact.name} - {msg.time}</p>
                                        </div>
                                        <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-700 text-lg font-bold">&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Message Form */}
                        <form onSubmit={handleAddMessage} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-3">
                             <h3 className="text-lg font-semibold">Add New Message</h3>
                             <textarea value={newMessageText} onChange={e => setNewMessageText(e.target.value)} rows={3} placeholder="Message text..." className="input-style"/>
                             <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="sender" checked={newMessageSender === 'them'} onChange={() => setNewMessageSender('them')} /> Received</label>
                                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="sender" checked={newMessageSender === 'me'} onChange={() => setNewMessageSender('me')} /> Sent</label>
                                </div>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-sm">Add</button>
                             </div>
                        </form>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-2 relative">
                        {isLoading && <Loader />}
                         <div ref={previewRef} className={`w-full max-w-md mx-auto aspect-[9/18] rounded-3xl p-2 border-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-black overflow-hidden shadow-2xl`}>
                            {platform === 'whatsapp' ? <WhatsAppPreview contact={contact} messages={messages} /> : <InstagramPreview contact={contact} messages={messages} />}
                         </div>
                         <button onClick={handleDownload} disabled={isLoading} className="mt-6 w-full max-w-md mx-auto flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md">
                             Download as Image
                         </button>
                    </div>
                </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden"></canvas>
            {error && <Toast message={error} onClose={() => setError(null)} />}
             <style>{`
                .input-style { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; }
                .dark .input-style { background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white; }
                .input-file-style { font-size: 0.875rem; }
                .dark .input-file-style { color: #cbd5e1; }
                .input-file-style::file-selector-button { margin-right: 1rem; padding: 0.5rem 1rem; border-radius: 9999px; border: 0; font-size: 0.875rem; font-weight: 600; background-color: #e0e7ff; color: #4338ca; }
                .input-file-style:hover::file-selector-button { background-color: #c7d2fe; }

                /* Loader */
                .shutter-loader { width: 100px; height: 100px; position: relative; overflow: hidden; }
                .blade { position: absolute; width: 150%; height: 150%; background: black; transform-origin: top left; animation: shutter-close 1.5s forwards; }
                .blade:nth-child(2) { transform-origin: top right; animation-delay: 0.1s; }
                .blade:nth-child(3) { transform-origin: bottom left; animation-delay: 0.2s; }
                .blade:nth-child(4) { transform-origin: bottom right; animation-delay: 0.3s; }
                
                @keyframes shutter-close {
                    0% { transform: scale(0); }
                    50% { transform: scale(1); }
                    100% { transform: scale(1); }
                }

                /* Previews */
                .wa-sent { background-color: #dcf8c6; } .dark .wa-sent { background-color: #225c4b; }
                .wa-received { background-color: #ffffff; } .dark .wa-received { background-color: #2a3942; }
                .ig-sent { background: linear-gradient(to right, #6a0dad, #007bff); }
                .ig-received { background-color: #e5e5e5; } .dark .ig-received { background-color: #262626; }

                @media print { .no-print { display: none; } }
            `}</style>
        </>
    );
};


// WhatsApp Preview Component
const WhatsAppPreview: React.FC<{ contact: Contact, messages: Message[] }> = ({ contact, messages }) => (
    <div className="h-full flex flex-col bg-[#E5DDD5] dark:bg-[#09141A]">
        {/* Header */}
        <header className="flex items-center gap-3 p-2 bg-[#008069] dark:bg-[#202C33] text-white">
            <img src={contact.avatar || 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>')} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600"/>
            <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-xs">{contact.status}</p>
            </div>
        </header>
        {/* Chat Body */}
        <main className="flex-grow p-3 space-y-2 overflow-y-auto">
            {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2 rounded-lg max-w-[75%] shadow ${msg.sender === 'me' ? 'wa-sent' : 'wa-received'}`}>
                        <p className="text-sm break-words text-slate-800 dark:text-slate-100">{msg.text}</p>
                        <div className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {msg.time}
                            {msg.sender === 'me' && <span className="inline-block ml-1 text-blue-500">✓✓</span>}
                        </div>
                    </div>
                </div>
            ))}
        </main>
        {/* Footer */}
        <footer className="p-2 bg-[#F0F0F0] dark:bg-[#202C33] flex items-center gap-2">
             <div className="flex-grow p-2 bg-white dark:bg-[#2A3942] rounded-full text-slate-400 text-sm">Type a message</div>
             <div className="w-10 h-10 bg-[#008069] rounded-full"></div>
        </footer>
    </div>
);

// Instagram Preview Component
const InstagramPreview: React.FC<{ contact: Contact, messages: Message[] }> = ({ contact, messages }) => (
    <div className="h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
        {/* Header */}
        <header className="flex items-center gap-3 p-3 border-b border-slate-200 dark:border-slate-800">
             <img src={contact.avatar || 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(203 213 225)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>')} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600"/>
            <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-xs text-slate-500">{contact.status}</p>
            </div>
        </header>
        {/* Chat Body */}
         <main className="flex-grow p-4 space-y-3 overflow-y-auto">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                     {msg.sender === 'them' && <img src={contact.avatar || 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(203 213 225)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>')} alt="Avatar" className="w-6 h-6 rounded-full mb-1"/>}
                    <div className={`p-3 rounded-2xl max-w-[70%] ${msg.sender === 'me' ? 'ig-sent text-white' : 'ig-received text-black dark:text-white'}`}>
                        <p className="text-sm break-words">{msg.text}</p>
                    </div>
                </div>
            ))}
        </main>
        {/* Footer */}
        <footer className="p-3 m-3 border border-slate-300 dark:border-slate-700 rounded-full text-slate-500 text-sm">
             Message...
        </footer>
    </div>
);