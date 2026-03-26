'use client';

import { useState, useEffect } from 'react';
import { WeatherData, WeatherForecast } from '../src/services/weatherApi';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  stadiumName: string;
  gameTime?: Date;
  onWeatherLoad?: (weather: WeatherData) => void;
}

export default function WeatherWidget({
  latitude,
  longitude,
  stadiumName,
  gameTime,
  onWeatherLoad
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHourly, setShowHourly] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/weather/${encodeURIComponent(stadiumName)}?lat=${latitude}&lng=${longitude}`);

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setForecast(data);

        // Get weather for specific game time or current
        const weatherForTime = gameTime ?
          getWeatherForGameTime(data, gameTime) :
          data.current;

        setWeather(weatherForTime);

        if (onWeatherLoad) {
          onWeatherLoad(weatherForTime);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [latitude, longitude, stadiumName, gameTime]);

  const getWeatherForGameTime = (forecast: WeatherForecast, gameTime: Date): WeatherData => {
    // Find the closest hourly forecast to game time
    const gameHour = gameTime.getTime();
    let closest = forecast.current;
    let minDiff = Infinity;

    forecast.hourly.forEach(hour => {
      const hourTime = new Date(hour.time).getTime();
      const diff = Math.abs(hourTime - gameHour);
      if (diff < minDiff) {
        minDiff = diff;
        closest = hour.weather;
      }
    });

    return closest;
  };

  const getWeatherIcon = (condition: string): string => {
    const iconMap: Record<string, string> = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
    };
    return iconMap[condition] || '🌤️';
  };

  const getUVIndexLevel = (uvIndex: number): { level: string; color: string; recommendation: string } => {
    if (uvIndex >= 11) {
      return {
        level: 'Extreme',
        color: '#8b00ff',
        recommendation: 'Avoid sun exposure. Maximum protection required.'
      };
    }
    if (uvIndex >= 8) {
      return {
        level: 'Very High',
        color: '#ff0000',
        recommendation: 'Extra protection needed. Seek shade during midday.'
      };
    }
    if (uvIndex >= 6) {
      return {
        level: 'High',
        color: '#ff8c00',
        recommendation: 'Protection required. Use sunscreen SPF 30+.'
      };
    }
    if (uvIndex >= 3) {
      return {
        level: 'Moderate',
        color: '#ffd700',
        recommendation: 'Consider protection for extended exposure.'
      };
    }
    return {
      level: 'Low',
      color: '#4caf50',
      recommendation: 'Minimal protection needed.'
    };
  };

  const getCloudCoverImpact = (cloudCover: number): { impact: string; color: string } => {
    if (cloudCover >= 80) {
      return { impact: 'Overcast - Minimal sun', color: '#607d8b' };
    }
    if (cloudCover >= 60) {
      return { impact: 'Mostly cloudy - Reduced sun', color: '#9e9e9e' };
    }
    if (cloudCover >= 40) {
      return { impact: 'Partly cloudy - Intermittent shade', color: '#2196f3' };
    }
    if (cloudCover >= 20) {
      return { impact: 'Mostly sunny - Some clouds', color: '#ff9800' };
    }
    return { impact: 'Clear skies - Full sun', color: '#ffc107' };
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="spinner"></div>
        <span>Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-widget error">
        <span className="error-icon">⚠️</span>
        <span>Weather data unavailable</span>
      </div>
    );
  }

  const uvInfo = getUVIndexLevel(weather.uvIndex);
  const cloudInfo = getCloudCoverImpact(weather.cloudCover);

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3 className="weather-title">
          {getWeatherIcon(weather.conditions[0]?.main || 'Clear')} Current Conditions
        </h3>
        {gameTime && (
          <span className="game-time-note">
            For game at {gameTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="weather-main">
        <div className="temperature-display">
          <span className="temp-value">{Math.round(weather.temperature)}°F</span>
          <span className="feels-like">Feels like {Math.round(weather.feelsLike)}°F</span>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Conditions</span>
            <span className="detail-value">{weather.conditions[0]?.description || 'Clear'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Cloud Cover</span>
            <span className="detail-value" style={{ color: cloudInfo.color }}>
              {weather.cloudCover}% - {cloudInfo.impact}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">UV Index</span>
            <span className="detail-value uv-index" style={{ backgroundColor: uvInfo.color }}>
              {weather.uvIndex} ({uvInfo.level})
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">
              {Math.round(weather.windSpeed)} mph
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.humidity}%</span>
          </div>

          {weather.precipitationProbability !== undefined && weather.precipitationProbability > 0 && (
            <div className="detail-item precipitation">
              <span className="detail-label">Rain Chance</span>
              <span className="detail-value">{weather.precipitationProbability}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="weather-recommendations">
        <h4>Sun Protection Tips</h4>
        <ul>
          <li className="uv-recommendation">{uvInfo.recommendation}</li>
          {weather.cloudCover < 50 && (
            <li>Consider seats with roof coverage or shade structures</li>
          )}
          {weather.temperature > 85 && (
            <li>Stay hydrated and take breaks in shaded concourses</li>
          )}
          {weather.windSpeed > 15 && (
            <li>Secure loose items - windy conditions expected</li>
          )}
        </ul>
      </div>

      {forecast && (
        <button
          className="hourly-toggle"
          onClick={() => setShowHourly(!showHourly)}
          aria-expanded={showHourly}
        >
          {showHourly ? 'Hide' : 'Show'} Hourly Forecast
        </button>
      )}

      {showHourly && forecast && (
        <div className="hourly-forecast">
          <h4>Next 12 Hours</h4>
          <div className="hourly-scroll">
            {forecast.hourly.slice(0, 12).map((hour, index) => {
              const time = new Date(hour.time);
              return (
                <div key={index} className="hourly-item">
                  <span className="hour-time">
                    {time.toLocaleTimeString([], { hour: 'numeric' })}
                  </span>
                  <span className="hour-icon">
                    {getWeatherIcon(hour.weather.conditions[0]?.main || 'Clear')}
                  </span>
                  <span className="hour-temp">
                    {Math.round(hour.weather.temperature)}°
                  </span>
                  <span className="hour-cloud">
                    ☁️ {hour.weather.cloudCover}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .weather-widget {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 1.5rem;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          margin: 1rem 0;
        }

        .weather-widget.loading,
        .weather-widget.error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 100px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .weather-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .weather-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .game-time-note {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .weather-main {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .temperature-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .temp-value {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
        }

        .feels-like {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-top: 0.5rem;
        }

        .weather-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 500;
        }

        .uv-index {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .weather-recommendations {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .weather-recommendations h4 {
          margin: 0 0 0.75rem;
          font-size: 1rem;
        }

        .weather-recommendations ul {
          margin: 0;
          padding-left: 1.5rem;
          list-style: none;
        }

        .weather-recommendations li {
          position: relative;
          margin-bottom: 0.5rem;
          padding-left: 1rem;
        }

        .weather-recommendations li::before {
          content: '→';
          position: absolute;
          left: 0;
        }

        .hourly-toggle {
          width: 100%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
          transition: background 0.2s;
        }

        .hourly-toggle:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .hourly-forecast {
          margin-top: 1rem;
        }

        .hourly-forecast h4 {
          margin: 0 0 1rem;
        }

        .hourly-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .hourly-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 70px;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .hour-time {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .hour-icon {
          font-size: 1.5rem;
        }

        .hour-temp {
          font-weight: 600;
        }

        .hour-cloud {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        @media (max-width: 640px) {
          .weather-main {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .temperature-display {
            flex-direction: row;
            justify-content: space-around;
          }

          .weather-details {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}