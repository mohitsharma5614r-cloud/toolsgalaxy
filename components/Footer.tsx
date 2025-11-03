
import React from 'react';

interface FooterProps {
    onSelectPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPage }) => {
    return (
        <footer className="mt-24 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} ToolsGalaxy. All Rights Reserved.</p>
                <div className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-0">
                    <button onClick={() => onSelectPage('about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        About Us
                    </button>
                    <button onClick={() => onSelectPage('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Privacy Policy
                    </button>
                    <button onClick={() => onSelectPage('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Terms & Conditions
                    </button>
                    <button onClick={() => onSelectPage('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Contact Us
                    </button>
                </div>
            </div>
        </footer>
    );
};
