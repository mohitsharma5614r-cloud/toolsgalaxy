
import React, { useState, useRef, useEffect } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="bird-loader mx-auto">
            <svg viewBox="0 0 50 50">
                <path className="bird-body" d="M10,25 Q25,10 40,25 Q25,40 10,25 Z" />
                <path className="bird-wing" d="M20,25 Q25,15 30,25 L25,30 Z" />
            </svg>
        </div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Generating your tweet...</p>
    </div>
);

export const TwitterPostMemeMaker: React.FC = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState('Creator');
    const [username, setUsername] = useState('creators_toolbox');
    const [content, setContent] = useState('This is a fake tweet created with the Creator\'s Toolbox! You can edit everything.');
    const [isVerified, setIsVerified] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const avatarImageRef = useRef(new Image());
    
    useEffect(() => {
        const defaultAvatar = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(203 213 225)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
        avatarImageRef.current.src = avatar || defaultAvatar;
    }, [avatar]);


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    // Function to wrap text on canvas
    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    const handleDownload = () => {
        setIsLoading(true);
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) {
                setIsLoading(false);
                return;
            }
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsLoading(false);
                return;
            }
            
            const isDark = document.documentElement.classList.contains('dark');
            const bgColor = isDark ? '#1e293b' : '#ffffff';
            const primaryTextColor = isDark ? '#f1f5f9' : '#0f172a';
            const secondaryTextColor = '#64748b';
            const verifiedColor = '#1d9bf0';

            const width = 600;
            const padding = 20;

            // Pre-calculate text height for dynamic canvas height
            ctx.font = '20px sans-serif';
            const words = content.split(' ');
            let line = '';
            let textHeight = 28;
            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > width - (padding * 2) && n > 0) {
                    textHeight += 28;
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }

            const height = textHeight + 140; // Base height + text height
            canvas.width = width;
            canvas.height = height;

            // Background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw Avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(padding + 25, padding + 25, 25, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImageRef.current, padding, padding, 50, 50);
            ctx.restore();

            // Draw Names
            ctx.fillStyle = primaryTextColor;
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(displayName, padding + 60, padding + 18);
            const nameWidth = ctx.measureText(displayName).width;
            
            if (isVerified) {
                ctx.fillStyle = verifiedColor;
                ctx.beginPath();
                ctx.arc(padding + 60 + nameWidth + 12, padding + 15, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = bgColor;
                ctx.font = 'bold 12px sans-serif';
                ctx.fillText('✓', padding + 60 + nameWidth + 12, padding + 18);
            }
            
            ctx.fillStyle = secondaryTextColor;
            ctx.font = '16px sans-serif';
            ctx.fillText(`@${username}`, padding + 60, padding + 40);

            // Draw Content
            ctx.fillStyle = primaryTextColor;
            ctx.font = '20px sans-serif';
            wrapText(ctx, content, padding, padding + 80, width - padding * 2, 28);
            
            // Draw Timestamp
            ctx.fillStyle = secondaryTextColor;
            ctx.font = '14px sans-serif';
            ctx.fillText('9:41 AM · Oct 26, 2023 · 1.2M Views', padding, height - 30);

            // Download
            const link = document.createElement('a');
            link.download = 'tweet-meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            setIsLoading(false);

        }, 500);
    };

    return (
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Twitter Post Meme Maker 🐦</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Create a realistic-looking fake tweet screenshot.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Customize Tweet</h2>
                    <div>
                        <label className="block text-sm font-medium">Avatar</label>
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Display Name</label>
                            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Username (@)</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-style" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tweet Content</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="input-style" />
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="verified" checked={isVerified} onChange={e => setIsVerified(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="verified" className="ml-2 block text-sm">Verified Badge</label>
                    </div>
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg">
                        Generate & Download Meme
                    </button>
                </div>
                
                <div>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Live Preview</h2>
                     <div ref={previewRef} className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         {isLoading ? (
                            <div className="flex items-center justify-center h-64"><Loader /></div>
                         ) : (
                             <div className="flex items-start space-x-4">
                                <img src={avatar || 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(203 213 225)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>')} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-slate-900 dark:text-white">{displayName}</span>
                                        {isVerified && <svg viewBox="0 0 22 22" className="w-5 h-5 fill-current text-blue-500"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.056-.75-1.69-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.706-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.018-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.273.572 1.814.355.54.85 .97 1.437 1.245-.223.606-.27 1.264-.14 1.897.132.634.438 1.218.882 1.687.47.445 1.054.75 1.69.882.633.132 1.29.084 1.897-.14.274.586.706 1.086 1.245 1.44.54.354 1.17.554 1.816.572.647-.02 1.275-.218 1.816-.573.54-.355.972-.855 1.246-1.438.606.224 1.264.27 1.897.14.634-.132 1.218-.438 1.687-.882.47-.445.75-.1.056.882-1.69.13-.633.08-1.29-.144-1.896.586-.274 1.086-.705 1.442-1.245.356-.54.555-1.17.573-1.816zm-5.23-4.84L9.816 12.5l-2.43-2.43a.996.996 0 00-1.41 0 .996.996 0 000 1.41l3.136 3.136c.39.39 1.022.39 1.412 0l6.07-6.07c.39-.39.39-1.022 0-1.412a.996.996 0 00-1.41 0z"></path></g></svg>}
                                        <span className="text-slate-500 dark:text-slate-400">@{username}</span>
                                    </div>
                                    <p className="mt-1 text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">{content}</p>
                                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">9:41 AM · Oct 26, 2023 · 1.2M Views</p>
                                </div>
                            </div>
                         )}
                     </div>
                </div>

            </div>
            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} className="hidden"></canvas>
            <style>{`
                .input-style {
                    width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1;
                }
                .dark .input-style {
                    background-color: rgba(15, 23, 42, 0.5); border-color: #475569; color: white;
                }
                .bird-loader { width: 80px; height: 80px; }
                .bird-body { fill: #818cf8; } .dark .bird-body { fill: #a5b4fc; }
                .bird-wing { fill: #6366f1; transform-origin: 22px 25px; animation: flap 0.4s infinite alternate; }
                .dark .bird-wing { fill: #818cf8; }
                @keyframes flap { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
            `}</style>
        </div>
    );
};
