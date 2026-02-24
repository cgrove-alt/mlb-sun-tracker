// MLB 3D Shade Calculator Integration
// Bridges MLB stadium data with OptimizedShadeCalculator3D

import {
  OptimizedShadeCalculator3D,
  Stadium3DModel,
  SectionGeometry,
  Obstruction,
  Seat,
  SunPosition,
  SectionShadeResult,
  createSunPosition
} from './shadeCalculation3DOptimized';
import { getStadiumCompleteData } from '../data/stadium-data-aggregator';
import { DetailedSection, Obstruction3D, Vector3D } from '../types/stadium-complete';
import { shadeCalculationCache } from './cacheManager';

export interface MLB3DCalculationOptions {
  useCache?: boolean;
  useWebWorkers?: boolean;
  lodLevel?: 'high' | 'medium' | 'low';
  onProgress?: (progress: number, message: string) => void;
}

export interface MLB3DCalculationResult {
  stadiumId: string;
  date: Date;
  time: string;
  sunPosition: SunPosition;
  sections: Map<string, SectionShadeResult>;
  calculationTime: number;
  fromCache: boolean;
}

/**
 * Convert DetailedSection to SectionGeometry for 3D calculator
 */
function convertToSectionGeometry(section: DetailedSection): SectionGeometry {
  const seats: Seat[] = [];

  // Generate seats from row data
  if (section.rows && section.rows.length > 0) {
    let seatId = 0;
    section.rows.forEach((row, rowIndex) => {
      const rowNumber = parseInt(row.rowNumber) || (rowIndex + 1);
      const numSeats = row.seats || 20;
      const rowElevation = row.elevation || 0;
      const rowDepth = row.depth || rowIndex * 2.8;

      // Calculate seat positions based on section geometry
      const angleStart = section.baseAngle * Math.PI / 180;
      const angleSpan = section.angleSpan * Math.PI / 180;
      const sectionCenterAngle = angleStart + angleSpan / 2;

      // Base distance from origin for this section
      const baseDistance = section.distance || 150;
      const seatDistance = baseDistance + rowDepth;

      for (let seatNum = 0; seatNum < numSeats; seatNum++) {
        // Distribute seats across the section angle span
        const seatAngle = angleStart + (seatNum / numSeats) * angleSpan;

        seats.push({
          id: `${section.id}-R${rowNumber}-S${seatNum + 1}`,
          sectionId: section.id,
          row: rowNumber,
          seatNumber: seatNum + 1,
          position: {
            x: seatDistance * Math.cos(seatAngle),
            y: seatDistance * Math.sin(seatAngle),
            z: rowElevation
          }
        });
        seatId++;
      }
    });
  } else {
    // Fallback: generate default seats if no row data
    const numRows = 20;
    const seatsPerRow = 20;

    for (let rowNum = 0; rowNum < numRows; rowNum++) {
      const rowElevation = (section.height || 0) + rowNum * 2.5;
      const rowDepth = rowNum * 2.8;

      for (let seatNum = 0; seatNum < seatsPerRow; seatNum++) {
        const angleStart = section.baseAngle * Math.PI / 180;
        const angleSpan = section.angleSpan * Math.PI / 180;
        const seatAngle = angleStart + (seatNum / seatsPerRow) * angleSpan;
        const seatDistance = (section.distance || 150) + rowDepth;

        seats.push({
          id: `${section.id}-R${rowNum + 1}-S${seatNum + 1}`,
          sectionId: section.id,
          row: rowNum + 1,
          seatNumber: seatNum + 1,
          position: {
            x: seatDistance * Math.cos(seatAngle),
            y: seatDistance * Math.sin(seatAngle),
            z: rowElevation
          }
        });
      }
    }
  }

  // Map DetailedSection level to SectionGeometry level (filter out 'standing')
  const level = section.level === 'standing' ? 'field' : section.level;

  return {
    id: section.id,
    name: section.name,
    level: level as 'field' | 'lower' | 'club' | 'upper' | 'suite',
    vertices: section.vertices3D || [],
    seats,
    baseAngle: section.baseAngle,
    angleSpan: section.angleSpan
  };
}

/**
 * Convert Obstruction3D to Obstruction for 3D calculator
 */
function convertToObstruction(obstruction: Obstruction3D): Obstruction {
  // Map Obstruction3D types to Obstruction types
  const typeMap: Record<string, Obstruction['type']> = {
    'roof': 'roof',
    'upper_deck': 'upper_deck',
    'overhang': 'overhang',
    'scoreboard': 'scoreboard',
    'structure': 'structure',
    'facade': 'overhang', // Map facade to overhang
    'canopy': 'overhang', // Map canopy to overhang
    'tree': 'structure' // Map tree to structure
  };

  return {
    id: obstruction.id,
    type: typeMap[obstruction.type] || 'structure',
    boundingBox: obstruction.boundingBox,
    opacity: obstruction.material?.opacity || 1.0
  };
}

/**
 * Load MLB stadium as 3D model
 */
export function loadMLBStadium3D(
  stadiumId: string,
  latitude: number,
  longitude: number,
  orientation: number = 0
): Stadium3DModel {
  // Get complete stadium data (sections + obstructions)
  const { sections: detailedSections, obstructions: obstructions3D } =
    getStadiumCompleteData(stadiumId, 'MLB');

  // Convert sections to 3D geometry
  const sections: SectionGeometry[] = detailedSections.map(convertToSectionGeometry);

  // Convert obstructions
  const obstructions: Obstruction[] = obstructions3D.map(convertToObstruction);

  return {
    id: stadiumId,
    sections,
    obstructions,
    origin: { x: 0, y: 0, z: 0 }, // Home plate at origin
    orientation
  };
}

/**
 * Calculate shade for MLB stadium using 3D calculator
 */
export async function calculateMLBStadiumShade3D(
  stadiumId: string,
  stadiumName: string,
  latitude: number,
  longitude: number,
  orientation: number,
  date: Date,
  time: string,
  options: MLB3DCalculationOptions = {}
): Promise<MLB3DCalculationResult> {
  const {
    useCache = true,
    useWebWorkers = false,
    lodLevel = 'medium',
    onProgress
  } = options;

  const startTime = performance.now();

  // Parse time
  const [hour, minute] = time.split(':').map(Number);
  const targetDate = new Date(date);
  targetDate.setHours(hour, minute, 0, 0);

  // Generate cache key
  const cacheKey = useCache ? shadeCalculationCache.generateKey({
    stadiumId,
    date,
    time,
    weather: 'clear'
  }) : null;

  // Check cache
  if (cacheKey && useCache) {
    onProgress?.(10, 'Checking cache...');
    const cached = await shadeCalculationCache.get<Record<string, SectionShadeResult>>(cacheKey);

    if (cached) {
      // Convert plain object back to Map
      const sectionsMap = new Map<string, SectionShadeResult>(Object.entries(cached));

      const endTime = performance.now();

      return {
        stadiumId,
        date,
        time,
        sunPosition: calculateSunPosition(targetDate, latitude, longitude),
        sections: sectionsMap,
        calculationTime: endTime - startTime,
        fromCache: true
      };
    }
  }

  onProgress?.(20, 'Loading stadium 3D model...');

  // Load stadium 3D model
  const stadium3D = loadMLBStadium3D(stadiumId, latitude, longitude, orientation);

  onProgress?.(30, 'Initializing 3D calculator...');

  // Create calculator instance
  const calculator = new OptimizedShadeCalculator3D(stadium3D, useWebWorkers);

  onProgress?.(40, 'Calculating sun position...');

  // Calculate sun position
  const sunPosition = calculateSunPosition(targetDate, latitude, longitude);

  onProgress?.(50, 'Calculating shade for all sections...');

  // Calculate shade for all sections
  const sections = calculator.calculateAllSectionsOptimized(sunPosition);

  onProgress?.(90, 'Saving to cache...');

  // Cache results
  if (cacheKey && useCache) {
    // Convert Map to plain object for caching
    const sectionsObj = Object.fromEntries(sections);
    await shadeCalculationCache.set(cacheKey, sectionsObj);
  }

  // Cleanup
  calculator.destroy();

  const endTime = performance.now();

  onProgress?.(100, 'Complete!');

  return {
    stadiumId,
    date,
    time,
    sunPosition,
    sections,
    calculationTime: endTime - startTime,
    fromCache: false
  };
}

/**
 * Calculate sun position using solar algorithms
 */
function calculateSunPosition(date: Date, latitude: number, longitude: number): SunPosition {
  // Use a simple solar position algorithm
  // This is a placeholder - in production, use NREL SPA or SunCalc

  const julianDay = getJulianDay(date);
  const centuriesSinceJ2000 = (julianDay - 2451545.0) / 36525.0;

  // Mean longitude of sun
  const L0 = (280.46646 + centuriesSinceJ2000 * (36000.76983 + centuriesSinceJ2000 * 0.0003032)) % 360;

  // Mean anomaly of sun
  const M = (357.52911 + centuriesSinceJ2000 * (35999.05029 - 0.0001537 * centuriesSinceJ2000)) % 360;

  // Equation of center
  const C = Math.sin(M * Math.PI / 180) * (1.914602 - centuriesSinceJ2000 * (0.004817 + 0.000014 * centuriesSinceJ2000)) +
            Math.sin(2 * M * Math.PI / 180) * (0.019993 - 0.000101 * centuriesSinceJ2000) +
            Math.sin(3 * M * Math.PI / 180) * 0.000289;

  // True longitude
  const trueLongitude = L0 + C;

  // Ecliptic longitude
  const lambda = trueLongitude - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * centuriesSinceJ2000) * Math.PI / 180);

  // Obliquity of ecliptic
  const epsilon = 23.439291 - centuriesSinceJ2000 * (0.0130042 + centuriesSinceJ2000 * (0.00000016 - centuriesSinceJ2000 * 0.000000504));

  // Declination
  const delta = Math.asin(Math.sin(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180)) * 180 / Math.PI;

  // Hour angle
  const hourAngle = getHourAngle(date, longitude);

  // Altitude (elevation)
  const sinAlt = Math.sin(latitude * Math.PI / 180) * Math.sin(delta * Math.PI / 180) +
                 Math.cos(latitude * Math.PI / 180) * Math.cos(delta * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180);
  const altitude = Math.asin(sinAlt) * 180 / Math.PI;

  // Azimuth
  const cosAz = (Math.sin(delta * Math.PI / 180) - Math.sin(latitude * Math.PI / 180) * sinAlt) /
                (Math.cos(latitude * Math.PI / 180) * Math.cos(altitude * Math.PI / 180));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;

  // Adjust azimuth based on hour angle
  if (hourAngle > 0) {
    azimuth = 360 - azimuth;
  }

  return createSunPosition(azimuth, altitude);
}

function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const fractionalDay = (hour - 12) / 24 + minute / 1440 + second / 86400;

  return jdn + fractionalDay;
}

function getHourAngle(date: Date, longitude: number): number {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  const decimalHours = hours + minutes / 60 + seconds / 3600;
  const localSolarTime = decimalHours + longitude / 15;

  const hourAngle = (localSolarTime - 12) * 15;

  return hourAngle;
}

/**
 * Batch calculate shade for multiple times
 */
export async function calculateMLBStadiumShadeBatch(
  stadiumId: string,
  stadiumName: string,
  latitude: number,
  longitude: number,
  orientation: number,
  date: Date,
  times: string[],
  options: MLB3DCalculationOptions = {}
): Promise<MLB3DCalculationResult[]> {
  const results: MLB3DCalculationResult[] = [];

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    options.onProgress?.(
      (i / times.length) * 100,
      `Calculating ${i + 1}/${times.length}: ${time}`
    );

    const result = await calculateMLBStadiumShade3D(
      stadiumId,
      stadiumName,
      latitude,
      longitude,
      orientation,
      date,
      time,
      { ...options, onProgress: undefined } // Don't pass nested progress
    );

    results.push(result);
  }

  options.onProgress?.(100, 'All calculations complete');

  return results;
}
