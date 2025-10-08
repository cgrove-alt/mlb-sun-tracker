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
  const [searchResults, setSearchResults] = useState<Array<{id: string; name: string; team: string; league?: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Get venues by league
  const mlbVenues = getVenuesByLeague('MLB');
  const nflVenues = getVenuesByLeague('NFL');
  const milbVenues = getVenuesByLeague('MiLB');

  // Popular stadiums for quick access (top 8 most visited)
  const popularStadiums = [
    { id: 'yankees', name: 'Yankee Stadium', team: 'New York Yankees', league: 'MLB' },
    { id: 'dodgers', name: 'Dodger Stadium', team: 'Los Angeles Dodgers', league: 'MLB' },
    { id: 'cubs', name: 'Wrigley Field', team: 'Chicago Cubs', league: 'MLB' },
    { id: 'redsox', name: 'Fenway Park', team: 'Boston Red Sox', league: 'MLB' },
    { id: 'giants', name: 'Oracle Park', team: 'San Francisco Giants', league: 'MLB' },
    { id: 'braves', name: 'Truist Park', team: 'Atlanta Braves', league: 'MLB' },
    { id: 'astros', name: 'Minute Maid Park', team: 'Houston Astros', league: 'MLB' },
    { id: 'mets', name: 'Citi Field', team: 'New York Mets', league: 'MLB' },
  ];

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
        team: venue.team,
        league: venue.league // Include league for routing
      }));
    
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const venue = searchResults[0];
      // Use /stadium route for MLB, /venue for others
      const route = venue.league === 'MLB' ? 'stadium' : 'venue';
      window.location.href = `/${route}/${venue.id}`;
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
                    placeholder="Search: Yankee Stadium, Dodgers..."
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
                    {searchResults.map((result) => {
                      // Use /stadium route for MLB, /venue for others
                      const route = result.league === 'MLB' ? 'stadium' : 'venue';
                      return (
                        <Link
                          key={result.id}
                          href={`/${route}/${result.id}`}
                          className="search-result-item"
                        >
                          <div className="result-header">
                            <span className="result-name">{result.name}</span>
                            <span className={`league-badge league-${result.league?.toLowerCase()}`}>
                              {result.league}
                            </span>
                          </div>
                          <span className="result-team">{result.team}</span>
                        </Link>
                      );
                    })}
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
            {/* POPULAR STADIUMS Section - NEW */}
            <div className="mobile-nav-section mobile-section-popular">
              <h4 className="mobile-section-title">
                <span className="section-icon">⭐</span>
                Popular Stadiums
              </h4>
              <div className="popular-stadiums-grid">
                {popularStadiums.map((stadium) => (
                  <Link
                    key={stadium.id}
                    href={`/stadium/${stadium.id}`}
                    className="popular-stadium-card"
                    onClick={closeMobileMenu}
                  >
                    <span className="stadium-name">{stadium.team}</span>
                    <span className="stadium-venue">{stadium.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FIND YOUR STADIUM Section */}
            <div className="mobile-nav-section">
              <h4 className="mobile-section-title">
                <span className="section-icon">🔍</span>
                Search All Stadiums
              </h4>

              {/* Integrated Search */}
              <div className="mobile-search">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    placeholder="Search 250+ stadiums: Yankee Stadium, Dodgers..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="mobile-search-input"
                    aria-label="Search stadiums"
                  />
                </form>
                {searchQuery && searchResults.length > 0 && (
                  <div className="mobile-search-results">
                    {searchResults.slice(0, 5).map((result) => {
                      const route = result.league === 'MLB' ? 'stadium' : 'venue';
                      return (
                        <Link
                          key={result.id}
                          href={`/${route}/${result.id}`}
                          className="mobile-search-result"
                          onClick={closeMobileMenu}
                        >
                          <span>{result.name}</span>
                          <span className="team-label">{result.team}</span>
                        </Link>
                      );
                    })}
                    {searchResults.length > 5 && (
                      <div className="search-more">+{searchResults.length - 5} more results</div>
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
                        href={`/stadium/${venue.id}`}
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

              {/* MiLB Browse Link - Too many to show in dropdown */}
              <Link
                href="/league/milb"
                className="mobile-league-browse"
                onClick={closeMobileMenu}
              >
                <span className="browse-label">
                  <span className="browse-icon">⚾</span>
                  MiLB Stadiums
                </span>
                <span className="browse-meta">
                  <span className="browse-count">{milbVenues.length}+ stadiums</span>
                  <svg className="browse-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>

            {/* NAVIGATION Section - Streamlined */}
            <div className="mobile-nav-section">
              <h4 className="mobile-section-title">
                <span className="section-icon">📍</span>
                Navigate
              </h4>

              <Link
                href="/"
                className={`nav-link-primary ${pathname === '/' ? 'active' : ''}`}
                onClick={closeMobileMenu}
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                🏠 Home
              </Link>

              <Link
                href="/#app-section"
                className="nav-link-primary"
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
                🎯 Shade Finder Tool
              </Link>

              <Link
                href="/blog"
                className={`nav-link-primary ${pathname?.startsWith('/blog') ? 'active' : ''}`}
                onClick={closeMobileMenu}
                aria-current={pathname?.startsWith('/blog') ? 'page' : undefined}
              >
                📰 Blog & Guides
              </Link>

              <Link
                href="/faq"
                className={`nav-link-secondary ${pathname === '/faq' ? 'active' : ''}`}
                onClick={closeMobileMenu}
                aria-current={pathname === '/faq' ? 'page' : undefined}
              >
                ❓ FAQs
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