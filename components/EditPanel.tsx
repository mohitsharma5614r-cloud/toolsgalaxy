import React, { useState } from 'react';

interface EditPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const promptSuggestions = [
  "Add a retro filter",
  "Make the sky look like a sunset",
  "Change the background to a beach",
  "Turn this into a painting",
  "Add a cat wearing sunglasses",
  "Remove the person in the background"
];

export const EditPanel: React.FC<EditPanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    onGenerate(suggestion);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          Editing Instruction
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Add a retro filter"
          className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={isLoading}
        />
        <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Or try a suggestion:</h4>
            <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>
    </div>
  );
};