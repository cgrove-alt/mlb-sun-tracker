import React from 'react';
import { WeatherForecast, weatherApi } from '../services/weatherApi';
import { useTranslation } from '../i18n/i18nContext';
import { Stadium } from '../data/stadiums';
import { formatDateTimeWithTimezone, formatTimeWithTimezone } from '../utils/timeUtils';
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
          <h3>{t('weather.forecast')}</h3>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>{t('weather.loading')}</p>
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
    if (uvIndex <= 2) return { level: t('weather.uvLevels.low'), color: '#4CAF50' };
    if (uvIndex <= 5) return { level: t('weather.uvLevels.moderate'), color: '#FF9800' };
    if (uvIndex <= 7) return { level: t('weather.uvLevels.high'), color: '#FF5722' };
    if (uvIndex <= 10) return { level: t('weather.uvLevels.veryHigh'), color: '#9C27B0' };
    return { level: t('weather.uvLevels.extreme'), color: '#E91E63' };
  };

  const uvLevel = getUVIndexLevel(relevantWeather.uvIndex);

  return (
    <div className="weather-display">
      <div className="weather-header">
        <h3>{t('weather.forecast')}</h3>
        {gameTime && (
          <span className="forecast-time">
            {t('weather.forGameTime')}: {stadium ? formatDateTimeWithTimezone(gameTime, stadium.timezone) : gameTime.toLocaleString()}
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
            <span className="feels-like">{t('weather.feelsLike')} {Math.round(relevantWeather.feelsLike)}°F</span>
          </div>
          <div className="weather-desc">
            <p>{relevantWeather.conditions[0].description}</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <span className="detail-label">{t('weather.humidity')}</span>
              <span className="detail-value">{relevantWeather.humidity}%</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">💨</span>
              <span className="detail-label">{t('weather.wind')}</span>
              <span className="detail-value">
                {Math.round(relevantWeather.windSpeed)} mph {getWindDirection(relevantWeather.windDirection)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">☁️</span>
              <span className="detail-label">{t('weather.cloudCover')}</span>
              <span className="detail-value">{relevantWeather.cloudCover}%</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🌡️</span>
              <span className="detail-label">{t('weather.pressure')}</span>
              <span className="detail-value">{Math.round(relevantWeather.pressure)} hPa</span>
            </div>

            {relevantWeather.uvIndex > 0 && (
              <div className="detail-item">
                <span className="detail-icon">☀️</span>
                <span className="detail-label">{t('weather.uvIndex')}</span>
                <span className="detail-value" style={{ color: uvLevel.color }}>
                  {relevantWeather.uvIndex} ({uvLevel.level})
                </span>
              </div>
            )}

            {relevantWeather.precipitationProbability && relevantWeather.precipitationProbability > 0 && (
              <div className="detail-item">
                <span className="detail-icon">🌧️</span>
                <span className="detail-label">{t('weather.rainChance')}</span>
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
              {t('weather.sunVisibility')}: {t(`weather.visibility.${weatherImpact.visibility}`)}
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
                {t('weather.sunExposureAdjustment', { percentage: Math.round(weatherImpact.sunExposureAdjustment * 100) })}
              </span>
            </div>
          )}
        </div>
      </div>

      {gameTime && weather.hourly.length > 0 && (
        <div className="hourly-forecast">
          <h4>{t('weather.gameDayForecast')}</h4>
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
                      {stadium ? formatTimeWithTimezone(hourTime, stadium.timezone).split(' ')[0] : hourTime.toLocaleTimeString([], { hour: 'numeric' })}
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