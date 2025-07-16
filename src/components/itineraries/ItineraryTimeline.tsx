import React from 'react';
import { SmartItinerary, ItineraryRecommendation } from '../../data/itineraryTypes';
import { Stadium } from '../../data/stadiums';
import { formatTimeWithTimezone } from '../../utils/timeUtils';
import { useTranslation } from '../../i18n/i18nContext';
import './ItineraryTimeline.css';

interface ItineraryTimelineProps {
  itinerary: SmartItinerary;
  stadium: Stadium;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  stadium
}) => {
  const { t } = useTranslation();

  const getRecommendationIcon = (type: ItineraryRecommendation['type']): string => {
    switch (type) {
      case 'arrival': return '🚶‍♂️';
      case 'concession': return '🍿';
      case 'restroom': return '🚻';
      case 'sunscreen': return '🧴';
      case 'shade_break': return '🌳';
      case 'activity': return '🎯';
      case 'departure': return '🚗';
      default: return '📍';
    }
  };

  const getPriorityColor = (priority: ItineraryRecommendation['priority']): string => {
    switch (priority) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#4CAF50';
      case 'low': return '#9E9E9E';
      default: return '#4CAF50';
    }
  };

  const getUVIndexColor = (uvIndex: number): string => {
    if (uvIndex <= 2) return '#4CAF50';
    if (uvIndex <= 5) return '#FF9800';
    if (uvIndex <= 7) return '#FF5722';
    return '#E91E63';
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const groupRecommendationsByHour = (recommendations: ItineraryRecommendation[]) => {
    const groups: { [key: string]: ItineraryRecommendation[] } = {};
    
    recommendations.forEach(rec => {
      const hourKey = rec.time.toISOString().substring(0, 13); // YYYY-MM-DDTHH
      if (!groups[hourKey]) {
        groups[hourKey] = [];
      }
      groups[hourKey].push(rec);
    });
    
    return groups;
  };

  const groupedRecommendations = groupRecommendationsByHour(itinerary.recommendations);

  return (
    <div className="itinerary-timeline">
      <h3>📅 Your Game Day Timeline</h3>
      
      <div className="timeline-container">
        {Object.entries(groupedRecommendations).map(([hourKey, recommendations]) => {
          const hour = new Date(hourKey + ':00:00');
          
          return (
            <div key={hourKey} className="timeline-hour-group">
              <div className="hour-header">
                <h4>{formatTimeWithTimezone(hour, stadium.timezone)}</h4>
                <div className="hour-divider"></div>
              </div>
              
              <div className="recommendations-list">
                {recommendations.map((recommendation, index) => (
                  <div 
                    key={recommendation.id} 
                    className={`timeline-item priority-${recommendation.priority}`}
                  >
                    <div className="timeline-marker">
                      <div 
                        className="marker-dot"
                        style={{ backgroundColor: getPriorityColor(recommendation.priority) }}
                      >
                        <span className="recommendation-icon">
                          {getRecommendationIcon(recommendation.type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="timeline-content">
                      <div className="recommendation-header">
                        <h5>{recommendation.details.title}</h5>
                        <div className="recommendation-meta">
                          <span className="time">
                            {formatTimeWithTimezone(recommendation.time, stadium.timezone)}
                          </span>
                          <span className="duration">
                            {formatDuration(recommendation.duration)}
                          </span>
                          {recommendation.location.walkingTime > 0 && (
                            <span className="walking-time">
                              🚶‍♂️ {recommendation.location.walkingTime}m
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="recommendation-description">
                        {recommendation.details.description}
                      </p>
                      
                      <div className="recommendation-details">
                        <div className="location-info">
                          <span className="location">
                            📍 {recommendation.location.description}
                          </span>
                        </div>
                        
                        <div className="reason">
                          <span className="reason-text">
                            💡 {recommendation.details.reason}
                          </span>
                        </div>
                        
                        {recommendation.details.uvIndexAtTime && (
                          <div className="uv-info">
                            <span 
                              className="uv-index"
                              style={{ color: getUVIndexColor(recommendation.details.uvIndexAtTime) }}
                            >
                              ☀️ UV Index: {recommendation.details.uvIndexAtTime}
                            </span>
                            {recommendation.details.sunExposureLevel && (
                              <span className={`sun-exposure ${recommendation.details.sunExposureLevel}`}>
                                ({recommendation.details.sunExposureLevel} exposure)
                              </span>
                            )}
                          </div>
                        )}
                        
                        {recommendation.familyConsiderations && (
                          <div className="family-considerations">
                            <span className="family-label">👨‍👩‍👧‍👦 Family Features:</span>
                            <div className="family-features">
                              {recommendation.familyConsiderations.kidFriendly && (
                                <span className="family-feature">Kid-friendly</span>
                              )}
                              {recommendation.familyConsiderations.hasRestroom && (
                                <span className="family-feature">Restroom nearby</span>
                              )}
                              {recommendation.familyConsiderations.shaded && (
                                <span className="family-feature">Shaded area</span>
                              )}
                              {recommendation.familyConsiderations.strollerAccessible && (
                                <span className="family-feature">Stroller accessible</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="priority-indicator">
                        <span 
                          className={`priority-badge priority-${recommendation.priority}`}
                          style={{ borderColor: getPriorityColor(recommendation.priority) }}
                        >
                          {recommendation.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="timeline-legend">
        <h4>Priority Levels</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#ff4444' }}></div>
            <span>Critical - Essential for safety/health</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#ff8800' }}></div>
            <span>High - Important for comfort</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>Medium - Recommended</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#9E9E9E' }}></div>
            <span>Low - Optional</span>
          </div>
        </div>
      </div>
    </div>
  );
};