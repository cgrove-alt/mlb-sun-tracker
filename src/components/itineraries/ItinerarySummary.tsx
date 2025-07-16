import React from 'react';
import { SmartItinerary } from '../../data/itineraryTypes';
import { Stadium } from '../../data/stadiums';
import { useTranslation } from '../../i18n/i18nContext';
import './ItinerarySummary.css';

interface ItinerarySummaryProps {
  itinerary: SmartItinerary;
  stadium: Stadium;
}

export const ItinerarySummary: React.FC<ItinerarySummaryProps> = ({
  itinerary,
  stadium
}) => {
  const { t } = useTranslation();

  const getUVIndexLevel = (uvIndex: number): { level: string; color: string } => {
    if (uvIndex <= 2) return { level: 'Low', color: '#4CAF50' };
    if (uvIndex <= 5) return { level: 'Moderate', color: '#FF9800' };
    if (uvIndex <= 7) return { level: 'High', color: '#FF5722' };
    return { level: 'Extreme', color: '#E91E63' };
  };

  const getWeatherIcon = (temperature: number, cloudCover: number): string => {
    if (cloudCover > 70) return '☁️';
    if (cloudCover > 30) return '⛅';
    if (temperature > 80) return '☀️';
    if (temperature > 60) return '🌤️';
    return '🌥️';
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };


  const uvLevel = getUVIndexLevel(itinerary.weatherContext.maxUVIndex);
  const weatherIcon = getWeatherIcon(
    itinerary.weatherContext.averageTemperature,
    itinerary.weatherContext.cloudCover
  );

  return (
    <div className="itinerary-summary">
      <div className="summary-header">
        <h3>📊 Your Game Day Overview</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{itinerary.recommendations.length}</span>
            <span className="stat-label">Recommendations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatDuration(itinerary.summary.totalWalkingTime)}</span>
            <span className="stat-label">Total Walking</span>
          </div>
        </div>
      </div>

      <div className="summary-content">
        <div className="weather-summary">
          <h4>🌤️ Weather Conditions</h4>
          <div className="weather-details">
            <div className="weather-item">
              <span className="weather-icon">{weatherIcon}</span>
              <div className="weather-info">
                <span className="weather-temp">{Math.round(itinerary.weatherContext.averageTemperature)}°F</span>
                <span className="weather-desc">Average Temperature</span>
              </div>
            </div>
            <div className="weather-item">
              <span className="weather-icon">☀️</span>
              <div className="weather-info">
                <span 
                  className="uv-index"
                  style={{ color: uvLevel.color }}
                >
                  {itinerary.weatherContext.maxUVIndex}
                </span>
                <span className="weather-desc">Max UV Index ({uvLevel.level})</span>
              </div>
            </div>
            <div className="weather-item">
              <span className="weather-icon">☁️</span>
              <div className="weather-info">
                <span className="cloud-cover">{itinerary.weatherContext.cloudCover}%</span>
                <span className="weather-desc">Cloud Cover</span>
              </div>
            </div>
            {itinerary.weatherContext.precipitationProbability > 0 && (
              <div className="weather-item">
                <span className="weather-icon">🌧️</span>
                <div className="weather-info">
                  <span className="precipitation">{itinerary.weatherContext.precipitationProbability}%</span>
                  <span className="weather-desc">Rain Chance</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="recommendations-summary">
          <h4>📝 Recommendation Breakdown</h4>
          <div className="recommendation-types">
            <div className="recommendation-type">
              <span className="type-icon">📍</span>
              <span className="type-count">{itinerary.recommendations.length}</span>
              <span className="type-label">Total Recommendations</span>
            </div>
            {itinerary.summary.sunscreenReminders > 0 && (
              <div className="recommendation-type">
                <span className="type-icon">🧴</span>
                <span className="type-count">{itinerary.summary.sunscreenReminders}</span>
                <span className="type-label">Sunscreen Reminders</span>
              </div>
            )}
            {itinerary.summary.shadeBreaks > 0 && (
              <div className="recommendation-type">
                <span className="type-icon">🌳</span>
                <span className="type-count">{itinerary.summary.shadeBreaks}</span>
                <span className="type-label">Shade Breaks</span>
              </div>
            )}
            {itinerary.summary.familyFriendlyStops > 0 && (
              <div className="recommendation-type">
                <span className="type-icon">👨‍👩‍👧‍👦</span>
                <span className="type-count">{itinerary.summary.familyFriendlyStops}</span>
                <span className="type-label">Family-Friendly Stops</span>
              </div>
            )}
            {itinerary.recommendations.filter(r => r.type === 'concession').length > 0 && (
              <div className="recommendation-type">
                <span className="type-icon">🍿</span>
                <span className="type-count">{itinerary.recommendations.filter(r => r.type === 'concession').length}</span>
                <span className="type-label">Concession Visits</span>
              </div>
            )}
            {itinerary.recommendations.filter(r => r.type === 'activity').length > 0 && (
              <div className="recommendation-type">
                <span className="type-icon">⚾</span>
                <span className="type-count">{itinerary.recommendations.filter(r => r.type === 'activity').length}</span>
                <span className="type-label">Activities</span>
              </div>
            )}
          </div>
        </div>

        <div className="safety-highlights">
          <h4>🛡️ Safety Highlights</h4>
          <div className="safety-items">
            {itinerary.weatherContext.maxUVIndex > 6 && (
              <div className="safety-item high-uv">
                <span className="safety-icon">⚠️</span>
                <span className="safety-text">High UV expected - extra sun protection recommended</span>
              </div>
            )}
            {itinerary.weatherContext.precipitationProbability > 30 && (
              <div className="safety-item rain-chance">
                <span className="safety-icon">🌧️</span>
                <span className="safety-text">Rain possible - consider bringing umbrella</span>
              </div>
            )}
            {itinerary.weatherContext.averageTemperature > 85 && (
              <div className="safety-item high-temp">
                <span className="safety-icon">🌡️</span>
                <span className="safety-text">Hot weather - stay hydrated and take breaks</span>
              </div>
            )}
            {itinerary.preferences.hasChildren && (
              <div className="safety-item family-safety">
                <span className="safety-icon">👨‍👩‍👧‍👦</span>
                <span className="safety-text">Family-friendly amenities included in recommendations</span>
              </div>
            )}
          </div>
        </div>

        <div className="timing-overview">
          <h4>⏰ Key Timing</h4>
          <div className="timing-items">
            <div className="timing-item">
              <span className="timing-label">Recommended Arrival:</span>
              <span className="timing-value">
                {new Date(itinerary.gameStartTime.getTime() - 
                  (itinerary.preferences.arrivalTime === 'early' ? 90 : 
                   itinerary.preferences.arrivalTime === 'on_time' ? 60 : 30) * 60 * 1000
                ).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <div className="timing-item">
              <span className="timing-label">Game Start:</span>
              <span className="timing-value">
                {itinerary.gameStartTime.toLocaleTimeString([], { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="timing-item">
              <span className="timing-label">Peak UV Time:</span>
              <span className="timing-value">
                {new Date(itinerary.gameStartTime.getTime() + 2 * 60 * 60 * 1000)
                  .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {itinerary.sectionRecommendations && (
          <div className="section-recommendations">
            <h4>🎯 Recommended Seating Sections</h4>
            <div className="section-recommendation-content">
              <p className="recommendation-reasoning">{itinerary.sectionRecommendations.reasoning}</p>
              
              {itinerary.sectionRecommendations.preferred.length > 0 && (
                <div className="section-group preferred">
                  <h5>✅ Preferred Sections</h5>
                  <div className="section-list">
                    {itinerary.sectionRecommendations.preferred.map(section => (
                      <span key={section} className="section-badge preferred">{section}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {itinerary.sectionRecommendations.alternatives.length > 0 && (
                <div className="section-group alternatives">
                  <h5>🔄 Alternative Sections</h5>
                  <div className="section-list">
                    {itinerary.sectionRecommendations.alternatives.map(section => (
                      <span key={section} className="section-badge alternative">{section}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {itinerary.sectionRecommendations.avoid.length > 0 && (
                <div className="section-group avoid">
                  <h5>⚠️ Sections to Avoid</h5>
                  <div className="section-list">
                    {itinerary.sectionRecommendations.avoid.map(section => (
                      <span key={section} className="section-badge avoid">{section}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mlb-play-sun-smart">
        <div className="play-sun-smart-banner">
          <span className="banner-icon">🏟️</span>
          <div className="banner-content">
            <h5>MLB Play Sun Smart Initiative</h5>
            <p>
              This itinerary includes sunscreen kiosks and sun safety recommendations 
              in partnership with MLB's Play Sun Smart program.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};