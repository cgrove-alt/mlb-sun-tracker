import React, { useState, useEffect, useCallback } from 'react';
import { Stadium, MLB_STADIUMS } from './data/stadiums';
import { getStadiumSections } from './data/stadiumSections';
import { MLBGame } from './services/mlbApi';
import { SeatingSectionSun } from './utils/sunCalculations';
import { MobileHeader } from './components/MobileHeader';
import { MobileStadiumSelector } from './components/MobileStadiumSelector';
import { MobileGameScheduler } from './components/MobileGameScheduler';
import { MobileFilterSheet } from './components/MobileFilterSheet';
import { SunFilterCriteria } from './components/SunExposureFilterFixed';
import { MobileSectionCard } from './components/MobileSectionCard';
import { WeatherDisplay } from './components/WeatherDisplay';
import { mlbApi } from './services/mlbApi';
import { weatherApi } from './services/weatherApi';
import './styles/mobile-first.css';
import './MobileApp.css';

const MobileApp: React.FC = () => {
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [games, setGames] = useState<MLBGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<MLBGame | null>(null);
  const [filteredSections, setFilteredSections] = useState<SeatingSectionSun[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const [isCalculating, setIsCalculating] = useState(false);

  // Load games when stadium is selected
  useEffect(() => {
    if (selectedStadium) {
      loadGames();
    } else {
      setGames([]);
      setSelectedGame(null);
    }
  }, [selectedStadium]);

  // Load weather when game is selected
  useEffect(() => {
    if (selectedGame && selectedStadium) {
      loadWeather();
    } else {
      setWeatherForecast(null);
    }
  }, [selectedGame]);

  // Calculate sun exposure when game is selected
  useEffect(() => {
    if (selectedGame && selectedStadium) {
      calculateSections();
    } else {
      setFilteredSections([]);
    }
  }, [selectedGame, selectedStadium, filterCriteria]);

  const loadGames = async () => {
    if (!selectedStadium) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const allGames = await mlbApi.getSchedule();
      const upcomingGames = mlbApi.getHomeGamesForStadium(selectedStadium.id, allGames);
      setGames(upcomingGames);
    } catch (err) {
      setError('Failed to load games');
      console.error('Error loading games:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeather = async () => {
    if (!selectedGame || !selectedStadium) return;
    
    setIsWeatherLoading(true);
    
    try {
      const forecast = await weatherApi.getForecast(
        selectedStadium.latitude,
        selectedStadium.longitude
      );
      setWeatherForecast(forecast);
    } catch (err) {
      console.error('Error loading weather:', err);
      setWeatherForecast(null);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const calculateSections = async () => {
    if (!selectedGame || !selectedStadium) return;
    
    setIsCalculating(true);
    
    try {
      const sections = getStadiumSections(selectedStadium.id);
      const gameDate = new Date(selectedGame.gameDate);
      
      // Simple sun exposure calculation based on time of day
      const hour = gameDate.getHours();
      const isNightGame = hour >= 19 || hour < 10;
      
      const results = sections.map(section => {
        let sunExposure = 0;
        
        if (!isNightGame && !section.covered) {
          // Basic calculation based on section angle and time
          const angle = section.baseAngle;
          if (angle >= 45 && angle <= 135) {
            sunExposure = hour < 15 ? 80 : 40; // East-facing sections
          } else if (angle >= 225 && angle <= 315) {
            sunExposure = hour >= 15 ? 80 : 40; // West-facing sections
          } else {
            sunExposure = 60; // North/South facing
          }
          
          // Reduce for upper levels
          if (section.level === 'upper') sunExposure *= 0.8;
          if (section.level === 'club' || section.level === 'suite') sunExposure *= 0.7;
        }
        
        return {
          section,
          sunExposure: Math.round(sunExposure),
          inSun: sunExposure > 10
        };
      });
    
    // Apply filters
    let filtered = results;
    
    if (filterCriteria.sunPreference) {
      if (filterCriteria.sunPreference === 'sun') {
        filtered = filtered.filter(s => s.sunExposure >= 50);
      } else if (filterCriteria.sunPreference === 'shade') {
        filtered = filtered.filter(s => s.sunExposure < 50);
      }
    }
    
    if (filterCriteria.maxSunExposure !== undefined) {
      const maxExposure = filterCriteria.maxSunExposure;
      filtered = filtered.filter(s => s.sunExposure <= maxExposure);
    }
    
    if (filterCriteria.seatingAreas && filterCriteria.seatingAreas.length > 0) {
      filtered = filtered.filter(s => 
        filterCriteria.seatingAreas!.includes(s.section.level)
      );
    }
    
      setFilteredSections(filtered);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleStadiumChange = useCallback((stadium: Stadium | null) => {
    setSelectedStadium(stadium);
    setSelectedGame(null);
  }, []);

  const handleGameSelect = useCallback((game: MLBGame) => {
    setSelectedGame(game);
  }, []);

  const handleFilterChange = useCallback((criteria: SunFilterCriteria) => {
    setFilterCriteria(criteria);
  }, []);


  return (
    <div className="mobile-app">
      <MobileHeader />
      
      <main className="mobile-main">
        <div className="mobile-content">
          {/* Stadium Selection */}
          <section className="mobile-section">
            <MobileStadiumSelector
              stadiums={MLB_STADIUMS}
              selectedStadium={selectedStadium}
              onStadiumSelect={handleStadiumChange}
            />
          </section>

          {/* Game Selection */}
          {selectedStadium && (
            <section className="mobile-section">
              <h2 className="mobile-section-title">Select a Game</h2>
              <MobileGameScheduler
                games={games}
                selectedGame={selectedGame}
                onGameSelect={handleGameSelect}
                loading={isLoading}
              />
            </section>
          )}

          {/* Weather Display */}
          {selectedGame && weatherForecast && (
            <section className="mobile-section">
              <h2 className="mobile-section-title">Game Weather</h2>
              <WeatherDisplay
                weather={weatherForecast}
                gameTime={new Date(selectedGame.gameDate)}
                loading={isWeatherLoading}
                stadium={selectedStadium}
              />
            </section>
          )}

          {/* Filter and Results */}
          {selectedGame && (
            <>
              <section className="mobile-section mobile-filter-section">
                <MobileFilterSheet
                  onFilterChange={handleFilterChange}
                  currentFilters={filterCriteria}
                  resultCount={filteredSections.length}
                />
              </section>

              <section className="mobile-section">
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
                      onClick={() => setFilterCriteria({})}
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
    </div>
  );
};

export default MobileApp;