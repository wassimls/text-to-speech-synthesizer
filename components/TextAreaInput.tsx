
import React from 'react';

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSpeaking: boolean;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ value, onChange, placeholder, isSpeaking }) => {
  return (
    <div className="flex-grow flex flex-col">
      <label htmlFor="tts-input" className="block text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">
        Enter Text to Synthesize / أدخل النص للتحويل
      </label>
      <textarea
        id="tts-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Type or paste your text here..."}
        className={`w-full h-64 lg:h-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 resize-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base leading-relaxed ${isSpeaking ? 'opacity-75 cursor-not-allowed' : ''}`}
        disabled={isSpeaking}
        rows={10}
        aria-label="Text to synthesize"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {value.length} characters. {value.split(/\s+/).filter(Boolean).length} words.
      </p>
    </div>
  );
};
