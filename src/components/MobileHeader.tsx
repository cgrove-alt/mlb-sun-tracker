import React, { useState } from 'react';
import { UserProfileMenu } from './UserProfileMenu';
import './MobileHeader.css';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title = 'MLB Sun Tracker',
  showBack = false,
  onBack
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        {showBack ? (
          <button 
            className="mobile-header-back"
            onClick={onBack}
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        ) : (
          <button 
            className="mobile-header-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
        )}
        
        <h1 className="mobile-header-title">{title}</h1>
        
        <div className="mobile-header-actions">
          <UserProfileMenu />
        </div>
      </div>
      
      {menuOpen && (
        <nav className="mobile-menu">
          <button className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
            <span className="mobile-menu-icon">🏟️</span>
            <span>Stadiums</span>
          </button>
          <button className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
            <span className="mobile-menu-icon">📅</span>
            <span>Schedule</span>
          </button>
          <button className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
            <span className="mobile-menu-icon">☀️</span>
            <span>Sun Guide</span>
          </button>
          <button className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
            <span className="mobile-menu-icon">⭐</span>
            <span>Favorites</span>
          </button>
        </nav>
      )}
    </header>
  );
};