import React from 'react';

interface ToolPlaceholderProps {
  title: string;
}

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="mb-4 animate-float">
            <svg className="w-20 h-20 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>
      <h2 className="text-3xl font-bold text-indigo-500 mb-2">{title}</h2>
      <p className="text-slate-600 dark:text-slate-300 text-lg">This tool is under construction.</p>
      <p className="text-slate-400 dark:text-slate-500 mt-1">Our team is working hard to bring it to you. Check back soon!</p>
       <style>{`
          @keyframes float-up-down {
              0%, 100% {
                  transform: translateY(0);
              }
              50% {
                  transform: translateY(-10px);
              }
          }
          .animate-float {
              animation: float-up-down 3s ease-in-out infinite;
          }
      `}</style>
    </div>
  );
};