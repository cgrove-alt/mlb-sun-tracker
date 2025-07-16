import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'tracker' | 'itinerary';
  onTabChange: (tab: 'tracker' | 'itinerary') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <button
          className={`nav-tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => onTabChange('tracker')}
        >
          <span className="tab-icon">☀️</span>
          <span className="tab-label">Sun Tracker</span>
        </button>
        <button
          className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => onTabChange('itinerary')}
        >
          <span className="tab-icon">🗓️</span>
          <span className="tab-label">Smart Itinerary</span>
        </button>
      </div>
    </nav>
  );
};