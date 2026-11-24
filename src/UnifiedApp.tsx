import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import './App.css';
import { UnifiedVenue, ALL_UNIFIED_VENUES, convertToLegacyStadium } from './data/unifiedVenues';
import { UnifiedGameSelector } from './components/UnifiedGameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { EmptyState } from './components/EmptyStates';
import { ErrorProvider } from './components/ErrorNotification';
// Renamed from './components/Breadcrumb': a file Breadcrumb.tsx and a directory
// Breadcrumb/ both existed, so this specifier resolved to the FILE by extension
// precedence — silently, and the two components have incompatible props (this
// one is the stateful venue/game navigator; Breadcrumb/ takes an items array).
// Deleting either would have swapped implementations without a type error.
import { Breadcrumb } from './components/NavigationBreadcrumb';
import { FidelityNotice } from './components/FidelityNotice';
import { getStadiumDataFidelity, fidelityNote } from './data/stadiumDataFidelity';
import { VenueChangeSkeleton } from './components/SkeletonScreens';
import { SunIcon, MoonIcon } from './components/Icons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShadeAnswer } from './components/ShadeAnswer';
import MobileApp from './MobileApp';

import { I18nProvider, useTranslation } from './i18n/i18nContext';
import { getSunPosition, getSunDescription, getCompassDirection } from './utils/sunCalculations';
import { isFieldAxisMeasured } from './data/nflOrientationMeasurements';
import { MLBGame } from './services/mlbApi';
import { NFLGame } from './services/nflApi';
import { MiLBGame } from './services/milbApi';
import { gameShade } from './utils/shadeSide';
import { nflGameShade } from './utils/nflSunSide';
import { readFinderLink } from './utils/finderLink';
import { WeatherForecast, weatherApi } from './services/weatherApi';
import { OfflineIndicator } from './components/OfflineIndicator';
import { trackStadiumSelection, trackGameSelection } from './utils/analytics';

function UnifiedAppContent() {
  const { t } = useTranslation();
  const [selectedVenue, setSelectedVenue] = useState<UnifiedVenue | null>(null);
  const [selectedGame, setSelectedGame] = useState<MLBGame | MiLBGame | NFLGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [stadiumGames, setStadiumGames] = useState<(MLBGame | MiLBGame | NFLGame)[]>([]);
  const [sunPosition, setSunPosition] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [changingVenue, setChangingVenue] = useState(false);

  // Convert unified venue to legacy stadium format for compatibility
  const legacyStadium = selectedVenue ? convertToLegacyStadium(selectedVenue) : null;
  // MLB ballparks have the game-by-game shade map on their own page. Minor
  // league parks and NFL stadiums have no seating map, so their answer is a side.
  const isMlb = selectedVenue?.league === 'MLB';
  const milbGame = useMemo(
    () => (selectedVenue?.league === 'MiLB' && gameDateTime ? gameShade(selectedVenue, gameDateTime) : undefined),
    [selectedVenue, gameDateTime],
  );
  // Undefined for a fixed roof, or a field whose direction we couldn't measure.
  const nflGame = useMemo(
    () => (selectedVenue?.league === 'NFL' && gameDateTime && selectedVenue.roof !== 'fixed' && isFieldAxisMeasured(selectedVenue.id)
      ? nflGameShade(selectedVenue, gameDateTime)
      : undefined),
    [selectedVenue, gameDateTime],
  );

  // Open the park and time a link names
  useEffect(() => {
    const { venue, dateTime } = readFinderLink(window.location.search);
    if (venue) setSelectedVenue(venue);
    if (dateTime) setGameDateTime(dateTime);
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

  // Work out the sun's position when the venue or time changes
  useEffect(() => {
    if (!selectedVenue || !gameDateTime) {
      setSunPosition(null);
      return;
    }
    const position = getSunPosition(gameDateTime, selectedVenue.latitude, selectedVenue.longitude);
    setSunPosition({
      altitudeDegrees: position.altitudeDegrees,
      azimuthDegrees: position.azimuthDegrees,
      altitude: position.altitude,
      azimuth: position.azimuth,
    });
  }, [selectedVenue, gameDateTime]);

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
                  Choose from MLB, MiLB and NFL venues to see where the sun and shade will be
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
                      Pick a game from the schedule, or set a date and time if yours isn&apos;t listed
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

              {isMlb && (
                <section style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #b5d4f4', borderRadius: '8px', background: '#e6f1fb', color: '#0c447c' }}>
                  <h2 style={{ marginTop: 0 }}>Every section&apos;s shade for this game</h2>
                  <p style={{ marginBottom: 0 }}>
                    <a href={`/stadium/${selectedVenue.id}${selectedGame && 'gamePk' in selectedGame ? `?game=${selectedGame.gamePk}` : ''}`} style={{ color: '#0c447c', fontWeight: 600 }}>
                      See the {selectedVenue.name} shade map
                    </a>{' '}
                    — sun or shade for every section, inning by inning.
                  </p>
                </section>
              )}

              {milbGame && <ShadeAnswer venue={selectedVenue} milbGame={milbGame} />}
              {selectedVenue.league === 'NFL' && <ShadeAnswer venue={selectedVenue} nflGame={nflGame} />}
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
