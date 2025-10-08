'use client';

import React from 'react';
import './QuickTimePresets.css';

interface QuickTimePresetsProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Callback when a preset is selected */
  onTimeSelect: (date: Date) => void;
  /** Show date selector */
  showDateSelector?: boolean;
  /** Callback when date changes */
  onDateChange?: (date: Date) => void;
}

export const QuickTimePresets: React.FC<QuickTimePresetsProps> = ({
  selectedDate,
  onTimeSelect,
  showDateSelector = true,
  onDateChange,
}) => {
  const presets = [
    { label: 'Morning', time: '10:00', icon: '🌅', hours: 10, minutes: 0 },
    { label: '1 PM Game', time: '1:00 PM', icon: '☀️', hours: 13, minutes: 0 },
    { label: '4 PM Game', time: '4:00 PM', icon: '🌤️', hours: 16, minutes: 0 },
    { label: '7 PM Game', time: '7:00 PM', icon: '🌆', hours: 19, minutes: 0 },
  ];

  const handlePresetClick = (hours: number, minutes: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    onTimeSelect(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime()) && onDateChange) {
      // Preserve the current time
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      onDateChange(newDate);
    }
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    onTimeSelect(newDate);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isCurrentTimePreset = (hours: number, minutes: number) => {
    return selectedDate.getHours() === hours && selectedDate.getMinutes() === minutes;
  };

  return (
    <div className="quick-time-presets">
      <div className="presets-header">
        <h3 className="presets-title">Quick Time Selection</h3>
        <p className="presets-subtitle">Choose a common game time or set custom</p>
      </div>

      {/* Date Selector */}
      {showDateSelector && (
        <div className="date-selector">
          <label htmlFor="preset-date" className="input-label">
            <span className="label-icon">📅</span>
            <span>Game Date</span>
          </label>
          <input
            id="preset-date"
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            className="date-input"
            min={formatDateForInput(new Date())}
          />
        </div>
      )}

      {/* Time Presets */}
      <div className="time-presets-grid">
        {presets.map((preset) => (
          <button
            key={preset.label}
            className={`time-preset-button ${
              isCurrentTimePreset(preset.hours, preset.minutes) ? 'active' : ''
            }`}
            onClick={() => handlePresetClick(preset.hours, preset.minutes)}
            type="button"
          >
            <span className="preset-icon">{preset.icon}</span>
            <span className="preset-label">{preset.label}</span>
            <span className="preset-time">{preset.time}</span>
          </button>
        ))}
      </div>

      {/* Custom Time Input */}
      <div className="custom-time-section">
        <label htmlFor="custom-time" className="input-label">
          <span className="label-icon">⏰</span>
          <span>Custom Time</span>
        </label>
        <input
          id="custom-time"
          type="time"
          value={formatTimeForInput(selectedDate)}
          onChange={handleCustomTimeChange}
          className="time-input"
        />
      </div>

      {/* Current Selection Display */}
      <div className="current-selection">
        <div className="selection-icon">🎯</div>
        <div className="selection-details">
          <div className="selection-label">Selected Time</div>
          <div className="selection-value">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {' at '}
            {selectedDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickTimePresets;
