/**
 * Complete sun-exposure audit for every venue the site ships.
 *
 * These assertions lock the root causes found in the 2026-08-18 audit:
 *   1. Dual metadata sources drifted (orientation / lat / lon / roof / tz).
 *   2. NFL sections use compass-from-north but were fed through the baseball
 *      local-angle converter, rotating every football bowl.
 *   3. SunCalculator only honored `roofType`, while callers set `roof`, so
 *      every dome was modelled as an open bowl.
 *   4. Homepage published NFL/MiLB section percentages despite unmeasured
 *      geometry — the same honesty gate MLB already used.
 *
 * @jest-environment node
 */

import { MLB_STADIUMS } from '../stadiums';
import { NFL_STADIUMS } from '../nflStadiums';
import { ALL_MILB_STADIUMS } from '../milbStadiums';
import { ALL_UNIFIED_VENUES } from '../unifiedVenues';
import { canPublishVenueSeatShade } from '../stadiumShadeConfidence';
import { MLB_ORIENTATION_PROVENANCE, getOrientationProvenance } from '../stadiumOrientationProvenance';
import { NFL_ORIENTATION_PROVENANCE } from '../nflOrientationProvenance';
import { MILB_ORIENTATION_PROVENANCE } from '../milbOrientationProvenance';
import { SunCalculator, calculateRowShadows } from '../../utils/sunCalculator';
import { getUnifiedVenueShade } from '../../utils/getUnifiedVenueShade';
import {
  sectionAngleConventionFor,
  venueSectionCompassAngle,
  requireFiniteOrientation,
} from '../../utils/bowlGeometry';
import { getSectionSunExposure, isSectionInSun } from '../../utils/sectionSunCalculations';
import { getSunPosition } from '../../utils/sunPosition';
import { calendarDateAndTimeToUTC } from '../../utils/stadiumTime';
import { bestShadedSideForDayGame } from '../../utils/shadeSide';

const unifiedById = new Map(ALL_UNIFIED_VENUES.map((v) => [v.id, v]));

function assertValidIana(timezone: string): void {
  expect(() => new Intl.DateTimeFormat('en-US', { timeZone: timezone })).not.toThrow();
}

describe('every venue has a consistent, valid shade-input record', () => {
  it('covers 30 MLB + 32 NFL + 120 MiLB in the unified list', () => {
    expect(MLB_STADIUMS).toHaveLength(30);
    expect(NFL_STADIUMS).toHaveLength(32);
    expect(ALL_MILB_STADIUMS).toHaveLength(120);
    expect(ALL_UNIFIED_VENUES.filter((v) => v.league === 'MLB')).toHaveLength(30);
    expect(ALL_UNIFIED_VENUES.filter((v) => v.league === 'NFL')).toHaveLength(32);
    expect(ALL_UNIFIED_VENUES.filter((v) => v.league === 'MiLB')).toHaveLength(120);
  });

  it.each(MLB_STADIUMS.map((s) => [s.id] as const))(
    'MLB %s matches stadiums.ts on shade-critical fields',
    (id) => {
      const src = MLB_STADIUMS.find((s) => s.id === id)!;
      const unified = unifiedById.get(id);
      expect(unified).toBeDefined();
      expect(unified).toMatchObject({
        latitude: src.latitude,
        longitude: src.longitude,
        orientation: src.orientation,
        timezone: src.timezone,
        roof: src.roof,
      });
      assertValidIana(src.timezone);
    },
  );

  it.each(NFL_STADIUMS.map((s) => [s.id] as const))(
    'NFL %s matches nflStadiums.ts on shade-critical fields',
    (id) => {
      const src = NFL_STADIUMS.find((s) => s.id === id)!;
      const unified = unifiedById.get(id);
      expect(unified).toBeDefined();
      expect(unified).toMatchObject({
        latitude: src.latitude,
        longitude: src.longitude,
        orientation: src.orientation,
        timezone: src.timezone,
        roof: src.roof,
      });
      assertValidIana(src.timezone);
    },
  );

  it.each(ALL_MILB_STADIUMS.map((s) => [s.id] as const))(
    'MiLB %s matches milbStadiums.ts on shade-critical fields',
    (id) => {
      const src = ALL_MILB_STADIUMS.find((s) => s.id === id)!;
      const unified = unifiedById.get(id);
      expect(unified).toBeDefined();
      expect(unified).toMatchObject({
        latitude: src.latitude,
        longitude: src.longitude,
        orientation: src.orientation,
        timezone: src.timezone,
        roof: src.roof ?? 'open',
      });
      assertValidIana(src.timezone);
    },
  );

  it('keeps MLB orientation provenance in lockstep with stadiums.ts', () => {
    for (const stadium of MLB_STADIUMS) {
      const provenance = MLB_ORIENTATION_PROVENANCE.find((p) => p.stadiumId === stadium.id);
      expect(provenance).toBeDefined();
      expect(provenance!.orientation).toBe(stadium.orientation);
    }
  });

  it('keeps NFL field-axis provenance in lockstep with nflStadiums.ts', () => {
    expect(NFL_ORIENTATION_PROVENANCE).toHaveLength(32);
    const ids = NFL_ORIENTATION_PROVENANCE.map((p) => p.stadiumId);
    expect(new Set(ids).size).toBe(32);
    for (const stadium of NFL_STADIUMS) {
      const provenance = getOrientationProvenance(stadium.id);
      expect(provenance).toBeDefined();
      expect(provenance!.orientation).toBe(stadium.orientation);
      expect(provenance!.precisionDeg).toBeDefined();
      expect(provenance!.sources?.length).toBeGreaterThan(0);
    }
  });

  it('keeps MiLB HP→CF provenance in lockstep with milbStadiums.ts', () => {
    expect(MILB_ORIENTATION_PROVENANCE).toHaveLength(120);
    const ids = MILB_ORIENTATION_PROVENANCE.map((p) => p.stadiumId);
    expect(new Set(ids).size).toBe(120);
    for (const stadium of ALL_MILB_STADIUMS) {
      const provenance = getOrientationProvenance(stadium.id);
      expect(provenance).toBeDefined();
      expect(provenance!.orientation).toBe(stadium.orientation);
      expect(provenance!.precisionDeg).toBeDefined();
      expect(provenance!.sources?.length).toBeGreaterThan(0);
    }
  });

  it('treats a 0° NFL orientation as a documented N-S axis, not a missing default', () => {
    const northSouth = NFL_STADIUMS.filter((s) => s.orientation === 0);
    expect(northSouth.map((s) => s.id).sort()).toEqual([
      'empower-field',
      'highmark-stadium',
      'lambeau-field',
      'lumen-field',
      'raymond-james-stadium',
    ]);
    for (const stadium of northSouth) {
      const provenance = getOrientationProvenance(stadium.id)!;
      expect(provenance.confidence).toBe('verified');
      expect(provenance.notes ?? '').toMatch(/measured N-S|published N-S|perfectly N-S|north-south/i);
    }
  });

  it('keeps shared NFL sites on the same measured axis', () => {
    const jets = NFL_STADIUMS.find((s) => s.id === 'metlife-stadium-jets')!;
    const giants = NFL_STADIUMS.find((s) => s.id === 'metlife-stadium-giants')!;
    const chargers = NFL_STADIUMS.find((s) => s.id === 'sofi-stadium-chargers')!;
    const rams = NFL_STADIUMS.find((s) => s.id === 'sofi-stadium-rams')!;
    expect(jets.orientation).toBe(giants.orientation);
    expect(chargers.orientation).toBe(rams.orientation);
    expect(jets.latitude).toBe(giants.latitude);
    expect(chargers.latitude).toBe(rams.latitude);
  });

  it('places the 2026 Bills home at the new Highmark site, not the demolished bowl', () => {
    const highmark = NFL_STADIUMS.find((s) => s.id === 'highmark-stadium')!;
    expect(highmark.latitude).toBeCloseTo(42.77306, 5);
    expect(highmark.longitude).toBeCloseTo(-78.79222, 5);
    expect(highmark.opened).toBe(2026);
    expect(highmark.capacity).toBe(60108);
    expect(highmark.surface).toBe('grass');
    expect(highmark.orientation).toBe(0);
  });

  it('uses the geographically correct IANA zones for known edge cities', () => {
    expect(MLB_STADIUMS.find((s) => s.id === 'tigers')!.timezone).toBe('America/Detroit');
    expect(MLB_STADIUMS.find((s) => s.id === 'rangers')!.timezone).toBe('America/Chicago');
    expect(MLB_STADIUMS.find((s) => s.id === 'reds')!.timezone).toBe('America/New_York');
    expect(MLB_STADIUMS.find((s) => s.id === 'guardians')!.timezone).toBe('America/New_York');
    expect(MLB_STADIUMS.find((s) => s.id === 'diamondbacks')!.timezone).toBe('America/Phoenix');
    expect(MLB_STADIUMS.find((s) => s.id === 'bluejays')!.timezone).toBe('America/Toronto');
    expect(NFL_STADIUMS.find((s) => s.id === 'lucas-oil-stadium')!.timezone)
      .toBe('America/Indiana/Indianapolis');
    expect(NFL_STADIUMS.find((s) => s.id === 'ford-field')!.timezone).toBe('America/Detroit');
  });

  it('classifies MLB roofs against the known 2026 inventory', () => {
    const byRoof = (roof: string) => MLB_STADIUMS.filter((s) => s.roof === roof).map((s) => s.id).sort();
    expect(byRoof('fixed')).toEqual(['rays']);
    expect(byRoof('retractable')).toEqual([
      'astros', 'bluejays', 'brewers', 'diamondbacks', 'mariners', 'marlins', 'rangers',
    ]);
    expect(byRoof('open')).toHaveLength(22);
  });
});

describe('publication gate is league-agnostic', () => {
  it('withholds open/retractable section % for every unvalidated venue', () => {
    for (const venue of ALL_UNIFIED_VENUES) {
      if (venue.roof === 'fixed') {
        expect(canPublishVenueSeatShade(venue)).toBe(true);
      } else {
        expect(canPublishVenueSeatShade(venue)).toBe(false);
      }
    }
  });
});

describe('fixed-roof shortcut honors the field callers actually set', () => {
  const openSection = {
    id: 'open',
    name: 'Open',
    level: 'lower' as const,
    baseAngle: 0,
    covered: false,
    depth: 50,
  };

  it('SunCalculator treats `roof: fixed` the same as `roofType: fixed`', () => {
    const viaRoof = new SunCalculator({
      id: 'dome',
      name: 'Dome',
      latitude: 27.77,
      longitude: -82.65,
      roof: 'fixed',
    } as any);
    const viaType = new SunCalculator({
      id: 'dome',
      name: 'Dome',
      latitude: 27.77,
      longitude: -82.65,
      roofType: 'fixed',
    } as any);
    const sun = { altitude: 45, azimuth: 180 } as any;
    expect(viaRoof.calculateShadows(sun, [openSection])[0].sunExposure).toBe(0);
    expect(viaType.calculateShadows(sun, [openSection])[0].sunExposure).toBe(0);
  });

  it('getUnifiedVenueShade returns 100% for every fixed-roof venue', () => {
    const utc = calendarDateAndTimeToUTC('2025-09-14', 13, 0, 'America/Chicago');
    for (const venue of ALL_UNIFIED_VENUES.filter((v) => v.roof === 'fixed')) {
      const results = getUnifiedVenueShade(venue, utc, [{
        id: 'x', name: 'x', level: 'lower', baseAngle: 0, angleSpan: 10,
        covered: false, price: 'moderate', venueType: venue.venueType,
      }]);
      expect(results[0].shadePercentage).toBe(100);
      expect(results[0].effectiveSunPercent).toBe(0);
    }
  });
});

describe('NFL shade math no longer uses the baseball rotation', () => {
  it('keeps a north-endzone section on the north side of the bowl', () => {
    for (const venue of ALL_UNIFIED_VENUES.filter((v) => v.league === 'NFL')) {
      const convention = sectionAngleConventionFor(venue);
      expect(convention).toBe('compass-from-north');
      expect(venueSectionCompassAngle({ baseAngle: 0, angleSpan: 0 }, venue.orientation, convention)).toBe(0);
    }
  });

  it('getSectionSunExposure / calculateRowShadows use compass-from-north, not baseball-local', () => {
    const highmark = NFL_STADIUMS.find((s) => s.id === 'highmark-stadium')!;
    expect(highmark.orientation).toBe(0);
    const northSection = {
      id: 'north',
      name: 'North',
      level: 'lower' as const,
      baseAngle: 0,
      angleSpan: 10,
      covered: false,
    };
    const southSection = {
      id: 'south',
      name: 'South',
      level: 'lower' as const,
      baseAngle: 180,
      angleSpan: 10,
      covered: false,
    };
    const northRows = {
      ...northSection,
      rows: [{ rowNumber: '1', seats: 10, elevation: 10, depth: 20 }],
    };
    const southRows = {
      ...southSection,
      rows: [{ rowNumber: '1', seats: 10, elevation: 10, depth: 20 }],
    };
    // Midsummer afternoon, sun in the south.
    const alt = 45;
    const az = 180;
    const nflNorth = getSectionSunExposure(northSection, alt, az, highmark.orientation, 'compass-from-north');
    const nflSouth = getSectionSunExposure(southSection, alt, az, highmark.orientation, 'compass-from-north');
    const baseballNorth = getSectionSunExposure(northSection, alt, az, highmark.orientation, 'baseball-local');
    expect(nflSouth).toBeLessThan(nflNorth);
    expect(nflNorth).not.toBe(baseballNorth);
    expect(isSectionInSun(southSection, az, alt, highmark.orientation, 'compass-from-north')).toBe(false);
    expect(isSectionInSun(northSection, az, alt, highmark.orientation, 'compass-from-north')).toBe(true);

    const rowNorth = calculateRowShadows(northRows, alt, az, highmark.orientation, 'compass-from-north');
    const rowSouth = calculateRowShadows(southRows, alt, az, highmark.orientation, 'compass-from-north');
    const rowNorthBaseball = calculateRowShadows(northRows, alt, az, highmark.orientation, 'baseball-local');
    expect(rowSouth.averageCoverage).toBeGreaterThan(rowNorth.averageCoverage);
    expect(rowNorth.averageCoverage).not.toBe(rowNorthBaseball.averageCoverage);
  });
});

describe('published football shade-side claims stay directionally true', () => {
  it.each([
    ['highmark-stadium', 'south end zone'],
    ['lambeau-field', 'south end zone'],
    ['empower-field', 'south end zone'],
    ['lumen-field', 'south end zone'],
    ['raymond-james-stadium', 'south end zone'],
    ['sofi-stadium-rams', 'south end zone'],
    ['at-t-stadium', 'south sideline'],
  ] as const)('%s day-game shade side is %s', (id, side) => {
    const stadium = NFL_STADIUMS.find((s) => s.id === id)!;
    expect(bestShadedSideForDayGame(stadium.orientation, 'football')).toBe(side);
  });
});

describe('published baseball shade-side claims stay directionally true', () => {
  // Sourced notes already sitting in stadiums.ts / provenance.
  it.each([
    // 1 PM sun is ~south. North-facing parks shade behind home first;
    // afternoon notes that say "3B" describe the later westward migration.
    ['bluejays', 'seating behind home plate'],
    ['diamondbacks', 'seating behind home plate'],
    ['padres', 'seating behind home plate'],
    ['rockies', 'seating behind home plate'],
    ['yankees', 'first base side'],
    ['redsox', 'first base side'],
  ] as const)('%s day-game shade side is %s', (id, side) => {
    const stadium = MLB_STADIUMS.find((s) => s.id === id)!;
    expect(bestShadedSideForDayGame(stadium.orientation)).toBe(side);
  });
});

describe('sun position is computable for every stadium at a 1 PM local start', () => {
  it('returns a finite azimuth/altitude for all 182 venues on 2025-07-15', () => {
    const failures: string[] = [];
    for (const venue of ALL_UNIFIED_VENUES) {
      const utc = calendarDateAndTimeToUTC('2025-07-15', 13, 0, venue.timezone);
      const sun = getSunPosition(utc, venue.latitude, venue.longitude);
      if (!Number.isFinite(sun.azimuthDegrees) || !Number.isFinite(sun.altitudeDegrees)) {
        failures.push(venue.id);
      }
      // Midsummer 1 PM is daylight everywhere this site covers.
      if (sun.altitudeDegrees <= 0) failures.push(`${venue.id} night-at-1pm`);
    }
    expect(failures).toEqual([]);
  });
});

describe('orientation 0 is preserved and missing orientation is refused', () => {
  it('accepts a documented 0° axis', () => {
    expect(requireFiniteOrientation(0, 'highmark-stadium')).toBe(0);
  });

  it('refuses undefined / NaN instead of aiming the bowl north', () => {
    expect(() => requireFiniteOrientation(undefined, 'missing')).toThrow(/refusing to invent/);
    expect(() => requireFiniteOrientation(Number.NaN, 'missing')).toThrow(/refusing to invent/);
  });

  it('SunCalculator still treats a 0° open park as north-facing, not "missing"', () => {
    const calc = new SunCalculator({
      id: 'highmark-stadium',
      name: 'Highmark',
      latitude: 42.77,
      longitude: -78.79,
      orientation: 0,
      league: 'NFL',
      roof: 'open',
    } as any);
    const sun = { altitude: 45, azimuth: 180 } as any;
    const north = { id: 'n', name: 'N', level: 'lower' as const, baseAngle: 0, angleSpan: 10, covered: false };
    const south = { ...north, id: 's', name: 'S', baseAngle: 180 };
    const shadows = calc.calculateShadows(sun, [north, south]);
    const n = shadows.find((s) => s.sectionId === 'n')!;
    const s = shadows.find((s) => s.sectionId === 's')!;
    expect(s.sunExposure).toBeLessThan(n.sunExposure);
  });
});
