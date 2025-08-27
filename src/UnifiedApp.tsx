import React, { useState, useEffect, useCallback } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Link from 'next/link';
import './App.css';
import { UnifiedVenue, ALL_UNIFIED_VENUES, convertToLegacyStadium } from './data/unifiedVenues';
import { UnifiedGameSelector } from './components/UnifiedGameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SunExposureFilterFixed, SunFilterCriteria } from './components/SunExposureFilterFixed';
import { SectionList } from './components/SectionList';
import { EmptyState } from './components/EmptyStates';
import { ErrorProvider, useError } from './components/ErrorNotification';
import { Breadcrumb } from './components/Breadcrumb';
import { ShareButton } from './components/ShareButton';
import { Navigation } from './components/Navigation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { VenueChangeSkeleton } from './components/SkeletonScreens';
import { SunIcon, CloudIcon, ChartIcon, InfoIcon, MoonIcon, StadiumIcon, ShadeIcon, PartlyCloudyIcon, RainIcon } from './components/Icons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOHelmet } from './components/SEOHelmet';
import { SunExposureExplanation } from './components/SunExposureExplanation';
import MobileApp from './MobileApp';

import { I18nProvider, useTranslation } from './i18n/i18nContext';
import { getSunPosition, getSunDescription, getCompassDirection, filterSectionsBySunExposure, SeatingSectionSun, calculateGameSunExposure } from './utils/sunCalculations';
import { SunCalculator } from './utils/sunCalculator';
import { getStadiumSections } from './data/stadiumSections';
import { getVenueSections } from './data/venueSections';
import { MLBGame, mlbApi } from './services/mlbApi';
import { NFLGame } from './services/nflApi';
import { MiLBGame } from './services/milbApi';
import { generateBaseballSections } from './utils/generateBaseballSections';
import { WeatherForecast, weatherApi } from './services/weatherApi';
import { formatDateTimeWithTimezone } from './utils/timeUtils';
import { performanceMonitor, trackWebVitals } from './utils/performanceMonitor';
import { OfflineIndicator } from './components/OfflineIndicator';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import { trackStadiumSelection, trackGameSelection, trackFilterUsage } from './utils/analytics';
import { getUnifiedVenueShade, ShadedVenueSection } from './utils/getUnifiedVenueShade';

function UnifiedAppContent() {
  const { t } = useTranslation();
  const [selectedVenue, setSelectedVenue] = useState<UnifiedVenue | null>(null);
  const [selectedGame, setSelectedGame] = useState<MLBGame | MiLBGame | NFLGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [stadiumGames, setStadiumGames] = useState<(MLBGame | MiLBGame | NFLGame)[]>([]);
  const [sunPosition, setSunPosition] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [detailedSections, setDetailedSections] = useState<SeatingSectionSun[]>([]);
  const [shadedSections, setShadedSections] = useState<ShadedVenueSection[]>([]);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [gameExposureData, setGameExposureData] = useState<Map<string, number> | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [loadingSections, setLoadingSections] = useState(false);
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'itinerary'>('tracker');
  const [changingVenue, setChangingVenue] = useState(false);
  const { showError } = useError();

  // Convert unified venue to legacy stadium format for compatibility
  const legacyStadium = selectedVenue ? convertToLegacyStadium(selectedVenue) : null;

  // Load venue from URL parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const venueParam = urlParams.get('venue');
    const stadiumParam = urlParams.get('stadium');
    const datetimeParam = urlParams.get('datetime');
    
    // Check for venue parameter (for MiLB/NFL venues)
    if (venueParam) {
      const venue = ALL_UNIFIED_VENUES.find(v => v.id === venueParam);
      if (venue) {
        setSelectedVenue(venue);
      }
    }
    // Check for stadium parameter (for MLB stadiums - backward compatibility)
    else if (stadiumParam) {
      const venue = ALL_UNIFIED_VENUES.find(v => v.id === stadiumParam);
      if (venue) {
        setSelectedVenue(venue);
      }
    }
    
    // If datetime is provided, set it
    if (datetimeParam) {
      try {
        const dateTime = new Date(datetimeParam);
        if (!isNaN(dateTime.getTime())) {
          setGameDateTime(dateTime);
        }
      } catch (error) {
        console.error('Invalid datetime parameter:', error);
      }
    }
  }, []); // Only run once on mount

  // Load weather forecast
  const loadWeatherForecast = useCallback(async () => {
    if (!selectedVenue || !gameDateTime) {
      setWeatherForecast(null);
      return;
    }

    setLoadingWeather(true);
    try {
      const forecast = await weatherApi.getForecast(
        selectedVenue.latitude,
        selectedVenue.longitude
      );
      setWeatherForecast(forecast);
    } catch (error) {
      console.error('Error loading weather:', error);
      setWeatherForecast(null);
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedVenue, gameDateTime]);

  // Handle venue change
  const handleVenueChange = (venue: UnifiedVenue | null) => {
    setChangingVenue(true);
    setSelectedVenue(venue);
    
    // Track venue view
    if (venue) {
      trackStadiumSelection(venue.id);
    }
    
    // Clear game data when venue changes
    setSelectedGame(null);
    setGameDateTime(null);
    setSunPosition(null);
    setWeatherForecast(null);
    setDetailedSections([]);
    setShadedSections([]);
    setFilteredSections([]);
    
    setTimeout(() => setChangingVenue(false), 300);
  };

  // Handle game/time selection
  const handleGameSelect = (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);
    
    if (game && selectedVenue) {
      trackGameSelection(selectedVenue.name, new Date(game.gameDate).toISOString());
    }
  };

  // Calculate sun and section data when venue, time, or weather changes
  useEffect(() => {
    if (!selectedVenue || !gameDateTime) {
      setDetailedSections([]);
      setShadedSections([]);
      setFilteredSections([]);
      setSunPosition(null);
      setLoadingSections(false);
      setCalculationInProgress(false);
      return;
    }
    
    let isCancelled = false;
    
    const performCalculation = async () => {
      if (isCancelled || calculationInProgress) return;
      
      setLoadingSections(true);
      setCalculationInProgress(true);
      
      try {
        // Calculate sun position
        const position = getSunPosition(gameDateTime, selectedVenue.latitude, selectedVenue.longitude);
        const formattedPosition = {
          altitudeDegrees: position.altitudeDegrees,
          azimuthDegrees: position.azimuthDegrees,
          altitude: position.altitude,
          azimuth: position.azimuth
        };
        
        if (isCancelled) return;
        setSunPosition(formattedPosition);
        
        // Get sections based on venue type
        let sections: any[] = [];
        if (selectedVenue.league === 'MLB') {
          // Use existing MLB sections
          sections = getStadiumSections(selectedVenue.id);
        } else if (selectedVenue.league === 'MiLB') {
          // Get MiLB sections - will use custom layouts if available
          sections = getVenueSections(selectedVenue.id);
          // Fall back to generated sections if no custom layout
          if (!sections || sections.length === 0) {
            sections = generateBaseballSections(selectedVenue);
          }
        } else {
          // Use generated sections for other sports
          sections = getVenueSections(selectedVenue.id);
        }
        
        // Calculate shade for unified venues
        const shadeResults = getUnifiedVenueShade(
          selectedVenue,
          gameDateTime,
          sections,
          weatherForecast?.current || undefined
        );
        
        if (isCancelled) return;
        setShadedSections(shadeResults);
        
        // Convert to legacy format for compatibility
        if (selectedVenue.league === 'MLB') {
          // For MLB, use existing detailed calculations
          const calculator = new SunCalculator(legacyStadium!);
          const gameDuration = 3;
          
          const detailedSectionData: SeatingSectionSun[] = sections.map((section) => {
            const side: 'home' | 'first' | 'third' | 'outfield' = 
              section.baseAngle >= 315 || section.baseAngle < 45 ? 'home' :
              section.baseAngle >= 45 && section.baseAngle < 135 ? 'first' :
              section.baseAngle >= 135 && section.baseAngle < 225 ? 'third' : 'outfield';
            
            const sectionWithGeometry = {
              ...section,
              side,
              angle: section.baseAngle || 0,
              depth: 50 // Default depth
            };
            
            // Calculate time in sun
            const timeExposure = calculator.calculateTimeInSun(sectionWithGeometry, gameDateTime, gameDuration);
            
            return {
              section,
              sunExposure: Math.round(timeExposure.percentage),
              inSun: timeExposure.percentage > 20,
              timeInSun: timeExposure.totalMinutes,
              percentageOfGameInSun: timeExposure.percentage
            };
          });
          
          if (isCancelled) return;
          
          setDetailedSections(detailedSectionData);
          setFilteredSections(filterSectionsBySunExposure(detailedSectionData, filterCriteria));
          
          // Calculate game exposure
          const exposureMap = calculateGameSunExposure(legacyStadium!, gameDateTime, gameDuration);
          setGameExposureData(exposureMap);
        } else {
          // For non-MLB venues, convert shade results to legacy format
          const convertedSections: SeatingSectionSun[] = shadeResults.map(result => ({
            section: {
              id: result.section.id,
              name: result.section.name,
              level: result.section.level as 'field' | 'lower' | 'club' | 'upper' | 'suite',
              baseAngle: result.section.baseAngle,
              angleSpan: result.section.angleSpan,
              covered: result.section.covered,
              price: result.section.price as 'value' | 'moderate' | 'premium' | 'luxury'
            },
            sunExposure: Math.round(100 - result.shadePercentage),
            inSun: result.isInSun,
            timeInSun: result.isInSun ? 180 : 0,
            percentageOfGameInSun: 100 - result.shadePercentage
          }));
          
          setDetailedSections(convertedSections);
          setFilteredSections(filterSectionsBySunExposure(convertedSections, filterCriteria));
        }
        
      } catch (error) {
        console.error('Error calculating sun exposure:', error);
        showError?.('Error calculating sun exposure. Please try again.', 'error');
      } finally {
        if (!isCancelled) {
          setLoadingSections(false);
          setCalculationInProgress(false);
        }
      }
    };
    
    const timeoutId = setTimeout(performCalculation, 300);
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      setCalculationInProgress(false);
    };
  }, [selectedVenue, gameDateTime, filterCriteria, selectedGame, weatherForecast]);

  // Load weather forecast when venue AND game time are selected
  useEffect(() => {
    if (selectedVenue && gameDateTime) {
      const timeoutId = setTimeout(() => {
        loadWeatherForecast();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedVenue, gameDateTime, loadWeatherForecast]);

  // Update filtered sections when filter criteria changes
  useEffect(() => {
    if (detailedSections.length > 0) {
      const filtered = filterSectionsBySunExposure(detailedSections, filterCriteria);
      setFilteredSections(filtered);
    }
  }, [detailedSections, filterCriteria]);

  const handleFilterChange = (criteria: SunFilterCriteria) => {
    setFilterCriteria(criteria);
    
    if (criteria.sunPreference) {
      trackFilterUsage('sun_preference', criteria.sunPreference);
    }
  };

  return (
    <div className="App">
      <SEOHelmet 
        stadium={legacyStadium} 
        game={selectedGame}
        pageType={selectedGame ? 'game' : selectedVenue ? 'stadium' : 'home'}
        shadedSectionsCount={filteredSections.filter(s => !s.inSun).length}
      />
      <OfflineIndicator />
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{t('app.title')}</h1>
            <p>{t('app.subtitle')}</p>
            {selectedVenue && gameDateTime && (
              <div className="quick-summary">
                <span className="stadium-name">{selectedVenue.name}</span>
                <span className="game-time">
                  {formatDateTimeWithTimezone(gameDateTime, selectedVenue.timezone)}
                </span>
              </div>
            )}
          </div>
          <div className="header-right">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            <ShareButton
              selectedStadium={legacyStadium}
              gameDateTime={gameDateTime}
              selectedGame={selectedGame}
            />
          </div>
        </div>
      </header>
      
      <main className="App-main">
        <div className="sun-tracker-container">
          {changingVenue && (
            <VenueChangeSkeleton venueName={selectedVenue?.name} />
          )}
          
          <Breadcrumb
            selectedStadium={legacyStadium}
            selectedGame={selectedGame}
            gameDateTime={gameDateTime}
            onStadiumChange={(stadium) => {
              // Find the unified venue matching this stadium
              const unifiedVenue = ALL_UNIFIED_VENUES.find(v => v.id === stadium?.id);
              handleVenueChange(unifiedVenue || null);
            }}
            onGameSelect={handleGameSelect}
          />
          
          <UnifiedGameSelector
            selectedVenue={selectedVenue}
            onGameSelect={handleGameSelect}
            onVenueChange={handleVenueChange}
            onGamesLoaded={setStadiumGames}
          />

          {!selectedVenue && (
            <EmptyState 
              type="no-stadium"
              action={
                <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                  Choose from MLB and NFL venues to analyze sun exposure patterns
                </p>
              }
            />
          )}

          {selectedVenue && !gameDateTime && (
            <>
              <EmptyState 
                type="no-game"
                action={
                  <div style={{textAlign: 'center'}}>
                    <p style={{fontSize: '0.9rem', color: '#666', margin: '0 0 1rem 0'}}>
                      {selectedVenue.league === 'MLB' 
                        ? 'Pick a real game or set any custom date and time'
                        : 'Set a custom date and time for shade calculations'
                      }
                    </p>
                    <Link 
                      href={`/venue/${selectedVenue.id}`}
                      style={{
                        color: '#2196f3',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                      }}
                    >
                      View {selectedVenue.name} Shade Guide →
                    </Link>
                  </div>
                }
              />
            </>
          )}

          {selectedVenue && gameDateTime && (
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
                  <p style={{marginTop: '1rem', color: '#666'}}>Calculating sun exposure for {selectedVenue.name}...</p>
                  <p style={{fontSize: '0.875rem', color: '#999'}}>This may take a moment for large venues</p>
                </div>
              )}
              
              <div className="weather-info-section">
                {weatherForecast && (
                  <WeatherDisplay 
                    key={`weather-${gameDateTime?.toISOString() || 'no-game'}`}
                    weather={weatherForecast} 
                    gameTime={gameDateTime}
                    loading={loadingWeather}
                    stadium={legacyStadium!}
                  />
                )}

                {sunPosition && (
                  <div className="sun-info">
                    <h3>
                      Sun Information
                      {selectedVenue?.roofHeight && (
                        <span className="enhanced-indicator" title="Using enhanced shadow calculations with venue geometry">
                          ✨ Enhanced
                        </span>
                      )}
                    </h3>
                    <div className="sun-position">
                      <p>
                        {sunPosition.altitudeDegrees > 0 ? (
                          <>
                            <SunIcon size={20} /> Sun is {getSunDescription(sunPosition.altitudeDegrees)} 
                            at {sunPosition.altitudeDegrees.toFixed(1)}° elevation
                          </>
                        ) : (
                          <>
                            <MoonIcon size={20} /> Sun is below horizon (night game)
                          </>
                        )}
                      </p>
                      {sunPosition.altitudeDegrees > 0 && (
                        <p>
                          Direction: {getCompassDirection(sunPosition.azimuthDegrees)} ({sunPosition.azimuthDegrees.toFixed(1)}°)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {sunPosition && sunPosition.altitudeDegrees > 0 && (
                <>
                  <SunExposureFilterFixed
                    onFilterChange={handleFilterChange}
                  />
                  
                  <SunExposureExplanation />
                </>
              )}

              {filteredSections.length > 0 && (
                <SectionList 
                  sections={filteredSections}
                  loading={loadingSections}
                  calculationProgress={null}
                />
              )}

              {filteredSections.length === 0 && detailedSections.length > 0 && (
                <EmptyState 
                  type="no-sections"
                  action={
                    <button 
                      onClick={() => setFilterCriteria({})}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear Filters
                    </button>
                  }
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function UnifiedApp() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <UnifiedAppContent />
          </ErrorProvider>
        </I18nProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default UnifiedApp;