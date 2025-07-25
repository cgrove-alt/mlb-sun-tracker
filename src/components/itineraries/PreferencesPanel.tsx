import React from 'react';
import { ItineraryPreferences } from '../../data/itineraryTypes';
import { Stadium, MLB_STADIUMS } from '../../data/stadiums';
import { MLBGame } from '../../services/mlbApi';
import { GameSelector } from '../GameSelector';
import { useTranslation } from '../../i18n/i18nContext';
import './PreferencesPanel.css';

interface PreferencesPanelProps {
  preferences: ItineraryPreferences;
  onPreferencesChange: (preferences: ItineraryPreferences) => void;
  onClose: () => void;
  selectedStadium: Stadium | null;
  onStadiumChange: (stadium: Stadium | null) => void;
  onGameSelect: (game: MLBGame | null, dateTime: Date | null) => void;
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onPreferencesChange,
  onClose,
  selectedStadium,
  onStadiumChange,
  onGameSelect
}) => {
  const { t } = useTranslation();

  const handleChange = (key: keyof ItineraryPreferences, value: any) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  const handleDietaryRestrictionToggle = (restriction: string) => {
    const current = preferences.dietaryRestrictions;
    const updated = current.includes(restriction as any)
      ? current.filter(r => r !== restriction)
      : [...current, restriction as any];
    
    handleChange('dietaryRestrictions', updated);
  };

  return (
    <div className="preferences-panel">
      <div className="preferences-header">
        <h3>⚙️ Customize Your Itinerary</h3>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>
      
      <div className="preferences-content">
        <div className="preference-section">
          <h4>⚾ Stadium & Game</h4>
          <div className="game-selector-wrapper">
            <GameSelector
              selectedStadium={selectedStadium}
              onStadiumChange={onStadiumChange}
              onGameSelect={onGameSelect}
              stadiums={MLB_STADIUMS}
            />
          </div>
        </div>

        <div className="preference-section">
          <h4>👥 Group Details</h4>
          
          <div className="preference-item">
            <label htmlFor="groupSize">Group Size:</label>
            <input
              id="groupSize"
              type="number"
              min="1"
              max="20"
              value={preferences.groupSize}
              onChange={(e) => handleChange('groupSize', parseInt(e.target.value))}
              className="number-input"
            />
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-has-children"
                checked={preferences.hasChildren}
                onChange={(e) => handleChange('hasChildren', e.target.checked)}
              />
              <span className="checkmark"></span>
              Traveling with children
            </label>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-has-elderly"
                checked={preferences.hasElderly}
                onChange={(e) => handleChange('hasElderly', e.target.checked)}
              />
              <span className="checkmark"></span>
              Traveling with elderly
            </label>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-mobility-needs"
                checked={preferences.mobilityNeeds}
                onChange={(e) => handleChange('mobilityNeeds', e.target.checked)}
              />
              <span className="checkmark"></span>
              Mobility assistance needed
            </label>
          </div>
        </div>

        <div className="preference-section">
          <h4>🍽️ Dietary Preferences</h4>
          
          <div className="dietary-restrictions">
            {['vegetarian', 'vegan', 'gluten_free', 'halal', 'kosher'].map(restriction => (
              <label key={restriction} className="checkbox-label">
                <input
                  type="checkbox"
                  id={`pref-dietary-${restriction}`}
                  checked={preferences.dietaryRestrictions.includes(restriction as any)}
                  onChange={() => handleDietaryRestrictionToggle(restriction)}
                />
                <span className="checkmark"></span>
                {restriction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        <div className="preference-section">
          <h4>☀️ Sun & Comfort</h4>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-prioritize-shade"
                checked={preferences.prioritizeShade}
                onChange={(e) => handleChange('prioritizeShade', e.target.checked)}
              />
              <span className="checkmark"></span>
              Prioritize shaded areas
            </label>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-frequent-restrooms"
                checked={preferences.frequentRestrooms}
                onChange={(e) => handleChange('frequentRestrooms', e.target.checked)}
              />
              <span className="checkmark"></span>
              More frequent restroom breaks
            </label>
          </div>
          
          <div className="preference-item">
            <label htmlFor="sunSensitivity">Sun Sensitivity:</label>
            <select
              id="sunSensitivity"
              value={preferences.sunSensitivity}
              onChange={(e) => handleChange('sunSensitivity', e.target.value)}
              className="select-input"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>

        <div className="preference-section">
          <h4>⏰ Timing Preferences</h4>
          
          <div className="preference-item">
            <label htmlFor="arrivalTime">Arrival Time:</label>
            <select
              id="arrivalTime"
              value={preferences.arrivalTime}
              onChange={(e) => handleChange('arrivalTime', e.target.value)}
              className="select-input"
            >
              <option value="early">Early (90 min before)</option>
              <option value="on_time">On Time (60 min before)</option>
              <option value="late">Late (30 min before)</option>
            </select>
          </div>
          
          <div className="preference-item">
            <label htmlFor="departureTime">Departure Time:</label>
            <select
              id="departureTime"
              value={preferences.departureTime}
              onChange={(e) => handleChange('departureTime', e.target.value)}
              className="select-input"
            >
              <option value="early">Early (7th inning)</option>
              <option value="full_game">Full Game</option>
              <option value="late">Late (stay after)</option>
            </select>
          </div>
        </div>

        <div className="preference-section">
          <h4>💰 Budget & Activities</h4>
          
          <div className="preference-item">
            <label htmlFor="budgetConstraints">Budget Level:</label>
            <select
              id="budgetConstraints"
              value={preferences.budgetConstraints}
              onChange={(e) => handleChange('budgetConstraints', e.target.value)}
              className="select-input"
            >
              <option value="budget">Budget Conscious</option>
              <option value="moderate">Moderate</option>
              <option value="premium">Premium</option>
              <option value="unlimited">No Limits</option>
            </select>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-skip-concessions"
                checked={preferences.skipConcessions}
                onChange={(e) => handleChange('skipConcessions', e.target.checked)}
              />
              <span className="checkmark"></span>
              Skip concession recommendations
            </label>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-skip-activities"
                checked={preferences.skipActivities}
                onChange={(e) => handleChange('skipActivities', e.target.checked)}
              />
              <span className="checkmark"></span>
              Skip activity recommendations
            </label>
          </div>
          
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="pref-prioritize-speed"
                checked={preferences.prioritizeSpeed}
                onChange={(e) => handleChange('prioritizeSpeed', e.target.checked)}
              />
              <span className="checkmark"></span>
              Minimize walking time
            </label>
          </div>
        </div>

        {preferences.hasChildren && (
          <div className="preference-section">
            <h4>👶 Special Needs</h4>
            
            <div className="preference-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="pref-nursling-needs"
                  checked={preferences.nurslingNeeds}
                  onChange={(e) => handleChange('nurslingNeeds', e.target.checked)}
                />
                <span className="checkmark"></span>
                Nursing/feeding needs
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="preferences-footer">
        <button className="apply-button" onClick={onClose}>
          ✓ Apply Preferences
        </button>
      </div>
    </div>
  );
};