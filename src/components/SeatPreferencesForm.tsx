/**
 * Seat Preferences Form Component
 * Collects user preferences for seat recommendations
 */

import React, { useState } from 'react';
import { UserPreferences } from '../services/seatRecommendationEngine';

interface SeatPreferencesFormProps {
  onPreferencesChange: (preferences: UserPreferences) => void;
  initialPreferences?: Partial<UserPreferences>;
  showTitle?: boolean;
}

export const SeatPreferencesForm: React.FC<SeatPreferencesFormProps> = ({
  onPreferencesChange,
  initialPreferences = {},
  showTitle = true
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    sunPreference: 'neutral',
    budgetRange: 'moderate',
    groupSize: 2,
    accessibilityNeeds: false,
    viewPreference: 'any',
    amenityPriorities: ['view', 'shade'],
    weatherSensitivity: 'medium',
    hasChildren: false,
    gameTimePreference: 'any',
    ...initialPreferences
  });

  const handleChange = (key: keyof UserPreferences, value: any) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    onPreferencesChange(updated);
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = preferences.amenityPriorities;
    const updated = current.includes(amenity as any)
      ? current.filter(a => a !== amenity)
      : [...current, amenity as any];
    handleChange('amenityPriorities', updated);
  };

  return (
    <div className="seat-preferences-form">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Customize Your Seat Recommendations
        </h3>
      )}

      <div className="space-y-6">
        {/* Sun Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ☀️ Sun Preference
          </label>
          <select
            value={preferences.sunPreference}
            onChange={(e) => handleChange('sunPreference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="love-sun">🌞 Love Sun - Sunny seats preferred</option>
            <option value="prefer-sun">☀️ Prefer Sun - Some sun is nice</option>
            <option value="neutral">🌤️ Neutral - Either is fine</option>
            <option value="prefer-shade">⛅ Prefer Shade - Limited sun</option>
            <option value="need-shade">🏠 Need Shade - Must be shaded</option>
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💰 Budget Range
          </label>
          <select
            value={preferences.budgetRange}
            onChange={(e) => handleChange('budgetRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="budget">💵 Budget - Value seating</option>
            <option value="moderate">💳 Moderate - Mid-range options</option>
            <option value="premium">💎 Premium - Better seats</option>
            <option value="any">🎫 Any - Price not a concern</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Group Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👥 Group Size
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={preferences.groupSize}
              onChange={(e) => handleChange('groupSize', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Weather Sensitivity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🌡️ Weather Sensitivity
            </label>
            <select
              value={preferences.weatherSensitivity}
              onChange={(e) => handleChange('weatherSensitivity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="low">🔥 Low - Weather doesn't matter</option>
              <option value="medium">🌤️ Medium - Some consideration</option>
              <option value="high">❄️ High - Weather is important</option>
            </select>
          </div>
        </div>

        {/* View Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👀 View Preference
          </label>
          <select
            value={preferences.viewPreference}
            onChange={(e) => handleChange('viewPreference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="any">🎯 Any - Location doesn't matter</option>
            <option value="home-plate">⚾ Home Plate - Behind the action</option>
            <option value="first-base">1️⃣ First Base - Right side</option>
            <option value="third-base">3️⃣ Third Base - Left side</option>
            <option value="outfield">🌳 Outfield - Beyond the bases</option>
          </select>
        </div>

        {/* Amenity Priorities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Important Features (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['view', 'shade', 'food', 'restrooms', 'parking'].map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={preferences.amenityPriorities.includes(amenity as any)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="capitalize">
                  {amenity === 'view' && '👀 Great View'}
                  {amenity === 'shade' && '⛅ Shade'}
                  {amenity === 'food' && '🍕 Food Options'}
                  {amenity === 'restrooms' && '🚻 Nearby Restrooms'}
                  {amenity === 'parking' && '🅿️ Easy Parking'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Considerations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Special Considerations</h4>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={preferences.accessibilityNeeds}
              onChange={(e) => handleChange('accessibilityNeeds', e.target.checked)}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span>♿ Accessibility needs</span>
          </label>

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={preferences.hasChildren}
              onChange={(e) => handleChange('hasChildren', e.target.checked)}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span>👶 Attending with children</span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .seat-preferences-form {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default SeatPreferencesForm;