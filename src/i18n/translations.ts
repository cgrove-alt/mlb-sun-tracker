// Import all translation files directly
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import jaTranslations from './locales/ja.json';

export const translations = {
  en: enTranslations,
  es: esTranslations,
  ja: jaTranslations,
};

export type SupportedLanguage = keyof typeof translations;
export type TranslationKeys = Record<string, any>;