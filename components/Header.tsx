import React, { useState, useMemo, useRef, useEffect } from 'react';
import { toolData } from '../data/tools';

interface HeaderProps {
    onGoHome: () => void;
    showHomeButton: boolean;
    onSelectTool: (id: string, name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, showHomeButton, onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
        return [];
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    const allTools = toolData.flatMap(category => 
        category.tools.map(tool => ({
            ...tool,
            categoryName: category.name
        }))
    );
    return allTools.filter(tool => 
        tool.name.toLowerCase().includes(lowercasedQuery) ||
        tool.description.toLowerCase().includes(lowercasedQuery)
    ).slice(0, 7); // Limit results for performance and UI
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsFocused(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            {showHomeButton && (
                <button onClick={onGoHome} aria-label="Go back to homepage" className="p-2 -ml-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
            )}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onGoHome}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'rgb(99 102 241)', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: 'rgb(129 140 248)', stopOpacity: 1}} />
                        </linearGradient>
                    </defs>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.22 8.22a.75.75 0 011.06 0L12 10.94l2.72-2.72a.75.75 0 111.06 1.06L13.06 12l2.72 2.72a.75.75 0 11-1.06 1.06L12 13.06l-2.72 2.72a.75.75 0 01-1.06-1.06L10.94 12 8.22 9.28a.75.75 0 010-1.06z" fill="url(#logoGradient)"/>
                </svg>

                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">ToolsGalaxy</h1>
            </div>
        </div>

        <div className="flex-1 px-4 md:px-8">
            <div className="relative max-w-sm mx-auto" ref={searchContainerRef}>
                <input
                    type="text"
                    placeholder="Search any tool..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-4 pl-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    aria-label="Search for tools"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                {isFocused && searchQuery && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-30">
                        <ul className="max-h-80 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                searchResults.map(tool => (
                                    <li key={tool.id}>
                                        <button
                                            className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => {
                                                onSelectTool(tool.id, tool.name);
                                                setSearchQuery('');
                                                setIsFocused(false);
                                            }}
                                        >
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{tool.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{tool.categoryName}</p>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-slate-500 text-center">No results found for "{searchQuery}".</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors hidden md:flex items-center gap-1">
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Toggle dark/light mode">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
        </div>
      </div>
    </header>
  );
};
