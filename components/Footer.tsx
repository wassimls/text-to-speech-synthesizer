
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-6 text-center shadow-inner">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Text-to-Speech Synthesizer. 
          Powered by React, Tailwind CSS, and Browser Web Speech API.
        </p>
        <p className="text-xs mt-1">
          For educational and demonstration purposes.
        </p>
      </div>
    </footer>
  );
};
