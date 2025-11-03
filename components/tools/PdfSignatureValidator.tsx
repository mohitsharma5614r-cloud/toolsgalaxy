
import React from 'react';
import { FileUploader } from '../FileUploader';

export const PdfSignatureValidator: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Check the validity of digital signatures in a PDF.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
        <div className="max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-amber-500 mb-4">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Feature Not Available</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Validating digital signatures is a highly complex and security-sensitive process that involves cryptographic checks against trusted certificate authorities. 
            This functionality cannot be safely and reliably performed within a web browser.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            To validate a signature, please use dedicated desktop software like Adobe Acrobat Reader, which has the necessary security infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};
