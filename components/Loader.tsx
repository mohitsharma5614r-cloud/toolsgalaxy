import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Generating your masterpiece...</p>
    </div>
  );
};