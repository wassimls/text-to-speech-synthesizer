
import React from 'react';
import type { VoiceOption } from '../types';

interface SettingsPanelProps {
  voices: VoiceOption[];
  selectedVoiceURI: string | undefined;
  onVoiceChange: (voiceURI: string) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  disabled: boolean;
}

const Slider: React.FC<{label: string, id: string, min: number, max: number, step: number, value: number, onChange: (value: number) => void, disabled: boolean}> = 
  ({label, id, min, max, step, value, onChange, disabled}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}: <span className="text-sky-600 dark:text-sky-400 font-semibold">{value.toFixed(1)}</span>
    </label>
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
      className={`w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-sky-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0`}
    />
  </div>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  voices,
  selectedVoiceURI,
  onVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  disabled,
}) => {
  return (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-600">
        Speech Settings / إعدادات النطق
      </h2>
      
      <div>
        <label htmlFor="voice-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Voice / الصوت:
        </label>
        {voices.length > 0 ? (
          <select
            id="voice-select"
            value={selectedVoiceURI || ''}
            onChange={(e) => onVoiceChange(e.target.value)}
            disabled={disabled || voices.length === 0}
            className="mt-1 block w-full py-2 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang}) {voice.default ? "- Default" : ""}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Loading voices or none available...</p>
        )}
      </div>

      <Slider
        label="Rate / السرعة"
        id="rate-slider"
        min={0.5} max={2} step={0.1}
        value={rate}
        onChange={onRateChange}
        disabled={disabled}
      />
      
      <Slider
        label="Pitch / طبقة الصوت"
        id="pitch-slider"
        min={0} max={2} step={0.1}
        value={pitch}
        onChange={onPitchChange}
        disabled={disabled}
      />
    </div>
  );
};
