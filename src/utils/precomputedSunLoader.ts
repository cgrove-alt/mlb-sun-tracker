/**
 * Precomputed Sun Data Loader
 * Loads and queries pre-computed sun exposure data from compressed files
 * Created: 2025-10-21
 */

import { gunzipSync } from 'zlib';
import * as fs from 'fs';
import * as path from 'path';

interface PrecomputedSeatData {
  seatId: string;
  timeline: string[]; // Binary strings: ["001111...", "111000...", ...]
}

interface PrecomputedData {
  stadiumId: string;
  gameTime: string;
  generatedDate: string;
  timezone: string;
  dates: string[]; // ISO date strings: ["2025-04-05", ...]
  timePoints: string[]; // Time strings: ["13:10", "13:25", ...]
  seats: Record<string, PrecomputedSeatData>;
}

// In-memory cache to avoid repeated decompression
const dataCache = new Map<string, PrecomputedData>();

/**
 * Load and decompress precomputed sun data
 */
export async function loadPrecomputedSunData(
  stadiumId: string,
  gameTime: string = '13:10'
): Promise<PrecomputedData | null> {
  const cacheKey = `${stadiumId}-${gameTime}`;

  // Check cache first
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey)!;
  }

  try {
    // Construct file path
    const fileName = `precomputed-sun-${gameTime.replace(':', '')}pm.json.gz`;
    const filePath = path.join(
      process.cwd(),
      'src',
      'data',
      'seatData',
      stadiumId,
      fileName
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Precomputed data not found: ${filePath}`);
      return null;
    }

    // Read and decompress
    const compressed = fs.readFileSync(filePath);
    const decompressed = gunzipSync(compressed);
    const data: PrecomputedData = JSON.parse(decompressed.toString('utf-8'));

    // Cache the decompressed data
    dataCache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error(`Failed to load precomputed data for ${stadiumId}:`, error);
    return null;
  }
}

/**
 * Get sun exposure for a specific seat at a specific date/time
 */
export function getSunExposureForSeat(
  data: PrecomputedData,
  seatId: string,
  date: Date,
  time?: Date
): boolean | null {
  const seatData = data.seats[seatId];
  if (!seatData) {
    return null; // Seat not found
  }

  // Find closest date match
  const targetDateStr = date.toISOString().split('T')[0];
  const dateIndex = findClosestDateIndex(data.dates, targetDateStr);
  if (dateIndex === -1) {
    return null; // Date out of range
  }

  // Get timeline for this date
  const timeline = seatData.timeline[dateIndex];
  if (!timeline) {
    return null;
  }

  // If no specific time provided, check game start time
  if (!time) {
    return timeline[0] === '1';
  }

  // Find closest time point
  const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
  const timeIndex = findClosestTimeIndex(data.timePoints, timeStr);
  if (timeIndex === -1) {
    return null; // Time out of range
  }

  // Return sun exposure at this time point
  return timeline[timeIndex] === '1';
}

/**
 * Get full timeline for a seat on a specific date
 */
export function getSeatTimeline(
  data: PrecomputedData,
  seatId: string,
  date: Date
): Array<{ time: string; inSun: boolean }> | null {
  const seatData = data.seats[seatId];
  if (!seatData) {
    return null;
  }

  // Find closest date match
  const targetDateStr = date.toISOString().split('T')[0];
  const dateIndex = findClosestDateIndex(data.dates, targetDateStr);
  if (dateIndex === -1) {
    return null;
  }

  const timeline = seatData.timeline[dateIndex];
  if (!timeline) {
    return null;
  }

  // Convert binary timeline to array of time/exposure pairs
  return data.timePoints.map((time, index) => ({
    time,
    inSun: timeline[index] === '1',
  }));
}

/**
 * Get sun exposure summary for a seat (percentage in sun across all time points)
 */
export function getSeatSunSummary(
  data: PrecomputedData,
  seatId: string,
  date: Date
): { percentInSun: number; totalTimePoints: number } | null {
  const timeline = getSeatTimeline(data, seatId, date);
  if (!timeline) {
    return null;
  }

  const inSunCount = timeline.filter((t) => t.inSun).length;
  return {
    percentInSun: (inSunCount / timeline.length) * 100,
    totalTimePoints: timeline.length,
  };
}

/**
 * Find the closest date index for weekly granularity
 */
function findClosestDateIndex(dates: string[], targetDate: string): number {
  const target = new Date(targetDate);
  let closestIndex = -1;
  let minDiff = Infinity;

  dates.forEach((dateStr, index) => {
    const date = new Date(dateStr);
    const diff = Math.abs(target.getTime() - date.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });

  // Only return if within 7 days (weekly granularity tolerance)
  const maxDiff = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return minDiff <= maxDiff ? closestIndex : -1;
}

/**
 * Find the closest time point index
 */
function findClosestTimeIndex(timePoints: string[], targetTime: string): number {
  const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
  const targetMinutesTotal = targetHours * 60 + targetMinutes;

  let closestIndex = -1;
  let minDiff = Infinity;

  timePoints.forEach((timeStr, index) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const minutesTotal = hours * 60 + minutes;
    const diff = Math.abs(targetMinutesTotal - minutesTotal);

    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });

  // Only return if within 30 minutes (reasonable tolerance for 15-min intervals)
  return minDiff <= 30 ? closestIndex : -1;
}

/**
 * Get all seats in a section with sun exposure at a specific time
 */
export function getSectionSunExposure(
  data: PrecomputedData,
  sectionId: string,
  date: Date,
  time?: Date
): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  // Filter seats by section
  Object.keys(data.seats).forEach((seatId) => {
    if (seatId.includes(`-${sectionId}-`)) {
      const exposure = getSunExposureForSeat(data, seatId, date, time);
      if (exposure !== null) {
        result[seatId] = exposure;
      }
    }
  });

  return result;
}

/**
 * Clear the data cache (useful for testing or memory management)
 */
export function clearCache(): void {
  dataCache.clear();
}
