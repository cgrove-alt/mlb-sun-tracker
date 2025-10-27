'use client';

import { useState, useEffect } from 'react';
import pako from 'pako';

interface SunExposureData {
  stadiumId: string;
  gameTime: string;
  generatedDate: string;
  timezone: string;
  dates: string[];
  timePoints: string[];
  seats: Record<string, {
    seatId: string;
    timeline: string[]; // Array of strings, one per date, each char is a time point
  }>;
}

interface UseSunExposureOptions {
  stadiumId: string;
  gameTime?: string;  // Format: "HH:MM" e.g. "13:10"
  gameDate?: Date;
  enabled?: boolean;
}

interface UseSunExposureResult {
  data: Record<string, boolean> | null;  // Map of seatId → inDirectSun
  isLoading: boolean;
  error: Error | null;
}

// Helper to find closest date in the precomputed data
function findClosestDateIndex(targetDate: Date, availableDates: string[]): number {
  const targetTime = targetDate.getTime();
  let closestIndex = 0;
  let smallestDiff = Math.abs(new Date(availableDates[0]).getTime() - targetTime);

  for (let i = 1; i < availableDates.length; i++) {
    const diff = Math.abs(new Date(availableDates[i]).getTime() - targetTime);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

// Helper to find closest time point
function findClosestTimeIndex(targetTime: string, availableTimePoints: string[]): number {
  const [targetHour, targetMin] = targetTime.split(':').map(Number);
  const targetMinutes = targetHour * 60 + targetMin;

  let closestIndex = 0;
  let smallestDiff = Math.abs(
    (parseInt(availableTimePoints[0].split(':')[0]) * 60 + parseInt(availableTimePoints[0].split(':')[1])) - targetMinutes
  );

  for (let i = 1; i < availableTimePoints.length; i++) {
    const [hour, min] = availableTimePoints[i].split(':').map(Number);
    const minutes = hour * 60 + min;
    const diff = Math.abs(minutes - targetMinutes);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

export function useSunExposure(options: UseSunExposureOptions): UseSunExposureResult {
  const { stadiumId, gameTime = '13:10', gameDate = new Date(), enabled = true } = options;

  const [data, setData] = useState<Record<string, boolean> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSunData() {
      try {
        setIsLoading(true);
        setError(null);

        // Format game time for filename (e.g., "13:10" → "1310pm", "07:05" → "0705am")
        const [hours, minutes] = gameTime.split(':');
        const hourNum = parseInt(hours, 10);
        const timeStr = hours.padStart(2, '0') + minutes.padStart(2, '0'); // Ensure 4 digits
        const ampm = hourNum >= 12 ? 'pm' : 'am';

        // Try test file first (temporary while generating full data)
        const testFilename = `precomputed-sun-${timeStr}${ampm}-test.json.gz`;
        const filename = `precomputed-sun-${timeStr}${ampm}.json.gz`;

        // Try to fetch stadium-specific pre-computed file (try test file first)
        const stadiumTestPath = `/data/sun/${stadiumId}/${testFilename}`;
        const stadiumPath = `/data/sun/${stadiumId}/${filename}`;
        const genericPath = `/data/sun/${filename}`;

        let response = await fetch(stadiumTestPath);
        if (!response.ok) {
          // Try non-test file
          response = await fetch(stadiumPath);
          if (!response.ok) {
            // Fallback to generic path if stadium-specific doesn't exist
            response = await fetch(genericPath);
            if (!response.ok) {
              // If no pre-computed data exists, we should calculate in real-time
              console.warn(`No pre-computed sun data found for ${gameTime}. Would need real-time calculation.`);
              // For now, return empty data - in production would calculate here
              setData({});
              setIsLoading(false);
              return;
            }
          }
        }

        const compressedData = await response.arrayBuffer();

        // Decompress using pako
        const decompressed = pako.ungzip(new Uint8Array(compressedData), { to: 'string' });
        const sunData: SunExposureData = JSON.parse(decompressed);

        if (cancelled) return;

        // Find closest date and time in the precomputed data
        const dateIndex = findClosestDateIndex(gameDate, sunData.dates);
        const timeIndex = findClosestTimeIndex(gameTime, sunData.timePoints);

        // Build the exposure map
        const exposureMap: Record<string, boolean> = {};

        Object.entries(sunData.seats).forEach(([seatId, seatData]) => {
          const dateTimeline = seatData.timeline[dateIndex];
          if (dateTimeline && dateTimeline[timeIndex]) {
            exposureMap[seatId] = dateTimeline[timeIndex] === '1';
          } else {
            exposureMap[seatId] = false; // Default to shade if no data
          }
        });

        if (!cancelled) {
          setData(exposureMap);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load sun data'));
          setIsLoading(false);
        }
      }
    }

    loadSunData();

    return () => {
      cancelled = true;
    };
  }, [stadiumId, gameTime, gameDate, enabled]);

  return { data, isLoading, error };
}
