import React from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { LanguageSelector, useTranslation } from '../i18n/i18nContext';
import { SunIcon, CalendarIcon } from './Icons';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'tracker' | 'itinerary';
  onTabChange: (tab: 'tracker' | 'itinerary') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              onTabChange('tracker');
            }}
            aria-label={t('navigation.sunTracker')}
            aria-current={activeTab === 'tracker' ? 'page' : undefined}
          >
            <span className="tab-icon" aria-hidden="true"><SunIcon size={20} /></span>
            <span className="tab-label">{t('navigation.sunTracker')}</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              onTabChange('itinerary');
            }}
            aria-label={t('navigation.smartItinerary')}
            aria-current={activeTab === 'itinerary' ? 'page' : undefined}
          >
            <span className="tab-icon" aria-hidden="true"><CalendarIcon size={20} /></span>
            <span className="tab-label">{t('navigation.smartItinerary')}</span>
          </button>
        </div>
        <div className="nav-controls">
          <LanguageSelector 
            variant="buttons" 
            className="nav-language-selector"
          />
        </div>
      </div>
    </nav>
  );
};