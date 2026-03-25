'use client';

import React, { useMemo } from 'react';
import { SeatRecommendationEngine, UserPreferences, RecommendationContext } from '../../services/seatRecommendationEngine';
import { calculateShadeScore, getShadeScoreColor, getShadeScoreTextColor } from '../../utils/shadeScore';
import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumCompleteData } from '../../data/stadium-data-aggregator';
import { WeatherData } from '../../services/weatherApi';
import styles from './FindMyShade.module.css';

interface WizardResultsProps {
  stadiumId: string;
  preferences: UserPreferences;
  gameDate: string;
  gameTime: string;
  onViewOnMap?: (sectionId: string) => void;
}

export const WizardResults: React.FC<WizardResultsProps> = ({
  stadiumId,
  preferences,
  gameDate,
  gameTime,
  onViewOnMap,
}) => {
  const results = useMemo(() => {
    try {
      const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
      if (!stadium) return [];

      const { sections, obstructions } = getStadiumCompleteData(stadiumId, 'MLB');

      const defaultWeather: WeatherData = {
        temperature: 72, feelsLike: 72, pressure: 1013, humidity: 50,
        cloudCover: 30, visibility: 10000, windSpeed: 5, windDirection: 180,
        precipitationProbability: 0, uvIndex: 5,
        conditions: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      };

      const context: RecommendationContext = {
        stadium,
        sections,
        obstructions,
        gameDate: new Date(gameDate),
        gameTime,
        weather: defaultWeather,
      };

      const engine = new SeatRecommendationEngine();
      return engine.recommendSeats(preferences, context).slice(0, 3);
    } catch {
      return [];
    }
  }, [stadiumId, preferences, gameDate, gameTime]);

  if (results.length === 0) {
    return <p style={{ color: '#6b7280', textAlign: 'center' }}>No matching sections found. Try adjusting your preferences.</p>;
  }

  return (
    <div>
      <h3 className={styles.stepTitle}>Your Top Shade Picks</h3>
      <div className={styles.resultsList}>
        {results.map((rec, i) => {
          const shade = calculateShadeScore(rec.estimatedSunExposure);
          return (
            <div key={rec.sectionId} className={styles.resultCard}>
              <div
                className={styles.scoreBadge}
                style={{ background: getShadeScoreColor(shade.score), color: getShadeScoreTextColor(shade.score) }}
                aria-label={`Shade Score ${shade.score} out of 10`}
              >
                {shade.score}
              </div>
              <div className={styles.resultInfo}>
                <div className={styles.resultName}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} Section {rec.sectionName}
                </div>
                <div className={styles.resultDetail}>
                  {shade.label} | Score: {shade.score}/10 | {Math.round(rec.score)}% match
                </div>
                {rec.pros.length > 0 && (
                  <div className={styles.resultDetail} style={{ marginTop: '0.25rem' }}>
                    {rec.pros[0]}
                  </div>
                )}
              </div>
              {onViewOnMap && (
                <button
                  className={styles.viewMapBtn}
                  onClick={() => onViewOnMap(rec.sectionId)}
                  aria-label={`View section ${rec.sectionName} on map`}
                >
                  View on Map
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardResults;
