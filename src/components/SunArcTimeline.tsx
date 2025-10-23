'use client';

import React, { useState, useMemo } from 'react';
import { getSunPosition } from '../utils/sunCalculations';
import { trackEvent } from '../utils/analytics';

interface SunArcTimelineProps {
  stadiumLatitude: number;
  stadiumLongitude: number;
  stadiumTimezone: string;
  gameDate: Date;
  gameStartTime: string; // Format: "13:10"
  sectionId?: string;
  sunExposureByHour?: Record<number, number>; // hour -> shade percentage (0-100)
  className?: string;
}

interface TimePoint {
  hour: number;
  displayTime: string;
  sunAltitude: number; // Degrees above horizon
  sunAzimuth: number; // Compass bearing
  shadePercentage: number;
}

export function SunArcTimeline({
  stadiumLatitude,
  stadiumLongitude,
  stadiumTimezone,
  gameDate,
  gameStartTime,
  sectionId,
  sunExposureByHour = {},
  className = '',
}: SunArcTimelineProps) {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // Parse game start time
  const [startHour, startMinute] = gameStartTime.split(':').map(Number);

  // Calculate time points (game start + 4 hours for typical game duration)
  const timePoints = useMemo<TimePoint[]>(() => {
    const points: TimePoint[] = [];
    const gameStartDate = new Date(gameDate);
    gameStartDate.setHours(startHour, startMinute, 0, 0);

    // Generate hourly data points from 1 hour before game to 4 hours after
    for (let i = -1; i <= 4; i++) {
      const timeDate = new Date(gameStartDate);
      timeDate.setHours(gameStartDate.getHours() + i);

      const hour = timeDate.getHours();
      const sunPos = getSunPosition(timeDate, stadiumLatitude, stadiumLongitude, stadiumTimezone);

      points.push({
        hour,
        displayTime: formatTime(hour, 0),
        sunAltitude: sunPos.altitude,
        sunAzimuth: sunPos.azimuth,
        shadePercentage: sunExposureByHour[hour] !== undefined ? (100 - sunExposureByHour[hour]) : 50,
      });
    }

    return points;
  }, [gameDate, startHour, startMinute, stadiumLatitude, stadiumLongitude, stadiumTimezone, sunExposureByHour]);

  // Calculate sun arc path for SVG
  const sunArcPath = useMemo(() => {
    const svgWidth = 600;
    const svgHeight = 200;
    const padding = 40;

    const points = timePoints.map((tp, index) => {
      // Map time to X position
      const x = padding + (index / (timePoints.length - 1)) * (svgWidth - 2 * padding);

      // Map altitude to Y position (higher altitude = lower Y)
      const maxAltitude = Math.max(...timePoints.map(t => t.sunAltitude), 60);
      const y = svgHeight - padding - (tp.sunAltitude / maxAltitude) * (svgHeight - 2 * padding);

      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [timePoints]);

  // Handle timeline click
  const handleTimePointClick = (hour: number) => {
    setSelectedHour(hour);
    trackEvent('sun_timeline_click', 'engagement', `Hour: ${hour}`, hour);
  };

  // Format time display
  function formatTime(hour: number, minute: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  const selectedTimePoint = selectedHour !== null
    ? timePoints.find(tp => tp.hour === selectedHour)
    : null;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Sun Position Timeline
        </h3>
        <p className="text-sm text-gray-600">
          Track the sun's path during the game. {sectionId && `Shade data for Section ${sectionId}.`}
        </p>
      </div>

      {/* Sun Arc Visualization */}
      <div className="mb-6">
        <svg
          viewBox="0 0 600 200"
          className="w-full h-auto"
          style={{ maxHeight: '200px' }}
        >
          {/* Grid lines */}
          <g className="grid-lines" opacity="0.2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={`grid-${i}`}
                x1={40 + (i * (600 - 80) / 5)}
                y1="20"
                x2={40 + (i * (600 - 80) / 5)}
                y2="180"
                stroke="#9ca3af"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
          </g>

          {/* Horizon line */}
          <line
            x1="40"
            y1="180"
            x2="560"
            y2="180"
            stroke="#6b7280"
            strokeWidth="2"
          />

          {/* Sun arc path */}
          <path
            d={sunArcPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Time point markers */}
          {timePoints.map((tp, index) => {
            const x = 40 + (index / (timePoints.length - 1)) * (600 - 80);
            const maxAltitude = Math.max(...timePoints.map(t => t.sunAltitude), 60);
            const y = 200 - 40 - (tp.sunAltitude / maxAltitude) * (200 - 60);

            const isSelected = tp.hour === selectedHour;
            const isGameStart = index === 1; // Index 1 is game start (after -1 hour)

            return (
              <g key={`point-${tp.hour}`}>
                {/* Marker circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : isGameStart ? 6 : 4}
                  fill={isGameStart ? '#ef4444' : isSelected ? '#f59e0b' : '#fbbf24'}
                  stroke={isSelected ? '#ffffff' : 'none'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all hover:r-6"
                  onClick={() => handleTimePointClick(tp.hour)}
                />

                {/* Game start indicator */}
                {isGameStart && (
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#ef4444"
                    fontWeight="bold"
                  >
                    START
                  </text>
                )}
              </g>
            );
          })}

          {/* Axis labels */}
          {timePoints.map((tp, index) => {
            const x = 40 + (index / (timePoints.length - 1)) * (600 - 80);
            return (
              <text
                key={`label-${tp.hour}`}
                x={x}
                y="195"
                textAnchor="middle"
                fontSize="11"
                fill="#6b7280"
              >
                {tp.displayTime}
              </text>
            );
          })}

          {/* Sun icon at current selected point */}
          {selectedTimePoint && (
            <g>
              <circle
                cx={40 + (timePoints.findIndex(tp => tp.hour === selectedHour) / (timePoints.length - 1)) * (600 - 80)}
                cy={200 - 40 - (selectedTimePoint.sunAltitude / Math.max(...timePoints.map(t => t.sunAltitude), 60)) * (200 - 60)}
                r="12"
                fill="#fbbf24"
                opacity="0.3"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Timeline Ruler */}
      <div className="relative h-16 bg-gradient-to-r from-blue-100 via-yellow-50 to-orange-100 rounded-lg mb-4">
        <div className="absolute inset-0 flex">
          {timePoints.map((tp, index) => {
            const isSelected = tp.hour === selectedHour;
            const isGameStart = index === 1;

            return (
              <button
                key={`ruler-${tp.hour}`}
                className={`flex-1 relative group transition-all ${
                  isSelected ? 'bg-accent-500 bg-opacity-20' : 'hover:bg-white hover:bg-opacity-30'
                }`}
                onClick={() => handleTimePointClick(tp.hour)}
              >
                {/* Shade percentage indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 opacity-40 transition-all"
                  style={{ height: `${tp.shadePercentage}%` }}
                />

                {/* Time marker */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-400" />

                {/* Game start indicator */}
                {isGameStart && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-red-500" />
                )}

                {/* Tooltip on hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
                    {tp.displayTime}
                    <br />
                    {tp.shadePercentage.toFixed(0)}% shade
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Time Details */}
      {selectedTimePoint && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</div>
              <div className="text-lg font-bold text-gray-900">{selectedTimePoint.displayTime}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sun Altitude</div>
              <div className="text-lg font-bold text-gray-900">{selectedTimePoint.sunAltitude.toFixed(1)}°</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sun Bearing</div>
              <div className="text-lg font-bold text-gray-900">{selectedTimePoint.sunAzimuth.toFixed(0)}°</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shade</div>
              <div className="text-lg font-bold text-gray-900">{selectedTimePoint.shadePercentage.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span>Game Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400" />
          <span>Sun Position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 opacity-40" />
          <span>Shade Percentage</span>
        </div>
      </div>
    </div>
  );
}
