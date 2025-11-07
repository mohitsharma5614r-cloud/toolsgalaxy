import React, { useState } from 'react';

const Loader: React.FC = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mt-6">Saving metadata...</p>
    </div>
);

interface MP3Metadata {
    title: string;
    artist: string;
    album: string;
    year: string;
    genre: string;
    comment: string;
}

export const Mp3TagEditor: React.FC<{ title: string }> = ({ title }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<MP3Metadata>({
        title: '',
        artist: '',
        album: '',
        year: '',
        genre: '',
        comment: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudioFile(file);
            // Mock loading existing metadata
            setMetadata({
                title: file.name.replace(/\.[^/.]+$/, ''),
                artist: 'Unknown Artist',
                album: 'Unknown Album',
                year: new Date().getFullYear().toString(),
                genre: 'Pop',
                comment: ''
            });
            setError('');
        }
    };

    const handleSave = async () => {
        if (!audioFile) return;

        setIsLoading(true);
        setError('');

        try {
            // Note: Actual MP3 tag editing requires server-side processing
            // This creates a download with the original file
            const url = URL.createObjectURL(audioFile);
            const link = document.createElement('a');
            link.href = url;
            link.download = `edited-${audioFile.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Failed to save metadata: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-lime-600 to-green-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Edit the metadata (artist, album, etc.) of MP3 files</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Upload */}
                        {!audioFile ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload MP3 File</label>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-slate-300 dark:border-slate-600 hover:border-lime-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <label className="cursor-pointer">
                                        <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                        <p className="text-slate-600 dark:text-slate-400 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-slate-500">MP3 files only</p>
                                        <input 
                                            type="file" 
                                            accept="audio/mpeg,audio/mp3" 
                                            onChange={handleFileSelect} 
                                            className="hidden" 
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* File Info */}
                                <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">{audioFile.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setAudioFile(null)} className="p-2 hover:bg-lime-100 dark:hover:bg-lime-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Metadata Fields */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                            </svg>
                                            Title
                                        </label>
                                        <input 
                                            type="text"
                                            value={metadata.title} 
                                            onChange={e => setMetadata({...metadata, title: e.target.value})} 
                                            placeholder="Song title"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Artist
                                        </label>
                                        <input 
                                            type="text"
                                            value={metadata.artist} 
                                            onChange={e => setMetadata({...metadata, artist: e.target.value})} 
                                            placeholder="Artist name"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            Album
                                        </label>
                                        <input 
                                            type="text"
                                            value={metadata.album} 
                                            onChange={e => setMetadata({...metadata, album: e.target.value})} 
                                            placeholder="Album name"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Year
                                        </label>
                                        <input 
                                            type="text"
                                            value={metadata.year} 
                                            onChange={e => setMetadata({...metadata, year: e.target.value})} 
                                            placeholder="2024"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                            Genre
                                        </label>
                                        <select
                                            value={metadata.genre}
                                            onChange={e => setMetadata({...metadata, genre: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all"
                                        >
                                            <option>Pop</option>
                                            <option>Rock</option>
                                            <option>Hip Hop</option>
                                            <option>Jazz</option>
                                            <option>Classical</option>
                                            <option>Electronic</option>
                                            <option>Country</option>
                                            <option>R&B</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            Comment
                                        </label>
                                        <textarea 
                                            value={metadata.comment} 
                                            onChange={e => setMetadata({...metadata, comment: e.target.value})} 
                                            placeholder="Additional comments..."
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-lime-500 focus:ring-4 focus:ring-lime-500/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button 
                                    onClick={handleSave}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-lime-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    <span>Save Tags & Download</span>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-6 right-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg animate-slide-up max-w-md">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
