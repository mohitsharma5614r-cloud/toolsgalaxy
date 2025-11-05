import React, { useState, useMemo, useRef, useEffect } from 'react';
import { toolData } from '../data/tools';

interface HeaderProps {
    onGoHome: () => void;
    showHomeButton: boolean;
    onSelectTool: (id: string, name: string) => void;
    onSelectCategory?: (categoryName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, showHomeButton, onSelectTool, onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

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
        if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
            setShowCategories(false);
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
            <div className="relative" ref={categoriesRef}>
                <button 
                    onClick={() => setShowCategories(!showCategories)}
                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Categories</span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`transition-transform ${showCategories ? 'rotate-180' : ''}`}
                    >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                </button>

                {showCategories && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-96 overflow-y-auto">
                            <div className="p-2">
                                {toolData.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => {
                                            if (onSelectCategory) {
                                                onSelectCategory(category.name);
                                            }
                                            setShowCategories(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                                                    {category.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {category.tools.length} tools
                                                </p>
                                            </div>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="16" 
                                                height="16" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                                className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                                            >
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};
