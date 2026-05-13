// sunCalculator.ts
import SunCalc from 'suncalc';

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

// 2D row-level shade model.
// - Covered rows (or covered sections) are fully shaded.
// - Below-horizon sun → fully shaded by night.
// - Otherwise: if the section is on the opposite side of the bowl from the
//   sun, the row's overhang (if any) projects shadow onto the row; back rows
//   (greater depth) reach shadow at higher sun altitudes than front rows.
//   If the section is on the same side as the sun, the bowl itself provides
//   only minor shadow at low altitudes.
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
  const sunOnOppositeSide = angleDiff > 90;

  const altRad = sunAltitudeDeg * Math.PI / 180;
  const tanAlt = Math.tan(altRad);

  const rowResults: RowShadowRow[] = rows.map((row) => {
    let coverage = 0;
    const sources = { roof: 0, upperDeck: 0, overhang: 0, bowl: 0 };

    if (section.covered === true || row.covered === true) {
      coverage = 100;
      sources.roof = 100;
    } else if (sunAltitudeDeg <= 0) {
      coverage = 100;
      sources.bowl = 100;
    } else if (sunOnOppositeSide && row.overhangHeight && row.overhangHeight > 0 && tanAlt > 0) {
      // Sun shines across the bowl into the front of the section; the
      // overhang above this row blocks part of that incoming light.
      const shadowLength = row.overhangHeight / tanAlt;
      const depth = Math.max(row.depth, 0.001);
      if (shadowLength >= depth) {
        coverage = 100;
      } else if (shadowLength > 0) {
        coverage = Math.min(100, (shadowLength / depth) * 100);
      }
      sources.overhang = coverage;
    } else if (!sunOnOppositeSide) {
      // Sun behind the section. Bowl/upper rows provide some back-shadow
      // mostly at low altitudes; this fades to ~0 above 30°.
      const lowSunFactor = Math.max(0, (30 - sunAltitudeDeg) / 30);
      coverage = lowSunFactor * 25;
      sources.bowl = coverage;
    } else {
      // Sun on opposite side, no overhang data: only a small bowl contribution.
      coverage = 5;
      sources.bowl = coverage;
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