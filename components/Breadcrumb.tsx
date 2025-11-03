import React from 'react';

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {crumb.onClick ? (
              <button onClick={crumb.onClick} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {crumb.label}
              </button>
            ) : (
              <span className="font-semibold text-slate-800 dark:text-slate-200">{crumb.label}</span>
            )}
            {index < crumbs.length - 1 && (
              <svg className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-600 mx-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};