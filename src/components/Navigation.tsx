import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'tracker' | 'itinerary';
  onTabChange: (tab: 'tracker' | 'itinerary') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  console.log('Navigation rendered with activeTab:', activeTab);
  
  return (
    <nav className="main-navigation" style={{ backgroundColor: '#667eea', minHeight: '60px' }}>
      <div className="nav-container">
        <button
          className={`nav-tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => {
            console.log('Tracker tab clicked');
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
            console.log('Itinerary tab clicked');
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