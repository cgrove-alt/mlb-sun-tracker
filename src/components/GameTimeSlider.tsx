'use client';

import React, { useState, useCallback } from 'react';
import { SunIcon, ClockIcon } from 'lucide-react';

interface GameTimeSliderProps {
  gameStartTime: string; // HH:mm format
  gameDate: Date;
  onTimeChange: (timeOffset: number) => void; // Minutes from game start
  className?: string;
}

/**
 * GameTimeSlider Component
 * Interactive slider that allows users to see sun exposure at different times during the game
 */
export const GameTimeSlider: React.FC<GameTimeSliderProps> = ({
  gameStartTime,
  gameDate,
  onTimeChange,
  className = '',
}) => {
  const [timeOffset, setTimeOffset] = useState(0); // Minutes from game start
  const GAME_DURATION = 180; // 3 hours (typical game duration)

  // Parse game start time
  const [startHour, startMinute] = gameStartTime.split(':').map(Number);

  // Calculate current time being viewed
  const getCurrentTime = useCallback((offset: number) => {
    const totalMinutes = startHour * 60 + startMinute + offset;
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, [startHour, startMinute]);

  // Get inning label based on time offset
  const getInningLabel = useCallback((offset: number) => {
    const inning = Math.floor(offset / 20) + 1; // Rough estimate: 20 min per inning
    if (inning < 1) return 'Start';
    if (inning > 9) return 'Extra';
    return `${inning}${getOrdinalSuffix(inning)}`;
  }, []);

  function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOffset = parseInt(e.target.value, 10);
    setTimeOffset(newOffset);
    onTimeChange(newOffset);
  };

  // Quick jump buttons
  const jumpToTime = (offset: number) => {
    setTimeOffset(offset);
    onTimeChange(offset);
  };

  const currentTime = getCurrentTime(timeOffset);
  const currentInning = getInningLabel(timeOffset);

  return (
    <div className={`game-time-slider-container ${className}`}>
      <div className="slider-header">
        <div className="slider-title">
          <ClockIcon className="inline-block mr-2 h-5 w-5" />
          <span className="font-semibold">Sun Exposure Timeline</span>
        </div>
        <div className="current-time-display">
          <span className="time-badge">{currentTime}</span>
          <span className="inning-badge">{currentInning} Inning</span>
        </div>
      </div>

      {/* Quick Jump Buttons */}
      <div className="quick-jump-buttons">
        <button
          onClick={() => jumpToTime(0)}
          className={`jump-btn ${timeOffset === 0 ? 'active' : ''}`}
          title="First Pitch"
        >
          Start
        </button>
        <button
          onClick={() => jumpToTime(60)}
          className={`jump-btn ${timeOffset === 60 ? 'active' : ''}`}
          title="3rd Inning"
        >
          3rd
        </button>
        <button
          onClick={() => jumpToTime(120)}
          className={`jump-btn ${timeOffset === 120 ? 'active' : ''}`}
          title="7th Inning"
        >
          7th
        </button>
        <button
          onClick={() => jumpToTime(GAME_DURATION)}
          className={`jump-btn ${timeOffset === GAME_DURATION ? 'active' : ''}`}
          title="Final Out"
        >
          End
        </button>
      </div>

      {/* Slider */}
      <div className="slider-wrapper">
        <div className="slider-track-labels">
          <span className="text-xs text-gray-500">{getCurrentTime(0)}</span>
          <span className="text-xs text-gray-500">{getCurrentTime(GAME_DURATION)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={GAME_DURATION}
          value={timeOffset}
          onChange={handleSliderChange}
          className="time-slider"
          aria-label="Game time slider"
        />
        {/* Time markers */}
        <div className="slider-markers">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="marker"
              style={{ left: `${(idx / 9) * 100}%` }}
              title={getInningLabel(idx * 20)}
            />
          ))}
        </div>
      </div>

      {/* Sun Position Indicator */}
      <div className="sun-position-indicator">
        <SunIcon className="sun-icon" />
        <span className="text-sm text-gray-600">
          Viewing sun position at {currentTime}
        </span>
      </div>

      <style jsx>{`
        .game-time-slider-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .slider-title {
          display: flex;
          align-items: center;
          font-size: 1.125rem;
          color: #1f2937;
        }

        .current-time-display {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .time-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .inning-badge {
          background: #f3f4f6;
          color: #374151;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .quick-jump-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .jump-btn {
          padding: 0.5rem 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .jump-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .jump-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .slider-wrapper {
          position: relative;
          padding: 1rem 0;
        }

        .slider-track-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .time-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            #fbbf24 0%,
            #f59e0b 25%,
            #f97316 50%,
            #dc2626 75%,
            #991b1b 100%
          );
          outline: none;
          cursor: pointer;
        }

        .time-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.15s;
        }

        .time-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .time-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.15s;
        }

        .time-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-markers {
          position: absolute;
          top: 2rem;
          left: 0;
          right: 0;
          height: 8px;
          pointer-events: none;
        }

        .marker {
          position: absolute;
          width: 2px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          transform: translateX(-50%);
        }

        .sun-position-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
        }

        .sun-icon {
          width: 20px;
          height: 20px;
          color: #f59e0b;
        }

        @media (max-width: 640px) {
          .slider-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .quick-jump-buttons {
            width: 100%;
            justify-content: space-between;
          }

          .jump-btn {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GameTimeSlider;
