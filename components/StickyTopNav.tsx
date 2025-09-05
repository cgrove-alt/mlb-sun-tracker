'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { ALL_UNIFIED_VENUES, getVenuesByLeague } from '../src/data/unifiedVenues';
import './StickyTopNav.css';

export default function StickyTopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMLBOpen, setIsMLBOpen] = useState(false);
  const [isNFLOpen, setIsNFLOpen] = useState(false);
  const [isMiLBOpen, setIsMiLBOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: string; name: string; team: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Get venues by league
  const mlbVenues = getVenuesByLeague('MLB');
  const nflVenues = getVenuesByLeague('NFL');
  const milbVenues = getVenuesByLeague('MiLB');

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsMLBOpen(false);
    setIsNFLOpen(false);
    setIsMiLBOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking inside the mobile menu, do not treat as outside
      if (mobileMenuRef.current && mobileMenuRef.current.contains(event.target as Node)) {
        return;
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    closeMobileMenu();
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('sticky-nav-menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('sticky-nav-menu-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('sticky-nav-menu-open');
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = ALL_UNIFIED_VENUES
      .filter(venue => 
        venue.name.toLowerCase().includes(lowerQuery) || 
        venue.team.toLowerCase().includes(lowerQuery) ||
        venue.city.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8)
      .map(venue => ({
        id: venue.id,
        name: venue.name,
        team: venue.team
      }));
    
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      window.location.href = `/stadium/${searchResults[0].id}`;
    }
  };

  return (
    <>
      <nav id="main-navigation" className={`sticky-top-nav ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <div className="nav-content">
            <Link href="/" className="nav-logo">
              <span className="logo-icon">☀️</span>
              <span className="logo-text">The Shadium</span>
            </Link>

            {/* Desktop navigation links removed - using hamburger menu only */}

            <div className="nav-right">
              <div className="nav-search" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    placeholder="Search stadiums..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="search-input"
                    aria-label="Search stadiums"
                  />
                  <button type="submit" className="search-button" aria-label="Search">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M13 13L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </form>
                
                {showSearchResults && (
                  <div className="search-results">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/stadium/${result.id}`}
                        className="search-result-item"
                      >
                        <span className="result-name">{result.name}</span>
                        <span className="result-team">{result.team}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="hamburger-menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`sticky-nav-mobile-menu ${isMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <div className="mobile-menu-content">
          {/* Close button */}
          <button
            className="mobile-menu-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="mobile-nav-links">
            {/* FIND YOUR STADIUM Section */}
            <div className="mobile-nav-section">
              <h4 className="mobile-section-title">
                <span className="section-icon">🏟️</span>
                Find Your Stadium
              </h4>
              
              {/* Integrated Search */}
              <div className="mobile-search">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="mobile-search-input"
                    aria-label="Search stadiums"
                  />
                </form>
                {searchQuery && searchResults.length > 0 && (
                  <div className="mobile-search-results">
                    {searchResults.slice(0, 5).map((result) => (
                      <Link
                        key={result.id}
                        href={`/stadium/${result.id}`}
                        className="mobile-search-result"
                        onClick={closeMobileMenu}
                      >
                        <span>{result.name}</span>
                        <span className="team-label">{result.team}</span>
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <div className="search-more">View all {searchResults.length} results</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* MLB Dropdown */}
              <div className="mobile-league-dropdown">
                <button
                  type="button"
                  className="mobile-league-toggle"
                  onClick={() => setIsMLBOpen(!isMLBOpen)}
                  aria-expanded={isMLBOpen}
                  aria-label="Toggle MLB stadiums menu"
                  aria-controls="mlb-venues-menu"
                >
                  MLB Stadiums ({mlbVenues.length})
                  <svg className="toggle-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {isMLBOpen && (
                  <div id="mlb-venues-menu" className="mobile-venues-menu" role="region" aria-label="MLB stadiums list">
                    {mlbVenues.map((venue) => (
                      <Link
                        key={venue.id}
                        href={`/venue/${venue.id}`}
                        className="mobile-venue-link"
                        onClick={closeMobileMenu}
                      >
                        {venue.name}
                        <span className="venue-team">{venue.team}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* NFL Dropdown */}
              <div className="mobile-league-dropdown">
                <button
                  type="button"
                  className="mobile-league-toggle"
                  onClick={() => setIsNFLOpen(!isNFLOpen)}
                  aria-expanded={isNFLOpen}
                  aria-label="Toggle NFL venues menu"
                  aria-controls="nfl-venues-menu"
                >
                  NFL Venues ({nflVenues.length})
                  <svg className="toggle-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {isNFLOpen && (
                  <div id="nfl-venues-menu" className="mobile-venues-menu" role="region" aria-label="NFL venues list">
                    {nflVenues.map((venue) => (
                      <Link
                        key={venue.id}
                        href={`/venue/${venue.id}`}
                        className="mobile-venue-link"
                        onClick={closeMobileMenu}
                      >
                        {venue.name}
                        <span className="venue-team">{venue.team}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* MiLB Dropdown */}
              <div className="mobile-league-dropdown">
                <button
                  type="button"
                  className="mobile-league-toggle"
                  onClick={() => setIsMiLBOpen(!isMiLBOpen)}
                  aria-expanded={isMiLBOpen}
                  aria-label="Toggle MiLB stadiums menu"
                  aria-controls="milb-venues-menu"
                >
                  MiLB Stadiums ({milbVenues.length})
                  <svg className="toggle-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {isMiLBOpen && (
                  <div id="milb-venues-menu" className="mobile-venues-menu" role="region" aria-label="MiLB stadiums list">
                    {milbVenues.map((venue) => (
                      <Link
                        key={venue.id}
                        href={`/venue/${venue.id}`}
                        className="mobile-venue-link"
                        onClick={closeMobileMenu}
                      >
                        {venue.name}
                        <span className="venue-team">{venue.team} ({venue.level})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* NAVIGATION Section */}
            <div className="mobile-nav-section">
              <h4 className="mobile-section-title">
                <span className="section-icon">📍</span>
                Navigation
              </h4>
              
              <Link 
                href="/" 
                className={pathname === '/' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              
              <Link 
                href="/#app-section" 
                className={pathname === '/' ? '' : ''}
                onClick={() => {
                  closeMobileMenu();
                  // Trigger the stadium selector to show
                  if (typeof window !== 'undefined') {
                    setTimeout(() => {
                      const button = document.querySelector('.hero-cta-button') as HTMLButtonElement;
                      if (button) button.click();
                    }, 100);
                  }
                }}
              >
                Shade Finder Tool
              </Link>
              
              <Link 
                href="/stadiums" 
                className={pathname === '/stadiums' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                All Stadiums
              </Link>
              
              <Link 
                href="/blog" 
                className={pathname?.startsWith('/blog') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
            </div>

            {/* RESOURCES Section */}
            <div className="mobile-nav-section">
              <h4 className="mobile-section-title">
                <span className="section-icon">📚</span>
                Resources
              </h4>
              
              <Link 
                href="/guide/how-to-find-shaded-seats" 
                className={pathname === '/guide/how-to-find-shaded-seats' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                How to Find Shaded Seats
              </Link>
              
              <Link 
                href="/guide/best-shaded-seats-mlb" 
                className={pathname === '/guide/best-shaded-seats-mlb' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Best Shaded Seats Guide
              </Link>
              
              <Link 
                href="/faq" 
                className={pathname === '/faq' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                FAQs
              </Link>
            </div>

            {/* ABOUT Section */}
            <div className="mobile-nav-section">
              <h4 className="mobile-section-title">
                <span className="section-icon">ℹ️</span>
                About
              </h4>
              
              <Link 
                href="/contact" 
                className={pathname === '/contact' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
              
              <Link 
                href="/privacy" 
                className={pathname === '/privacy' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Privacy Policy
              </Link>
              
              <Link 
                href="/terms" 
                className={pathname === '/terms' ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sticky-nav-mobile-overlay" onClick={closeMobileMenu} />
      )}
    </>
  );
}