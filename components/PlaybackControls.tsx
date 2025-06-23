
import React from 'react';

interface PlaybackControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  disabled: boolean; // General disable for when no text
}

const ControlButton: React.FC<{onClick: () => void; disabled: boolean; children: React.ReactNode; title: string; className?: string;}> = 
  ({ onClick, disabled, children, title, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-700 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);


export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  onPlay,
  onPause,
  onResume,
  onStop,
  isSpeaking,
  isPaused,
  disabled,
}) => {
  return (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b pb-2 mb-6 border-slate-200 dark:border-slate-600">
        Playback / التشغيل
      </h2>
      <div className="flex items-center justify-around space-x-2">
        {!isSpeaking && !isPaused && (
          <ControlButton
            onClick={onPlay}
            disabled={disabled}
            title="Play"
            className="bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            <span className="sr-only">Play</span>
          </ControlButton>
        )}

        {isSpeaking && !isPaused && (
          <ControlButton
            onClick={onPause}
            disabled={disabled}
            title="Pause"
            className="bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
            <span className="sr-only">Pause</span>
          </ControlButton>
        )}

        {isPaused && (
          <ControlButton
            onClick={onResume}
            disabled={disabled}
            title="Resume"
            className="bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            <span className="sr-only">Resume</span>
          </ControlButton>
        )}
        
        <ControlButton
          onClick={onStop}
          disabled={disabled || (!isSpeaking && !isPaused)}
          title="Stop"
          className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
          </svg>
          <span className="sr-only">Stop</span>
        </ControlButton>
      </div>
      <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        {isSpeaking && !isPaused && "Status: Speaking..."}
        {isPaused && "Status: Paused"}
        {!isSpeaking && !isPaused && "Status: Idle"}
      </div>
    </div>
  );
};
