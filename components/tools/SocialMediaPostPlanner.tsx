import React, { useState } from 'react';

interface Post {
    id: number;
    text: string;
    platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin';
    time: string;
}

const platformStyles = {
    instagram: { icon: '📷', color: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white' },
    twitter: { icon: '🐦', color: 'bg-sky-500 text-white' },
    facebook: { icon: '👍', color: 'bg-blue-600 text-white' },
    linkedin: { icon: '💼', color: 'bg-blue-800 text-white' },
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SocialMediaPostPlanner: React.FC<{ title: string }> = ({ title }) => {
    const [posts, setPosts] = useState<Record<string, Post[]>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    // Form state for new post
    const [text, setText] = useState('');
    const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'facebook' | 'linkedin'>('instagram');
    const [time, setTime] = useState('10:00');

    const openModal = (day: string) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDay(null);
        setText('');
        setTime('10:00');
    };

    const addPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDay || !text.trim()) return;
        const newPost: Post = { id: Date.now(), text, platform, time };
        const dayPosts = posts[selectedDay] || [];
        setPosts({ ...posts, [selectedDay]: [...dayPosts, newPost].sort((a,b) => a.time.localeCompare(b.time)) });
        closeModal();
    };
    
    const deletePost = (day: string, postId: number) => {
        setPosts({
            ...posts,
            [day]: posts[day].filter(p => p.id !== postId)
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Plan your social media posts for the week.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {days.map(day => (
                    <div key={day} className="bg-white dark:bg-slate-800 rounded-lg shadow border p-3 flex flex-col min-h-[300px]">
                        <h3 className="font-bold text-center mb-3">{day}</h3>
                        <div className="space-y-2 flex-grow">
                            {(posts[day] || []).map(post => (
                                <div key={post.id} className={`p-2 rounded-md text-xs relative group ${platformStyles[post.platform].color}`}>
                                    <p className="font-bold">{platformStyles[post.platform].icon} {post.time}</p>
                                    <p>{post.text}</p>
                                    <button onClick={() => deletePost(day, post.id)} className="absolute top-1 right-1 text-white/50 hover:text-white opacity-0 group-hover:opacity-100">✕</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => openModal(day)} className="mt-2 w-full text-center text-sm bg-slate-200 dark:bg-slate-700 rounded p-1 hover:bg-slate-300">
                            + Add Post
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20" onClick={closeModal}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Add Post for {selectedDay}</h2>
                        <form onSubmit={addPost} className="space-y-4">
                            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="What do you want to post?" className="w-full input-style" required/>
                            <div className="flex gap-4">
                                <select value={platform} onChange={e => setPlatform(e.target.value as any)} className="input-style">
                                    {Object.keys(platformStyles).map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                                </select>
                                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input-style"/>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`
                .input-style { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; }
                .dark .input-style { background: #1e293b; border-color: #475569; color: white; }
                .btn-primary { background: #4f46e5; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.5rem 1rem; }
                .btn-secondary { background: #64748b; color: white; border-radius: 0.5rem; font-weight: 600; padding: 0.5rem 1rem; }
            `}</style>
        </div>
    );
};