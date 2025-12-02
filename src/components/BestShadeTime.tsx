'use client';

import React, { useMemo } from 'react';
import { getSunPosition } from '../utils/sunCalculations';
import { isSectionInSun, getSectionSunExposure } from '../utils/sectionSunCalculations';
import type { StadiumSection } from '../data/stadiumSectionTypes';

interface BestShadeTimeProps {
  section: StadiumSection;
  stadiumLat: number;
  stadiumLon: number;
  stadiumTimezone: string;
  stadiumOrientation?: number;
  selectedDate: string; // YYYY-MM-DD format
}

interface TimeSlot {
  time: string;
  label: string;
  sunExposure: number;
  inShade: boolean;
}

// Common game start times to analyze
const GAME_TIMES = [
  { hour: 11, minute: 0, label: '11:00 AM' },
  { hour: 12, minute: 0, label: '12:00 PM' },
  { hour: 13, minute: 0, label: '1:00 PM' },
  { hour: 13, minute: 30, label: '1:30 PM' },
  { hour: 14, minute: 0, label: '2:00 PM' },
  { hour: 15, minute: 0, label: '3:00 PM' },
  { hour: 16, minute: 0, label: '4:00 PM' },
  { hour: 17, minute: 0, label: '5:00 PM' },
  { hour: 18, minute: 0, label: '6:00 PM' },
  { hour: 19, minute: 0, label: '7:00 PM' },
  { hour: 19, minute: 30, label: '7:30 PM' },
  { hour: 20, minute: 0, label: '8:00 PM' },
];

export function BestShadeTime({
  section,
  stadiumLat,
  stadiumLon,
  stadiumTimezone,
  stadiumOrientation = 0,
  selectedDate,
}: BestShadeTimeProps) {
  // Calculate sun exposure for each time slot
  const timeSlots = useMemo((): TimeSlot[] => {
    const date = new Date(selectedDate);

    return GAME_TIMES.map(({ hour, minute, label }) => {
      const gameTime = new Date(date);
      gameTime.setHours(hour, minute, 0, 0);

      // Get sun position at this time
      const sunPos = getSunPosition(gameTime, stadiumLat, stadiumLon, stadiumTimezone);

      // Skip if sun is below horizon
      if (sunPos.altitudeDegrees < 0) {
        return {
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          label,
          sunExposure: 0,
          inShade: true, // Night time = no sun
        };
      }

      // Calculate sun exposure for this section at this time
      const inSun = isSectionInSun(section, sunPos.azimuthDegrees, sunPos.altitudeDegrees, stadiumOrientation);
      const exposure = getSectionSunExposure(section, sunPos.altitudeDegrees, sunPos.azimuthDegrees, stadiumOrientation);

      return {
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        label,
        sunExposure: exposure,
        inShade: !inSun || exposure < 30,
      };
    });
  }, [section, stadiumLat, stadiumLon, stadiumTimezone, stadiumOrientation, selectedDate]);

  // Find the best times for shade
  const bestTimes = useMemo(() => {
    return timeSlots
      .filter(slot => slot.inShade)
      .sort((a, b) => a.sunExposure - b.sunExposure)
      .slice(0, 3);
  }, [timeSlots]);

  // Count shaded vs sunny time slots
  const shadedCount = timeSlots.filter(s => s.inShade).length;
  const totalCount = timeSlots.length;

  // Get shade status color
  const getStatusColor = (exposure: number): string => {
    if (exposure === 0) return 'bg-blue-600';
    if (exposure < 30) return 'bg-blue-500';
    if (exposure < 50) return 'bg-yellow-500';
    if (exposure < 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // If section is covered, it's always in shade
  if (section.covered) {
    return (
      <div className="best-shade-time p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🏠</span>
          <h4 className="font-semibold text-blue-800">Always Shaded</h4>
        </div>
        <p className="text-sm text-blue-700">
          This section has permanent overhead coverage. You'll be protected from sun at any game time.
        </p>
      </div>
    );
  }

  return (
    <div className="best-shade-time p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">Best Times for Shade</h4>
        <span className="text-sm text-gray-500">
          {shadedCount}/{totalCount} slots in shade
        </span>
      </div>

      {/* Best times recommendation */}
      {bestTimes.length > 0 ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Recommended game times:</p>
          <div className="flex flex-wrap gap-2">
            {bestTimes.map(slot => (
              <div
                key={slot.time}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                <span>🌤️</span>
                <span>{slot.label}</span>
                {slot.sunExposure === 0 && <span className="text-xs">(full shade)</span>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-700">
            ☀️ This section may have sun exposure at most game times. Consider sunscreen or a hat.
          </p>
        </div>
      )}

      {/* Timeline visualization */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Sun exposure by game time:</p>
        <div className="flex gap-0.5 overflow-x-auto pb-2">
          {timeSlots.map(slot => (
            <div key={slot.time} className="flex flex-col items-center min-w-[36px]">
              <div
                className={`w-6 h-6 rounded ${getStatusColor(slot.sunExposure)} flex items-center justify-center`}
                title={`${slot.label}: ${slot.sunExposure}% sun`}
              >
                <span className="text-white text-xs">
                  {slot.sunExposure === 0 ? '✓' : slot.sunExposure < 30 ? '○' : ''}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">
                {slot.label.replace(':00', '').replace(' AM', 'a').replace(' PM', 'p')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t flex flex-wrap gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span>Full shade</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span>Partial sun</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>Full sun</span>
        </div>
      </div>
    </div>
  );
}

export default BestShadeTime;
