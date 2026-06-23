// sunCalculator.ts
import SunCalc from 'suncalc';
import type { CoverageDetail } from '../types/stadium-complete';

interface Stadium {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  roofType?: 'open' | 'fixed' | 'retractable';
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  orientation?: number;
  sections?: Section[];
}

interface Section {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  side?: 'home' | 'first' | 'third' | 'outfield';
  angle?: number;
  depth?: number;
  covered?: boolean;
}

interface SunPosition {
  altitude: number;
  azimuth: number;
  elevation: string;
  isDay: boolean;
  solarNoon: Date;
  sunrise: Date;
  sunset: Date;
  goldenHour: Date;
  civilTwilight: {
    start: Date;
    end: Date;
  };
}

interface ShadowData {
  sectionId: string;
  coverage: number;
  inShadow: boolean;
  shadowSources: {
    roof: number;
    upperDeck: number;
    bowl: number;
  };
  sunExposure: number;
}

interface StadiumGeometry {
  roofHeight: number;
  roofOverhang: number;
  upperDeckHeight: number;
  fieldLevel: number;
  homeplate: { x: number; y: number };
  orientation: number;
}

export class SunCalculator {
  private stadium: Stadium;
  private stadiumGeometry: StadiumGeometry;

  constructor(stadium: Stadium) {
    this.stadium = stadium;
    this.stadiumGeometry = this.initializeStadiumGeometry();
  }

  private initializeStadiumGeometry(): StadiumGeometry {
    return {
      roofHeight: this.stadium.roofHeight || 150,
      roofOverhang: this.stadium.roofOverhang || 50,
      upperDeckHeight: this.stadium.upperDeckHeight || 100,
      fieldLevel: 0,
      homeplate: { x: 0, y: 0 },
      orientation: this.stadium.orientation || 0
    };
  }

  /**
   * Compute sun position for a UTC instant at this stadium's lat/lon.
   * Caller MUST pass a Date whose .getTime() is the correct UTC moment —
   * use src/utils/stadiumTime.ts#stadiumLocalToUTC to convert a stadium-
   * local wall-clock time to UTC. String inputs are no longer accepted
   * because they cannot be parsed safely without timezone information.
   */
  calculateSunPosition(date: Date): SunPosition {
    const dateTime = date;

    const sunPos = SunCalc.getPosition(
      dateTime,
      this.stadium.latitude,
      this.stadium.longitude,
    );
    const altitude = (sunPos.altitude * 180) / Math.PI;
    const azimuth = ((sunPos.azimuth * 180) / Math.PI + 180) % 360;

    const sunTimes = SunCalc.getTimes(
      dateTime,
      this.stadium.latitude,
      this.stadium.longitude,
    );
    
    return {
      altitude,
      azimuth,
      elevation: this.getElevationAngle(altitude * Math.PI / 180),
      isDay: dateTime > sunTimes.sunrise && dateTime < sunTimes.sunset,
      solarNoon: sunTimes.solarNoon,
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      goldenHour: sunTimes.goldenHour,
      civilTwilight: {
        start: sunTimes.dawn,
        end: sunTimes.dusk
      }
    };
  }

  private getElevationAngle(altitudeRad: number): string {
    const altitudeDeg = altitudeRad * 180 / Math.PI;
    if (altitudeDeg < 0) return 'below_horizon';
    if (altitudeDeg < 10) return 'very_low';
    if (altitudeDeg < 30) return 'low';
    if (altitudeDeg < 50) return 'medium';
    if (altitudeDeg < 70) return 'high';
    return 'very_high';
  }

  calculateShadows(sunPosition: SunPosition, sections: Section[]): ShadowData[] {
    const shadows: ShadowData[] = [];
    const { altitude, azimuth } = sunPosition;
    
    if (altitude <= 0) {
      return sections.map(section => ({
        sectionId: section.id,
        coverage: 0,
        inShadow: false,
        shadowSources: {
          roof: 0,
          upperDeck: 0,
          bowl: 0
        },
        sunExposure: 0
      }));
    }
    
    sections.forEach(section => {
      const shadowData = this.calculateSectionShadow(section, altitude, azimuth);
      shadows.push(shadowData);
    });
    
    return shadows;
  }

  private calculateSectionShadow(section: Section, sunAltitude: number, sunAzimuth: number): ShadowData {
    // CRITICAL: Check if section is covered FIRST
    // Covered sections should ALWAYS return 0% sun exposure regardless of sun position
    if (section.covered === true) {
      return {
        sectionId: section.id,
        coverage: 100,
        inShadow: true,
        shadowSources: {
          roof: 100, // Covered sections have permanent roof coverage
          upperDeck: 0,
          bowl: 0
        },
        sunExposure: 0 // ZERO sun exposure for covered sections
      };
    }
    
    // Don't adjust azimuth - sun and section angles are already in absolute compass coordinates
    
    // Basic sun exposure logic: sections on same side as sun get exposure
    const sectionAngle = this.getSectionAngle(section);
    let angleDiff = Math.abs(sunAzimuth - sectionAngle);
    if (angleDiff > 180) {
      angleDiff = 360 - angleDiff;
    }
    
    // If section is not on same side as sun, it's in shadow
    let baseSunExposure = 100;
    if (angleDiff > 90) {
      baseSunExposure = 0; // Section on opposite side from sun
    } else {
      // Reduce exposure based on angle (direct sun = 100%, glancing = less)
      baseSunExposure = 100 * Math.cos((angleDiff / 90) * Math.PI / 2);
    }
    
    // Apply altitude factor (low sun = less exposure)
    if (sunAltitude < 0) {
      baseSunExposure = 0;
    } else if (sunAltitude < 30) {
      baseSunExposure *= (sunAltitude / 30);
    }
    
    // Calculate shadow coverage from structures
    const roofShadow = this.calculateRoofShadow(section, sunAltitude, sunAzimuth);
    const upperDeckShadow = section.level === 'field' || section.level === 'lower' 
      ? this.calculateUpperDeckShadow(section, sunAltitude, sunAzimuth)
      : 0;
    const bowlShadow = this.calculateBowlShadow(section, sunAltitude, sunAzimuth);
    
    const totalCoverage = Math.min(100, roofShadow + upperDeckShadow + bowlShadow);
    
    // Final sun exposure is base exposure minus shadow coverage
    const finalSunExposure = Math.max(0, baseSunExposure * (1 - totalCoverage / 100));
    
    return {
      sectionId: section.id,
      coverage: Math.round(totalCoverage),
      inShadow: finalSunExposure < 50,
      shadowSources: {
        roof: roofShadow,
        upperDeck: upperDeckShadow,
        bowl: bowlShadow
      },
      sunExposure: Math.round(finalSunExposure)
    };
  }

  private calculateRoofShadow(section: Section, sunAltitude: number, sunAzimuth: number): number {
    if (sunAltitude <= 0) return 0;
    
    // Fixed roof stadiums always have 100% coverage
    if (this.stadium.roofType === 'fixed') return 100;
    
    // For covered sections, they MUST always have complete coverage
    // This is a critical fix - covered sections have permanent overhead protection
    if (section.covered === true) {
      return 100; // Covered sections provide COMPLETE protection from direct sun
    }
    
    // For retractable roofs when closed, all sections are covered
    if (this.stadium.roofType === 'retractable') {
      // Assume roof is closed for this calculation (can be made dynamic later)
      // For now, check if there's overhang shadow for open roof scenario
      if (this.stadiumGeometry.roofOverhang && sunAltitude > 0) {
        // Calculate shadow cast by roof overhang
        const shadowLength = this.stadiumGeometry.roofHeight / Math.tan(sunAltitude * Math.PI / 180);
        const overhangDepth = this.stadiumGeometry.roofOverhang;
        
        if (shadowLength > 0 && shadowLength <= overhangDepth) {
          // Full shadow from overhang
          return 100;
        } else if (shadowLength > 0 && shadowLength < overhangDepth * 2) {
          // Partial shadow from overhang
          return Math.max(50, 100 - ((shadowLength - overhangDepth) / overhangDepth) * 50);
        }
      }
    }
    
    return 0;
  }

  private calculateUpperDeckShadow(section: Section, sunAltitude: number, sunAzimuth: number): number {
    if (sunAltitude <= 0) return 0;
    
    const shadowLength = this.stadiumGeometry.upperDeckHeight / Math.tan(sunAltitude * Math.PI / 180);
    const shadowDirection = (sunAzimuth + 180) % 360;
    
    const sectionAngle = this.getSectionAngle(section);
    const angleDiff = Math.abs(shadowDirection - sectionAngle);
    
    if (angleDiff > 60 && angleDiff < 300) {
      return 0;
    }
    
    const coverage = (shadowLength / (section.depth || 50)) * 50;
    return Math.min(50, coverage);
  }

  private calculateBowlShadow(section: Section, sunAltitude: number, sunAzimuth: number): number {
    // Bowl shadow only matters for very low sun angles
    if (sunAltitude > 30) return 0;
    
    // Low sun creates some shadow from the stadium bowl structure
    const shadowFactor = (30 - sunAltitude) / 30;
    return shadowFactor * 20; // Max 20% shadow from bowl at very low sun
  }

  private getSectionAngle(section: Section): number {
    // section.angle already contains the absolute compass angle (baseAngle from stadiumSections data)
    // Don't add stadium orientation - it's already included in the baseAngle
    if (section.angle !== undefined) {
      return section.angle;
    }
    
    // Fallback for sections without explicit angle - use side-based defaults
    const baseAngle: Record<string, number> = {
      'home': 0,
      'first': 90,
      'outfield': 180,
      'third': 270
    };
    
    const side = section.side || 'home';
    // Only add orientation if using default angles (which are relative to stadium)
    return (baseAngle[side] || 0) + this.stadiumGeometry.orientation;
  }

  projectShadow(origin: { x: number; y: number }, azimuth: number, length: number): { x: number; y: number } {
    const shadowAzimuth = (azimuth + 180) % 360;
    const shadowRad = shadowAzimuth * Math.PI / 180;
    
    return {
      x: origin.x + length * Math.sin(shadowRad),
      y: origin.y + length * Math.cos(shadowRad)
    };
  }

  calculateTimeInSun(section: Section, gameStartTime: string | Date, gameDuration: number = 3): { totalMinutes: number; percentage: number } {
    const intervals = 12;
    const timeStep = gameDuration * 60 / intervals;
    let sunExposureMinutes = 0;
    
    const startDate = new Date(gameStartTime);
    
    // Covered sections are handled separately
    
    for (let i = 0; i < intervals; i++) {
      const checkTime = new Date(startDate.getTime() + i * timeStep * 60000);
      // Pass the Date object directly - it has the correct UTC time
      const sunPos = this.calculateSunPosition(checkTime);
      
      if (sunPos.altitude > 0) {
        const shadows = this.calculateSectionShadow(section, sunPos.altitude, sunPos.azimuth);
        
        // Debug covered sections - they should always have 0% sun exposure
        if (section.covered && shadows.sunExposure > 0 && process.env.NODE_ENV === 'development') {
          console.error(`[SunCalc] ERROR: Covered section ${section.name} has ${shadows.sunExposure}% sun exposure (should be 0%)`);
          console.error(`  - Coverage breakdown: roof=${shadows.shadowSources.roof}%, upperDeck=${shadows.shadowSources.upperDeck}%, bowl=${shadows.shadowSources.bowl}%`);
          console.error(`  - Total coverage: ${shadows.coverage}%`);
          console.error(`  - Section covered flag: ${section.covered}`);
        }
        
        // Accumulate actual sun exposure percentage for this time interval
        // If a section has 30% sun exposure for this interval, count 30% of the time
        const exposureFraction = shadows.sunExposure / 100;
        sunExposureMinutes += timeStep * exposureFraction;
      }
    }
    
    return {
      totalMinutes: Math.min(sunExposureMinutes, gameDuration * 60),
      percentage: Math.min(100, (sunExposureMinutes / (gameDuration * 60)) * 100)
    };
  }

  // getSunPath and getOptimalSections were removed: they accepted string
  // date/time inputs with no timezone, which produced the same wrong-by-tz
  // bug the rest of the codebase just stamped out. Neither had any
  // production callers. If we need a sun-path visualization later, build
  // it on top of stadiumLocalToUTC so the iteration is timezone-aware.
}

export function formatSunPosition(position: SunPosition): {
  compass: string;
  altitude: string;
  description: string;
  isDay: boolean;
} {
  const compass = getCompassDirection(position.azimuth);
  const altitude = position.altitude.toFixed(1);
  
  return {
    compass,
    altitude: `${altitude}°`,
    description: position.elevation,
    isDay: position.isDay
  };
}

export function getCompassDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function calculateGameSunExposure(
  stadium: Stadium, 
  sections: Section[], 
  gameDateTime: string | Date, 
  duration: number = 3
): Array<{ sectionId: string; totalMinutes: number; percentage: number }> {
  const calculator = new SunCalculator(stadium);
  
  return sections.map(section => {
    const exposure = calculator.calculateTimeInSun(section, gameDateTime, duration);
    return {
      sectionId: section.id,
      ...exposure
    };
  });
}

// --------------------------------------------------------------------------
// Row-level shade calculation
// --------------------------------------------------------------------------

// Minimal shape required to compute row shade. Matches DetailedSection from
// src/types/stadium-complete.ts, but stays loose so the route doesn't have to
// pass a fully-populated DetailedSection in test mocks.
export interface RowShadowInputRow {
  rowNumber: string;
  seats: number;
  elevation: number;
  depth: number;
  covered?: boolean;
  overhangHeight?: number;
}

export interface RowShadowInputSection {
  id: string;
  name: string;
  level?: 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'standing';
  baseAngle: number;
  angleSpan?: number;
  covered?: boolean;
  /**
   * Optional partial/translucent canopy (mesh, fabric, glass) covering some
   * rows. When present it lets a non-solid roof shade those rows by less than
   * 100% instead of the all-or-nothing `covered` flag. Flows through from
   * DetailedSection; absent on plain test mocks, so behavior is unchanged for
   * sections that only set `covered`.
   */
  partialCoverage?: CoverageDetail;
  rows: RowShadowInputRow[];
}

export interface RowShadowRow {
  rowNumber: string;
  seats: number;
  elevation: number;
  depth: number;
  coverage: number;          // 0..100, fraction of row in shadow
  sunExposure: number;       // 0..100, equals 100 - coverage
  inShadow: boolean;         // coverage >= 50
  shadowSources: {
    roof: number;
    upperDeck: number;
    overhang: number;
    bowl: number;
  };
  recommendation: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface RowShadowResult {
  sectionId: string;
  sectionName: string;
  rows: RowShadowRow[];
  averageCoverage: number;
  bestRows: string[];
  worstRows: string[];
}

function recommendForCoverage(coverage: number): RowShadowRow['recommendation'] {
  if (coverage >= 80) return 'excellent';
  if (coverage >= 60) return 'good';
  if (coverage >= 40) return 'fair';
  return 'poor';
}

// Opacity (0..1) of any roof/canopy directly over this row.
//   - A solid structural roof (section.covered or row.covered) is fully
//     opaque: 1.0 — preserves the original binary behavior.
//   - A `partialCoverage` canopy shades only its `coveredRows`, and only as
//     much as its material lets through: mesh ~0.5, fabric ~0.7, glass ~0.1,
//     solid 1.0. A full canopy (type 'full' / no coveredRows listed) covers
//     every row.
//   - Otherwise 0 (open to the sky).
// Mesh/fabric canopies (common over modern club levels and shade structures)
// no longer get forced to 100% shade.
function canopyOpacity(section: RowShadowInputSection, row: RowShadowInputRow): number {
  if (section.covered === true || row.covered === true) return 1;

  const pc = section.partialCoverage;
  if (pc) {
    const coversThisRow =
      pc.type === 'full' || !pc.coveredRows || pc.coveredRows.length === 0
        ? true
        : pc.coveredRows.includes(row.rowNumber);
    if (coversThisRow) {
      switch (pc.material) {
        case 'mesh': return 0.5;
        case 'fabric': return 0.7;
        case 'glass': return 0.1;
        case 'solid': return 1;
        default: return 1; // material unspecified → treat as solid
      }
    }
  }
  return 0;
}

// 2D row-level shade model.
// - Below-horizon sun → fully shaded by night.
// - A roof/canopy over the row contributes `canopyOpacity * 100` (solid roof
//   = 100; mesh/fabric/glass less).
// - Structural bowl shade blends two regimes by a CONTINUOUS incidence factor
//   `opp = (1 - cos(angleDiff)) / 2`, where angleDiff is between the sun and
//   the section's compass facing:
//     · opp → 1 when the sun is across the bowl shining into the seat faces:
//       the row's overhang projects shadow onto it (back rows, greater depth,
//       reach shadow at higher sun altitudes than front rows).
//     · opp → 0 when the sun is behind the section: only the minor bowl
//       back-shadow at low altitudes applies.
//   Blending by `opp` (instead of a hard >90° branch) removes the old
//   discontinuity at the 90° boundary AND azimuth-projects the overhang —
//   when the sun rakes along the section edge the overhang blocks less than
//   when it shines head-on.
//
// This is intentionally a simple 2D model — the 3D path in mlb3DCalculator.ts
// handles ray-cast obstructions when stadium has obstruction data.
export function calculateRowShadows(
  section: RowShadowInputSection,
  sunAltitudeDeg: number,
  sunAzimuthDeg: number,
  stadiumOrientation: number,
): RowShadowResult {
  const rows = section.rows ?? [];
  // section.baseAngle is stadium-local (0 = 1B, 90 = CF, 180 = 3B, 270 = behind home).
  // Convert to compass bearing before comparing against the (compass) sun azimuth.
  // See src/utils/sectionSunCalculations.ts for the convention block.
  const sectionLocal = section.baseAngle + (section.angleSpan ?? 0) / 2;
  const sectionCompass = ((stadiumOrientation + 90 - sectionLocal) % 360 + 360) % 360;
  const sunAz = ((sunAzimuthDeg % 360) + 360) % 360;
  let angleDiff = Math.abs(sunAz - sectionCompass);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;
  // Continuous incidence: 1 = sun across the bowl into the seat faces,
  // 0 = sun directly behind the section. Replaces the old hard >90° branch.
  const opp = (1 - Math.cos(angleDiff * Math.PI / 180)) / 2;

  const altRad = sunAltitudeDeg * Math.PI / 180;
  const tanAlt = Math.tan(altRad);

  const rowResults: RowShadowRow[] = rows.map((row) => {
    let coverage = 0;
    const sources = { roof: 0, upperDeck: 0, overhang: 0, bowl: 0 };

    const canopyCoverage = canopyOpacity(section, row) * 100;

    if (sunAltitudeDeg <= 0) {
      // Night: fully shaded regardless of geometry.
      coverage = 100;
      sources.bowl = 100;
    } else {
      // Overhang projection (front-incidence regime), scaled by how head-on
      // the sun is (opp). Back rows reach shadow at higher altitudes.
      let overhangCoverage = 0;
      if (row.overhangHeight && row.overhangHeight > 0 && tanAlt > 0) {
        const shadowLength = row.overhangHeight / tanAlt;
        const depth = Math.max(row.depth, 0.001);
        overhangCoverage = Math.min(100, (shadowLength / depth) * 100);
      }
      // Bowl back-shadow (behind regime), fades to ~0 above 30°.
      const lowSunFactor = Math.max(0, (30 - sunAltitudeDeg) / 30);
      const bowlCoverage = lowSunFactor * 25;

      const structural = opp * overhangCoverage + (1 - opp) * bowlCoverage;
      coverage = Math.max(structural, canopyCoverage);

      sources.overhang = Math.round(opp * overhangCoverage);
      sources.bowl = Math.round((1 - opp) * bowlCoverage);
      sources.roof = Math.round(canopyCoverage);
    }

    const clamped = Math.max(0, Math.min(100, Math.round(coverage)));
    return {
      rowNumber: row.rowNumber,
      seats: row.seats,
      elevation: row.elevation,
      depth: row.depth,
      coverage: clamped,
      sunExposure: 100 - clamped,
      inShadow: clamped >= 50,
      shadowSources: {
        roof: Math.round(sources.roof),
        upperDeck: Math.round(sources.upperDeck),
        overhang: Math.round(sources.overhang),
        bowl: Math.round(sources.bowl),
      },
      recommendation: recommendForCoverage(clamped),
    };
  });

  const averageCoverage = rowResults.length
    ? Math.round(rowResults.reduce((sum, r) => sum + r.coverage, 0) / rowResults.length)
    : 0;

  const byCoverageDesc = [...rowResults].sort((a, b) => b.coverage - a.coverage);
  const bestRows = byCoverageDesc.slice(0, 5).map((r) => r.rowNumber);
  const worstRows = byCoverageDesc.slice(-5).reverse().map((r) => r.rowNumber);

  return {
    sectionId: section.id,
    sectionName: section.name,
    rows: rowResults,
    averageCoverage,
    bestRows,
    worstRows,
  };
}

// --------------------------------------------------------------------------
// Whole-game-window shade
// --------------------------------------------------------------------------
//
// A single instant is precisely accurate for one moment, but the sun sweeps
// ~15°/hr in azimuth, so a ~3-hour game's shade map changes completely from
// first pitch to final out. These helpers run the SAME `calculateRowShadows`
// at several sampled times across the game and aggregate, so the answer is
// "how shade migrates through the game" rather than "shade at first pitch."
//
// The sun positions are computed by the caller (the route, via getSunPosition
// over the stadium's timezone) and passed in as samples — this module stays
// pure and time-zone-agnostic.

export interface SunSample {
  /** Minutes after first pitch this sample represents. */
  minutesFromStart: number;
  altitudeDegrees: number;
  azimuthDegrees: number;
}

export interface RowWindowShade {
  rowNumber: string;
  seats: number;
  elevation: number;
  depth: number;
  coverageStart: number;   // coverage at first pitch
  coverageEnd: number;     // coverage at the last sample
  coverageAvg: number;     // mean coverage across the window
  coverageMin: number;
  coverageMax: number;
  timeline: { minutesFromStart: number; coverage: number }[];
  recommendation: RowShadowRow['recommendation']; // from coverageAvg
}

/** How a section's shade evolves across the game window. */
export type ShadeProgression =
  | 'shaded-all'   // in shade the whole game
  | 'sunny-all'    // in sun the whole game
  | 'sun-to-shade' // starts sunny, ends shaded
  | 'shade-to-sun' // starts shaded, ends sunny
  | 'mixed';       // dips in/out without a clean trend

export interface SectionWindowShade {
  sectionId: string;
  sectionName: string;
  rows: RowWindowShade[];
  averageCoverage: number; // mean of rows' coverageAvg
  startCoverage: number;   // section-average coverage at first pitch
  endCoverage: number;     // section-average coverage at the last sample
  coverageMin: number;     // lowest section-average across the window
  coverageMax: number;     // highest section-average across the window
  progression: ShadeProgression;
  timeline: { minutesFromStart: number; coverage: number }[]; // section avg per sample
  bestRows: string[];
  worstRows: string[];
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}

function classifyProgression(timeline: { coverage: number }[]): ShadeProgression {
  if (timeline.length === 0) return 'mixed';
  const cov = timeline.map((t) => t.coverage);
  const first = cov[0];
  const last = cov[cov.length - 1];
  const lo = Math.min(...cov);
  const hi = Math.max(...cov);
  if (lo >= 50) return 'shaded-all';
  if (hi < 50) return 'sunny-all';
  if (last - first > 10) return 'sun-to-shade';
  if (first - last > 10) return 'shade-to-sun';
  return 'mixed';
}

/**
 * Shade for one section across a game window. Calls `calculateRowShadows`
 * once per sample (no duplicated math) and aggregates per row + per section.
 * `sunSamples` must be ordered by `minutesFromStart` ascending; the first is
 * treated as first pitch. With a single sample this degrades to a one-instant
 * result expressed in the window shape.
 */
export function calculateGameWindowShade(
  section: RowShadowInputSection,
  sunSamples: SunSample[],
  stadiumOrientation: number,
): SectionWindowShade {
  const samples = sunSamples.length
    ? sunSamples
    : [{ minutesFromStart: 0, altitudeDegrees: 0, azimuthDegrees: 0 }];

  const perSample = samples.map((s) => ({
    minutesFromStart: s.minutesFromStart,
    result: calculateRowShadows(section, s.altitudeDegrees, s.azimuthDegrees, stadiumOrientation),
  }));

  // Section-average timeline (one point per sample).
  const timeline = perSample.map((p) => ({
    minutesFromStart: p.minutesFromStart,
    coverage: p.result.averageCoverage,
  }));

  // Rows align positionally across samples (same section.rows order each call).
  const rowCount = section.rows.length;
  const rows: RowWindowShade[] = [];
  for (let i = 0; i < rowCount; i++) {
    const rowTimeline = perSample.map((p) => ({
      minutesFromStart: p.minutesFromStart,
      coverage: p.result.rows[i].coverage,
    }));
    const cov = rowTimeline.map((t) => t.coverage);
    const base = perSample[0].result.rows[i];
    const avg = Math.round(mean(cov));
    rows.push({
      rowNumber: base.rowNumber,
      seats: base.seats,
      elevation: base.elevation,
      depth: base.depth,
      coverageStart: cov[0],
      coverageEnd: cov[cov.length - 1],
      coverageAvg: avg,
      coverageMin: Math.min(...cov),
      coverageMax: Math.max(...cov),
      timeline: rowTimeline,
      recommendation: recommendForCoverage(avg),
    });
  }

  const byAvgDesc = [...rows].sort((a, b) => b.coverageAvg - a.coverageAvg);
  const tlCov = timeline.map((t) => t.coverage);

  return {
    sectionId: section.id,
    sectionName: section.name,
    rows,
    averageCoverage: Math.round(mean(rows.map((r) => r.coverageAvg))),
    startCoverage: timeline[0].coverage,
    endCoverage: timeline[timeline.length - 1].coverage,
    coverageMin: tlCov.length ? Math.min(...tlCov) : 0,
    coverageMax: tlCov.length ? Math.max(...tlCov) : 0,
    progression: classifyProgression(timeline),
    timeline,
    bestRows: byAvgDesc.slice(0, 5).map((r) => r.rowNumber),
    worstRows: byAvgDesc.slice(-5).reverse().map((r) => r.rowNumber),
  };
}

/**
 * Build the ordered list of minute-offsets to sample across a game window.
 * `windowMinutes` total length, `stepMinutes` between samples; always includes
 * both endpoints (0 and windowMinutes). Defaults: 180-minute window
 * (a typical ~2h40 pitch-clock game + margin), 30-minute step → 7 samples.
 */
export function gameWindowOffsets(windowMinutes = 180, stepMinutes = 30): number[] {
  const w = Math.max(0, windowMinutes);
  const step = Math.max(1, stepMinutes);
  const offsets: number[] = [];
  for (let m = 0; m < w; m += step) offsets.push(m);
  offsets.push(w); // always include the final out
  return offsets;
}