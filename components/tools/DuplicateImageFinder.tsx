import React from 'react';

export const DuplicateImageFinder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="mb-4">
            <svg className="w-20 h-20 text-amber-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
      <h2 className="text-3xl font-bold text-amber-500 mb-2">{title}</h2>
      <p className="text-slate-600 dark:text-slate-300 text-lg">This feature is not feasible in a browser-only environment.</p>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
        Finding duplicate or visually similar images requires intensive processing and advanced algorithms (like pHash or dHash) that are too computationally expensive for a web browser to handle effectively. 
        This type of tool typically relies on a powerful server-side backend to process and compare image fingerprints.
      </p>
    </div>
  );
};
