'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';
import './StickyTopNav.css';

interface TeamGroup {
  division: string;
  teams: Array<{
    id: string;
    name: string;
    stadium: string;
  }>;
}

const MLB_TEAMS_BY_DIVISION: TeamGroup[] = [
  {
    division: 'AL East',
    teams: [
      { id: 'orioles', name: 'Baltimore Orioles', stadium: 'Oriole Park at Camden Yards' },
      { id: 'redsox', name: 'Boston Red Sox', stadium: 'Fenway Park' },
      { id: 'yankees', name: 'New York Yankees', stadium: 'Yankee Stadium' },
      { id: 'rays', name: 'Tampa Bay Rays', stadium: 'Tropicana Field' },
      { id: 'bluejays', name: 'Toronto Blue Jays', stadium: 'Rogers Centre' },
    ]
  },
  {
    division: 'AL Central',
    teams: [
      { id: 'whitesox', name: 'Chicago White Sox', stadium: 'Guaranteed Rate Field' },
      { id: 'guardians', name: 'Cleveland Guardians', stadium: 'Progressive Field' },
      { id: 'tigers', name: 'Detroit Tigers', stadium: 'Comerica Park' },
      { id: 'royals', name: 'Kansas City Royals', stadium: 'Kauffman Stadium' },
      { id: 'twins', name: 'Minnesota Twins', stadium: 'Target Field' },
    ]
  },
  {
    division: 'AL West',
    teams: [
      { id: 'astros', name: 'Houston Astros', stadium: 'Minute Maid Park' },
      { id: 'angels', name: 'Los Angeles Angels', stadium: 'Angel Stadium' },
      { id: 'athletics', name: 'Oakland Athletics', stadium: 'Sutter Health Park' },
      { id: 'mariners', name: 'Seattle Mariners', stadium: 'T-Mobile Park' },
      { id: 'rangers', name: 'Texas Rangers', stadium: 'Globe Life Field' },
    ]
  },
  {
    division: 'NL East',
    teams: [
      { id: 'braves', name: 'Atlanta Braves', stadium: 'Truist Park' },
      { id: 'marlins', name: 'Miami Marlins', stadium: 'loanDepot park' },
      { id: 'mets', name: 'New York Mets', stadium: 'Citi Field' },
      { id: 'phillies', name: 'Philadelphia Phillies', stadium: 'Citizens Bank Park' },
      { id: 'nationals', name: 'Washington Nationals', stadium: 'Nationals Park' },
    ]
  },
  {
    division: 'NL Central',
    teams: [
      { id: 'cubs', name: 'Chicago Cubs', stadium: 'Wrigley Field' },
      { id: 'reds', name: 'Cincinnati Reds', stadium: 'Great American Ball Park' },
      { id: 'brewers', name: 'Milwaukee Brewers', stadium: 'American Family Field' },
      { id: 'pirates', name: 'Pittsburgh Pirates', stadium: 'PNC Park' },
      { id: 'cardinals', name: 'St. Louis Cardinals', stadium: 'Busch Stadium' },
    ]
  },
  {
    division: 'NL West',
    teams: [
      { id: 'diamondbacks', name: 'Arizona Diamondbacks', stadium: 'Chase Field' },
      { id: 'rockies', name: 'Colorado Rockies', stadium: 'Coors Field' },
      { id: 'dodgers', name: 'Los Angeles Dodgers', stadium: 'Dodger Stadium' },
      { id: 'padres', name: 'San Diego Padres', stadium: 'Petco Park' },
      { id: 'giants', name: 'San Francisco Giants', stadium: 'Oracle Park' },
    ]
  }
];

export default function StickyTopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStadiumsOpen, setIsStadiumsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: string; name: string; team: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsStadiumsOpen(false);
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStadiumsOpen(false);
      }
      // Removed the mobileMenuRef check to prevent issues with overlay clicks
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
      <nav className={`sticky-top-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-content">
            <Link href="/" className="nav-logo">
              <span className="logo-icon">☀️</span>
              <span className="logo-text">The Shadium</span>
            </Link>

            <div className="nav-links desktop-only">
              <Link href="/" className={pathname === '/' ? 'active' : ''}>
                Home
              </Link>
              
              <div className="dropdown-wrapper" ref={dropdownRef}>
                <button
                  className={`dropdown-trigger ${pathname.startsWith('/stadium') ? 'active' : ''}`}
                  onClick={() => setIsStadiumsOpen(!isStadiumsOpen)}
                  aria-expanded={isStadiumsOpen}
                >
                  Stadiums
                  <svg className="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                
                {isStadiumsOpen && (
                  <div className="dropdown-menu mega-menu">
                    <div className="mega-menu-content">
                      {MLB_TEAMS_BY_DIVISION.map((group) => (
                        <div key={group.division} className="division-group">
                          <h3 className="division-title">{group.division}</h3>
                          <ul className="team-list">
                            {group.teams.map((team) => (
                              <li key={team.id}>
                                <Link href={`/stadium/${team.id}`} className="team-link">
                                  <span className="team-name">{team.name}</span>
                                  <span className="stadium-name">{team.stadium}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <Link href="/stadiums" className="view-all-link">
                        View All Stadiums →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/faqs" className={pathname === '/faqs' ? 'active' : ''}>
                FAQs
              </Link>
              
              <Link href="/contact" className={`contact-link ${pathname === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </div>

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
      </nav>

      <div className={`sticky-nav-mobile-menu ${isMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="search"
                placeholder="Search stadiums..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="mobile-search-input"
                aria-label="Search stadiums"
              />
            </form>
            {searchQuery && searchResults.length > 0 && (
              <div className="mobile-search-results">
                {searchResults.map((result) => (
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
              </div>
            )}
          </div>

          <div className="mobile-nav-links">
            <Link 
              href="/" 
              className={pathname === '/' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            
            {/* Quick access to All Stadiums page */}
            <Link 
              href="/stadiums" 
              className={pathname === '/stadiums' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              All Stadiums
            </Link>
            
            <div className="mobile-stadiums-section">
              <button
                className="mobile-stadiums-toggle"
                onClick={() => setIsStadiumsOpen(!isStadiumsOpen)}
                aria-expanded={isStadiumsOpen}
              >
                Stadiums
                <svg className="toggle-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {isStadiumsOpen && (
                <div className="mobile-stadiums-menu">
                  {MLB_TEAMS_BY_DIVISION.map((group) => (
                    <div key={group.division} className="mobile-division">
                      <h4 className="mobile-division-title">{group.division}</h4>
                      {group.teams.map((team) => (
                        <Link
                          key={team.id}
                          href={`/stadium/${team.id}`}
                          className="mobile-team-link"
                          onClick={closeMobileMenu}
                        >
                          {team.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guides */}
            <Link 
              href="/guide" 
              className={pathname === '/guide' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Guides
            </Link>
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
              Best Shaded Seats (MLB)
            </Link>

            {/* Leagues */}
            <Link 
              href="/league/mlb" 
              className={pathname === '/league/mlb' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              MLB Stadiums
            </Link>
            <Link 
              href="/league/nfl" 
              className={pathname === '/league/nfl' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              NFL Venues
            </Link>
            <Link 
              href="/league/milb" 
              className={pathname === '/league/milb' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              MiLB Stadiums
            </Link>

            {/* Tools / Other pages */}
            <Link 
              href="/seats-shade-finder" 
              className={pathname === '/seats-shade-finder' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Seats Shade Finder
            </Link>

            <Link 
              href="/faqs" 
              className={`faqs-link ${pathname === '/faqs' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              FAQs
            </Link>
            
            <Link 
              href="/contact" 
              className={`contact-link ${pathname === '/contact' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            <Link 
              href="/privacy" 
              className={pathname === '/privacy' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className={pathname === '/terms' ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sticky-nav-mobile-overlay" onClick={closeMobileMenu} />
      )}
    </>
  );
}