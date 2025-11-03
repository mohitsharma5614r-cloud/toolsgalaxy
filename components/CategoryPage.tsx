import React, { useState, useMemo } from 'react';
import { ToolCategory } from '../data/tools';

interface CategoryPageProps {
  category: ToolCategory;
  onSelectTool: (id: string, name: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onSelectTool }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) {
      return category.tools;
    }
    return category.tools.filter(tool =>
      tool.name.toLowerCase().includes(lowercasedFilter) ||
      tool.description.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, category.tools]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{category.name}</h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
            {category.tools.length} tools to supercharge your workflow.
        </p>
      </header>

      <div className="sticky top-[69px] bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 py-4 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            placeholder={`Search in ${category.name.split(' ')[1]} Tools...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4 pl-12 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            aria-label="Search for tools in this category"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id, tool.name)}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl text-left transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-indigo-500"
            >
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{tool.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{tool.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
           <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">No tools found</h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">We couldn't find any tools matching "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
};