/**
 * Section-level sun-exposure regression tests.
 *
 * The user-reported bug (May 13, 2026): at Guaranteed Rate Field (White Sox,
 * orientation 120°) the site told a fan shade would be on the third base
 * side; the actual shade was on the first base side. Root cause:
 * `section.baseAngle` is stadium-local (0 = 1B, 90 = CF, 180 = 3B,
 * 270 = behind home), but the section-in-sun helpers were comparing it
 * directly against the (absolute compass) sun azimuth.
 *
 * These tests pin the corrected behaviour with physically-grounded cases:
 * for every named MLB orientation the chosen side of the bowl matches
 * geographical reality at that time of day.
 */

import {
  isSectionInSun,
  getSectionSunExposure,
  sectionCompassAngle,
} from '../sectionSunCalculations';
import type { StadiumSection } from '../../data/stadiumSectionTypes';

// Helpers --------------------------------------------------------

const lowerBowl = (id: string, baseAngle: number): StadiumSection => ({
  id,
  name: id,
  level: 'lower',
  baseAngle,
  angleSpan: 10,
  covered: false,
});

const coveredUpper = (id: string, baseAngle: number): StadiumSection => ({
  id,
  name: id,
  level: 'upper',
  baseAngle,
  angleSpan: 10,
  covered: true,
});

// Stadium-local convention reminder:
//   0   = 1B side
//   90  = CF
//   180 = 3B side
//   270 = behind home plate
const FIRST_BASE_SIDE = 0;
const CENTER_FIELD = 90;
const THIRD_BASE_SIDE = 180;
const BEHIND_HOME = 270;

// Compass conversion helper -------------------------------------

describe('sectionCompassAngle', () => {
  // Rate Field orientation 120° verified against satellite imagery (provenance file).
  it('places Rate Field 1B at compass SSW (~210°)', () => {
    const compass = sectionCompassAngle({ baseAngle: FIRST_BASE_SIDE, angleSpan: 0 }, 120);
    expect(Math.abs(compass - 210)).toBeLessThan(0.5);
  });

  it('places Rate Field 3B at compass NE (~30°)', () => {
    const compass = sectionCompassAngle({ baseAngle: THIRD_BASE_SIDE, angleSpan: 0 }, 120);
    expect(Math.abs(compass - 30)).toBeLessThan(0.5);
  });

  it('places Rate Field CF at compass ESE (~120°, matches orientation)', () => {
    const compass = sectionCompassAngle({ baseAngle: CENTER_FIELD, angleSpan: 0 }, 120);
    expect(Math.abs(compass - 120)).toBeLessThan(0.5);
  });

  it('places Rate Field behind-home at compass WNW (~300°)', () => {
    const compass = sectionCompassAngle({ baseAngle: BEHIND_HOME, angleSpan: 0 }, 120);
    expect(Math.abs(compass - 300)).toBeLessThan(0.5);
  });

  // Cross-stadium sanity check.
  it('places Citi Field 1B at compass ESE (~125°)', () => {
    const compass = sectionCompassAngle({ baseAngle: FIRST_BASE_SIDE, angleSpan: 0 }, 35);
    expect(Math.abs(compass - 125)).toBeLessThan(0.5);
  });
});

// isSectionInSun ------------------------------------------------

describe('isSectionInSun', () => {
  const RATE_FIELD_ORIENTATION = 120;

  it('is false below the horizon', () => {
    const sec = lowerBowl('any', FIRST_BASE_SIDE);
    expect(isSectionInSun(sec, 290, -5, RATE_FIELD_ORIENTATION)).toBe(false);
    expect(isSectionInSun(sec, 290, 0, RATE_FIELD_ORIENTATION)).toBe(false);
  });

  it('is false for covered sections at moderate sun', () => {
    const sec = coveredUpper('cov', FIRST_BASE_SIDE);
    expect(isSectionInSun(sec, 180, 45, RATE_FIELD_ORIENTATION)).toBe(false);
    expect(isSectionInSun(sec, 180, 60, RATE_FIELD_ORIENTATION)).toBe(false);
  });

  it('is true for any uncovered section above the horizon', () => {
    for (const baseAngle of [FIRST_BASE_SIDE, CENTER_FIELD, THIRD_BASE_SIDE, BEHIND_HOME]) {
      expect(isSectionInSun(lowerBowl('s', baseAngle), 280, 8, RATE_FIELD_ORIENTATION)).toBe(true);
    }
  });
});

// getSectionSunExposure ----------------------------------------

describe('getSectionSunExposure', () => {
  const RATE_FIELD_ORIENTATION = 120;
  const CITI_FIELD_ORIENTATION = 35;

  it('returns 0 below the horizon', () => {
    const sec = lowerBowl('any', FIRST_BASE_SIDE);
    expect(getSectionSunExposure(sec, -5, 290, RATE_FIELD_ORIENTATION)).toBe(0);
  });

  it('returns 0 for covered sections at moderate sun', () => {
    expect(
      getSectionSunExposure(coveredUpper('c', FIRST_BASE_SIDE), 45, 180, RATE_FIELD_ORIENTATION),
    ).toBe(0);
  });

  // PRIMARY REGRESSION — the user-reported case.
  // Rate Field, orientation 120°, evening sun in the west (~280° azimuth, ~8° elevation).
  // The site told a fan "shade on 3B side"; reality was "shade on 1B side". After
  // the convention fix, 3B should be MORE sunlit (cross-bowl direct light from
  // the east) and 1B should be MORE shaded (back to the sun).
  it('reports 3B side as sunnier than 1B side at Rate Field at sunset', () => {
    const oneB = lowerBowl('1B', FIRST_BASE_SIDE);
    const threeB = lowerBowl('3B', THIRD_BASE_SIDE);
    const threeBExposure = getSectionSunExposure(threeB, 8, 280, RATE_FIELD_ORIENTATION);
    const oneBExposure = getSectionSunExposure(oneB, 8, 280, RATE_FIELD_ORIENTATION);
    expect(threeBExposure).toBeGreaterThan(oneBExposure);
    // And not by a trivial margin — the geometry says these are on opposite halves.
    expect(threeBExposure - oneBExposure).toBeGreaterThan(20);
  });

  // Cross-stadium check: Citi Field (orientation 35°). At sunset west sun,
  // the section receiving direct cross-bowl light is the one facing east —
  // for Citi Field at orientation 35° the 3B side sits at compass 305° (WNW)
  // and 1B at compass 125° (ESE). So at sunset, 1B is the directly-lit side.
  it('reports 1B side as sunnier than 3B side at Citi Field at sunset', () => {
    const oneB = lowerBowl('1B', FIRST_BASE_SIDE);
    const threeB = lowerBowl('3B', THIRD_BASE_SIDE);
    const oneBExposure = getSectionSunExposure(oneB, 8, 280, CITI_FIELD_ORIENTATION);
    const threeBExposure = getSectionSunExposure(threeB, 8, 280, CITI_FIELD_ORIENTATION);
    expect(oneBExposure).toBeGreaterThan(threeBExposure);
    expect(oneBExposure - threeBExposure).toBeGreaterThan(20);
  });

  it('saturates near 100 for high sun on an uncovered section', () => {
    const sec = lowerBowl('home', BEHIND_HOME);
    expect(getSectionSunExposure(sec, 75, 180, RATE_FIELD_ORIENTATION)).toBeGreaterThan(85);
  });

  it('falls off monotonically as elevation drops', () => {
    const sec = lowerBowl('1B', FIRST_BASE_SIDE);
    const high = getSectionSunExposure(sec, 60, 280, RATE_FIELD_ORIENTATION);
    const mid = getSectionSunExposure(sec, 30, 280, RATE_FIELD_ORIENTATION);
    const low = getSectionSunExposure(sec, 5, 280, RATE_FIELD_ORIENTATION);
    expect(high).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(low);
  });

  it('is bounded to [0, 100] across a parameter sweep', () => {
    for (let baseAngle = 0; baseAngle < 360; baseAngle += 30) {
      for (let az = 0; az < 360; az += 30) {
        for (let el = -10; el <= 90; el += 10) {
          for (const orientation of [0, 35, 90, 120, 180, 270, 318]) {
            const sec = lowerBowl('s', baseAngle);
            const exp = getSectionSunExposure(sec, el, az, orientation);
            expect(exp).toBeGreaterThanOrEqual(0);
            expect(exp).toBeLessThanOrEqual(100);
          }
        }
      }
    }
  });
});

// Per-stadium consistency: every MLB stadium produces a physically-sensible
// "east half of bowl is lit at sunset" prediction.
describe('Sunset shade direction consistency across all 30 MLB stadiums', () => {
  // For each stadium, at evening west sun:
  //   - The section located at compass ~ENE (~100°) — opposite the sun —
  //     should be MORE sunlit than the section located at compass ~W (~280°),
  //     which has the sun directly behind it.
  // We pick two test sections per stadium by stadium-local baseAngle such that
  // they land at the right compass positions for that stadium's orientation.
  it('shade falls on the west-facing half at sunset for every orientation', () => {
    const ORIENTATIONS = [
      { id: 'angels', orientation: 65 },
      { id: 'astros', orientation: 20 },
      { id: 'athletics', orientation: 330 },
      { id: 'bluejays', orientation: 15 },
      { id: 'braves', orientation: 45 },
      { id: 'brewers', orientation: 357 },
      { id: 'cardinals', orientation: 92 },
      { id: 'cubs', orientation: 13 },
      { id: 'diamondbacks', orientation: 23 },
      { id: 'dodgers', orientation: 25 },
      { id: 'giants', orientation: 87 },
      { id: 'guardians', orientation: 60 },
      { id: 'mariners', orientation: 318 },
      { id: 'marlins', orientation: 40 },
      { id: 'mets', orientation: 35 },
      { id: 'nationals', orientation: 87 },
      { id: 'orioles', orientation: 58 },
      { id: 'padres', orientation: 25 },
      { id: 'phillies', orientation: 59 },
      { id: 'pirates', orientation: 25 },
      { id: 'rangers', orientation: 46 },
      { id: 'rays', orientation: 316 },
      { id: 'redsox', orientation: 52 },
      { id: 'reds', orientation: 105 },
      { id: 'rockies', orientation: 40 },
      { id: 'royals', orientation: 58 },
      { id: 'tigers', orientation: 145 },
      { id: 'twins', orientation: 0 },
      { id: 'whitesox', orientation: 120 },
      { id: 'yankees', orientation: 55 },
    ];

    const sunAzimuth = 280; // west
    const sunElevation = 8;

    for (const { id, orientation } of ORIENTATIONS) {
      // baseAngle that places a section at compass ~100° (ENE, opposite the sun):
      //   compass = (orientation + 90 - baseAngle) mod 360 = 100
      //   baseAngle = (orientation + 90 - 100) mod 360 = (orientation - 10) mod 360
      const sunlitBase = ((orientation - 10) % 360 + 360) % 360;
      // baseAngle for compass ~280° (W, sun directly behind):
      //   baseAngle = (orientation + 90 - 280) mod 360 = (orientation - 190) mod 360
      const shadedBase = ((orientation - 190) % 360 + 360) % 360;

      const sunlit = getSectionSunExposure(
        lowerBowl(`${id}-sunlit`, sunlitBase),
        sunElevation,
        sunAzimuth,
        orientation,
      );
      const shaded = getSectionSunExposure(
        lowerBowl(`${id}-shaded`, shadedBase),
        sunElevation,
        sunAzimuth,
        orientation,
      );

      if (sunlit <= shaded) {
        throw new Error(
          `[${id}] orientation=${orientation}°: section opposite sun reported as ` +
            `LESS sunlit (${sunlit}) than section behind sun (${shaded}). Convention bug?`,
        );
      }
    }
  });
});
