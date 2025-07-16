import React, { useState, useEffect, useCallback } from 'react';
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
import { SmartItinerariesPage } from './components/SmartItinerariesPage';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import { I18nProvider } from './i18n/i18nContext';
import { getSunPosition, getSunDescription, getCompassDirection, calculateDetailedSectionSunExposure, filterSectionsBySunExposure, SeatingSectionSun } from './utils/sunCalculations';
import { MLBGame } from './services/mlbApi';
import { WeatherForecast, weatherApi } from './services/weatherApi';
import { formatDateTimeWithTimezone } from './utils/timeUtils';

function AppContent() {
  const { currentProfile, updatePreferences, trackStadiumView } = useUserProfile();
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [selectedGame, setSelectedGame] = useState<MLBGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [sunPosition, setSunPosition] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [detailedSections, setDetailedSections] = useState<SeatingSectionSun[]>([]);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [loadingSections, setLoadingSections] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'itinerary'>('tracker');
  const { showError } = useError();

  // Load preferences and URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
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
            console.error('Invalid datetime parameter:', error);
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
      console.error('Error loading weather forecast:', error);
      setWeatherForecast(null);
      showError(
        'Unable to load weather forecast. Sun calculations will continue without weather data.',
        'warning'
      );
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedStadium, showError]);

  // Calculate sun and section data when stadium, time, or weather changes
  useEffect(() => {
    if (selectedStadium && gameDateTime) {
      setLoadingSections(true);
      
      try {
        // Calculate sun position
        const position = getSunPosition(gameDateTime, selectedStadium.latitude, selectedStadium.longitude);
        setSunPosition(position);
        
        // Get weather data for calculations
        const gameWeather = weatherForecast ? weatherApi.getWeatherForTime(weatherForecast, gameDateTime) : undefined;
        console.log('Game weather for sun calculations:', gameWeather ? {
          cloudCover: gameWeather.cloudCover,
          conditions: gameWeather.conditions[0]?.main,
          precipitationProbability: gameWeather.precipitationProbability,
          temperature: gameWeather.temperature
        } : 'No weather data');

        // Calculate detailed section data with weather impact
        const detailedSectionData = calculateDetailedSectionSunExposure(selectedStadium, position, gameWeather);
        
        console.log('Detailed sections calculated:', detailedSectionData.length);
        setDetailedSections(detailedSectionData);
        
        // Apply current filter
        const filtered = filterSectionsBySunExposure(detailedSectionData, filterCriteria);
        console.log('Filtered sections:', filtered.length);
        setFilteredSections(filtered);
        
      } catch (error) {
        console.error('Error calculating sun exposure:', error);
        showError(
          'Unable to calculate sun exposure for stadium sections. Please try again.',
          'error'
        );
      } finally {
        setLoadingSections(false);
      }
    }
  }, [selectedStadium, gameDateTime, weatherForecast, filterCriteria, showError]);

  // Load weather forecast when stadium changes
  useEffect(() => {
    if (selectedStadium) {
      loadWeatherForecast();
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
  };

  const handleGameSelect = (game: MLBGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);
  };

  const handleStadiumChange = (stadium: Stadium | null) => {
    setSelectedStadium(stadium);
    setSelectedGame(null);
    setGameDateTime(null);
    setWeatherForecast(null);
    setSunPosition(null);
    setDetailedSections([]);
    setFilteredSections([]);
    setFilterCriteria({});
    
    // Save selected stadium to user profile and track view
    if (stadium) {
      updatePreferences({ selectedStadiumId: stadium.id });
      trackStadiumView(stadium.id);
    } else {
      updatePreferences({ selectedStadiumId: undefined });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <h1>MLB Stadium Sun Tracker</h1>
            <p>Find optimal seats and plan your perfect ballpark experience</p>
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
      
      {/* Debug info */}
      <div style={{ background: 'yellow', padding: '10px', textAlign: 'center' }}>
        DEBUG: Current tab is "{activeTab}". Navigation should be visible above.
      </div>

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
          />

        {!selectedStadium && (
          <EmptyState 
            type="no-stadium"
            action={
              <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                💡 Choose from 30 MLB stadiums to analyze sun exposure patterns
              </p>
            }
          />
        )}

        {selectedStadium && !gameDateTime && (
          <EmptyState 
            type="no-game"
            action={
              <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                🎯 Pick a real game or set any custom date and time
              </p>
            }
          />
        )}

        {selectedStadium && gameDateTime && (
          <div className="results">
            <div className="weather-info-section">
              {weatherForecast && (
                <WeatherDisplay 
                  weather={weatherForecast} 
                  gameTime={gameDateTime}
                  loading={loadingWeather}
                  stadium={selectedStadium}
                />
              )}

              {sunPosition && (
                <div className="sun-info">
                  <h3>Sun Information</h3>
                  <div className="sun-details">
                    <div className="sun-detail-item">
                      <span className="sun-icon">☀️</span>
                      <div className="sun-detail-content">
                        <span className="sun-label">Condition</span>
                        <span className="sun-value">{getSunDescription(sunPosition)}</span>
                      </div>
                    </div>
                    
                    <div className="sun-detail-item">
                      <span className="sun-icon">🧭</span>
                      <div className="sun-detail-content">
                        <Tooltip content="The compass direction where the sun is located (0° = North, 90° = East, 180° = South, 270° = West)">
                          <span className="sun-label">Direction</span>
                        </Tooltip>
                        <span className="sun-value">{sunPosition ? getCompassDirection(sunPosition.azimuthDegrees) : 'N/A'} ({sunPosition ? Math.round(sunPosition.azimuthDegrees) : 0}°)</span>
                      </div>
                    </div>
                    
                    <div className="sun-detail-item">
                      <span className="sun-icon">📐</span>
                      <div className="sun-detail-content">
                        <Tooltip content="The sun's angle above the horizon (0° = horizon, 90° = directly overhead). Negative values indicate the sun is below the horizon.">
                          <span className="sun-label">Elevation</span>
                        </Tooltip>
                        <span className="sun-value">{sunPosition ? Math.round(sunPosition.altitudeDegrees) : 0}°</span>
                      </div>
                    </div>

                    {sunPosition && sunPosition.altitudeDegrees < 0 && (
                      <div className="night-game">
                        <span className="night-icon">🌙</span>
                        <span>This is a night game - sun will not be a factor</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="filter-section">
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
                </div>
              </div>
              
              <SunExposureFilterFixed 
                onFilterChange={handleFilterChange}
                disabled={loadingSections}
              />
              <SectionList 
                sections={filteredSections}
                loading={loadingSections}
              />
            </div>

            <div className="recommendations">
              <h3>🎯 Smart Seating Recommendations</h3>
              <div className="recommendations-content">
                {sunPosition && sunPosition.altitudeDegrees < 0 ? (
                  <div className="recommendation-item night">
                    <span className="rec-icon">🌙</span>
                    <div className="rec-content">
                      <h4>Night Game</h4>
                      <p>Since this is a night game, sun exposure won't be a concern for any seats. Focus on other factors like sightlines and amenities.</p>
                    </div>
                  </div>
                ) : selectedStadium.roof === 'fixed' ? (
                  <div className="recommendation-item covered">
                    <span className="rec-icon">🏟️</span>
                    <div className="rec-content">
                      <h4>Covered Stadium</h4>
                      <p>This stadium has a fixed roof, so all seats are protected from direct sunlight and weather.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="recommendation-item shade">
                      <span className="rec-icon">🏛️</span>
                      <div className="rec-content">
                        <h4>To Avoid Sun</h4>
                        <p>Choose seats on the <strong>{
                          sunPosition && sunPosition.azimuthDegrees > 180 ? 'first base side' : 'third base side'
                        }</strong> or in shaded sections. {selectedStadium.roof === 'retractable' && 'The retractable roof may also provide coverage.'}</p>
                      </div>
                    </div>

                    <div className="recommendation-item sun">
                      <span className="rec-icon">☀️</span>
                      <div className="rec-content">
                        <h4>For Sun Lovers</h4>
                        <p>Seats in <strong>{
                          sunPosition && (sunPosition.azimuthDegrees < 90 || sunPosition.azimuthDegrees > 270) ? 'right field' : 'left field'
                        }</strong> will likely have the most sun exposure.</p>
                      </div>
                    </div>

                    {sunPosition && sunPosition.altitudeDegrees > 60 && (
                      <div className="recommendation-item high-sun">
                        <span className="rec-icon">🌤️</span>
                        <div className="rec-content">
                          <h4>High Sun</h4>
                          <p>With the sun high in the sky, upper deck seats may provide more shade from overhangs.</p>
                        </div>
                      </div>
                    )}

                    {weatherForecast && (
                      <div className="recommendation-item weather">
                        <span className="rec-icon">🌦️</span>
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
                    <h4>📊 Game Details</h4>
                    <p><strong>Matchup:</strong> {selectedGame.teams.away.team.name} @ {selectedGame.teams.home.team.name}</p>
                    <p><strong>Venue:</strong> {selectedGame.venue.name}</p>
                    <p><strong>Game Time:</strong> {selectedStadium ? formatDateTimeWithTimezone(gameDateTime, selectedStadium.timezone) : gameDateTime.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </main>
      ) : (
        <SmartItinerariesPage
          selectedStadium={selectedStadium}
          selectedGame={selectedGame}
          gameDateTime={gameDateTime}
          weatherForecast={weatherForecast}
          selectedSectionId={filteredSections.length > 0 ? filteredSections[0].section.id : undefined}
        />
      )}

      <footer className="App-footer">
        <div className="footer-content">
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
  return (
    <I18nProvider>
      <ErrorProvider>
        <UserProfileProvider>
          <AppContent />
        </UserProfileProvider>
      </ErrorProvider>
    </I18nProvider>
  );
}

export default App;