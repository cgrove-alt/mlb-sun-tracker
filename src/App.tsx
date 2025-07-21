import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import { MLB_STADIUMS, Stadium } from './data/stadiums';
import { GameSelector } from './components/GameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SunExposureFilterFixed, SunFilterCriteria } from './components/SunExposureFilterFixed';
import { SectionList } from './components/SectionList';
import { EmptyState } from './components/EmptyStates';
import { ErrorProvider, useError } from './components/ErrorNotification';
import { Breadcrumb } from './components/Breadcrumb';
import { Tooltip } from './components/Tooltip';
import { ShareButton } from './components/ShareButton';
import { UserProfileMenu } from './components/UserProfileMenu';
import { FavoriteButton } from './components/FavoriteButton';
import { Navigation } from './components/Navigation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useSunCalculations } from './hooks/useSunCalculations';
import { SunIcon, CloudIcon, ChartIcon, InfoIcon, MoonIcon, StadiumIcon, ShadeIcon, PartlyCloudyIcon, RainIcon } from './components/Icons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOHelmet } from './components/SEOHelmet';
import MobileApp from './MobileApp';

const SmartItinerariesPage = lazy(() => import('./components/SmartItinerariesPage').then(module => ({ default: module.SmartItinerariesPage })));
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import { I18nProvider, useTranslation } from './i18n/i18nContext';
import { getSunPosition, getSunDescription, getCompassDirection, calculateDetailedSectionSunExposure, calculateEnhancedSectionSunExposure, filterSectionsBySunExposure, SeatingSectionSun, calculateGameSunExposure } from './utils/sunCalculations';
import { getStadiumSections } from './data/stadiumSections';
import { MLBGame, mlbApi } from './services/mlbApi';
import { WeatherForecast, weatherApi } from './services/weatherApi';
import { formatDateTimeWithTimezone } from './utils/timeUtils';
import { performanceMonitor, trackWebVitals } from './utils/performanceMonitor';
import { OfflineIndicator } from './components/OfflineIndicator';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import { trackStadiumSelection, trackGameSelection, trackFilterUsage } from './utils/analytics';

function AppContent() {
  const { currentProfile, updatePreferences, trackStadiumView } = useUserProfile();
  const { t } = useTranslation();
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [selectedGame, setSelectedGame] = useState<MLBGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [stadiumGames, setStadiumGames] = useState<MLBGame[]>([]);
  const [sunPosition, setSunPosition] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [detailedSections, setDetailedSections] = useState<SeatingSectionSun[]>([]);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [gameExposureData, setGameExposureData] = useState<Map<string, number> | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [loadingSections, setLoadingSections] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState<{completed: number, total: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'itinerary'>('tracker');
  const { showError } = useError();
  const { calculateSunPosition, calculateSectionExposures } = useSunCalculations();

  // Load preferences and URL parameters on component mount
  // Initialize performance monitoring and service worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackWebVitals();
      
      // Register service worker
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
      
      // Log performance report every 30 seconds in development
      if (process.env.NODE_ENV === 'development') {
        const interval = setInterval(() => {
          performanceMonitor.logReport();
        }, 30000);
        
        return () => clearInterval(interval);
      }
    }
  }, []);

  useEffect(() => {
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
    } else {
      // Fall back to profile preferences if no URL parameters
      if (preferences.selectedStadiumId) {
        const stadium = MLB_STADIUMS.find(s => s.id === preferences.selectedStadiumId);
        if (stadium) {
          setSelectedStadium(stadium);
        }
      }
    }
    
    // Restore filter criteria (unless overridden by URL)
    if (preferences.filterCriteria) {
      setFilterCriteria(preferences.filterCriteria);
    }
  }, [currentProfile]);

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
      showError(
        'Unable to load weather forecast. Sun calculations will continue without weather data.',
        'warning'
      );
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedStadium, showError]);

  // Load games when stadium is selected
  const loadGames = useCallback(async () => {
    if (!selectedStadium) {
      setStadiumGames([]);
      return;
    }
    
    try {
      const allGames = await mlbApi.getSchedule();
      const homeGames = mlbApi.getHomeGamesForStadium(selectedStadium.id, allGames);
      setStadiumGames(homeGames);
    } catch (error) {
      console.error('Error loading games:', error);
      setStadiumGames([]);
    }
  }, [selectedStadium]);

  // Load games when stadium changes
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Calculate sun and section data when stadium, time, or weather changes
  useEffect(() => {
    // Exit early if no stadium or game time
    if (!selectedStadium || !gameDateTime) {
      setDetailedSections([]);
      setFilteredSections([]);
      setSunPosition(null);
      return;
    }
    
    setLoadingSections(true);
    
    // Use an abort controller to cancel if dependencies change
    const abortController = new AbortController();
    
    const calculateSunData = async () => {
      // Check if aborted
      if (abortController.signal.aborted) return;
      
      try {
          // Calculate sun position using Web Worker
          const position = await calculateSunPosition(
            gameDateTime,
            selectedStadium.latitude,
            selectedStadium.longitude
          );
          
          // Convert worker response format to match existing format
          const formattedPosition = {
            altitudeDegrees: position.altitude,
            azimuthDegrees: position.azimuth,
            altitude: position.altitude * Math.PI / 180,
            azimuth: position.azimuth * Math.PI / 180
          };
          setSunPosition(formattedPosition);
          
          // Get weather data for calculations
          let gameWeather;
          if (weatherForecast) {
            const weatherData = weatherApi.getWeatherForTime(weatherForecast, gameDateTime);
            // Only use weather data if it's actually available for the game time
            gameWeather = weatherData.isForecastAvailable !== false ? weatherData : undefined;
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Game weather for sun calculations:', {
              gameDateTime: gameDateTime.toISOString(),
              hasWeatherForecast: !!weatherForecast,
              weatherData: gameWeather ? {
                cloudCover: gameWeather.cloudCover,
                conditions: gameWeather.conditions[0]?.main,
                precipitationProbability: gameWeather.precipitationProbability,
                temperature: gameWeather.temperature,
                time: gameWeather.time,
                isForecastAvailable: gameWeather.isForecastAvailable
              } : 'No weather data available for this date'
            });
          }

          // Get sections and calculate
          const sections = getStadiumSections(selectedStadium.id);
          let detailedSectionData;
          
          try {
            // Try Web Worker first
            const workerSections = await calculateSectionExposures(
              sections,
              position,
              selectedStadium.orientation,
              gameWeather,
              (completed, total) => {
                setCalculationProgress({ completed, total });
              }
            );
            
            // Format results to match expected SeatingSectionSun structure
            detailedSectionData = workerSections.map(ws => {
              // Extract section properties (everything except inSun and sunExposure)
              const { inSun, sunExposure, ...sectionProps } = ws;
              return {
                section: sectionProps,
                inSun: inSun,
                sunExposure: sunExposure
              };
            });
          } catch (workerError) {
            console.error('Worker calculation failed, using fallback:', workerError);
            // Fallback to synchronous calculation
            detailedSectionData = selectedStadium.roofHeight 
              ? calculateEnhancedSectionSunExposure(selectedStadium, gameDateTime, gameWeather)
              : calculateDetailedSectionSunExposure(selectedStadium, formattedPosition, gameWeather);
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Detailed sections calculated:', detailedSectionData.length);
          }
          
          // Calculate game-long sun exposure if using enhanced calculator
          if (selectedStadium.roofHeight && selectedGame) {
            const gameExposure = calculateGameSunExposure(selectedStadium, gameDateTime, 3);
            console.log('Game sun exposure calculated:', gameExposure);
            setGameExposureData(gameExposure);
          } else {
            setGameExposureData(null);
          }
          setDetailedSections(detailedSectionData);
          setCalculationProgress(null);
          
          // Apply current filter
          const filtered = filterSectionsBySunExposure(detailedSectionData, filterCriteria);
          console.log('Filtered sections:', filtered.length);
          setFilteredSections(filtered);
          
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.error('Error calculating sun exposure:', error);
            showError(
              'Unable to calculate sun exposure for stadium sections. Please try again.',
              'error'
            );
          }
        } finally {
          if (!abortController.signal.aborted) {
            setLoadingSections(false);
          }
        }
      };
      
      calculateSunData();
      
    // Cleanup function to abort if dependencies change
    return () => {
      abortController.abort();
    };
  }, [selectedStadium, gameDateTime, filterCriteria, showError, calculateSunPosition, calculateSectionExposures]);

  // Load weather forecast when stadium changes
  useEffect(() => {
    if (selectedStadium) {
      // Add a small delay to prevent rapid updates
      const timeoutId = setTimeout(() => {
        loadWeatherForecast();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedStadium, loadWeatherForecast]);

  // Update filtered sections when filter criteria changes
  useEffect(() => {
    if (detailedSections.length > 0) {
      const filtered = filterSectionsBySunExposure(detailedSections, filterCriteria);
      setFilteredSections(filtered);
    }
  }, [detailedSections, filterCriteria]);

  const handleFilterChange = (criteria: SunFilterCriteria) => {
    setFilterCriteria(criteria);
    // Save filter criteria to user profile
    updatePreferences({ filterCriteria: criteria });
    
    // Track filter usage
    if (criteria.sunPreference) {
      trackFilterUsage('sun_preference', criteria.sunPreference);
    }
    if (criteria.maxSunExposure !== undefined) {
      trackFilterUsage('max_sun_exposure', criteria.maxSunExposure.toString());
    }
  };

  const handleGameSelect = (game: MLBGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);
    
    // Track game selection
    if (game && selectedStadium && dateTime) {
      trackGameSelection(selectedStadium.name, dateTime.toISOString());
    }
  };

  const handleStadiumChange = useCallback((stadium: Stadium | null) => {
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
    setCalculationProgress(null);
    
    // Save selected stadium to user profile and track view
    if (stadium) {
      updatePreferences({ selectedStadiumId: stadium.id });
      trackStadiumView(stadium.id);
      // Track analytics
      trackStadiumSelection(stadium.name);
    } else {
      updatePreferences({ selectedStadiumId: undefined });
    }
  }, [updatePreferences, trackStadiumView]);

  return (
    <div className="App">
      <SEOHelmet 
        stadium={selectedStadium} 
        game={selectedGame}
        pageType={selectedGame ? 'game' : selectedStadium ? 'stadium' : 'home'}
        shadedSectionsCount={filteredSections.filter(s => !s.inSun).length}
      />
      <OfflineIndicator />
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{t('app.title')}</h1>
            <p>{t('app.subtitle')}</p>
            {selectedStadium && gameDateTime && (
              <div className="quick-summary">
                <span className="stadium-name">{selectedStadium.name}</span>
                <FavoriteButton
                  stadiumId={selectedStadium.id}
                  stadiumName={selectedStadium.name}
                  size="small"
                />
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
          <UserProfileMenu />
        </div>
      </header>

      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {activeTab === 'tracker' ? (
        <main className="App-main">
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
            stadiums={MLB_STADIUMS}
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
                  <a 
                    href={`/stadium/${selectedStadium.id}`}
                    style={{
                      color: '#2196f3',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    View {selectedStadium.name} Shade Guide →
                  </a>
                </div>
              }
            />
          </>
        )}

        {selectedStadium && gameDateTime && (
          <div className="results">
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
                  <a href={`/stadium/${selectedStadium.id}`}>
                    View Full Stadium Guide →
                  </a>
                </div>
              </div>
            </div>
            
            <div className="filter-and-sections-container">
              <SunExposureFilterFixed 
                onFilterChange={handleFilterChange}
                disabled={loadingSections}
              />
              <SectionList 
                sections={filteredSections}
                loading={loadingSections}
                calculationProgress={calculationProgress}
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
                        }</strong> or in shaded sections. {selectedStadium && selectedStadium.roof === 'retractable' && 'The retractable roof may also provide coverage.'}</p>
                      </div>
                    </div>

                    <div className="recommendation-item sun">
                      <span className="rec-icon"><SunIcon size={24} /></span>
                      <div className="rec-content">
                        <h4>For Sun Lovers</h4>
                        <p>Seats in <strong>{
                          sunPosition && (sunPosition.azimuthDegrees < 90 || sunPosition.azimuthDegrees > 270) ? 'right field' : 'left field'
                        }</strong> will likely have the most sun exposure.</p>
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
                    <p><strong>Matchup:</strong> {selectedGame.teams.away.team.name} @ {selectedGame.teams.home.team.name}</p>
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

      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-section guides-section">
            <h4>Shade Guides</h4>
            <ul>
              <li><a href="/guide/how-to-find-shaded-seats">How to Find Shaded Seats</a></li>
              <li><a href="/guide/best-shaded-seats-mlb">Best Shaded Seats at Every Stadium</a></li>
              <li><a href="/guide/avoid-sun-baseball-games">How to Avoid Sun at Games</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/guide">View All Guides →</a></li>
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
      <ErrorProvider>
        <UserProfileProvider>
          <I18nProvider>
            <ErrorBoundary>
              <MobileApp />
            </ErrorBoundary>
          </I18nProvider>
        </UserProfileProvider>
      </ErrorProvider>
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <I18nProvider>
          <ErrorProvider>
            <UserProfileProvider>
              <AppContent />
            </UserProfileProvider>
          </ErrorProvider>
        </I18nProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;