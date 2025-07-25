// Lazy loading for translation files
import { TranslationKeys } from './translations';

// Language modules to be loaded on demand
const languageModules: Record<string, () => Promise<{ default: TranslationKeys }>> = {
  en: () => import('./locales/en.json').then(m => ({ default: m as TranslationKeys })),
  es: () => import('./locales/es.json').then(m => ({ default: m as TranslationKeys })),
  ja: () => import('./locales/ja.json').then(m => ({ default: m as TranslationKeys }))
};

// Cache for loaded translations
const translationCache = new Map<string, TranslationKeys>();

// Default fallback translations (minimal set for loading state)
const fallbackTranslations: Partial<TranslationKeys> = {
  app: {
    title: 'Shadium'
  },
  controls: {
    loading: 'Loading...'
  }
};

// Load translations for a specific language
export async function loadTranslations(language: string): Promise<TranslationKeys> {
  // Check cache first
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  const loader = languageModules[language] || languageModules.en;
  
  try {
    const module = await loader();
    const translations = module.default;
    
    // Cache the loaded translations
    translationCache.set(language, translations);
    
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error);
    // Return English as fallback
    if (language !== 'en') {
      return loadTranslations('en');
    }
    // Last resort: return fallback translations
    return fallbackTranslations as TranslationKeys;
  }
}

// Preload a language for better performance
export function preloadLanguage(language: string): void {
  if (!translationCache.has(language)) {
    loadTranslations(language).catch(console.error);
  }
}

// Get available languages
export function getAvailableLanguages(): string[] {
  return Object.keys(languageModules);
}

// Clear translation cache if needed
export function clearTranslationCache(): void {
  translationCache.clear();
}