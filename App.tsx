
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TextAreaInput } from './components/TextAreaInput';
import { SettingsPanel } from './components/SettingsPanel';
import { PlaybackControls } from './components/PlaybackControls';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import type { VoiceOption } from './types';
import { initialText } from './constants';

const App: React.FC = () => {
  const [text, setText] = useState<string>(initialText);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | undefined>(undefined);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isSpeakingViaApi, setIsSpeakingViaApi] = useState<boolean>(false); // For potential future API integration

  const {
    isSpeaking,
    isPaused,
    supportedVoices,
    speak,
    pause,
    resume,
    cancel,
    currentUtterance,
    currentBoundaryInfo, // Use this for progress
  } = useSpeechSynthesis();

  useEffect(() => {
    if (supportedVoices.length > 0 && !selectedVoiceURI) {
      let defaultVoice = supportedVoices.find(voice => voice.lang.startsWith('en'));
      if (!defaultVoice) {
        defaultVoice = supportedVoices.find(voice => voice.default);
      }
      if(!defaultVoice && supportedVoices.length > 0) {
        defaultVoice = supportedVoices[0];
      }
      if (defaultVoice) {
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    }
  }, [supportedVoices, selectedVoiceURI]);

  const handlePlay = useCallback(() => {
    if (!text.trim()) {
      alert("Please enter some text to speak.");
      return;
    }
    const selectedVoice = supportedVoices.find(v => v.voiceURI === selectedVoiceURI);
    speak(text, selectedVoice, rate, pitch);
  }, [text, selectedVoiceURI, rate, pitch, speak, supportedVoices]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (isSpeaking || isPaused) { 
        cancel();
    }
  };
  
  const textOfCurrentUtterance = currentUtterance?.text;
  const lengthOfSpokenText = textOfCurrentUtterance?.length || 0;
  let currentTextProgress = 0;

  if ((isSpeaking || isPaused) && currentBoundaryInfo && lengthOfSpokenText > 0) {
    const charIndex = currentBoundaryInfo.charIndex;
    if (typeof charIndex === 'number' && charIndex >= 0) {
      currentTextProgress = (charIndex / lengthOfSpokenText) * 100;
    }
  } else if (!isSpeaking && !isPaused) {
    currentTextProgress = 0;
  }
  // Ensure progress is within 0-100 range
  currentTextProgress = Math.min(100, Math.max(0, currentTextProgress));


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-800 dark:to-sky-900 transition-colors duration-500">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col space-y-6 bg-white dark:bg-slate-700 p-6 rounded-xl shadow-2xl">
          <TextAreaInput
            value={text}
            onChange={handleTextChange}
            placeholder="اكتب النص هنا ليتم تحويله إلى كلام..."
            isSpeaking={isSpeaking || isPaused}
          />
           { (isSpeaking || isPaused) && lengthOfSpokenText > 0 && (
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 my-2">
              <div 
                className="bg-sky-500 h-2.5 rounded-full transition-all duration-100 ease-linear" 
                style={{ width: `${currentTextProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="lg:w-1/3 flex flex-col space-y-6">
          <SettingsPanel
            voices={supportedVoices}
            selectedVoiceURI={selectedVoiceURI}
            onVoiceChange={setSelectedVoiceURI}
            rate={rate}
            onRateChange={setRate}
            pitch={pitch}
            onPitchChange={setPitch}
            disabled={isSpeaking || isPaused || isSpeakingViaApi}
          />
          <PlaybackControls
            onPlay={handlePlay}
            onPause={pause}
            onResume={resume}
            onStop={cancel}
            isSpeaking={isSpeaking || isSpeakingViaApi}
            isPaused={isPaused}
            disabled={!text.trim()}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
