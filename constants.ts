
// This is placeholder text. Users can replace it.
// النص الأولي. يمكن للمستخدمين استبداله.
export const initialText: string = `مرحباً بك في أداة تحويل النص إلى كلام. يمكنك كتابة أي نص هنا وسيتم نطقه. 
Hello and welcome to the Text-to-Speech tool. You can type any text here and it will be spoken.
Bonjour et bienvenue dans l'outil de synthèse vocale. Vous pouvez taper n'importe quel texte ici et il sera prononcé.
Hola y bienvenido a la herramienta de Texto a Voz. Puedes escribir cualquier texto aquí y será pronunciado.`;

// As per the prompt, process.env.API_KEY is assumed to be available.
// We are not defining process.env here.
// const API_KEY = process.env.API_KEY;

// Specific models mentioned in the problem description for other tasks
export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

// The user requested 'gemini-2.5-flash-preview-tts'.
// This is not in the allowed models list from the problem description.
// If it were a supported model for TTS via a hypothetical API endpoint:
export const REQUESTED_TTS_MODEL = 'gemini-2.5-flash-preview-tts';
