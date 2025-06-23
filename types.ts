
export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default?: boolean;
}

// This interface would be for a hypothetical Gemini TTS response
// For now, it's a placeholder as the Gemini API guidance doesn't cover TTS.
export interface GeminiTTSResponse {
  audioContent: string; // Base64 encoded audio data
  mimeType: string; // e.g., 'audio/mpeg'
}
