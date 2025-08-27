import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Link from 'next/link';
import './App.css';
import { MLB_STADIUMS, Stadium } from './data/stadiums';
import { ALL_UNIFIED_VENUES } from './data/unifiedVenues';
import { GameSelector } from './components/GameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { EnhancedSunFilter, SunFilterCriteria } from './components/EnhancedSunFilter';
import { SectionList } from './components/SectionList';
import { EmptyState } from './components/EmptyStates';
import { ErrorProvider, useError } from './components/ErrorNotification';
import { Breadcrumb } from './components/Breadcrumb';
import { Tooltip } from './components/Tooltip';
import { ShareButton } from './components/ShareButton';
import { Navigation } from './components/Navigation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SunIcon, CloudIcon, ChartIcon, InfoIcon, MoonIcon, StadiumIcon, ShadeIcon, PartlyCloudyIcon, RainIcon } from './components/Icons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOHelmet } from './components/SEOHelmet';
import { SunExposureExplanation } from './components/SunExposureExplanation';
import MobileApp from './MobileApp';

const SmartItinerariesPage = lazy(() => import('./components/SmartItinerariesPage').then(module => ({ default: module.SmartItinerariesPage })));
import { I18nProvider, useTranslation } from './i18n/i18nContext';
// PWA functionality disabled
// import { pwaManager, PWAInstallManager } from './utils/pwa';
// import { PWAInstallToast } from './components/PWAInstallToast';
import { getSunPosition, getSunDescription, getCompassDirection, calculateDetailedSectionSunExposure, calculateEnhancedSectionSunExposure, filterSectionsBySunExposure, SeatingSectionSun, calculateGameSunExposure } from './utils/sunCalculations';
import { calculateDetailedSectionSunExposureOptimized } from './utils/optimizedSunCalculations';
import { SunCalculator } from './utils/sunCalculator';
import { getStadiumSections } from './data/stadiumSections';
import { getVenueSections } from './data/venueSections';
import { MLBGame, mlbApi } from './services/mlbApi';
import { NFLGame } from './services/nflApi';
import { MiLBGame } from './services/milbApi';
import { WeatherForecast, weatherApi } from './services/weatherApi';
import { formatDateTimeWithTimezone } from './utils/timeUtils';
import { performanceMonitor, trackWebVitals } from './utils/performanceMonitor';
import { OfflineIndicator } from './components/OfflineIndicator';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import { trackStadiumSelection, trackGameSelection, trackFilterUsage } from './utils/analytics';

// Convert unified venues to Stadium format for the selector
// Include all venues: MLB, MiLB, and NFL
const ALL_STADIUMS: Stadium[] = ALL_UNIFIED_VENUES.map(venue => ({
  id: venue.id,
  name: venue.name,
  team: venue.team,
  latitude: venue.latitude,
  longitude: venue.longitude,
  orientation: venue.orientation,
  capacity: venue.capacity,
  roof: venue.roof || 'open',
  roofHeight: venue.roofHeight,
  roofOverhang: venue.roofOverhang,
  upperDeckHeight: venue.upperDeckHeight,
  city: venue.city,
  state: venue.state,
  timezone: venue.timezone
}));

function AppContent() {
  const { t } = useTranslation();
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [selectedGame, setSelectedGame] = useState<MLBGame | MiLBGame | NFLGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [stadiumGames, setStadiumGames] = useState<(MLBGame | MiLBGame)[]>([]);
  const [sunPosition, setSunPosition] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [detailedSections, setDetailedSections] = useState<SeatingSectionSun[]>([]);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [gameExposureData, setGameExposureData] = useState<Map<string, number> | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [loadingSections, setLoadingSections] = useState(false);
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'itinerary'>('tracker');
  const [changingStadium, setChangingStadium] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { showError } = useError();

  // Load preferences and URL parameters on component mount
  // PWA manager disabled
  // useEffect(() => {
  //   pwaManager.init();
  //   return () => {
  //     pwaManager.cleanup();
  //   };
  // }, []);

  // Add scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.mobile-nav-menu') && !target.closest('.mobile-menu-btn')) {
          setMobileMenuOpen(false);
        }
      };

      setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 0);
      
      return () => {
        document.removeEventListener('click', handleClick);
        document.body.classList.remove('menu-open');
      };
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [mobileMenuOpen]);

  // Initialize performance monitoring and service worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // DISABLED: Performance tracking to reduce initial load
      // trackWebVitals();
      
      // DISABLED: Service worker to reduce initial load
      /*
      serviceWorkerRegistration.register({
        onSuccess: (registration) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Service worker registered successfully');
          }
        },
        onUpdate: (registration) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('New content available, refresh to update');
          }
        },
        onOffline: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('App is running in offline mode');
          }
        },
        onOnline: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('App is back online');
          }
        }
      });
      */
      
      // DISABLED: Performance logging to reduce overhead
      /*
      if (process.env.NODE_ENV === 'development') {
        const interval = setInterval(() => {
          performanceMonitor.logReport();
        }, 30000);
        
        return () => clearInterval(interval);
      }
      */
    }
  }, []);

  useEffect(() => {
    // DISABLED: All initial loading to prevent page freeze
    // Users must manually select stadium and game
    return;
    
    /*
    // Only run once on mount to avoid infinite loops
    // Only access window in the browser environment
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const preferences = currentProfile?.preferences || {};
    
    // Check URL parameters first (shared links take precedence)
    const stadiumParam = urlParams.get('stadium');
    const datetimeParam = urlParams.get('datetime');
    
    if (stadiumParam) {
      const stadium = MLB_STADIUMS.find(s => s.id === stadiumParam);
      if (stadium) {
        setSelectedStadium(stadium);
        
        // If datetime is provided, set it
        if (datetimeParam) {
          try {
            const dateTime = new Date(datetimeParam);
            if (!isNaN(dateTime.getTime())) {
              setGameDateTime(dateTime);
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Invalid datetime parameter:', error);
            }
          }
        }
      }
    } else if (!selectedStadium) { // Only set from preferences if no stadium is already selected
      // DISABLED: Auto-loading stadium from preferences to prevent freeze on page load
      // Users must manually select a stadium
      if (preferences.selectedStadiumId) {
        const stadium = MLB_STADIUMS.find(s => s.id === preferences.selectedStadiumId);
        if (stadium) {
          setSelectedStadium(stadium);
        }
      }
    }
    
    // Restore filter criteria (unless overridden by URL)
    if (preferences.filterCriteria && Object.keys(filterCriteria).length === 0) {
      setFilterCriteria(preferences.filterCriteria);
    }
    */
  }, []); // Empty dependency array - only run once

  const loadWeatherForecast = useCallback(async () => {
    if (!selectedStadium) return;
    
    setLoadingWeather(true);
    try {
      const forecast = await weatherApi.getForecast(selectedStadium.latitude, selectedStadium.longitude);
      setWeatherForecast(forecast);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading weather forecast:', error);
      }
      setWeatherForecast(null);
      // Don't include showError in dependencies to avoid infinite loops
      showError?.(
        'Unable to load weather forecast. Sun calculations will continue without weather data.',
        'warning'
      );
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedStadium]); // showError excluded to prevent loops

  // Load games when stadium is selected
  const loadGames = useCallback(async () => {
    if (!selectedStadium) {
      setStadiumGames([]);
      return;
    }
    
    try {
      // Load games through end of October to ensure we get all remaining regular season games
      const today = new Date();
      const currentYear = today.getFullYear();
      const endDate = new Date(currentYear, 9, 31); // October 31st
      const allGames = await mlbApi.getSchedule(
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      const homeGames = mlbApi.getHomeGamesForStadium(selectedStadium.id, allGames);
      setStadiumGames(homeGames);
    } catch (error) {
      console.error('Error loading games:', error);
      setStadiumGames([]);
      // Show error to user
      showError?.('Unable to load MLB games. Please check your connection and try again.', 'error');
    }
  }, [selectedStadium]);

  // Load games when stadium changes - but defer to prevent UI blocking
  useEffect(() => {
    if (!selectedStadium) return;
    
    // Defer game loading to next tick to allow UI to update
    const timeoutId = setTimeout(() => {
      loadGames();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [selectedStadium, loadGames]);

  // Calculate sun and section data when stadium, time, or weather changes
  useEffect(() => {
    // Exit early if no stadium or game time
    if (!selectedStadium || !gameDateTime) {
      setDetailedSections([]);
      setFilteredSections([]);
      setSunPosition(null);
      setLoadingSections(false);
      setCalculationInProgress(false);
      return;
    }
    
    // Don't calculate immediately on mount - wait for user interaction
    if (!selectedGame && !gameDateTime) {
      return;
    }
    
    let isCancelled = false;
    
    const performCalculation = async () => {
      if (isCancelled || calculationInProgress) return;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[performCalculation] Starting', {
          stadium: selectedStadium.name,
          time: gameDateTime.toISOString()
        });
      }
      
      // Double-check we're not cancelled before starting heavy work
      if (isCancelled) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[performCalculation] Cancelled before starting');
        }
        return;
      }
      
      setLoadingSections(true);
      setCalculationInProgress(true);
      
      try {
        // Calculate sun position for display
        const position = getSunPosition(gameDateTime, selectedStadium.latitude, selectedStadium.longitude);
        const formattedPosition = {
          altitudeDegrees: position.altitudeDegrees,
          azimuthDegrees: position.azimuthDegrees,
          altitude: position.altitude,
          azimuth: position.azimuth
        };
        
        if (isCancelled) return;
        setSunPosition(formattedPosition);
        
        // Get sections - try MLB stadiums first, then check all venues (MiLB/NFL)
        let sections = getStadiumSections(selectedStadium.id);
        if (sections.length === 0) {
          // Try venue sections for MiLB and NFL venues
          sections = getVenueSections(selectedStadium.id);
        }
        if (process.env.NODE_ENV === 'development') {
          console.log(`[performCalculation] Got ${sections.length} sections for ${selectedStadium.id}`);
        }
        
        // Safety check - if too many sections, something's wrong
        if (sections.length > 300) {
          console.error(`[performCalculation] Too many sections (${sections.length}), limiting to 300`);
          showError?.('Stadium has too many sections. Showing first 300 sections only.', 'warning');
          // Limit to first 300 sections to prevent freeze
          sections.splice(300);
        }
        
        // Allow UI to update before heavy calculation
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Calculate time-based sun exposure for entire game duration
        const calculator = new SunCalculator(selectedStadium);
        const gameDuration = 3; // 3 hour game
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[performCalculation] Calculating time-based sun exposure');
        }
        
        // Calculate time-based exposure for each section
        const detailedSectionData: SeatingSectionSun[] = sections.map((section, index) => {
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
          const timeExposure = calculator.calculateTimeInSun(sectionWithGeometry, gameDateTime, gameDuration);
          
          // Log progress at intervals
          if (index % 50 === 0 && process.env.NODE_ENV === 'development') {
            console.log(`[performCalculation] Progress: ${Math.round((index / sections.length) * 100)}%`);
          }
          
          // Debug: Log covered sections and very low sun exposure
          if (process.env.NODE_ENV === 'development' && (section.covered || timeExposure.percentage < 10)) {
            console.log(`[Debug] Section ${section.name}: covered=${section.covered}, sun=${timeExposure.percentage.toFixed(1)}%`);
          }
          
          return {
            section,
            sunExposure: Math.round(timeExposure.percentage),
            inSun: timeExposure.percentage > 20,
            timeInSun: timeExposure.totalMinutes,
            percentageOfGameInSun: timeExposure.percentage
          };
        });
        
        if (isCancelled) return;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[performCalculation] Calculated time-based exposure for ${detailedSectionData.length} sections`);
        }
        setDetailedSections(detailedSectionData);
        
        // Apply filter
        const filtered = filterSectionsBySunExposure(detailedSectionData, filterCriteria);
        setFilteredSections(filtered);
        
        // PWA notification disabled
        // if (filtered.length > 0) {
        //   PWAInstallManager.notifyShadeCalculation();
        // }
        
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[performCalculation] Error:', error);
        }
        if (!isCancelled) {
          showError?.('Unable to calculate sun exposure. Please try again.', 'error');
        }
      } finally {
        if (!isCancelled) {
          setLoadingSections(false);
          setCalculationInProgress(false);
        }
      }
    };
    
    // Use a longer timeout to batch updates and allow navigation
    const timeoutId = setTimeout(performCalculation, 300);
    
    // Cleanup
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      setCalculationInProgress(false);
    };
  }, [selectedStadium, gameDateTime, filterCriteria, selectedGame]); // Minimal dependencies

  // Load weather forecast when stadium AND game time are selected
  useEffect(() => {
    // Only load weather when we have both stadium and game time
    if (selectedStadium && gameDateTime) {
      // Add a delay to prevent rapid updates
      const timeoutId = setTimeout(() => {
        loadWeatherForecast();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedStadium, gameDateTime, loadWeatherForecast]); // Include all dependencies

  // Update filtered sections when filter criteria changes
  useEffect(() => {
    if (detailedSections.length > 0) {
      const filtered = filterSectionsBySunExposure(detailedSections, filterCriteria);
      setFilteredSections(filtered);
    }
  }, [detailedSections, filterCriteria]);

  const handleFilterChange = (criteria: SunFilterCriteria) => {
    setFilterCriteria(criteria);
    // PWA notification disabled
    // if (Object.keys(criteria).length > 0) {
    //   PWAInstallManager.notifyUserEngagement('filter');
    // }
    
    // Track filter usage
    if (criteria.sunPreference) {
      trackFilterUsage('sun_preference', criteria.sunPreference);
    }
    if (criteria.maxSunExposure !== undefined) {
      trackFilterUsage('max_sun_exposure', criteria.maxSunExposure.toString());
    }
  };

  const handleGameSelect = (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);
    
    // Track game selection
    if (game && selectedStadium && dateTime) {
      trackGameSelection(selectedStadium.name, dateTime.toISOString());
    }
  };

  const handleStadiumChange = useCallback((stadium: Stadium | null) => {
    // Set loading state to prevent UI interactions during state reset
    setChangingStadium(true);
    
    // Use React's batching to update all states together
    setSelectedStadium(stadium);
    setSelectedGame(null);
    setGameDateTime(null);
    setWeatherForecast(null);
    setSunPosition(null);
    setDetailedSections([]);
    setFilteredSections([]);
    setFilterCriteria({});
    setLoadingSections(false);
    
    // Track analytics
    if (stadium) {
      trackStadiumSelection(stadium.name);
    }
    
    // Clear loading state after a brief delay
    setTimeout(() => {
      setChangingStadium(false);
    }, 300);
  }, []);

  return (
    <div className="App">
      <SEOHelmet 
        stadium={selectedStadium} 
        game={selectedGame}
        pageType={selectedGame ? 'game' : selectedStadium ? 'stadium' : 'home'}
        shadedSectionsCount={filteredSections.filter(s => !s.inSun).length}
      />
      <OfflineIndicator />
      <header className={`App-header ${scrolled ? 'scrolled' : ''} ${selectedStadium ? 'hidden-when-stadium-selected' : ''}`}>
        <div className="header-content">
          <div className="header-left">
            <h1>{t('app.title')}</h1>
            <p className="header-subtitle">{t('app.subtitle')}</p>
            {selectedStadium && gameDateTime && (
              <div className="quick-summary">
                <span className="stadium-name">{selectedStadium.name}</span>
                <span className="game-time">{selectedStadium ? formatDateTimeWithTimezone(gameDateTime, selectedStadium.timezone) : gameDateTime.toLocaleDateString()}</span>
                <ShareButton
                  selectedStadium={selectedStadium}
                  selectedGame={selectedGame}
                  gameDateTime={gameDateTime}
                  className="header-share-btn"
                />
              </div>
            )}
          </div>
          <div className="header-right">
            <button 
              className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay and Panel */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-overlay" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true"
          />
          <nav className="mobile-nav-menu" role="navigation" aria-label="Mobile navigation">
            <div className="mobile-nav-header">
              <h2>Menu</h2>
              <button 
                className="mobile-nav-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mobile-nav-items">
              <a href="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-nav-icon">🏠</span>
                <span>Home</span>
              </a>
              <a href="/stadiums" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-nav-icon">🏟️</span>
                <span>Stadiums</span>
              </a>
              <a href="/faq" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-nav-icon">❓</span>
                <span>FAQs</span>
              </a>
              <a href="/contact" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-nav-icon">📧</span>
                <span>Contact</span>
              </a>
            </div>
          </nav>
        </>
      )}

      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {activeTab === 'tracker' ? (
        <main className="App-main">
          {changingStadium && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.9)',
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <LoadingSpinner />
                <p style={{ marginTop: '1rem', color: '#666' }}>Loading stadium data...</p>
              </div>
            </div>
          )}
          <Breadcrumb
            selectedStadium={selectedStadium}
            selectedGame={selectedGame}
            gameDateTime={gameDateTime}
            onStadiumChange={handleStadiumChange}
            onGameSelect={handleGameSelect}
          />
          
          <GameSelector
            selectedStadium={selectedStadium}
            onGameSelect={handleGameSelect}
            onStadiumChange={handleStadiumChange}
            stadiums={ALL_STADIUMS}
            onGamesLoaded={setStadiumGames}
          />

        {!selectedStadium && (
          <EmptyState 
            type="no-stadium"
            action={
              <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                Choose from 30 MLB stadiums to analyze sun exposure patterns
              </p>
            }
          />
        )}

        {selectedStadium && !gameDateTime && (
          <>
            <EmptyState 
              type="no-game"
              action={
                <div style={{textAlign: 'center'}}>
                  <p style={{fontSize: '0.9rem', color: '#666', margin: '0 0 1rem 0'}}>
                    Pick a real game or set any custom date and time
                  </p>
                  <Link 
                    href={`/stadium/${selectedStadium.id}`}
                    style={{
                      color: '#2196f3',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    View {selectedStadium.name} Shade Guide →
                  </Link>
                </div>
              }
            />
          </>
        )}

        {selectedStadium && gameDateTime && (
          <div className="results">
            {loadingSections && (
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                textAlign: 'center'
              }}>
                <LoadingSpinner />
                <p style={{marginTop: '1rem', color: '#666'}}>Calculating sun exposure for {selectedStadium.name}...</p>
                <p style={{fontSize: '0.875rem', color: '#999'}}>This may take a moment for large stadiums</p>
              </div>
            )}
            <div className="weather-info-section">
              {weatherForecast && (
                <WeatherDisplay 
                  key={`weather-${gameDateTime?.toISOString() || 'no-game'}`}
                  weather={weatherForecast} 
                  gameTime={gameDateTime}
                  loading={loadingWeather}
                  stadium={selectedStadium}
                />
              )}

              {sunPosition && (
                <div className="sun-info">
                  <h3>
                    Sun Information
                    {selectedStadium?.roofHeight && (
                      <span className="enhanced-indicator" title="Using enhanced shadow calculations with stadium geometry">
                        ✨ Enhanced
                      </span>
                    )}
                  </h3>
                  <div className="sun-details">
                    <div className="sun-detail-item">
                      <span className="sun-icon"><SunIcon size={20} /></span>
                      <div className="sun-detail-content">
                        <span className="sun-label">Condition</span>
                        <span className="sun-value">{getSunDescription(sunPosition)}</span>
                      </div>
                    </div>
                    
                    <div className="sun-detail-item">
                      <span className="sun-icon"><InfoIcon size={20} /></span>
                      <div className="sun-detail-content">
                        <Tooltip content="The compass direction where the sun is located (0° = North, 90° = East, 180° = South, 270° = West)">
                          <span className="sun-label">Direction</span>
                        </Tooltip>
                        <span className="sun-value">{sunPosition ? getCompassDirection(sunPosition.azimuthDegrees) : 'N/A'} ({sunPosition ? Math.round(sunPosition.azimuthDegrees) : 0}°)</span>
                      </div>
                    </div>
                    
                    <div className="sun-detail-item">
                      <span className="sun-icon"><ChartIcon size={20} /></span>
                      <div className="sun-detail-content">
                        <Tooltip content="The sun's angle above the horizon (0° = horizon, 90° = directly overhead). Negative values indicate the sun is below the horizon.">
                          <span className="sun-label">Elevation</span>
                        </Tooltip>
                        <span className="sun-value">{sunPosition ? Math.round(sunPosition.altitudeDegrees) : 0}°</span>
                      </div>
                    </div>

                    {sunPosition && sunPosition.altitudeDegrees < 0 && (
                      <div className="night-game">
                        <span className="night-icon"><MoonIcon size={20} /></span>
                        <span>This is a night game - sun will not be a factor</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <SunExposureExplanation />

            <div className="section-overview">
              <div className="overview-stats">
                <div className="stat-item">
                  <span className="stat-number">{detailedSections.length}</span>
                  <span className="stat-label">Total Sections</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{filteredSections.length}</span>
                  <span className="stat-label">Matching Filters</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{filteredSections.filter(s => s.inSun).length}</span>
                  <span className="stat-label">In Sun</span>
                </div>
                <div className="stat-item stadium-guide-link">
                  <Link href={`/stadium/${selectedStadium.id}`}>
                    View Full Stadium Guide →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="filter-and-sections-container">
              <EnhancedSunFilter 
                onFilterChange={handleFilterChange}
                disabled={loadingSections}
                isMobile={window.innerWidth < 768}
              />
              <SectionList 
                sections={filteredSections}
                loading={loadingSections}
                calculationProgress={null}
              />
            </div>

            <div className="recommendations">
              <h3><InfoIcon size={20} /> Smart Seating Recommendations</h3>
              <div className="recommendations-content">
                {!sunPosition ? (
                  <div className="recommendation-item">
                    <p>Calculating sun position...</p>
                  </div>
                ) : sunPosition.altitudeDegrees < 0 ? (
                  <div className="recommendation-item night">
                    <span className="rec-icon"><MoonIcon size={24} /></span>
                    <div className="rec-content">
                      <h4>Night Game</h4>
                      <p>Since this is a night game, sun exposure won't be a concern for any seats. Focus on other factors like sightlines and amenities.</p>
                    </div>
                  </div>
                ) : selectedStadium && selectedStadium.roof === 'fixed' ? (
                  <div className="recommendation-item covered">
                    <span className="rec-icon"><StadiumIcon size={24} /></span>
                    <div className="rec-content">
                      <h4>Covered Stadium</h4>
                      <p>This stadium has a fixed roof, so all seats are protected from direct sunlight and weather.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="recommendation-item shade">
                      <span className="rec-icon"><ShadeIcon size={24} /></span>
                      <div className="rec-content">
                        <h4>To Avoid Sun</h4>
                        <p>Choose seats on the <strong>{
                          sunPosition && sunPosition.azimuthDegrees > 180 ? 'first base side' : 'third base side'
                        }</strong> for minimal sun time. Look for sections with 0-25% sun exposure. {selectedStadium && selectedStadium.roof === 'retractable' && 'The retractable roof may also provide coverage.'}</p>
                      </div>
                    </div>

                    <div className="recommendation-item sun">
                      <span className="rec-icon"><SunIcon size={24} /></span>
                      <div className="rec-content">
                        <h4>For Sun Lovers</h4>
                        <p>Seats in <strong>{
                          sunPosition && (sunPosition.azimuthDegrees < 90 || sunPosition.azimuthDegrees > 270) ? 'right field' : 'left field'
                        }</strong> will be in sun for most of the game. Look for 75-100% exposure sections.</p>
                      </div>
                    </div>

                    {sunPosition && sunPosition.altitudeDegrees > 60 && (
                      <div className="recommendation-item high-sun">
                        <span className="rec-icon"><PartlyCloudyIcon size={24} /></span>
                        <div className="rec-content">
                          <h4>High Sun</h4>
                          <p>With the sun high in the sky, upper deck seats may provide more shade from overhangs.</p>
                        </div>
                      </div>
                    )}

                    {weatherForecast && (
                      <div className="recommendation-item weather">
                        <span className="rec-icon"><RainIcon size={24} /></span>
                        <div className="rec-content">
                          <h4>Weather Considerations</h4>
                          <p>{weatherApi.getWeatherImpactOnSun(weatherApi.getWeatherForTime(weatherForecast, gameDateTime || undefined)).recommendation}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedGame && (
                  <div className="game-info">
                    <h4><ChartIcon size={20} /> Game Details</h4>
                    <p><strong>Matchup:</strong> {
                      'teams' in selectedGame 
                        ? `${selectedGame.teams.away.team.name} @ ${selectedGame.teams.home.team.name}`
                        : `${(selectedGame as NFLGame).awayTeam.name} @ ${(selectedGame as NFLGame).homeTeam.name}`
                    }</p>
                    <p><strong>Venue:</strong> {selectedGame.venue.name}</p>
                    <p><strong>Game Time:</strong> {selectedStadium && gameDateTime ? formatDateTimeWithTimezone(gameDateTime, selectedStadium.timezone) : gameDateTime?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </main>
      ) : (
        <Suspense fallback={<LoadingSpinner size="large" message="Loading Smart Itineraries..." fullScreen />}>
          <SmartItinerariesPage
            selectedStadium={selectedStadium}
            selectedGame={selectedGame}
            gameDateTime={gameDateTime}
            weatherForecast={weatherForecast}
            selectedSectionId={filteredSections.length > 0 ? filteredSections[0].section.id : undefined}
            onStadiumChange={handleStadiumChange}
            onGameSelect={handleGameSelect}
          />
        </Suspense>
      )}

      {/* PWA Install Toast disabled */}
      {/* <PWAInstallToast /> */}

      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-section guides-section">
            <h4>Shade Guides</h4>
            <ul>
              <li><Link href="/guide/how-to-find-shaded-seats">How to Find Shaded Seats</Link></li>
              <li><Link href="/guide/best-shaded-seats-mlb">Best Shaded Seats at Every Stadium</Link></li>
              <li><Link href="/guide/avoid-sun-baseball-games">How to Avoid Sun at Games</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/guide">View All Guides →</Link></li>
            </ul>
          </div>
          
          <div className="disclaimer">
            <p>Sun calculations are approximate and may vary based on stadium architecture and weather conditions.</p>
          </div>
          
          <div className="data-sources">
            <h4>Data Sources</h4>
            <ul>
              <li><strong>Game Schedules:</strong> <a href="https://statsapi.mlb.com" target="_blank" rel="noopener noreferrer">MLB Stats API</a></li>
              <li><strong>Weather Data:</strong> <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo.com</a></li>
              <li><strong>Stadium Information:</strong> Compiled from publicly available MLB resources</li>
              <li><strong>Astronomical Calculations:</strong> Based on standard solar position algorithms</li>
              <li><strong>Timezone Data:</strong> <a href="https://www.iana.org/time-zones" target="_blank" rel="noopener noreferrer">IANA Time Zone Database</a></li>
            </ul>
          </div>
          
          <div className="attribution">
            <p>Built with <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a> and <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a></p>
            <p>All APIs used within their terms of service with appropriate rate limiting and caching.</p>
            <p className="legal-links">
              <Link href="/privacy">Privacy Policy</Link> • <Link href="/terms">Terms of Service</Link>
            </p>
            <p>© {new Date().getFullYear()} The Shadium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  // Check if the device is mobile based on viewport width
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false; // Default to desktop during SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use mobile-first design for mobile devices
  if (isMobile) {
    return (
      <HelmetProvider>
        <ErrorBoundary>
          <I18nProvider>
            <ErrorProvider>
              <MobileApp />
            </ErrorProvider>
          </I18nProvider>
        </ErrorBoundary>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <I18nProvider>
          <ErrorProvider>
              <AppContent />
          </ErrorProvider>
        </I18nProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;