/**
 * Seat Data Loader
 *
 * Loads seat coordinate data for stadiums asynchronously.
 * Implements caching to avoid repeated file loads.
 */

import { Vector3D } from '../types/stadium-complete';

// TypeScript interfaces for seat data structure
export interface SeatPosition {
  id: string;
  seatNumber: number;
  position: [number, number, number]; // [x, y, z]
}

export interface SeatRow {
  rowNumber: number;
  seats: SeatPosition[];
}

export interface SectionSeatData {
  sectionName: string;
  level: string;
  totalSeats: number;
  rows: SeatRow[];
}

export interface StadiumSeatData {
  stadiumId: string;
  stadiumName: string;
  totalSections: number;
  totalSeats: number;
  generatedAt: string;
  sections: {
    [sectionId: string]: SectionSeatData;
  };
}

// Cache for loaded seat data
const seatDataCache = new Map<string, StadiumSeatData>();

/**
 * Load seat data for a stadium
 * @param stadiumId - ID of the stadium (e.g., 'dodgers')
 * @returns Promise resolving to stadium seat data
 */
export async function loadStadiumSeatData(
  stadiumId: string
): Promise<StadiumSeatData> {
  // Check cache first
  if (seatDataCache.has(stadiumId)) {
    return seatDataCache.get(stadiumId)!;
  }

  // Load from JSON file
  // Note: In production, these should be served as static assets
  const response = await fetch(`/data/seatData/${stadiumId}-seats.json`);

  if (!response.ok) {
    throw new Error(`Failed to load seat data for ${stadiumId}: ${response.status}`);
  }

  const data: StadiumSeatData = await response.json();

  // Cache the data
  seatDataCache.set(stadiumId, data);

  return data;
}

/**
 * Load seat data for a specific section
 * @param stadiumId - ID of the stadium
 * @param sectionId - ID of the section
 * @returns Promise resolving to section seat data
 */
export async function loadSectionSeatData(
  stadiumId: string,
  sectionId: string
): Promise<SectionSeatData | null> {
  const stadiumData = await loadStadiumSeatData(stadiumId);

  return stadiumData.sections[sectionId] || null;
}

/**
 * Get seats as Vector3D array for a section
 * Useful for 3D calculations and rendering
 * @param stadiumId - ID of the stadium
 * @param sectionId - ID of the section
 * @returns Promise resolving to array of seat positions
 */
export async function getSectionSeatsAsVector3D(
  stadiumId: string,
  sectionId: string
): Promise<Array<{ id: string; position: Vector3D }>> {
  const sectionData = await loadSectionSeatData(stadiumId, sectionId);

  if (!sectionData) {
    return [];
  }

  const seats: Array<{ id: string; position: Vector3D }> = [];

  for (const row of sectionData.rows) {
    for (const seat of row.seats) {
      seats.push({
        id: seat.id,
        position: {
          x: seat.position[0],
          y: seat.position[1],
          z: seat.position[2]
        }
      });
    }
  }

  return seats;
}

/**
 * Clear seat data cache (useful for memory management)
 */
export function clearSeatDataCache(): void {
  seatDataCache.clear();
}

/**
 * Check if seat data is cached for a stadium
 * @param stadiumId - ID of the stadium
 * @returns true if cached, false otherwise
 */
export function isSeatDataCached(stadiumId: string): boolean {
  return seatDataCache.has(stadiumId);
}
