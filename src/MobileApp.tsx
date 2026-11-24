import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { VENUE_COUNT } from './data/venueCount';
import { Stadium } from './data/stadiums';
import { UnifiedVenue, convertToLegacyStadium } from './data/unifiedVenues';
import { isFieldAxisMeasured } from './data/nflOrientationMeasurements';
import { gameShade } from './utils/shadeSide';
import { nflGameShade } from './utils/nflSunSide';
import { readFinderLink } from './utils/finderLink';
import { MLBGame } from './services/mlbApi';
import { MiLBGame } from './services/milbApi';
import { NFLGame } from './services/nflApi';
import { UnifiedGameSelector } from './components/UnifiedGameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { EmptyState } from './components/EmptyStates';
import { weatherApi } from './services/weatherApi';
import { getSunPosition, getSunDescription, getCompassDirection, type SunPosition } from './utils/sunCalculations';
import { SunIcon, MoonIcon } from './components/Icons';
import { FidelityNotice } from './components/FidelityNotice';
import { ShadeAnswer } from './components/ShadeAnswer';
import { getStadiumDataFidelity, fidelityNote } from './data/stadiumDataFidelity';
import { RateLimiter } from './utils/validation';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [sunPosition, setSunPosition] = useState<SunPosition | null>(null);

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
  }, []);

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

  // Work out the sun's position when a game is selected
  useEffect(() => {
    if (!gameDateTime || !selectedVenue) {
      setSunPosition(null);
      return;
    }
    setSunPosition(getSunPosition(gameDateTime, selectedVenue.latitude, selectedVenue.longitude));
  }, [gameDateTime, selectedVenue]);

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
      setError(null);
    } catch (err) {
      console.error('Error loading weather:', err);
      setWeatherForecast(null);
      // The `error` state existed but nothing ever set it and nothing rendered
      // it, so a failed forecast looked identical to "no weather yet" — the
      // shade numbers silently fell back to clear-sky assumptions with no
      // indication to the user.
      setError('Weather forecast unavailable — shade estimates assume clear skies.');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleVenueChange = useCallback((venue: UnifiedVenue | null) => {
    setSelectedVenue(venue);
    setSelectedGame(null);
    setGameDateTime(null);
  }, []);

  const handleGameSelect = useCallback((game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);
  }, []);


  return (
    <div className="mobile-app">
      {/* Skip links within the finder. "Skip to main content" comes from the layout. */}
      <a href="#venue-selector" className="skip-link">Skip to venue selector</a>
      <a href="#results" className="skip-link">Skip to results</a>
      
      
      <div className="mobile-main">
        <div className="mobile-content">
          {error && (
            <div className="mobile-section" role="alert" aria-live="polite">
              <div className="mobile-error-banner">
                <span aria-hidden="true">⚠️</span> {error}
              </div>
            </div>
          )}

          {/* Unified Venue and Game Selection */}
          <section className="mobile-section" id="venue-selector">
            <UnifiedGameSelector
              selectedVenue={selectedVenue}
              onGameSelect={handleGameSelect}
              onVenueChange={handleVenueChange}
              onGamesLoaded={handleGamesLoaded}
            />
          </section>

          {selectedVenue?.league === 'MLB' && (
            <section className="mobile-section">
              <FidelityNotice note={fidelityNote(getStadiumDataFidelity(selectedVenue.id))} />
            </section>
          )}

          {/* Empty State Info Box */}
          {!selectedVenue && (
            <section className="mobile-section">
              <EmptyState 
                type="no-stadium"
                action={
                  <div style={{textAlign: 'center'}}>
                    <p style={{fontSize: '0.9rem', color: '#666', margin: '0 0 12px 0'}}>
                      Choose from MLB, MiLB and NFL venues to see where the sun and shade will be
                    </p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                      <span style={{padding: '4px 8px', background: '#e3f2fd', borderRadius: '12px', fontSize: '0.8rem', color: '#1976d2'}}>
                        ☀️ Date-specific solar position
                      </span>
                      <span style={{padding: '4px 8px', background: '#f3e5f5', borderRadius: '12px', fontSize: '0.8rem', color: '#7b1fa2'}}>
                        🏟️ {VENUE_COUNT} venues
                      </span>
                      <span style={{padding: '4px 8px', background: '#e8f5e9', borderRadius: '12px', fontSize: '0.8rem', color: '#388e3c'}}>
                        📊 Confidence disclosed
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
                      Pick a game from the schedule, or set a date and time if yours isn&apos;t listed
                    </p>
                  }
                />
              </section>
              
              <section className="mobile-section">
                <div className="mobile-stadium-guide-link">
                  <a href={`/stadium/${selectedVenue.id}`} className="mobile-guide-button">
                    <div>
                      <div className="guide-title">View {selectedVenue.name} Sun Guide</div>
                      <p className="mobile-guide-description">
                        Review solar context, measurement status, and sun-safety tips
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
                          {getSunDescription(sunPosition)}
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
            isMlb ? (
              <section className="mobile-section" id="results">
                <h2 className="mobile-section-title">Every section&apos;s shade for this game</h2>
                <p>
                  <a href={`/stadium/${selectedVenue.id}${selectedGame && 'gamePk' in selectedGame ? `?game=${selectedGame.gamePk}` : ''}`}>
                    See the {selectedVenue.name} shade map
                  </a>{' '}
                  — sun or shade for every section, inning by inning.
                </p>
              </section>
            ) : (
              <section className="mobile-section" id="results">
                <ShadeAnswer venue={selectedVenue} milbGame={milbGame} nflGame={nflGame} />
              </section>
            )
          )}
        </div>
      </div>
      
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
