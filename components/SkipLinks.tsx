'use client';

import React from 'react';
import './SkipLinks.css';

export default function SkipLinks() {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="skip-links" role="navigation" aria-label="Skip links">
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={(e) => handleSkipClick(e, 'main-content')}
      >
        Skip to main content
      </a>
      <a 
        href="#main-navigation" 
        className="skip-link"
        onClick={(e) => handleSkipClick(e, 'main-navigation')}
      >
        Skip to navigation
      </a>
      <a 
        href="#footer" 
        className="skip-link"
        onClick={(e) => handleSkipClick(e, 'footer')}
      >
        Skip to footer
      </a>
    </nav>
  );
}