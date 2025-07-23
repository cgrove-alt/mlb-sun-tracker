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
import { EmptyState } from './components/EmptyStates';
import { SEOHelmet } from './components/SEOHelmet';
import { mlbApi } from './services/mlbApi';
import { weatherApi } from './services/weatherApi';
import { SunCalculator } from './utils/sunCalculator';
import { validateStadiumId, validateFilterCriteria, RateLimiter } from './utils/validation';
import './styles/mobile-first.css';
import './MobileApp.css';

// Create rate limiters for API calls
const gameLoadRateLimiter = new RateLimiter(5, 60000); // 5 requests per minute
const weatherLoadRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

const MobileApp: React.FC = () => {
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [games, setGames] = useState<MLBGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<MLBGame | null>(null);
  const [allSections, setAllSections] = useState<SeatingSectionSun[]>([]);
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
      setAllSections([]);
      setFilteredSections([]);
    }
  }, [selectedGame, selectedStadium, filterCriteria]);

  const loadGames = async () => {
    if (!selectedStadium) return;
    
    // Rate limit check
    if (!gameLoadRateLimiter.isAllowed('games')) {
      setError('Too many requests. Please wait a moment.');
      return;
    }
    
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
    
    // Rate limit check
    if (!weatherLoadRateLimiter.isAllowed('weather')) {
      console.warn('Weather API rate limited');
      return;
    }
    
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
    
    // Store all sections for filter preview
    setAllSections(results);
    
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
    // Validate stadium ID if provided
    if (stadium && !validateStadiumId(stadium.id)) {
      console.error('Invalid stadium ID:', stadium.id);
      return;
    }
    setSelectedStadium(stadium);
    setSelectedGame(null);
  }, []);

  const handleGameSelect = useCallback((game: MLBGame) => {
    setSelectedGame(game);
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
      <SEOHelmet 
        stadium={selectedStadium}
        game={selectedGame}
        pageType={selectedGame ? 'game' : selectedStadium ? 'stadium' : 'home'}
        shadedSectionsCount={filteredSections.filter(s => !s.inSun).length}
      />
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

          {/* Empty State Info Box */}
          {!selectedStadium && (
            <section className="mobile-section">
              <EmptyState 
                type="no-stadium"
                action={
                  <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                    Choose from 30 MLB stadiums to analyze sun exposure patterns
                  </p>
                }
              />
            </section>
          )}
          
          {selectedStadium && !selectedGame && (
            <section className="mobile-section">
              <EmptyState 
                type="no-game"
                action={
                  <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                    Pick a real game or set any custom date and time
                  </p>
                }
              />
            </section>
          )}

          {/* Game Selection */}
          {selectedStadium && (
            <section className="mobile-section">
              <h2 className="mobile-section-title">Select a Game</h2>
              <MobileGameScheduler
                games={games}
                selectedGame={selectedGame}
                onGameSelect={handleGameSelect}
                loading={isLoading}
                stadium={selectedStadium}
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
                  allSections={allSections}
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