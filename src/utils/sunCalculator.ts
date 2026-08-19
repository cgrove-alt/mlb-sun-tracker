// sunCalculator.ts
import SunCalc from 'suncalc';
import type { CoverageDetail } from '../types/stadium-complete';
import { getSunPosition } from './sunPosition';
import {
  venueSectionCompassAngle,
  sectionAngleConventionFor,
  requireFiniteOrientation,
  sunIncidence,
  backStructureShadeFraction,
  overhangShadeFraction,
  horizonBlockFactor,
  shadowReachFt,
  normalizeAngle,
  BOWL_DEFAULTS,
  type SeatingLevel,
  type SectionAngleConvention,
} from './bowlGeometry';

interface Stadium {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  roof?: 'open' | 'fixed' | 'retractable';
  roofType?: 'open' | 'fixed' | 'retractable';
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  orientation?: number;
  sections?: Section[];
  league?: string;
  venueType?: string;
  sport?: string;
  sectionAngleConvention?: SectionAngleConvention;
}

interface Section {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  side?: 'home' | 'first' | 'third' | 'outfield';
  /**
   * STADIUM-LOCAL angle (0 = 1B, 90 = CF, 180 = 3B, 270 = behind home).
   * PREFER THIS. The calculator converts it to a compass bearing itself using
   * the stadium's orientation, so a caller cannot get the conversion wrong.
   */
  baseAngle?: number;
  angleSpan?: number;
  /**
   * Absolute COMPASS bearing of the section from the field centre, as an
   * escape hatch for callers that already hold one.
   *
   * This field is why the homepage was wrong for so long: both UnifiedApp and
   * MobileApp assigned `angle: section.baseAngle` — a stadium-local angle — and
   * an old comment here claimed base angles were "already in absolute compass
   * coordinates", so nothing converted them and every park's orientation was
   * silently discarded. Pass `baseAngle` instead unless you genuinely have a
   * compass bearing.
   */
  angle?: number;
  depth?: number;
  covered?: boolean;
  overhangHeight?: number;
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
      // Preserve a documented 0° N-S axis. Missing orientation stays NaN and
      // requireFiniteOrientation throws before any compass conversion.
      orientation: typeof this.stadium.orientation === 'number' && Number.isFinite(this.stadium.orientation)
        ? this.stadium.orientation
        : Number.NaN,
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

    const sunPos = getSunPosition(
      dateTime,
      this.stadium.latitude,
      this.stadium.longitude,
    );
    const altitude = sunPos.altitudeDegrees;
    const azimuth = sunPos.azimuthDegrees;

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
        // No direct sun exists below the horizon. The previous values paired
        // `coverage: 0` / `inShadow: false` with `sunExposure: 0`, an
        // impossible state that disagreed with the row API and every other
        // shade path. Attribute the all-park darkness to the bowl/rim source,
        // matching calculateRowShadows().
        coverage: 100,
        inShadow: true,
        shadowSources: {
          roof: 0,
          upperDeck: 0,
          bowl: 100
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

    // Fixed roofs do not need a compass conversion (and must not invent one).
    if ((this.stadium.roofType ?? this.stadium.roof) === 'fixed') {
      return {
        sectionId: section.id,
        coverage: 100,
        inShadow: true,
        shadowSources: {
          roof: 100,
          upperDeck: 0,
          bowl: 0
        },
        sunExposure: 0
      };
    }
    
    // REWRITTEN 2026-08-07. This block used to read:
    //
    //     if (angleDiff > 90) baseSunExposure = 0;  // "opposite side from sun"
    //     else baseSunExposure = 100 * cos(...)
    //
    // which is the sun/shade relationship exactly backwards. A section more
    // than 90° from the sun in compass terms is the one sitting ACROSS the
    // bowl with the light in its face — the sunniest place in the park — and
    // it was being reported as fully shaded, while the genuinely shaded
    // sun-side sections were reported as sunlit. Measured over all 30 MLB
    // parks at 1 PM / 4 PM / 7 PM it picked the correct side 1 time out of 87.
    // See src/utils/bowlGeometry.ts for the rule and its derivation.
    const sectionCompass = this.getSectionCompassAngle(section);
    const { sunBehind, sunFacing } = sunIncidence(sunAzimuth, sectionCompass);

    // Shade thrown FORWARD across the seats by the structure behind them.
    // This is the dominant mechanism, and it applies when the sun is behind
    // the section. For a field/lower section that structure is the upper deck.
    const backShade = 100 * sunBehind * backStructureShadeFraction(sunAltitude, section.level as SeatingLevel);

    // Shade thrown BACKWARD over the back rows by an overhang lip above them,
    // which applies when the sun is across the bowl shining in. Only sections
    // that actually carry overhang geometry get this.
    const overhang = 100 * sunFacing * overhangShadeFraction(
      sunAltitude,
      section.overhangHeight,
      section.depth,
    );

    const roofShadow = this.calculateRoofShadow(section, sunAltitude);
    const totalCoverage = Math.min(100, roofShadow + backShade + overhang);

    // Direct sun left over, damped by the stadium rim as the sun sets.
    const finalSunExposure = Math.max(
      0,
      (100 - totalCoverage) * horizonBlockFactor(sunAltitude),
    );

    return {
      sectionId: section.id,
      coverage: Math.round(totalCoverage),
      inShadow: finalSunExposure < 50,
      shadowSources: {
        roof: Math.round(roofShadow),
        upperDeck: Math.round(backShade),
        bowl: Math.round(overhang)
      },
      sunExposure: Math.round(finalSunExposure)
    };
  }

  private calculateRoofShadow(section: Section, sunAltitude: number): number {
    if (sunAltitude <= 0) return 0;

    // Fixed roof stadiums always have 100% coverage. Accept both `roof`
    // (the field stadiums.ts / unifiedVenues actually store) and the
    // legacy `roofType` alias — callers used to set only one of them.
    if ((this.stadium.roofType ?? this.stadium.roof) === 'fixed') return 100;

    // Covered sections have permanent overhead protection.
    if (section.covered === true) return 100;

    // A retractable roof is modelled OPEN here, matching the rest of the site
    // (the venue page shows an explicit "assumes roof open" note). The old
    // code claimed to "assume the roof is closed" and then computed an
    // open-roof overhang anyway — using the stadium's ROOF height against its
    // overhang depth, with no reference to the section's own position, so
    // every section of a retractable-roof park got the same number. Structural
    // shade for those parks now comes from the same bowl model as everywhere
    // else, above.
    return 0;
  }

  /**
   * Absolute compass bearing of the section from the field centre.
   *
   * Prefers `baseAngle` (stadium-local) and converts it here, so callers
   * cannot repeat the UnifiedApp/MobileApp bug of handing a local angle to a
   * field that expects compass degrees.
   */
  private getSectionCompassAngle(section: Section): number {
    const orientation = requireFiniteOrientation(
      this.stadiumGeometry.orientation,
      this.stadium.id,
    );
    const convention = sectionAngleConventionFor(this.stadium);
    if (section.baseAngle !== undefined) {
      return venueSectionCompassAngle(
        { baseAngle: section.baseAngle, angleSpan: section.angleSpan },
        orientation,
        convention,
      );
    }
    if (section.angle !== undefined) {
      return normalizeAngle(section.angle);
    }

    // Last resort: derive from the coarse `side` label. These are stadium-local
    // positions, so they still have to go through the orientation conversion.
    const localBySide: Record<string, number> = {
      first: 0,      // 1B
      outfield: 90,  // CF
      third: 180,    // 3B
      home: 270,     // behind home plate
    };
    const local = localBySide[section.side ?? 'home'] ?? 270;
    return venueSectionCompassAngle({ baseAngle: local, angleSpan: 0 }, orientation, convention);
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
//
// REWRITTEN 2026-08-07. The previous version had the two structural regimes
// weighted the wrong way round. It applied the overhang shadow when the sun
// was ACROSS the bowl (correct, but a minor effect) and gave the sun-behind
// case nothing but a "bowl back-shadow" capped at 25% that vanished entirely
// above 30° sun altitude. But sun-behind is the DEEP shade case: the deck,
// façade and tier rising behind those seats block the sun outright. So the
// genuinely shaded half of every ballpark was reported as ~100% sun.
//
// Measured against the physical rule over all 30 MLB parks at 1 PM / 4 PM /
// 7 PM, the old model chose the correct side 0 times out of 87 for rows that
// carry an overhang — which is 6,877 of the 30,551 real MLB rows. It scored
// 29/87 for rows with NO overhang, and that is precisely the configuration
// shadeSanity.test.ts was built from, which is why a green test suite sat on
// top of an inverted site for so long.
//
// The model now has three shade sources, all continuous in azimuth:
//   · canopy   — a roof/awning directly over the row (opacity by material).
//   · back     — the structure BEHIND the seats, throwing shadow forward
//                across the deck when the sun is behind the section. Uses the
//                real per-row `depth`, so the shadow edge sweeps from the back
//                row forward as the sun drops, which is what fans actually
//                watch happen during a game.
//   · overhang — the lip ABOVE the seats, throwing shadow backward over the
//                rear rows when the sun is across the bowl shining in.
//   · rim      — below the stadium rim (~12°) the surrounding structure
//                occludes the sun for every seat, whichever side it is on.
//
// This is intentionally a simple 2D model — the 3D path in mlb3DCalculator.ts
// handles ray-cast obstructions when stadium has obstruction data.
export function calculateRowShadows(
  section: RowShadowInputSection,
  sunAltitudeDeg: number,
  sunAzimuthDeg: number,
  stadiumOrientation: number,
  convention: SectionAngleConvention = 'baseball-local',
): RowShadowResult {
  const orientation = requireFiniteOrientation(stadiumOrientation, section.id);
  const rows = section.rows ?? [];
  const sectionCompass = venueSectionCompassAngle(
    { baseAngle: section.baseAngle, angleSpan: section.angleSpan },
    orientation,
    convention,
  );
  const { sunBehind, sunFacing } = sunIncidence(sunAzimuthDeg, sectionCompass);

  const level = (section.level ?? 'lower') as SeatingLevel;

  // Front-to-back depth of this deck, measured from the real row data. Rows
  // are given as a distance back from the front of the section, so the deepest
  // row marks the back wall — where the structure behind starts casting.
  const measuredDepths = rows.map(r => r.depth).filter(d => typeof d === 'number' && d > 0);
  const deckDepthFt = measuredDepths.length ? Math.max(...measuredDepths) : 0;
  const haveRowDepths = deckDepthFt > 0;

  // Reach of the shadow thrown forward by the structure behind the seats.
  const backReachFt = shadowReachFt(BOWL_DEFAULTS.backStructureHeightFt[level] ?? 45, sunAltitudeDeg);
  // Section-level fallback for sections whose rows carry no usable depth data.
  const sectionBackShade = backStructureShadeFraction(sunAltitudeDeg, level);
  // The shadow edge is soft over roughly one row of seating rather than a
  // knife-edge, so coverage moves smoothly row to row.
  const EDGE_SOFTEN_FT = 3;

  // Below the rim, everything is shaded regardless of which side it is on.
  const rimCoverage = (1 - horizonBlockFactor(sunAltitudeDeg)) * 100;

  // Leading edge of the overhang above this section.
  //
  // `row.depth` is a row's distance back from the FRONT of the section, so the
  // front row is legitimately at depth 0 — that is correct data, not missing
  // data. The old model nonetheless fed `row.depth` straight into
  // `shadowLength / max(depth, 0.001)`, which meant the front row of every
  // overhung section divided by ~zero and came out pinned at 100% coverage.
  // 647 real MLB rows hit that branch, and they are precisely the rows LEAST
  // likely to be shaded — the ones closest to the field.
  //
  // What the overhang calculation actually needs is the distance from the
  // overhang's LIP to the row, and that is recoverable: the shallowest row
  // carrying an `overhangHeight` sits at the lip, so every deeper row's
  // distance behind it is just the difference in depth. A row at the lip gets
  // no overhang shade from a sun in front of it, which is correct.
  const overhungRows = rows.filter(r => (r.overhangHeight ?? 0) > 0);
  const lipDepthFt = overhungRows.length
    ? Math.min(...overhungRows.map(r => r.depth))
    : 0;
  const lipHeightFt = overhungRows.length
    ? overhungRows.reduce((lip, r) => (r.depth <= lipDepthFt ? r.overhangHeight! : lip), 0)
    : 0;

  const rowResults: RowShadowRow[] = rows.map((row) => {
    let coverage = 0;
    const sources = { roof: 0, upperDeck: 0, overhang: 0, bowl: 0 };

    const canopyCoverage = canopyOpacity(section, row) * 100;

    if (sunAltitudeDeg <= 0) {
      // Night: fully shaded regardless of geometry.
      coverage = 100;
      sources.bowl = 100;
    } else {
      // --- Sun behind the section: shadow sweeps forward from the back wall.
      let backFraction: number;
      if (haveRowDepths && Number.isFinite(backReachFt)) {
        const distanceFromBackFt = deckDepthFt - row.depth;
        backFraction = Math.max(0, Math.min(1,
          (backReachFt - distanceFromBackFt) / EDGE_SOFTEN_FT,
        ));
      } else {
        backFraction = sectionBackShade;
      }
      const backCoverage = 100 * sunBehind * backFraction;

      // --- Sun across the bowl: the overhang lip shades the rows behind it.
      // Distance measured from the lip (see lipDepthFt above), not from the
      // front of the section.
      const overhangCoverage = (row.overhangHeight ?? 0) > 0
        ? 100 * sunFacing * overhangShadeFraction(
            sunAltitudeDeg,
            lipHeightFt || row.overhangHeight,
            row.depth - lipDepthFt,
          )
        : 0;

      coverage = Math.max(backCoverage + overhangCoverage, canopyCoverage, rimCoverage);

      sources.upperDeck = Math.round(backCoverage);
      sources.overhang = Math.round(overhangCoverage);
      sources.bowl = Math.round(rimCoverage);
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

  // A section with no row data used to report `averageCoverage: 0` — i.e. a
  // confident "this section is in full sun" for a section whose geometry we
  // know nothing about. Several real venues carry such sections, and the row
  // API answered for them as authoritatively as for a fully-surveyed one.
  // Fall back to the section-level bowl model instead, which at least answers
  // the orientation question correctly.
  const averageCoverage = rowResults.length
    ? Math.round(rowResults.reduce((sum, r) => sum + r.coverage, 0) / rowResults.length)
    : Math.round(100 * Math.max(
        sunAltitudeDeg <= 0 ? 1 : sunBehind * sectionBackShade,
        canopyOpacity(section, { rowNumber: '', seats: 0, elevation: 0, depth: 0 }),
        rimCoverage / 100,
      ));

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
  convention: SectionAngleConvention = 'baseball-local',
): SectionWindowShade {
  const samples = sunSamples.length
    ? sunSamples
    : [{ minutesFromStart: 0, altitudeDegrees: 0, azimuthDegrees: 0 }];

  const perSample = samples.map((s) => ({
    minutesFromStart: s.minutesFromStart,
    result: calculateRowShadows(section, s.altitudeDegrees, s.azimuthDegrees, stadiumOrientation, convention),
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
