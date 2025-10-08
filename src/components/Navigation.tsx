import React from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { LanguageSelector, useTranslation } from '../i18n/i18nContext';
import { SunIcon, CalendarIcon } from './Icons';

interface NavigationProps {
  activeTab: 'tracker' | 'itinerary';
  onTabChange: (tab: 'tracker' | 'itinerary') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  return (
    <nav className="bg-white px-5 md:px-2.5 border-b border-gray-200 sticky top-0 z-[100] min-h-[56px]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-5 md:gap-2.5">
        <div className="flex gap-0">
          <button
            className={`
              bg-transparent border-0 border-b-2 rounded-none px-5 py-4 text-sm font-medium cursor-pointer transition-all
              flex items-center gap-2 relative min-h-[44px] touch-manipulation
              ${activeTab === 'tracker'
                ? 'text-primary-700 border-b-primary-700 bg-gray-50 font-semibold after:content-[""] after:absolute after:bottom-[-3px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-b-[6px] after:border-b-white'
                : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:bg-gray-50'
              }
              active:scale-[0.98] active:opacity-90
              md:py-3 md:px-3.5 md:text-sm md:min-h-[48px] md:gap-1
              sm:py-2.5 sm:px-3
            `.trim().replace(/\s+/g, ' ')}
            onClick={() => {
              haptic.light();
              onTabChange('tracker');
            }}
            aria-label={t('navigation.sunTracker')}
            aria-current={activeTab === 'tracker' ? 'page' : undefined}
          >
            <span className="text-xl md:text-xl sm:text-[1.4rem]" aria-hidden="true"><SunIcon size={20} /></span>
            <span className="whitespace-nowrap md:text-xs md:-ml-1 sm:hidden">{t('navigation.sunTracker')}</span>
          </button>
          <button
            className={`
              bg-transparent border-0 border-b-2 rounded-none px-5 py-4 text-sm font-medium cursor-pointer transition-all
              flex items-center gap-2 relative min-h-[44px] touch-manipulation
              ${activeTab === 'itinerary'
                ? 'text-primary-700 border-b-primary-700 bg-gray-50 font-semibold after:content-[""] after:absolute after:bottom-[-3px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-b-[6px] after:border-b-white'
                : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:bg-gray-50'
              }
              active:scale-[0.98] active:opacity-90
              md:py-3 md:px-3.5 md:text-sm md:min-h-[48px] md:gap-1
              sm:py-2.5 sm:px-3
            `.trim().replace(/\s+/g, ' ')}
            onClick={() => {
              haptic.light();
              onTabChange('itinerary');
            }}
            aria-label={t('navigation.smartItinerary')}
            aria-current={activeTab === 'itinerary' ? 'page' : undefined}
          >
            <span className="text-xl md:text-xl sm:text-[1.4rem]" aria-hidden="true"><CalendarIcon size={20} /></span>
            <span className="whitespace-nowrap md:text-xs md:-ml-1 sm:hidden">{t('navigation.smartItinerary')}</span>
          </button>
        </div>
        <div className="flex items-center">
          <LanguageSelector
            variant="buttons"
            className="[&_.language-selector-buttons]:gap-1 [&_.language-selector-buttons_button]:bg-white/10 [&_.language-selector-buttons_button]:text-white/80 [&_.language-selector-buttons_button]:border [&_.language-selector-buttons_button]:border-white/20 [&_.language-selector-buttons_button]:py-1.5 [&_.language-selector-buttons_button]:px-3 [&_.language-selector-buttons_button]:rounded [&_.language-selector-buttons_button]:text-[0.85rem] [&_.language-selector-buttons_button]:transition-all [&_.language-selector-buttons_button]:min-h-[32px] [&_.language-selector-buttons_button]:min-w-[32px] [&_.language-selector-buttons_button:hover]:bg-white/20 [&_.language-selector-buttons_button:hover]:text-white [&_.language-selector-buttons_button.active]:bg-white/30 [&_.language-selector-buttons_button.active]:text-white [&_.language-selector-buttons_button.active]:border-white/40 md:[&_.language-selector-buttons_button]:py-1 md:[&_.language-selector-buttons_button]:px-2 md:[&_.language-selector-buttons_button]:text-xs md:[&_.language-selector-buttons_button]:min-h-[36px] md:[&_.language-selector-buttons_button]:min-w-[36px] sm:[&_.language-selector-buttons_button_span]:hidden"
          />
        </div>
      </div>
    </nav>
  );
};