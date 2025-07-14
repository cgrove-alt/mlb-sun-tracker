import React from 'react';
import { WeatherData, WeatherForecast, weatherApi } from '../services/weatherApi';
import './WeatherDisplay.css';

interface WeatherDisplayProps {
  weather: WeatherForecast | null;
  gameTime?: Date;
  loading?: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weather, 
  gameTime, 
  loading = false 
}) => {
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

  return (
    <div className="weather-display">
      <div className="weather-header">
        <h3>Weather Forecast</h3>
        {gameTime && (
          <span className="forecast-time">
            For game time: {gameTime.toLocaleString()}
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
              Sun Visibility: {weatherImpact.visibility.charAt(0).toUpperCase() + weatherImpact.visibility.slice(1)}
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
                {Math.round(weatherImpact.sunExposureAdjustment * 100)}% of normal sun exposure
              </span>
            </div>
          )}
        </div>
      </div>

      {gameTime && weather.hourly.length > 0 && (
        <div className="hourly-forecast">
          <h4>Hourly Forecast</h4>
          <div className="hourly-grid">
            {weather.hourly.slice(0, 8).map((hour, index) => {
              const hourTime = new Date(hour.time);
              const hourWeather = hour.weather;
              
              return (
                <div key={index} className="hourly-item">
                  <div className="hourly-time">
                    {hourTime.toLocaleTimeString([], { hour: 'numeric' })}
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
            })}
          </div>
        </div>
      )}
    </div>
  );
};