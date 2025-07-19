import React from 'react';
import { WeatherForecast, weatherApi } from '../services/weatherApi';
import { Stadium } from '../data/stadiums';
import { formatDateTimeWithTimezone, formatTimeWithTimezone } from '../utils/timeUtils';
import { formatGameTime, formatInLocalTimezone } from '../utils/dateTimeUtils';
import { useTranslation } from '../i18n/i18nContext';
import './WeatherDisplay.css';

interface WeatherDisplayProps {
  weather: WeatherForecast | null;
  gameTime?: Date;
  loading?: boolean;
  stadium?: Stadium | null;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weather, 
  gameTime, 
  loading = false,
  stadium = null
}) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <div className="weather-display loading">
        <div className="weather-header">
          <h3>Weather Forecast</h3>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  // Use centralized weather selection method
  const relevantWeather = weatherApi.getWeatherForTime(weather, gameTime || undefined);
  const weatherImpact = weatherApi.getWeatherImpactOnSun(relevantWeather);
  const isForecastAvailable = relevantWeather.isForecastAvailable !== false;
  
  // Calculate days until game
  const daysUntilGame = gameTime ? Math.ceil((gameTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Weather Display Debug:', {
      gameTime: gameTime?.toISOString() || 'No game time',
      selectedWeatherTime: relevantWeather.time,
      temperature: relevantWeather.temperature,
      conditions: relevantWeather.conditions[0]?.main,
      isForecastAvailable,
      daysUntilGame
    });
  }

  const getWeatherIcon = (condition: string, iconCode: string): string => {
    const iconMap: Record<string, string> = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '🌨️',
      'Fog': '🌫️',
      'Mist': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  };

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVIndexLevel = (uvIndex: number): { level: string; color: string } => {
    if (uvIndex <= 2) return { level: 'Low', color: '#4CAF50' };
    if (uvIndex <= 5) return { level: 'Moderate', color: '#FF9800' };
    if (uvIndex <= 7) return { level: 'High', color: '#FF5722' };
    if (uvIndex <= 10) return { level: 'Very High', color: '#9C27B0' };
    return { level: 'Extreme', color: '#E91E63' };
  };

  const uvLevel = getUVIndexLevel(relevantWeather.uvIndex);

  // If forecast is not available for games beyond 7 days, show only the warning
  if (!isForecastAvailable && daysUntilGame > 7) {
    return (
      <div className="weather-display unavailable">
        <div className="weather-header">
          <h3>{t('weather.forecast')}</h3>
        </div>
        <div className="weather-unavailable">
          <span className="unavailable-icon">🌤️</span>
          <div className="unavailable-content">
            <strong>Weather Forecast Unavailable</strong>
            <p>This game is {daysUntilGame} days away. Weather forecasts are only available up to 7 days in advance.</p>
            <p className="unavailable-note">Sun position calculations are still accurate and based on astronomical data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-display">
      <div className="weather-header">
        <h3>{t('weather.forecast')}</h3>
        {gameTime && (
          <span className="forecast-time">
            For game time: {formatGameTime(gameTime, true)}
          </span>
        )}
      </div>

      <div className="weather-main">
        <div className="weather-primary">
          <div className="weather-icon">
            {getWeatherIcon(relevantWeather.conditions[0].main, relevantWeather.conditions[0].icon)}
          </div>
          <div className="weather-temp">
            <span className="temp-value">{Math.round(relevantWeather.temperature)}°F</span>
            <span className="feels-like">Feels like {Math.round(relevantWeather.feelsLike)}°F</span>
          </div>
          <div className="weather-desc">
            <p>{relevantWeather.conditions[0].description}</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{relevantWeather.humidity}%</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">💨</span>
              <span className="detail-label">Wind</span>
              <span className="detail-value">
                {Math.round(relevantWeather.windSpeed)} mph {getWindDirection(relevantWeather.windDirection)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">☁️</span>
              <span className="detail-label">Cloud Cover</span>
              <span className="detail-value">{relevantWeather.cloudCover}%</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🌡️</span>
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{Math.round(relevantWeather.pressure)} hPa</span>
            </div>

            {relevantWeather.uvIndex > 0 && (
              <div className="detail-item">
                <span className="detail-icon">☀️</span>
                <span className="detail-label">UV Index</span>
                <span className="detail-value" style={{ color: uvLevel.color }}>
                  {relevantWeather.uvIndex} ({uvLevel.level})
                </span>
              </div>
            )}

            {relevantWeather.precipitationProbability && relevantWeather.precipitationProbability > 0 && (
              <div className="detail-item">
                <span className="detail-icon">🌧️</span>
                <span className="detail-label">Rain Chance</span>
                <span className="detail-value">{relevantWeather.precipitationProbability}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="weather-impact">
        <div className={`impact-indicator ${weatherImpact.visibility}`}>
          <div className="impact-header">
            <span className="impact-icon">
              {weatherImpact.visibility === 'excellent' && '🌞'}
              {weatherImpact.visibility === 'good' && '⛅'}
              {weatherImpact.visibility === 'poor' && '☁️'}
              {weatherImpact.visibility === 'blocked' && '🌧️'}
            </span>
            <span className="impact-title">
              Sun Visibility: {weatherImpact.visibility}
            </span>
          </div>
          <p className="impact-desc">{weatherImpact.recommendation}</p>
          
          {weatherImpact.sunExposureAdjustment < 1 && (
            <div className="exposure-adjustment">
              <div className="adjustment-bar">
                <div 
                  className="adjustment-fill" 
                  style={{ width: `${weatherImpact.sunExposureAdjustment * 100}%` }}
                ></div>
              </div>
              <span className="adjustment-text">
                Sun exposure reduced to {Math.round(weatherImpact.sunExposureAdjustment * 100)}% due to weather
              </span>
            </div>
          )}
        </div>
      </div>

      {gameTime && weather.hourly.length > 0 && (
        <div className="hourly-forecast">
          <h4>Game Day Forecast</h4>
          <div className="hourly-grid">
            {(() => {
              const gameHour = gameTime.getTime();
              const startTime = gameHour - (2 * 60 * 60 * 1000); // 2 hours before
              const endTime = gameHour + (5 * 60 * 60 * 1000);   // 5 hours after
              
              // Filter hours to show 2 hours before to 5 hours after game time
              const relevantHours = weather.hourly.filter(hour => {
                const hourTime = new Date(hour.time).getTime();
                return hourTime >= startTime && hourTime <= endTime;
              });

              return relevantHours.map((hour, index) => {
                const hourTime = new Date(hour.time);
                const hourWeather = hour.weather;
                const isGameHour = Math.abs(hourTime.getTime() - gameHour) < (30 * 60 * 1000); // Within 30 min of game
                
                return (
                  <div key={index} className={`hourly-item ${isGameHour ? 'game-hour' : ''}`}>
                    <div className="hourly-time">
                      {formatInLocalTimezone(hourTime, 'h a')}
                      {isGameHour && <span className="game-indicator">⚾</span>}
                    </div>
                    <div className="hourly-icon">
                      {getWeatherIcon(hourWeather.conditions[0].main, hourWeather.conditions[0].icon)}
                    </div>
                    <div className="hourly-temp">
                      {Math.round(hourWeather.temperature)}°
                    </div>
                    <div className="hourly-clouds">
                      ☁️ {hourWeather.cloudCover}%
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};