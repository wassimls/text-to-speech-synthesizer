
import { useState, useEffect, useCallback } from 'react';
import type { VoiceOption } from '../types';

interface SpeechBoundaryInfo {
  charIndex: number;
  charLength: number;
}

interface SpeechSynthesisState {
  isSpeaking: boolean;
  isPaused: boolean;
  supportedVoices: VoiceOption[];
  currentUtterance: SpeechSynthesisUtterance | null;
  currentBoundaryInfo: SpeechBoundaryInfo | null; // Added to track progress
  speak: (text: string, voice?: VoiceOption, rate?: number, pitch?: number) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

export const useSpeechSynthesis = (): SpeechSynthesisState => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [supportedVoices, setSupportedVoices] = useState<VoiceOption[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentBoundaryInfo, setCurrentBoundaryInfo] = useState<SpeechBoundaryInfo | null>(null);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const populateVoiceList = useCallback(() => {
    if (!synth) return;
    const voices = synth.getVoices().map(v => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      default: v.default,
    }));
    setSupportedVoices(voices);
  }, [synth]);

  useEffect(() => {
    if (!synth) return;

    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth]); // populateVoiceList is memoized and depends on synth


  const speak = useCallback((text: string, voice?: VoiceOption, rate: number = 1, pitch: number = 1) => {
    if (!synth || !text.trim()) return;

    if (synth.speaking) {
      synth.cancel(); // Cancel current speech before starting new one
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentBoundaryInfo(null); // Reset boundary info
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      setCurrentBoundaryInfo(null);
    };
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => { // Explicitly type the event
      console.error('SpeechSynthesisUtterance.onerror - Error Code:', event.error);
      if (event.error) {
        switch (event.error) {
          case 'canceled':
            console.warn('Speech synthesis was canceled.');
            break;
          case 'interrupted':
            console.warn('Speech synthesis was interrupted.');
            break;
          case 'audio-busy':
            console.error('Speech synthesis failed: Audio output is busy.');
            break;
          case 'audio-hardware':
            console.error('Speech synthesis failed: Audio hardware error.');
            break;
          case 'network':
            console.error('Speech synthesis failed: Network error (possibly for server-side voices).');
            break;
          case 'synthesis-unavailable':
            console.error('Speech synthesis failed: Synthesis engine unavailable.');
            break;
          case 'language-unavailable':
            console.error(`Speech synthesis failed: Language '${utterance.lang}' for the selected voice is not available.`);
            break;
          case 'voice-unavailable':
            console.error(`Speech synthesis failed: Voice '${utterance.voice?.name || 'selected voice'}' is not available.`);
            break;
          case 'text-too-long':
            console.error('Speech synthesis failed: Text is too long.');
            break;
          case 'invalid-argument':
            console.error('Speech synthesis failed: Invalid argument provided to speech synthesis.');
            break;
          case 'synthesis-failed':
            console.error('Speech synthesis failed: A general synthesis error occurred.');
            break;
          default:
            console.error('Speech synthesis failed with an unknown error code:', event.error);
        }
      } else {
        console.error('SpeechSynthesisUtterance.onerror - An unspecified error occurred.', event);
      }
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      setCurrentBoundaryInfo(null);
    };
    utterance.onpause = () => {
        setIsPaused(true);
        setIsSpeaking(false);
    };
    utterance.onresume = () => {
        setIsPaused(false);
        setIsSpeaking(true);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      // SpeechSynthesisEvent has charIndex and charLength
      if (event.name === 'word' || event.name === 'sentence') { 
         setCurrentBoundaryInfo({ charIndex: event.charIndex, charLength: event.charLength });
      }
    };

    if (voice) {
      const actualVoice = synth.getVoices().find(v => v.voiceURI === voice.voiceURI);
      if (actualVoice) {
        utterance.voice = actualVoice;
      }
    }
    utterance.lang = voice?.lang || document.documentElement.lang || 'en-US';
    utterance.pitch = Math.max(0, Math.min(2, pitch));
    utterance.rate = Math.max(0.1, Math.min(10, rate));
    
    setCurrentUtterance(utterance); // Store the utterance object
    synth.speak(utterance);
  }, [synth, populateVoiceList]); // Added populateVoiceList in case voices not loaded before first speak

  const pause = useCallback(() => {
    if (synth && synth.speaking && !synth.paused) {
      synth.pause();
    }
  }, [synth]);

  const resume = useCallback(() => {
    if (synth && synth.paused) {
      synth.resume();
    }
  }, [synth]);

  const cancel = useCallback(() => {
    if (synth) {
      synth.cancel(); // This will trigger onend/onerror which handles state cleanup
      // Explicitly set states for immediate UI update if needed
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      setCurrentBoundaryInfo(null);
    }
  }, [synth]);

   useEffect(() => {
    if (!synth) return;
    const interval = setInterval(() => {
      if (!synth.speaking && isSpeaking) {
        setIsSpeaking(false);
         if (!synth.paused) setCurrentBoundaryInfo(null); // Clear progress if speech ended naturally
      }
      if (!synth.paused && isPaused) {
        setIsPaused(false);
      }
      if (!synth.speaking && !synth.paused && currentUtterance) {
        // Case where speech might have ended but onend didn't fire or state didn't clear
        setCurrentUtterance(null);
        setCurrentBoundaryInfo(null);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [synth, isSpeaking, isPaused, currentUtterance]);


  return { isSpeaking, isPaused, supportedVoices, speak, pause, resume, cancel, currentUtterance, currentBoundaryInfo };
};
