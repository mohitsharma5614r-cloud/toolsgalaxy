
import React from 'react';
import { toolData } from '../data/tools';

interface HomePageProps {
  onSelectCategory: (categoryName: string) => void;
  onSelectTool: (id: string, name: string) => void;
}

const popularTools = [
    { id: 'ai-image-editor', name: 'AI Image Editor', description: 'Edit images by describing the changes you want.' },
    { id: 'ai-article-writer', name: 'AI Article Writer', description: 'Generate unique articles on any topic.' },
    { id: 'ai-thumbnail-banner-generator', name: 'AI Thumbnail/Banner Generator', description: 'Design eye-catching graphics for your content.' },
    { id: 'online-voice-recorder', name: 'Online Voice Recorder', description: 'Record audio directly from your microphone.' },
    { id: 'case-converter-pro', name: 'Case Converter Pro', description: 'Convert text between UPPER, lower, and Title Case.' },
    { id: 'color-palette-extractor', name: 'Color Palette Extractor', description: 'Extract dominant colors from any image.' },
];

export const HomePage: React.FC<HomePageProps> = ({ onSelectCategory, onSelectTool }) => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl">
          1000+ Free Online Tools — <span className="text-indigo-500">All in One Place 🚀</span>
        </h1>
        <p className="mt-4 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl">
          PDF, Images, Videos, AI, Coding — Everything you need in one click!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })} 
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105"
            >
                Explore Tools
            </button>
            <button 
                onClick={() => onSelectCategory('🧠 Fun AI-Style Tools')} 
                className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
                Try AI Tools
            </button>
        </div>
      </div>
      
      {/* Popular Tools */}
      <section id="popular-tools" aria-labelledby="popular-tools-heading">
        <h2 id="popular-tools-heading" className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">Popular Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTools.map(tool => (
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
      </section>

      {/* Categories Section */}
      <section id="categories" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolData.map(category => (
                <div key={category.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col p-6 transition-shadow hover:shadow-xl">
                    <h3 className="text-xl font-bold text-indigo-500">{category.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm flex-grow">Contains {category.tools.length} tools for all your needs.</p>
                    <button 
                        onClick={() => onSelectCategory(category.name)} 
                        className="mt-6 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-md transition-colors"
                    >
                        View Tools
                    </button>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};
