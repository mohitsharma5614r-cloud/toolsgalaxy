import React, { useState } from 'react';

const prefixes = ['Quantum', 'Synergy', 'Pixel', 'Aura', 'Zenith', 'Nova', 'Cyber', 'Fusion', 'Echo', 'Helio', 'Momentum', 'Apex', 'Stellar', 'Ignite', 'Orbit'];
const suffixes = ['Leap', 'Grid', 'Core', 'Verse', 'Forge', 'Shift', 'Stack', 'Pulse', 'Works', 'Flow', 'Gen', 'Bot', 'Hub', 'Nest', 'Base'];

// FIX: Add title prop to component.
export const StartupNameMixer: React.FC<{ title: string }> = ({ title }) => {
    const [name, setName] = useState('Click "Generate"');
    const [copied, setCopied] = useState(false);

    const generateName = () => {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        setName(`${prefix}${suffix}`);
        setCopied(false);
    };
    
    const copyToClipboard = () => {
        if (name !== 'Click "Generate"') {
             navigator.clipboard.writeText(name);
             setCopied(true);
             setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            {/* FIX: Use title prop for the heading. */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">Generate the next big thing's name with a single click.</p>
            
            <div 
                className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 my-6 border border-slate-200 dark:border-slate-700 cursor-pointer relative"
                onClick={copyToClipboard}
                title="Click to copy"
            >
                <h2 className="text-4xl font-extrabold text-indigo-500 tracking-wider transition-colors">{name}</h2>
                {copied && <span className="absolute top-2 right-2 text-xs text-emerald-500">Copied!</span>}
            </div>
            
            <button
                onClick={generateName}
                className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50"
            >
                Generate Name
            </button>
             <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Pro Tip: Click the generated name to copy it!</p>
        </div>
    );
};