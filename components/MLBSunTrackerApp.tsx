'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MLB_STADIUMS, Stadium } from '../src/data/stadiums';
import { GameSelector } from '../src/components/GameSelector';
import { WeatherDisplay } from '../src/components/WeatherDisplay';
import { SunExposureFilterFixed, SunFilterCriteria } from '../src/components/SunExposureFilterFixed';
import { SectionList } from '../src/components/SectionList';
import { EmptyState } from '../src/components/EmptyStates';
import { ErrorProvider, useError } from '../src/components/ErrorNotification';
import { Breadcrumb } from '../src/components/Breadcrumb';
import { Tooltip } from '../src/components/Tooltip';
import { ShareButton } from '../src/components/ShareButton';
import { UserProfileMenu } from '../src/components/UserProfileMenu';
import { FavoriteButton } from '../src/components/FavoriteButton';
import { AffordableShadeSection } from '../src/components/AffordableShadeSection';
import { UserProfileProvider, useUserProfile } from '../src/contexts/UserProfileContext';
import { getSunPosition, getSunDescription, getCompassDirection, calculateDetailedSectionSunExposure, filterSectionsBySunExposure, SeatingSectionSun } from '../src/utils/sunCalculations';
import { MLBGame } from '../src/services/mlbApi';
import { WeatherForecast, weatherApi } from '../src/services/weatherApi';
import { I18nProvider, useTranslation, LanguageSelector } from '../src/i18n/i18nContext';
import ErrorBoundary from './ErrorBoundary';

function AppContent() {
  const { currentProfile, updatePreferences, trackStadiumView } = useUserProfile();
  const { t } = useTranslation();
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
  const { showError } = useError();

  // Debug logging
  useEffect(() => {
    console.log('PARENT: AppContent component mounted and running');
  }, []);


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
        t('weather.error'),
        'warning'
      );
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedStadium, showError, t]);

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
          t('errors.sunCalculation'),
          'error'
        );
      } finally {
        setLoadingSections(false);
      }
    }
  }, [selectedStadium, gameDateTime, weatherForecast, filterCriteria, showError, t]);

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
    try {
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
    } catch (error) {
      console.error('Error changing stadium:', error);
      showError(t('errors.stadiumLoad'), 'error');
    }
  };

  return (
    <div className="App">
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
                <span className="game-time">{gameDateTime.toLocaleDateString()}</span>
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
            <LanguageSelector variant="buttons" showLabel={false} className="header-language-selector" />
            <UserProfileMenu />
          </div>
        </div>
      </header>

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
                💡 {t('emptyStates.noStadium.description')}
              </p>
            }
          />
        )}

        {selectedStadium && !gameDateTime && (
          <EmptyState 
            type="no-game"
            action={
              <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                🎯 {t('emptyStates.noGame.description')}
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
                />
              )}

              {sunPosition && (
                <div className="sun-info">
                  <h3>{t('sun.information')}</h3>
                  <div className="sun-details">
                    <div className="sun-detail-item">
                      <span className="sun-icon">☀️</span>
                      <div className="sun-detail-content">
                        <span className="sun-label">{t('sun.condition')}</span>
                        <span className="sun-value">{getSunDescription(sunPosition)}</span>
                      </div>
                    </div>
                    
                    <div className="sun-detail-item">
                      <span className="sun-icon">🧭</span>
                      <div className="sun-detail-content">
                        <Tooltip content={t('tooltips.sunDirection')}>
                          <span className="sun-label">{t('sun.direction')}</span>
                        </Tooltip>
                        <span className="sun-value">{sunPosition ? getCompassDirection(sunPosition.azimuthDegrees) : 'N/A'} ({sunPosition ? Math.round(sunPosition.azimuthDegrees) : 0}°)</span>
                      </div>
                    </div>
                    
                    <div className="sun-detail-item">
                      <span className="sun-icon">📐</span>
                      <div className="sun-detail-content">
                        <Tooltip content={t('tooltips.sunElevation')}>
                          <span className="sun-label">{t('sun.elevation')}</span>
                        </Tooltip>
                        <span className="sun-value">{sunPosition ? Math.round(sunPosition.altitudeDegrees) : 0}°</span>
                      </div>
                    </div>

                    {sunPosition && sunPosition.altitudeDegrees < 0 && (
                      <div className="night-game">
                        <span className="night-icon">🌙</span>
                        <span>{t('recommendations.nightGame.description')}</span>
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
                    <span className="stat-label">{t('sections.totalSections')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{filteredSections.length}</span>
                    <span className="stat-label">{t('sections.matchingFilters')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{filteredSections.filter(s => s.inSun).length}</span>
                    <span className="stat-label">{t('sun.inSun')}</span>
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
              
              <AffordableShadeSection 
                stadium={selectedStadium}
                sections={detailedSections}
                gameDateTime={gameDateTime}
                selectedGame={selectedGame}
              />
            </div>

            <div className="recommendations">
              <h3>🎯 {t('recommendations.title')}</h3>
              <div className="recommendations-content">
                {sunPosition && sunPosition.altitudeDegrees < 0 ? (
                  <div className="recommendation-item night">
                    <span className="rec-icon">🌙</span>
                    <div className="rec-content">
                      <h4>{t('recommendations.nightGame.title')}</h4>
                      <p>{t('recommendations.nightGame.description')}</p>
                    </div>
                  </div>
                ) : selectedStadium.roof === 'fixed' ? (
                  <div className="recommendation-item covered">
                    <span className="rec-icon">🏟️</span>
                    <div className="rec-content">
                      <h4>{t('recommendations.coveredStadium.title')}</h4>
                      <p>{t('recommendations.coveredStadium.description')}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="recommendation-item shade">
                      <span className="rec-icon">🏛️</span>
                      <div className="rec-content">
                        <h4>{t('recommendations.avoidSun.title')}</h4>
                        <p>{sunPosition && sunPosition.azimuthDegrees > 180 ? t('recommendations.avoidSun.firstBaseSide') : t('recommendations.avoidSun.thirdBaseSide')} {selectedStadium.roof === 'retractable' && t('recommendations.avoidSun.retractableRoof')}</p>
                      </div>
                    </div>

                    <div className="recommendation-item sun">
                      <span className="rec-icon">☀️</span>
                      <div className="rec-content">
                        <h4>{t('recommendations.sunLovers.title')}</h4>
                        <p>{sunPosition && (sunPosition.azimuthDegrees < 90 || sunPosition.azimuthDegrees > 270) ? t('recommendations.sunLovers.rightField') : t('recommendations.sunLovers.leftField')}</p>
                      </div>
                    </div>

                    {sunPosition && sunPosition.altitudeDegrees > 60 && (
                      <div className="recommendation-item high-sun">
                        <span className="rec-icon">🌤️</span>
                        <div className="rec-content">
                          <h4>{t('recommendations.highSun.title')}</h4>
                          <p>{t('recommendations.highSun.description')}</p>
                        </div>
                      </div>
                    )}

                    {weatherForecast && (
                      <div className="recommendation-item weather">
                        <span className="rec-icon">🌦️</span>
                        <div className="rec-content">
                          <h4>{t('recommendations.weather.title')}</h4>
                          <p>{weatherApi.getWeatherImpactOnSun(weatherApi.getWeatherForTime(weatherForecast, gameDateTime || undefined)).recommendation}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedGame && (
                  <div className="game-info">
                    <h4>📊 {t('game.gameDetails')}</h4>
                    <p><strong>{t('game.matchup')}:</strong> {selectedGame.teams.away.team.name} @ {selectedGame.teams.home.team.name}</p>
                    <p><strong>{t('game.venue')}:</strong> {selectedGame.venue.name}</p>
                    <p><strong>{t('game.gameTime')}:</strong> {gameDateTime.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>{t('footer.disclaimer')}</p>
        <p>{t('footer.weatherCredit')} <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">{t('footer.openMeteo')}</a></p>
      </footer>
    </div>
  );
}

export default function MLBSunTrackerApp() {
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