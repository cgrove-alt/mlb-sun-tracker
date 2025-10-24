'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Seat } from '../types/seat';
import {
  type UserPreferences,
  type ScoredSeat,
  getRecommendations,
  getPreferencePresets,
} from '../utils/seatRecommendationEngine';

interface SeatRecommendationsProps {
  seats: Seat[];
  stadiumId: string;
  onAddToComparison?: (seatId: string) => void;
}

export function SeatRecommendations({
  seats,
  stadiumId,
  onAddToComparison,
}: SeatRecommendationsProps) {
  const presets = getPreferencePresets();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPreferences, setCustomPreferences] = useState<UserPreferences | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const currentPreferences = useMemo(() => {
    if (customPreferences) return customPreferences;
    if (selectedPreset) return presets[selectedPreset];
    return null;
  }, [customPreferences, selectedPreset, presets]);

  const recommendations = useMemo(() => {
    if (!currentPreferences) return [];
    return getRecommendations(seats, currentPreferences, 10);
  }, [seats, currentPreferences]);

  const handlePresetClick = (presetId: string) => {
    setSelectedPreset(presetId);
    setCustomPreferences(null);
    setShowCustomForm(false);
  };

  const handleCustomFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const preferences: UserPreferences = {
      sunPreference: formData.get('sunPreference') as 'avoid' | 'some' | 'full',
      viewQuality: formData.get('viewQuality') as 'excellent' | 'good' | 'any',
      accessibility: formData.get('accessibility') === 'true',
      aislePreference: formData.get('aislePreference') === 'true',
      coveragePreference: formData.get('coveragePreference') as 'covered' | 'open' | 'any',
      maxElevation: formData.get('maxElevation') ? parseInt(formData.get('maxElevation') as string) : undefined,
    };

    setCustomPreferences(preferences);
    setSelectedPreset(null);
  };

  return (
    <div className="seat-recommendations">
      {/* Header */}
      <div className="recommendations-header">
        <h2 className="recommendations-title">Find Your Perfect Seat</h2>
        <p className="recommendations-subtitle">
          Tell us what you're looking for and we'll recommend the best seats for you
        </p>
      </div>

      {/* Quick Preset Buttons */}
      <div className="preset-buttons">
        <button
          onClick={() => handlePresetClick('sun-avoider')}
          className={`preset-btn ${selectedPreset === 'sun-avoider' ? 'active' : ''}`}
        >
          ☂️ Avoid Sun
        </button>
        <button
          onClick={() => handlePresetClick('sun-lover')}
          className={`preset-btn ${selectedPreset === 'sun-lover' ? 'active' : ''}`}
        >
          ☀️ Sun Lover
        </button>
        <button
          onClick={() => handlePresetClick('best-view')}
          className={`preset-btn ${selectedPreset === 'best-view' ? 'active' : ''}`}
        >
          ⭐ Best Views
        </button>
        <button
          onClick={() => handlePresetClick('accessible')}
          className={`preset-btn ${selectedPreset === 'accessible' ? 'active' : ''}`}
        >
          ♿ Accessible
        </button>
        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className={`preset-btn ${showCustomForm ? 'active' : ''}`}
        >
          ⚙️ Custom
        </button>
      </div>

      {/* Custom Form */}
      {showCustomForm && (
        <form onSubmit={handleCustomFormSubmit} className="custom-form">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Sun Preference</label>
              <select name="sunPreference" className="form-select">
                <option value="avoid">Avoid Sun</option>
                <option value="some">Some Sun OK</option>
                <option value="full">Full Sun OK</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">View Quality</label>
              <select name="viewQuality" className="form-select">
                <option value="excellent">Excellent Only</option>
                <option value="good">Good or Better</option>
                <option value="any">Any View</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Coverage</label>
              <select name="coveragePreference" className="form-select">
                <option value="covered">Covered</option>
                <option value="open">Open Air</option>
                <option value="any">No Preference</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Max Elevation (ft)</label>
              <input
                type="number"
                name="maxElevation"
                placeholder="Optional"
                className="form-input"
                min="0"
                max="200"
              />
            </div>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="accessibility" value="true" />
              <span>Wheelchair Accessible Required</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="aislePreference" value="true" />
              <span>Prefer Aisle Seats</span>
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Get Recommendations
          </button>
        </form>
      )}

      {/* Recommendations List */}
      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <div className="results-header">
            <h3 className="results-title">Top {recommendations.length} Recommended Seats</h3>
            <p className="results-subtitle">
              Based on your preferences, here are the best matches
            </p>
          </div>

          <div className="recommendations-grid">
            {recommendations.map((scoredSeat, index) => (
              <div key={scoredSeat.seat.id} className="recommendation-card">
                {/* Rank Badge */}
                <div className="rank-badge">#{index + 1}</div>

                {/* Seat Info */}
                <div className="seat-info">
                  <Link
                    href={`/seat/${stadiumId}/${scoredSeat.seat.sectionId}/${scoredSeat.seat.row}/${scoredSeat.seat.seatNumber}`}
                    className="seat-link"
                  >
                    <div className="seat-title">
                      Section {scoredSeat.seat.sectionId} • Row {scoredSeat.seat.row} • Seat {scoredSeat.seat.seatNumber}
                    </div>
                  </Link>

                  {/* Score */}
                  <div className="score-bar-container">
                    <div className="score-label">Match Score</div>
                    <div className="score-bar-wrapper">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${(scoredSeat.score / 100) * 100}%` }}
                      />
                    </div>
                    <div className="score-value">{scoredSeat.score.toFixed(0)}/100</div>
                  </div>

                  {/* Reasons */}
                  {scoredSeat.reasons.length > 0 && (
                    <div className="reasons-section">
                      <div className="reasons-title">Why We Recommend:</div>
                      <ul className="reasons-list">
                        {scoredSeat.reasons.map((reason, i) => (
                          <li key={i} className="reason-item">
                            ✓ {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {scoredSeat.warnings.length > 0 && (
                    <div className="warnings-section">
                      <div className="warnings-title">Note:</div>
                      <ul className="warnings-list">
                        {scoredSeat.warnings.map((warning, i) => (
                          <li key={i} className="warning-item">
                            ⚠️ {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="card-actions">
                  <Link
                    href={`/seat/${stadiumId}/${scoredSeat.seat.sectionId}/${scoredSeat.seat.row}/${scoredSeat.seat.seatNumber}`}
                    className="action-btn primary"
                  >
                    View Details
                  </Link>
                  {onAddToComparison && (
                    <button
                      onClick={() => onAddToComparison(scoredSeat.seat.id)}
                      className="action-btn secondary"
                    >
                      Add to Compare
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentPreferences && recommendations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">😔</div>
          <h3 className="empty-title">No Matching Seats Found</h3>
          <p className="empty-message">
            Try adjusting your preferences to see more options
          </p>
        </div>
      )}

      <style jsx>{`
        .seat-recommendations {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .recommendations-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .recommendations-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .recommendations-subtitle {
          font-size: 1rem;
          color: #6b7280;
        }

        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .preset-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 9999px;
          background: white;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preset-btn:hover {
          border-color: #0f766e;
          background: #f0fdfa;
        }

        .preset-btn.active {
          border-color: #0f766e;
          background: #0f766e;
          color: white;
        }

        .custom-form {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-select,
        .form-input {
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          color: #374151;
          background: white;
        }

        .form-checkboxes {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-label input[type='checkbox'] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: #0f766e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-btn:hover {
          background: #0d9488;
        }

        .recommendations-list {
          margin-top: 2rem;
        }

        .results-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .results-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .results-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .recommendation-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          position: relative;
          transition: all 0.2s ease;
        }

        .recommendation-card:hover {
          border-color: #0f766e;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.1);
        }

        .rank-badge {
          position: absolute;
          top: -12px;
          right: 1rem;
          background: #0f766e;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .seat-info {
          margin-bottom: 1rem;
        }

        .seat-link {
          text-decoration: none;
        }

        .seat-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f766e;
          margin-bottom: 1rem;
          transition: color 0.2s ease;
        }

        .seat-link:hover .seat-title {
          color: #0d9488;
        }

        .score-bar-container {
          margin-bottom: 1rem;
        }

        .score-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .score-bar-wrapper {
          height: 8px;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }

        .score-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #0f766e 0%, #14b8a6 100%);
          transition: width 0.3s ease;
        }

        .score-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f766e;
        }

        .reasons-section {
          margin-bottom: 0.75rem;
        }

        .reasons-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .reasons-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .reason-item {
          font-size: 0.875rem;
          color: #059669;
          margin-bottom: 0.25rem;
          padding-left: 0.25rem;
        }

        .warnings-section {
          margin-bottom: 0.75rem;
        }

        .warnings-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .warnings-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .warning-item {
          font-size: 0.875rem;
          color: #92400e;
          margin-bottom: 0.25rem;
          padding-left: 0.25rem;
        }

        .card-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.625rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
        }

        .action-btn.primary {
          background: #0f766e;
          color: white;
        }

        .action-btn.primary:hover {
          background: #0d9488;
        }

        .action-btn.secondary {
          background: white;
          color: #0f766e;
          border: 2px solid #0f766e;
        }

        .action-btn.secondary:hover {
          background: #f0fdfa;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-message {
          font-size: 1rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .seat-recommendations {
            padding: 1.5rem;
          }

          .recommendations-title {
            font-size: 1.5rem;
          }

          .preset-buttons {
            gap: 0.5rem;
          }

          .preset-btn {
            padding: 0.625rem 1rem;
            font-size: 0.8125rem;
          }

          .recommendations-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .preset-btn,
          .recommendation-card,
          .seat-title,
          .score-bar-fill,
          .action-btn,
          .submit-btn {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
