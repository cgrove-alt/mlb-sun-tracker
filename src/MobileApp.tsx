import React, { useState, useEffect, useCallback } from 'react';
import { Stadium, MLB_STADIUMS } from './data/stadiums';
import { UnifiedVenue, ALL_UNIFIED_VENUES, convertToLegacyStadium } from './data/unifiedVenues';
import { getStadiumSections } from './data/stadiumSections';
import { getVenueSections } from './data/venueSections';
import { generateBaseballSections } from './utils/generateBaseballSections';
import { MLBGame } from './services/mlbApi';
import { MiLBGame } from './services/milbApi';
import { NFLGame } from './services/nflApi';
import { SeatingSectionSun } from './utils/sunCalculations';
import { UnifiedGameSelector } from './components/UnifiedGameSelector';
import { MobileGameScheduler } from './components/MobileGameScheduler';
import { MobileFilterSheet } from './components/MobileFilterSheet';
import { SunFilterCriteria } from './components/EnhancedSunFilter';
import { MobileSectionCard } from './components/MobileSectionCard';
import { WeatherDisplay } from './components/WeatherDisplay';
import { EmptyState } from './components/EmptyStates';
import { SEOHelmet } from './components/SEOHelmet';
import { mlbApi } from './services/mlbApi';
import { weatherApi } from './services/weatherApi';
import { SunCalculator } from './utils/sunCalculator';
import { getSunPosition, getSunDescription, getCompassDirection } from './utils/sunCalculations';
import { SunIcon, MoonIcon } from './components/Icons';
import { validateStadiumId, validateFilterCriteria, RateLimiter } from './utils/validation';
import { debounce } from './utils/debounce';
import './styles/mobile.css';
import './MobileApp.css';

// Create rate limiters for API calls
const gameLoadRateLimiter = new RateLimiter(5, 60000); // 5 requests per minute
const weatherLoadRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

const MobileApp: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState<UnifiedVenue | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [games, setGames] = useState<(MLBGame | MiLBGame | NFLGame)[]>([]);
  const [selectedGame, setSelectedGame] = useState<MLBGame | MiLBGame | NFLGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [allSections, setAllSections] = useState<SeatingSectionSun[]>([]);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [sunPosition, setSunPosition] = useState<any>(null);

  const [isCalculating, setIsCalculating] = useState(false);

  // Convert unified venue to legacy stadium when needed
  useEffect(() => {
    if (selectedVenue) {
      setSelectedStadium(convertToLegacyStadium(selectedVenue));
    } else {
      setSelectedStadium(null);
    }
  }, [selectedVenue]);



  // Load weather when game is selected
  useEffect(() => {
    if (gameDateTime && selectedVenue) {
      loadWeather();
    } else {
      setWeatherForecast(null);
    }
  }, [gameDateTime, selectedVenue]);

  // Calculate sun exposure when game is selected
  useEffect(() => {
    if (gameDateTime && selectedVenue && selectedStadium) {
      calculateSections();
    } else {
      setAllSections([]);
      setFilteredSections([]);
    }
  }, [gameDateTime, selectedVenue, selectedStadium]);
  
  // Apply filters when sections or filter criteria change
  useEffect(() => {
    if (allSections.length > 0) {
      applyFilters();
    }
  }, [allSections, filterCriteria]);

  const handleGamesLoaded = (loadedGames: (MLBGame | MiLBGame | NFLGame)[]) => {
    setGames(loadedGames);
  };

  const loadWeather = async () => {
    if (!gameDateTime || !selectedVenue) return;
    
    // Rate limit check
    if (!weatherLoadRateLimiter.isAllowed('weather')) {
      console.warn('Weather API rate limited');
      return;
    }
    
    setIsWeatherLoading(true);
    
    try {
      const forecast = await weatherApi.getForecast(
        selectedVenue.latitude,
        selectedVenue.longitude
      );
      setWeatherForecast(forecast);
    } catch (err) {
      console.error('Error loading weather:', err);
      setWeatherForecast(null);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const applyFilters = React.useCallback(() => {
    let filtered = [...allSections];
    
    if (filterCriteria.sunPreference) {
      if (filterCriteria.sunPreference === 'sun') {
        filtered = filtered.filter(s => s.sunExposure >= 60);
      } else if (filterCriteria.sunPreference === 'shade') {
        filtered = filtered.filter(s => s.sunExposure <= 20);
      }
    }
    
    if (filterCriteria.maxSunExposure !== undefined && filterCriteria.maxSunExposure !== 100) {
      const maxExposure = filterCriteria.maxSunExposure;
      filtered = filtered.filter(s => s.sunExposure <= maxExposure);
    }
    
    if (filterCriteria.seatingAreas && filterCriteria.seatingAreas.length > 0) {
      filtered = filtered.filter(s => 
        filterCriteria.seatingAreas!.includes(s.section.level)
      );
    }
    
    if (filterCriteria.priceRange && filterCriteria.priceRange.length > 0) {
      filtered = filtered.filter(s => 
        s.section.price && filterCriteria.priceRange!.includes(s.section.price)
      );
    }
    
    setFilteredSections(filtered);
  }, [allSections, filterCriteria]);

  const calculateSections = React.useCallback(debounce(async () => {
    if (!gameDateTime || !selectedVenue || !selectedStadium) return;
    
    setIsCalculating(true);
    
    try {
      // Calculate sun position
      const position = getSunPosition(gameDateTime, selectedVenue.latitude, selectedVenue.longitude);
      setSunPosition({
        altitudeDegrees: position.altitudeDegrees,
        azimuthDegrees: position.azimuthDegrees
      });
      
      // Get sections based on venue type
      let sections: any[] = [];
      if (selectedVenue.league === 'MLB') {
        sections = getStadiumSections(selectedVenue.id);
      } else if (selectedVenue.league === 'MiLB') {
        // Get MiLB sections - will use custom layouts if available
        sections = getVenueSections(selectedVenue.id);
        // Fall back to generated sections if no custom layout
        if (!sections || sections.length === 0) {
          sections = generateBaseballSections(selectedVenue);
        }
      } else {
        sections = getVenueSections(selectedVenue.id);
      }
      const gameDate = gameDateTime;
      
      // Use the same time-based calculation as desktop
      const calculator = new SunCalculator(selectedStadium);
      const gameDuration = 3; // 3 hour game
      
      const results: SeatingSectionSun[] = sections.map(section => {
        // Add section geometry for calculations
        const side: 'home' | 'first' | 'third' | 'outfield' = 
          section.name.toLowerCase().includes('third') || section.name.toLowerCase().includes('3b') || section.name.toLowerCase().includes('left') ? 'third' :
          section.name.toLowerCase().includes('first') || section.name.toLowerCase().includes('1b') || section.name.toLowerCase().includes('right') ? 'first' :
          section.name.toLowerCase().includes('behind') || section.name.toLowerCase().includes('home') || section.name.toLowerCase().includes('backstop') ? 'home' : 'outfield';
        
        const sectionWithGeometry = {
          ...section,
          side,
          angle: section.baseAngle || 0,
          depth: 50 // Default depth
        };
        
        // Calculate time in sun
        const timeExposure = calculator.calculateTimeInSun(sectionWithGeometry, gameDate, gameDuration);
        
        return {
          section,
          sunExposure: Math.round(timeExposure.percentage),
          inSun: timeExposure.percentage > 20,
          timeInSun: timeExposure.totalMinutes,
          percentageOfGameInSun: timeExposure.percentage
        };
      });
    
      // Store all sections (unfiltered)
      setAllSections(results);
    } finally {
      setIsCalculating(false);
    }
  }, 300), [gameDateTime, selectedVenue, selectedStadium]);

  const handleVenueChange = useCallback((venue: UnifiedVenue | null) => {
    setSelectedVenue(venue);
    setSelectedGame(null);
    setGameDateTime(null);
  }, []);

  const handleGameSelect = useCallback((game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);
  }, []);

  const handleFilterChange = useCallback((criteria: SunFilterCriteria) => {
    // Validate filter criteria
    if (!validateFilterCriteria(criteria)) {
      console.error('Invalid filter criteria:', criteria);
      return;
    }
    setFilterCriteria(criteria);
  }, []);


  return (
    <div className="mobile-app">
      {/* Skip Navigation Links for Accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <a href="#venue-selector" className="skip-link">Skip to venue selector</a>
      <a href="#results" className="skip-link">Skip to results</a>
      
      <SEOHelmet 
        stadium={selectedStadium}
        game={selectedGame}
        pageType={selectedGame ? 'game' : selectedVenue ? 'stadium' : 'home'}
        shadedSectionsCount={filteredSections.filter(s => !s.inSun).length}
      />
      
      <main className="mobile-main" id="main-content">
        <div className="mobile-content">
          {/* Unified Venue and Game Selection */}
          <section className="mobile-section" id="venue-selector">
            <UnifiedGameSelector
              selectedVenue={selectedVenue}
              onGameSelect={handleGameSelect}
              onVenueChange={handleVenueChange}
              onGamesLoaded={handleGamesLoaded}
            />
          </section>

          {/* Empty State Info Box */}
          {!selectedVenue && (
            <section className="mobile-section">
              <EmptyState 
                type="no-stadium"
                action={
                  <div style={{textAlign: 'center'}}>
                    <p style={{fontSize: '0.9rem', color: '#666', margin: '0 0 12px 0'}}>
                      Choose from MLB, MiLB, and NFL venues to analyze sun exposure patterns
                    </p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                      <span style={{padding: '4px 8px', background: '#e3f2fd', borderRadius: '12px', fontSize: '0.8rem', color: '#1976d2'}}>
                        ☀️ Real-time sun tracking
                      </span>
                      <span style={{padding: '4px 8px', background: '#f3e5f5', borderRadius: '12px', fontSize: '0.8rem', color: '#7b1fa2'}}>
                        🏟️ 180+ venues
                      </span>
                      <span style={{padding: '4px 8px', background: '#e8f5e9', borderRadius: '12px', fontSize: '0.8rem', color: '#388e3c'}}>
                        📊 Detailed analysis
                      </span>
                    </div>
                  </div>
                }
              />
            </section>
          )}
          
          {selectedVenue && !gameDateTime && (
            <>
              <section className="mobile-section">
                <EmptyState 
                  type="no-game"
                  action={
                    <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                      {selectedVenue.league === 'MLB' || selectedVenue.league === 'MiLB'
                        ? 'Pick a real game or set any custom date and time'
                        : 'Set a custom date and time for shade calculations'
                      }
                    </p>
                  }
                />
              </section>
              
              <section className="mobile-section">
                <div className="mobile-stadium-guide-link">
                  <a href={`/venue/${selectedVenue.id}`} className="mobile-guide-button">
                    <div>
                      <div className="guide-title">View {selectedVenue.name} Shade Guide</div>
                      <p className="mobile-guide-description">
                        Discover the best shaded sections, weather patterns, and tips
                      </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="guide-arrow">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </a>
                </div>
              </section>
            </>
          )}

          {/* Games are now handled by UnifiedGameSelector */}

          {/* Sun Information Banner */}
          {gameDateTime && selectedVenue && sunPosition && (
            <section className="mobile-sun-banner">
              <div className="mobile-sun-content">
                <div className="mobile-sun-info">
                  {sunPosition.altitudeDegrees > 0 ? (
                    <>
                      <SunIcon size={24} />
                      <div className="sun-details">
                        <span className="sun-status">
                          Sun is {getSunDescription(sunPosition.altitudeDegrees)}
                        </span>
                        <span className="sun-position">
                          {sunPosition.altitudeDegrees.toFixed(1)}° · {getCompassDirection(sunPosition.azimuthDegrees)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <MoonIcon size={24} />
                      <div className="sun-details">
                        <span className="sun-status">Night Game</span>
                        <span className="sun-position">Sun below horizon</span>
                      </div>
                    </>
                  )}
                </div>
                
              </div>
            </section>
          )}

          {/* Weather Display */}
          {gameDateTime && weatherForecast && selectedStadium && (
            <section className="mobile-section">
              <h2 className="mobile-section-title">Game Weather</h2>
              <WeatherDisplay
                weather={weatherForecast}
                gameTime={gameDateTime}
                loading={isWeatherLoading}
                stadium={selectedStadium}
              />
            </section>
          )}

          {/* Filter and Results */}
          {gameDateTime && selectedVenue && (
            <>
              <section className="mobile-section mobile-filter-section">
                <MobileFilterSheet
                  onFilterChange={handleFilterChange}
                  currentFilters={filterCriteria}
                  resultCount={filteredSections.length}
                  allSections={allSections}
                />
              </section>

              <section className="mobile-section" id="results">
                <h2 className="mobile-section-title">
                  {filteredSections.length} Sections Found
                </h2>
                
                {isCalculating ? (
                  <div className="mobile-loading">
                    <div className="mobile-spinner" />
                    <p>Calculating sun exposure...</p>
                  </div>
                ) : filteredSections.length > 0 ? (
                  <div className="mobile-section-list">
                    {filteredSections.map((sectionData) => (
                      <MobileSectionCard
                        key={sectionData.section.id}
                        section={sectionData.section}
                        sunExposure={sectionData.sunExposure}
                        inSun={sectionData.inSun}
                        timeInSun={sectionData.timeInSun}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mobile-empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No sections match your filters</p>
                    <button 
                      className="mobile-reset-btn"
                      onClick={() => {
                        setFilterCriteria({});
                        // Immediately apply empty filters
                        setFilteredSections(allSections);
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      
      <footer className="mobile-footer">
        <div className="mobile-footer-content">
          <div className="mobile-footer-links">
            <a href="/privacy" className="mobile-footer-link">Privacy Policy</a>
            <span className="mobile-footer-separator">•</span>
            <a href="/terms" className="mobile-footer-link">Terms of Service</a>
          </div>
          <p className="mobile-footer-copyright">
            © {new Date().getFullYear()} The Shadium. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MobileApp;