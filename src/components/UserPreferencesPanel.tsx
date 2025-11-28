'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { preferencesStorage, ShadePreference } from '../utils/preferences';
import { MLB_STADIUMS } from '../data/stadiums';

interface UserPreferencesPanelProps {
  onClose?: () => void;
  isOpen?: boolean;
}

const SHADE_OPTIONS: { value: ShadePreference; label: string; icon: string; desc: string }[] = [
  { value: 'love-sun', label: 'Love the Sun', icon: '☀️', desc: 'Show me seats in direct sunlight' },
  { value: 'prefer-sun', label: 'Prefer Sun', icon: '🌤️', desc: 'Some sun is fine, but not too hot' },
  { value: 'neutral', label: 'No Preference', icon: '⚖️', desc: 'Show all seats equally' },
  { value: 'prefer-shade', label: 'Prefer Shade', icon: '⛅', desc: 'I\'d rather be in the shade' },
  { value: 'need-shade', label: 'Need Shade', icon: '🌥️', desc: 'Only show shaded seats' },
];

const GAME_TIME_OPTIONS = [
  { value: '13:00', label: '1:00 PM (Day Game)' },
  { value: '16:00', label: '4:00 PM (Afternoon)' },
  { value: '19:00', label: '7:00 PM (Night Game)' },
];

export function UserPreferencesPanel({ onClose, isOpen = true }: UserPreferencesPanelProps) {
  const [shadePreference, setShadePreference] = useState<ShadePreference>('neutral');
  const [defaultGameTime, setDefaultGameTime] = useState<string>('13:00');
  const [favoriteStadiums, setFavoriteStadiums] = useState<string[]>([]);
  const [recentStadiums, setRecentStadiums] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const prefs = preferencesStorage.load();
    setShadePreference(prefs.shadePreference || 'neutral');
    setDefaultGameTime(prefs.defaultGameTime || '13:00');
    setFavoriteStadiums(prefs.favoriteStadiums || []);
    setRecentStadiums(prefs.recentStadiums || []);
  }, []);

  // Save shade preference
  const handleShadeChange = useCallback((pref: ShadePreference) => {
    setShadePreference(pref);
    preferencesStorage.setShadePreference(pref);
    showSavedFeedback();
  }, []);

  // Save default game time
  const handleGameTimeChange = useCallback((time: string) => {
    setDefaultGameTime(time);
    preferencesStorage.update('defaultGameTime', time);
    showSavedFeedback();
  }, []);

  // Toggle favorite stadium
  const toggleFavoriteStadium = useCallback((stadiumId: string) => {
    if (favoriteStadiums.includes(stadiumId)) {
      preferencesStorage.removeFavoriteStadium(stadiumId);
      setFavoriteStadiums(prev => prev.filter(id => id !== stadiumId));
    } else {
      preferencesStorage.addFavoriteStadium(stadiumId);
      setFavoriteStadiums(prev => [...prev, stadiumId]);
    }
    showSavedFeedback();
  }, [favoriteStadiums]);

  // Show saved feedback
  const showSavedFeedback = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  // Clear all preferences
  const handleClearAll = useCallback(() => {
    if (confirm('Clear all preferences? This cannot be undone.')) {
      preferencesStorage.clear();
      setShadePreference('neutral');
      setDefaultGameTime('13:00');
      setFavoriteStadiums([]);
      setRecentStadiums([]);
      showSavedFeedback();
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="user-preferences-panel bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Your Preferences</h2>
        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Shade Preference */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sun/Shade Preference</h3>
        <div className="grid gap-2">
          {SHADE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleShadeChange(option.value)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                shadePreference === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{option.icon}</span>
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.desc}</div>
              </div>
              {shadePreference === option.value && (
                <svg className="w-5 h-5 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Default Game Time */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Default Game Time</h3>
        <div className="flex gap-2 flex-wrap">
          {GAME_TIME_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleGameTimeChange(option.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                defaultGameTime === option.value
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Stadiums */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Favorite Stadiums ({favoriteStadiums.length})
        </h3>
        {favoriteStadiums.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {favoriteStadiums.map(stadiumId => {
              const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
              return (
                <button
                  key={stadiumId}
                  onClick={() => toggleFavoriteStadium(stadiumId)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200 transition-colors"
                >
                  <span>⭐</span>
                  <span>{stadium?.name || stadiumId}</span>
                  <span className="ml-1 text-yellow-600">×</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No favorites yet. Visit a stadium page and tap the star to add it.
          </p>
        )}
      </div>

      {/* Recent Stadiums */}
      {recentStadiums.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recently Viewed</h3>
          <div className="flex flex-wrap gap-2">
            {recentStadiums.map(stadiumId => {
              const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
              const isFav = favoriteStadiums.includes(stadiumId);
              return (
                <button
                  key={stadiumId}
                  onClick={() => toggleFavoriteStadium(stadiumId)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    isFav
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span>{isFav ? '⭐' : '☆'}</span>
                  <span>{stadium?.name || stadiumId}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear All */}
      <div className="pt-4 border-t">
        <button
          onClick={handleClearAll}
          className="text-sm text-red-600 hover:text-red-700 hover:underline"
        >
          Clear all preferences
        </button>
      </div>
    </div>
  );
}

export default UserPreferencesPanel;
