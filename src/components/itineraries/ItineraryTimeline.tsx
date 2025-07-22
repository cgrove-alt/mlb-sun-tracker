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

  const getRelativeTimeLabel = (time: Date): string => {
    // Calculate time relative to game start
    const gameStart = itinerary.gameStartTime;
    const timeDiff = time.getTime() - gameStart.getTime();
    const minutesDiff = Math.round(timeDiff / (1000 * 60));
    
    // Pre-game times
    if (minutesDiff < -120) return 'Early Arrival';
    if (minutesDiff < -90) return '2hr Before Game';
    if (minutesDiff < -60) return '90min Before Game';
    if (minutesDiff < -30) return '1hr Before Game';
    if (minutesDiff < 0) return '30min Before Game';
    
    // During game - estimate ~20 minutes per inning
    const estimatedInning = Math.floor(minutesDiff / 20) + 1;
    
    if (estimatedInning > 9) return 'Post-Game';
    if (estimatedInning < 1) return 'Game Start';
    
    // Format as ordinal (1st, 2nd, 3rd, etc.)
    const suffix = estimatedInning === 1 ? 'st' : 
                   estimatedInning === 2 ? 'nd' : 
                   estimatedInning === 3 ? 'rd' : 'th';
    
    return `${estimatedInning}${suffix} Inning`;
  };

  const groupRecommendationsByTimePhase = (recommendations: ItineraryRecommendation[]) => {
    const groups: { [key: string]: ItineraryRecommendation[] } = {};
    
    recommendations.forEach(rec => {
      const timeLabel = getRelativeTimeLabel(rec.time);
      if (!groups[timeLabel]) {
        groups[timeLabel] = [];
      }
      groups[timeLabel].push(rec);
    });
    
    // Return in chronological order
    const orderedKeys = [
      'Early Arrival', '2hr Before Game', '90min Before Game', '1hr Before Game', 
      '30min Before Game', 'Game Start', '1st Inning', '2nd Inning', '3rd Inning', 
      '4th Inning', '5th Inning', '6th Inning', '7th Inning', '8th Inning', 
      '9th Inning', 'Post-Game'
    ];
    
    const orderedGroups: { [key: string]: ItineraryRecommendation[] } = {};
    orderedKeys.forEach(key => {
      if (groups[key]) {
        orderedGroups[key] = groups[key];
      }
    });
    
    return orderedGroups;
  };

  const groupedRecommendations = groupRecommendationsByTimePhase(itinerary.recommendations);

  return (
    <div className="itinerary-timeline">
      <h3>📅 Your Game Day Timeline</h3>
      
      <div className="timeline-container">
        {Object.entries(groupedRecommendations).map(([timePhase, recommendations]) => {
          return (
            <div key={timePhase} className="timeline-hour-group">
              <div className="hour-header">
                <h4>{getRelativeTimeLabel(new Date(recommendations[0].time))}</h4>
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