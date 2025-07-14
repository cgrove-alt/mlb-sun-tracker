import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { MLB_STADIUMS, Stadium } from './data/stadiums';
import { getDetailedStadium } from './data/detailedStadiums';
import { StadiumView } from './components/StadiumView';
import { DetailedStadiumView } from './components/DetailedStadiumView';
import { GameSelector } from './components/GameSelector';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SunExposureFilter, SunFilterCriteria } from './components/SunExposureFilter';
import { SimpleFilter } from './components/SimpleFilter';
import { SunExposureFilterFixed } from './components/SunExposureFilterFixed';
import { SectionList } from './components/SectionList';
import { EmptyState } from './components/EmptyStates';
import { getSunPosition, calculateSunnySections, getSunDescription, getCompassDirection, calculateDetailedSectionSunExposure, filterSectionsBySunExposure, SeatingSectionSun } from './utils/sunCalculations';
import { MLBGame } from './services/mlbApi';
import { WeatherForecast, weatherApi } from './services/weatherApi';

function App() {
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [selectedGame, setSelectedGame] = useState<MLBGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(null);
  const [sunPosition, setSunPosition] = useState<any>(null);
  const [sunnySections, setSunnySections] = useState<Map<string, boolean>>(new Map());
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [detailedSections, setDetailedSections] = useState<SeatingSectionSun[]>([]);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [loadingSections, setLoadingSections] = useState(false);

  const loadWeatherForecast = useCallback(async () => {
    if (!selectedStadium) return;
    
    setLoadingWeather(true);
    try {
      const forecast = await weatherApi.getForecast(selectedStadium.latitude, selectedStadium.longitude);
      setWeatherForecast(forecast);
    } catch (error) {
      console.error('Error loading weather forecast:', error);
      // Show user-friendly message instead of null
      setWeatherForecast(null);
      // Could add a toast notification here
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedStadium]);

  // Calculate sun and section data when stadium, time, or weather changes
  useEffect(() => {
    if (selectedStadium && gameDateTime) {
      setLoadingSections(true);
      
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
      
      // Convert detailed sections to simple Map for stadium visualization
      const sectionsMap = new Map<string, boolean>();
      detailedSectionData.forEach(sectionData => {
        sectionsMap.set(sectionData.section.name, sectionData.inSun);
      });
      setSunnySections(sectionsMap);
      console.log('Detailed sections calculated:', detailedSectionData.length);
      setDetailedSections(detailedSectionData);
      
      // Apply current filter
      const filtered = filterSectionsBySunExposure(detailedSectionData, filterCriteria);
      console.log('Filtered sections:', filtered.length);
      setFilteredSections(filtered);
      
      setLoadingSections(false);
    }
  }, [selectedStadium, gameDateTime, weatherForecast, filterCriteria]);

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
    setSunnySections(new Map());
    setDetailedSections([]);
    setFilteredSections([]);
    setFilterCriteria({});
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MLB Stadium Sun Tracker</h1>
        <p>Find out which seats will be in the sun during baseball games</p>
        {selectedStadium && gameDateTime && (
          <div className="quick-summary">
            <span className="stadium-name">{selectedStadium.name}</span>
            <span className="game-time">{gameDateTime.toLocaleDateString()}</span>
          </div>
        )}
      </header>

      <main className="App-main">
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
            <div className="analysis-grid">
              <div className="sun-weather-info">
                {weatherForecast && (
                  <WeatherDisplay 
                    weather={weatherForecast} 
                    gameTime={gameDateTime}
                    loading={loadingWeather}
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
                          <span className="sun-label">Direction</span>
                          <span className="sun-value">{sunPosition ? getCompassDirection(sunPosition.azimuthDegrees) : 'N/A'} ({sunPosition ? Math.round(sunPosition.azimuthDegrees) : 0}°)</span>
                        </div>
                      </div>
                      
                      <div className="sun-detail-item">
                        <span className="sun-icon">📐</span>
                        <div className="sun-detail-content">
                          <span className="sun-label">Elevation</span>
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

              <div className="stadium-visualization">
                {(() => {
                  const detailedStadium = getDetailedStadium(selectedStadium.id);
                  return detailedStadium ? (
                    <DetailedStadiumView
                      stadium={detailedStadium}
                      sunPosition={sunPosition}
                      sunnySections={sunnySections}
                    />
                  ) : (
                    <StadiumView
                      stadium={selectedStadium}
                      sunPosition={sunPosition}
                      sunnySections={sunnySections}
                    />
                  );
                })()}
              </div>
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
                    <p><strong>Game Time:</strong> {gameDateTime.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Sun calculations are approximate and may vary based on stadium architecture and weather conditions.</p>
        <p>Weather data provided by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo.com</a></p>
      </footer>
    </div>
  );
}

export default App;