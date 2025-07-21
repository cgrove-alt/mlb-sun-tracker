import React, { useState, useEffect } from 'react';
import { UserProfileMenu } from './UserProfileMenu';
import './MobileHeader.css';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title = 'The Shadium',
  showBack = false,
  onBack
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (menuOpen) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.mobile-menu') && !target.closest('.mobile-header-menu')) {
          setMenuOpen(false);
        }
      };

      // Use setTimeout to avoid immediate closing when opening
      setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 0);
      
      return () => document.removeEventListener('click', handleClick);
    }
  }, [menuOpen]);

  return (
    <>
      <header className={`mobile-header ${scrolled ? 'scrolled' : ''}`}>
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
            <div className="mobile-header-logo">
              <div className="mobile-header-icon">⚾</div>
              <h1 className="mobile-header-title">{title}</h1>
            </div>
          )}
          
          <div className="mobile-header-actions">
            <UserProfileMenu />
            {!showBack && (
              <button 
                className={`mobile-header-menu ${menuOpen ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
          <nav className="mobile-menu" role="navigation" aria-label="Main menu">
            <div className="mobile-menu-header">
              <h2>Menu</h2>
              <button 
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mobile-menu-items">
              <a href="/" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-icon">🏟️</span>
                <span>Home</span>
              </a>
              <a href="/guide" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-icon">☀️</span>
                <span>Shade Guides</span>
              </a>
              <a href="/guide/how-to-find-shaded-seats" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-icon">🔍</span>
                <span>Find Shaded Seats</span>
              </a>
              <a href="/guide/best-shaded-seats-mlb" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-icon">⭐</span>
                <span>Best Shaded Seats</span>
              </a>
              <a href="/faq" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-icon">❓</span>
                <span>FAQ</span>
              </a>
              <button className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-icon">⚙️</span>
                <span>Settings</span>
              </button>
            </div>
            
            <div className="mobile-menu-footer">
              <p className="mobile-menu-version">The Shadium v2.0</p>
            </div>
          </nav>
        </>
      )}
    </>
  );
};