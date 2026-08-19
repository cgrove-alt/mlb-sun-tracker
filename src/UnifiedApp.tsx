import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import './App.css';
import { UnifiedVenue, ALL_UNIFIED_VENUES, convertToLegacyStadium } from './data/unifiedVenues';
import { UnifiedGameSelector } from './components/UnifiedGameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SectionList } from './components/SectionList';
import { EmptyState } from './components/EmptyStates';
import { ErrorProvider, useError } from './components/ErrorNotification';
// Renamed from './components/Breadcrumb': a file Breadcrumb.tsx and a directory
// Breadcrumb/ both existed, so this specifier resolved to the FILE by extension
// precedence — silently, and the two components have incompatible props (this
// one is the stateful venue/game navigator; Breadcrumb/ takes an items array).
// Deleting either would have swapped implementations without a type error.
import { Breadcrumb } from './components/NavigationBreadcrumb';
import { FidelityNotice } from './components/FidelityNotice';
import { getStadiumDataFidelity, fidelityNote } from './data/stadiumDataFidelity';
import { canPublishVenueSeatShade, canPublishSectionLevelShadeTiers, SECTION_LEVEL_TIER_NOTICE } from './data/stadiumShadeConfidence';
import { LoadingSpinner } from './components/LoadingSpinner';
import { VenueChangeSkeleton } from './components/SkeletonScreens';
import { SunIcon, MoonIcon } from './components/Icons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SunExposureExplanation } from './components/SunExposureExplanation';
import MobileApp from './MobileApp';

import { I18nProvider, useTranslation } from './i18n/i18nContext';
import { getSunPosition, getSunDescription, getCompassDirection, SeatingSectionSun, calculateGameSunExposure } from './utils/sunCalculations';
import { SunCalculator } from './utils/sunCalculator';
import { getStadiumSectionsAsync } from './data/getStadiumSections';
import { getVenueSections } from './data/venueSections';
import { MLBGame } from './services/mlbApi';
import { NFLGame } from './services/nflApi';
import { MiLBGame } from './services/milbApi';
import { WeatherForecast, weatherApi } from './services/weatherApi';
import { OfflineIndicator } from './components/OfflineIndicator';
import { trackStadiumSelection, trackGameSelection } from './utils/analytics';
import { getUnifiedVenueShade, ShadedVenueSection } from './utils/getUnifiedVenueShade';
import { sectionAngleConventionFor } from './utils/bowlGeometry';
import {
  EXPOSURE_TIER_LABEL,
  sectionExposureAtSun,
  sortKeyForExposureTier,
} from './utils/sectionShadeTier';

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
  const [gameExposureData, setGameExposureData] = useState<Map<string, number> | null>(null);
  const [loadingSections, setLoadingSections] = useState(false);
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const [changingVenue, setChangingVenue] = useState(false);
  const { showError } = useError();

  // Convert unified venue to legacy stadium format for compatibility
  const legacyStadium = selectedVenue ? convertToLegacyStadium(selectedVenue) : null;
  const seatShadePublished = selectedVenue
    ? canPublishVenueSeatShade(selectedVenue)
    : false;
  const sectionTiersPublished = selectedVenue
    ? canPublishSectionLevelShadeTiers(selectedVenue)
    : false;

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

        if (!seatShadePublished && !sectionTiersPublished) {
          setDetailedSections([]);
          setShadedSections([]);
          setGameExposureData(null);
          return;
        }

        const sections = selectedVenue.league === 'MLB'
          ? await getStadiumSectionsAsync(selectedVenue.id)
          : getVenueSections(selectedVenue.id);

        if (!seatShadePublished && sectionTiersPublished && selectedVenue.league === 'MLB') {
          const domed = selectedVenue.roof === 'fixed';
          const convention = sectionAngleConventionFor({ sport: 'baseball' });
          const tierSections: SeatingSectionSun[] = sections.map((section) => {
            const { tier } = sectionExposureAtSun(
              section,
              {
                altitudeDegrees: position.altitudeDegrees,
                azimuthDegrees: position.azimuthDegrees,
              },
              selectedVenue.orientation,
              domed,
              convention,
            );
            const sortKey = sortKeyForExposureTier(tier);
            return {
              section,
              sunExposure: sortKey,
              exposureLabel: EXPOSURE_TIER_LABEL[tier],
              inSun: tier === 'full' || tier === 'moderate',
              timeInSun: 0,
              percentageOfGameInSun: sortKey,
            };
          });
          if (isCancelled) return;
          setDetailedSections(tierSections);
          setShadedSections([]);
          setGameExposureData(null);
          return;
        }
        
        if (!seatShadePublished) {
          setDetailedSections([]);
          setShadedSections([]);
          setGameExposureData(null);
          return;
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
            // Stadium-local convention: 0 = 1B, 90 = CF, 180 = 3B, 270 = behind
            // home plate. This mapping used to start `home` at 315–45°, which is
            // the 1B corner, so every section was labelled a quarter-turn wrong.
            const local = ((section.baseAngle % 360) + 360) % 360;
            const side: 'home' | 'first' | 'third' | 'outfield' =
              local >= 315 || local < 45 ? 'first' :
              local < 135 ? 'outfield' :
              local < 225 ? 'third' : 'home';

            // Pass the stadium-LOCAL baseAngle (carried through by the spread)
            // and let SunCalculator convert it with the park's orientation.
            // This used to set `angle: section.baseAngle`, handing a local angle
            // to a field documented as a compass bearing, which discarded every
            // park's orientation.
            const sectionWithGeometry = {
              ...section,
              side,
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
          
          // Calculate game exposure - pass sections to avoid bundling
          const exposureMap = calculateGameSunExposure(legacyStadium!, gameDateTime, gameDuration, sections);
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
  }, [selectedVenue, gameDateTime, selectedGame, weatherForecast]);

  // Load weather forecast when venue AND game time are selected
  useEffect(() => {
    if (selectedVenue && gameDateTime) {
      const timeoutId = setTimeout(() => {
        loadWeatherForecast();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedVenue, gameDateTime, loadWeatherForecast]);

  return (
    <div className="App">
      <OfflineIndicator />
      {/* Duplicate header removed - StickyTopNav in layout.tsx provides global navigation */}

      <div className="App-main">
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

          {/* Honest disclosure for MLB parks whose seating data is templated.
              Gated to MLB — the fidelity classifier is MLB-specific. */}
          {selectedVenue?.league === 'MLB' && (
            <FidelityNotice note={fidelityNote(getStadiumDataFidelity(selectedVenue.id))} />
          )}

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
                      href={`/stadium/${selectedVenue.id}`}
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
                    <h2>
                      Sun Information
                      {selectedVenue?.roofHeight && (
                        <span className="enhanced-indicator" title="Using enhanced shadow calculations with venue geometry">
                          ✨ Enhanced
                        </span>
                      )}
                    </h2>
                    <div className="sun-position">
                      <p>
                        {sunPosition.altitudeDegrees > 0 ? (
                          <>
                            <SunIcon size={20} /> {getSunDescription(sunPosition)} at {sunPosition.altitudeDegrees.toFixed(1)}° elevation
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

              {!seatShadePublished && !sectionTiersPublished && (
                <section
                  role="status"
                  aria-labelledby="desktop-shade-results-paused"
                  style={{
                    margin: '1rem 0',
                    padding: '1rem',
                    border: '1px solid #f5c96a',
                    borderLeft: '4px solid #b45309',
                    borderRadius: '8px',
                    background: '#fffbeb',
                    color: '#78350f',
                  }}
                >
                  <h2 id="desktop-shade-results-paused" style={{ marginTop: 0 }}>Section results paused</h2>
                  <p style={{ marginBottom: 0 }}>Sun position and weather remain available, but section percentages and rankings are withheld until measured stadium geometry passes independent shadow validation.</p>
                </section>
              )}

              {!seatShadePublished && sectionTiersPublished && (
                <section
                  role="note"
                  aria-labelledby="desktop-section-tier-guide"
                  style={{
                    margin: '1rem 0',
                    padding: '1rem',
                    border: '1px solid #cbd5e1',
                    borderLeft: '4px solid #334155',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    color: '#334155',
                  }}
                >
                  <h2 id="desktop-section-tier-guide" style={{ marginTop: 0 }}>Section-level shade guide</h2>
                  <p style={{ marginBottom: '0.5rem' }}>{SECTION_LEVEL_TIER_NOTICE}</p>
                  <p style={{ marginBottom: 0 }}>
                    Sections below show discrete tiers (Shaded / Light sun / Moderate sun / Full sun), not measured percentages.
                    {' '}<Link href={`/stadium/${selectedVenue.id}`}>Open the full interactive diagram →</Link>
                  </p>
                </section>
              )}

              {seatShadePublished && selectedVenue && gameDateTime && detailedSections.length > 0 && (
                <>
                  <SunExposureExplanation />
                </>
              )}

              {(seatShadePublished || sectionTiersPublished) && detailedSections.length > 0 && (
                <SectionList
                  sections={detailedSections}
                  loading={loadingSections}
                  calculationProgress={null}
                  showFilters={true}
                  displayMode={sectionTiersPublished && !seatShadePublished ? 'tier' : 'percent'}
                />
              )}
            </div>
          )}
        </div>
      </div>
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
        <ErrorBoundary>
          <I18nProvider>
            <ErrorProvider>
              <MobileApp />
            </ErrorProvider>
          </I18nProvider>
        </ErrorBoundary>
    );
  }

  return (
      <ErrorBoundary>
        <I18nProvider>
          <ErrorProvider>
            <UnifiedAppContent />
          </ErrorProvider>
        </I18nProvider>
      </ErrorBoundary>
  );
}

export default UnifiedApp;
