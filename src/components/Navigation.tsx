import React from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { LanguageSelector, useTranslation } from '../i18n/i18nContext';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'tracker' | 'itinerary';
  onTabChange: (tab: 'tracker' | 'itinerary') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  return (
    <nav className="main-navigation" style={{ backgroundColor: '#667eea', minHeight: '60px' }}>
      <div className="nav-container">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              onTabChange('tracker');
            }}
            style={{ color: 'white', fontWeight: 'bold' }}
          >
            <span className="tab-icon">☀️</span>
            <span className="tab-label">{t('navigation.sunTracker')}</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              onTabChange('itinerary');
            }}
            style={{ color: 'white', fontWeight: 'bold' }}
          >
            <span className="tab-icon">🗓️</span>
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