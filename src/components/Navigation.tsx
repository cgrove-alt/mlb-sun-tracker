import React from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'tracker' | 'itinerary';
  onTabChange: (tab: 'tracker' | 'itinerary') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const haptic = useHapticFeedback();
  return (
    <nav className="main-navigation" style={{ backgroundColor: '#667eea', minHeight: '60px' }}>
      <div className="nav-container">
        <button
          className={`nav-tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => {
            haptic.light();
            onTabChange('tracker');
          }}
          style={{ color: 'white', fontWeight: 'bold' }}
        >
          <span className="tab-icon">☀️</span>
          <span className="tab-label">Sun Tracker</span>
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
          <span className="tab-label">Smart Itinerary</span>
        </button>
      </div>
    </nav>
  );
};