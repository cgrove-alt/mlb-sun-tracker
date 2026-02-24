'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage, TranslationKeys } from './translations';

interface I18nContextType {
  language: SupportedLanguage;
  translations: TranslationKeys;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
  supportedLanguages: Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
  }>;
}

// Language configuration
const SUPPORTED_LANGUAGES = [
  { code: 'en' as const, name: 'English', nativeName: 'English' },
  { code: 'es' as const, name: 'Spanish', nativeName: 'Español' },
  { code: 'ja' as const, name: 'Japanese', nativeName: '日本語' },
  { code: 'fr' as const, name: 'French', nativeName: 'Français' }
];

// Default language
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'mlb-sun-tracker-language';

const I18nContext = createContext<I18nContextType | null>(null);

// Helper function to get nested value from object using dot notation
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

// Helper function to interpolate parameters in translation strings
const interpolateString = (str: string, params: Record<string, string | number> = {}): string => {
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
};

// Detect user's preferred language
const detectLanguage = (): SupportedLanguage => {
  // Only access browser APIs in the browser environment
  if (typeof window === 'undefined') {
    return 'en'; // Default language for SSR
  }

  // Check localStorage first
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
    return savedLanguage as SupportedLanguage;
  }

  // Check browser language
  const browserLanguage = navigator.language.toLowerCase();
  const supportedCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);
  
  // Check for exact match
  if (supportedCodes.includes(browserLanguage as SupportedLanguage)) {
    return browserLanguage as SupportedLanguage;
  }
  
  // Check for language prefix (e.g., 'en-US' -> 'en')
  const languagePrefix = browserLanguage.split('-')[0];
  if (supportedCodes.includes(languagePrefix as SupportedLanguage)) {
    return languagePrefix as SupportedLanguage;
  }
  
  // Check for specific cases
  if (browserLanguage.startsWith('es')) {
    return 'es';
  }
  if (browserLanguage.startsWith('ja')) {
    return 'ja';
  }
  if (browserLanguage.startsWith('fr')) {
    return 'fr';
  }

  return DEFAULT_LANGUAGE;
};

// Get translations for a specific language
const getTranslations = (language: SupportedLanguage): TranslationKeys => {
  return translations[language] || translations.en;
};

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  initialLanguage 
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    initialLanguage || detectLanguage()
  );
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>(
    getTranslations(initialLanguage || detectLanguage())
  );
  const [isLoading] = useState(false); // Translations are now embedded, no loading needed

  // Update translations when language changes
  useEffect(() => {
    setCurrentTranslations(getTranslations(language));
  }, [language]);

  // Set language and save to localStorage
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      
      // Update HTML lang attribute for accessibility
      document.documentElement.lang = lang;
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(currentTranslations, key);
    
    if (value === null || value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key as fallback
    }
    
    if (typeof value === 'string') {
      return interpolateString(value, params);
    }
    
    if (typeof value === 'object') {
      console.warn(`Translation key points to object, not string: ${key}`);
      return key;
    }
    
    return String(value);
  };

  // Set initial HTML lang attribute
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const contextValue: I18nContextType = {
    language,
    translations: currentTranslations,
    setLanguage,
    t,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

// Custom hook to use i18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Custom hook for translation function only
export const useTranslation = () => {
  const { t, language, isLoading } = useI18n();
  return { t, language, isLoading };
};

// Language selector component
interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'buttons';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showLabel = true,
  variant = 'dropdown'
}) => {
  const { language, setLanguage, supportedLanguages, t } = useI18n();

  if (variant === 'buttons') {
    return (
      <div className={`language-selector language-selector-buttons ${className}`}>
        {showLabel && (
          <span className="language-selector-label" id="language-selector-label">
            {t('app.language')}
          </span>
        )}
        <div className="language-buttons" role="radiogroup" aria-label={t('app.selectLanguage')} aria-labelledby={showLabel ? "language-selector-label" : undefined}>
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-button ${language === lang.code ? 'active' : ''}`}
              onClick={() => setLanguage(lang.code)}
              aria-pressed={language === lang.code}
              role="radio"
              aria-checked={language === lang.code}
              title={`${lang.name} (${lang.nativeName})`}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`language-selector language-selector-dropdown ${className}`}>
      {showLabel && (
        <label htmlFor="language-select" className="language-selector-label">
          {t('app.language', { fallback: 'Language' })}
        </label>
      )}
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className="language-select"
        aria-label={t('app.selectLanguage')}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

// Utility function to format numbers according to locale
export const formatNumber = (
  num: number,
  language: SupportedLanguage = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    ja: 'ja-JP',
    fr: 'fr-FR'
  };

  return new Intl.NumberFormat(localeMap[language], options).format(num);
};

// Utility function to format dates according to locale
export const formatDate = (
  date: Date,
  language: SupportedLanguage = 'en',
  options?: Intl.DateTimeFormatOptions
): string => {
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    ja: 'ja-JP',
    fr: 'fr-FR'
  };

  return new Intl.DateTimeFormat(localeMap[language], options).format(date);
};

// Export types for use in other components
export type { I18nContextType };