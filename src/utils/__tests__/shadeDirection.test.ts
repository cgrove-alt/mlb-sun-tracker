/**
 * SHADE DIRECTION — the test the site did not have.
 *
 * Background. Until 2026-08-07 three of the four shade models on this site had
 * the sun/shade sides exactly inverted, and 900 tests passed on top of them.
 * They passed because the only test that asserted the physical direction
 * (shadeSanity) built its fixtures with `overhangHeight: 0` — a configuration
 * that does not occur in the real data. On those synthetic sections the model
 * happened to be right; on the 6,877 real MLB rows that carry an overhang it
 * was wrong every single time.
 *
 * So this file uses REAL sections, for ALL 30 parks, through EVERY production
 * entry point. If a future change re-inverts any model, this fails.
 *
 * The rule under test (see src/utils/bowlGeometry.ts for the derivation):
 *   a grandstand shades its own seats — the half of the bowl on the same
 *   compass side as the sun is the shaded half.
 *
 * @jest-environment node
 */

import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumSections } from '../../data/stadium-data-aggregator';
import { getSunPosition } from '../sunPosition';
import { calendarDateAndTimeToUTC } from '../stadiumTime';
import { angularDistance, sectionCompassAngle, normalizeAngle } from '../bowlGeometry';
import { getSectionSunExposure } from '../sectionSunCalculations';
import { SunCalculator, calculateRowShadows } from '../sunCalculator';
import { getUnifiedVenueShade } from '../getUnifiedVenueShade';

const DATE = '2025-07-15';
const HOURS = [13, 16, 19]; // day game, late-afternoon start, evening start

/** Sections whose bearing sits within 60° of the sun — the shaded half. */
const SUN_SIDE_MAX_DEG = 60;
/** Sections more than 120° from the sun — the lit half. */
const OPP_SIDE_MIN_DEG = 120;

const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

interface Sample {
  stadium: (typeof MLB_STADIUMS)[number];
  utc: Date;
  sun: { altitudeDegrees: number; azimuthDegrees: number };
  sections: any[];
  sunSide: any[];
  oppSide: any[];
}

/**
 * Build every (park, hour) sample with its real sections split into the half
 * of the bowl the sun is on and the half across from it. Only uncovered
 * sections take part: a roofed section is shaded whatever the sun does, so
 * including them would dilute the very signal under test.
 */
async function buildSamples(): Promise<Sample[]> {
  const out: Sample[] = [];
  for (const stadium of MLB_STADIUMS) {
    if (stadium.roof === 'fixed') continue; // a dome shades everything; nothing to orient
    const all = (await getStadiumSections(stadium.id, 'MLB')) as any[];
    const usable = all.filter(
      s => typeof s.baseAngle === 'number' && typeof s.angleSpan === 'number' && !s.covered,
    );
    for (const hour of HOURS) {
      const utc = calendarDateAndTimeToUTC(DATE, hour, 0, stadium.timezone);
      const sun = getSunPosition(utc, stadium.latitude, stadium.longitude);
      if (sun.altitudeDegrees <= 0) continue;

      const withDist = usable.map(s => ({
        s,
        d: angularDistance(sectionCompassAngle(s, stadium.orientation), sun.azimuthDegrees),
      }));
      const sunSide = withDist.filter(x => x.d <= SUN_SIDE_MAX_DEG).map(x => x.s);
      const oppSide = withDist.filter(x => x.d >= OPP_SIDE_MIN_DEG).map(x => x.s);
      if (!sunSide.length || !oppSide.length) continue;

      out.push({ stadium, utc, sun, sections: usable, sunSide, oppSide });
    }
  }
  return out;
}

let SAMPLES: Sample[] = [];
beforeAll(async () => {
  SAMPLES = await buildSamples();
});

describe('every production shade model agrees with the physics', () => {
  it('covers all 30 parks across the day', () => {
    expect(SAMPLES.length).toBeGreaterThanOrEqual(60);
    const parks = new Set(SAMPLES.map(s => s.stadium.id));
    const openParks = MLB_STADIUMS.filter(s => s.roof !== 'fixed').length;
    expect(parks.size).toBe(openParks);
  });

  it('getSectionSunExposure — venue-page shade diagram', () => {
    const failures: string[] = [];
    for (const { stadium, sun, sunSide, oppSide } of SAMPLES) {
      const exp = (list: any[]) =>
        mean(list.map(s => getSectionSunExposure(s, sun.altitudeDegrees, sun.azimuthDegrees, stadium.orientation)));
      const a = exp(sunSide);
      const b = exp(oppSide);
      if (!(a < b)) failures.push(`${stadium.id} az=${sun.azimuthDegrees.toFixed(0)} sunSide=${a.toFixed(1)} oppSide=${b.toFixed(1)}`);
    }
    expect(failures).toEqual([]);
  });

  it('SunCalculator — homepage MLB section list and MobileApp', () => {
    const failures: string[] = [];
    for (const { stadium, sun, sunSide, oppSide } of SAMPLES) {
      const calc = new SunCalculator(stadium as any);
      const exp = (list: any[]) => {
        const shadows = calc.calculateShadows(
          { altitude: sun.altitudeDegrees, azimuth: sun.azimuthDegrees } as any,
          list.map(s => ({ ...s, depth: 50 })),
        );
        return mean(shadows.map(r => r.sunExposure));
      };
      const a = exp(sunSide);
      const b = exp(oppSide);
      if (!(a < b)) failures.push(`${stadium.id} az=${sun.azimuthDegrees.toFixed(0)} sunSide=${a.toFixed(1)} oppSide=${b.toFixed(1)}`);
    }
    expect(failures).toEqual([]);
  });

  it('getUnifiedVenueShade — homepage shade % and "most shaded first" ordering', () => {
    const failures: string[] = [];
    for (const { stadium, utc, sun, sunSide, oppSide } of SAMPLES) {
      const venue = { ...stadium, sport: 'baseball' } as any;
      const tag = (list: any[], prefix: string) =>
        list.map((s, i) => ({
          id: `${prefix}${i}`, name: `${prefix}${i}`, level: s.level,
          baseAngle: s.baseAngle, angleSpan: s.angleSpan, covered: false,
          price: 'moderate', venueType: 'baseball',
        }));
      const results = getUnifiedVenueShade(venue, utc, [...tag(sunSide, 'S'), ...tag(oppSide, 'O')]);
      const avg = (p: string) =>
        mean(results.filter(r => r.section.id.startsWith(p)).map(r => r.shadePercentage));
      const a = avg('S'); // shade %: HIGHER means shadier
      const b = avg('O');
      if (!(a > b)) failures.push(`${stadium.id} az=${sun.azimuthDegrees.toFixed(0)} sunSideShade=${a.toFixed(1)} oppSideShade=${b.toFixed(1)}`);
    }
    expect(failures).toEqual([]);
  });

  it('SunCalculator reports a coherent fully-shaded state below the horizon', () => {
    const calc = new SunCalculator(MLB_STADIUMS[0] as any);
    const [result] = calc.calculateShadows(
      { altitude: -5, azimuth: 270 } as any,
      [{ id: 'night', name: 'Night section', level: 'lower', baseAngle: 0, depth: 50 }],
    );

    expect(result).toMatchObject({
      coverage: 100,
      inShadow: true,
      sunExposure: 0,
      shadowSources: { bowl: 100 },
    });
  });
});

describe('every real section responds to the sun in the right direction', () => {
  // Comparing the two halves of a bowl is a fair test only when both halves
  // carry similar structure. They often do not — at Rate Field the half away
  // from the 1 PM sun happens to have 39% of its rows roofed against the sun
  // side's 28%, so at high noon the roofed half really is shadier and a
  // halves comparison says nothing about orientation.
  //
  // So isolate the variable: hold each REAL section fixed, with all its real
  // rows, overhangs and canopies, and move only the sun. Put the sun behind
  // the section, then across the bowl from it, at the same altitude. Shade
  // must never go DOWN when the sun moves behind the seats.
  //
  // This is the strongest form of the check, it runs on every real section in
  // MLB, and it is exactly what the old model failed: for the 6,877 rows that
  // carry an overhang it produced more shade with the sun in the seats' faces
  // than with the sun behind them.
  it('calculateRowShadows — /api/stadium/*/rows/shade, every real section', () => {
    const inverted: string[] = [];
    let strictlyMore = 0;
    let total = 0;

    for (const { stadium, sun, sections } of SAMPLES) {
      for (const s of sections) {
        const compass = sectionCompassAngle(s, stadium.orientation);
        const behind = calculateRowShadows(s, sun.altitudeDegrees, compass, stadium.orientation).averageCoverage;
        const facing = calculateRowShadows(s, sun.altitudeDegrees, normalizeAngle(compass + 180), stadium.orientation).averageCoverage;
        total++;
        if (behind < facing) {
          inverted.push(`${stadium.id}/${s.id} alt=${sun.altitudeDegrees.toFixed(0)} behind=${behind} facing=${facing}`);
        } else if (behind > facing) {
          strictlyMore++;
        }
      }
    }

    expect(inverted).toEqual([]);
    // Ties are legitimate (a fully roofed section is 100% shaded either way),
    // but the model must actually respond to orientation for most sections.
    expect(strictlyMore / total).toBeGreaterThan(0.5);
  });

  it('getSectionSunExposure — every real section', () => {
    const inverted: string[] = [];
    for (const { stadium, sun, sections } of SAMPLES) {
      for (const s of sections) {
        const compass = sectionCompassAngle(s, stadium.orientation);
        const behind = getSectionSunExposure(s, sun.altitudeDegrees, compass, stadium.orientation);
        const facing = getSectionSunExposure(s, sun.altitudeDegrees, normalizeAngle(compass + 180), stadium.orientation);
        if (behind > facing) {
          inverted.push(`${stadium.id}/${s.id} behind=${behind} facing=${facing}`);
        }
      }
    }
    expect(inverted).toEqual([]);
  });
});

describe('3D ray-cast path (?use3d=true)', () => {
  // The 3D path was doubly broken: its sun ray pointed the way light TRAVELS
  // (down into the ground, so a roof above a seat could never occlude it) and
  // was built from a compass azimuth inside a stadium-LOCAL coordinate frame.
  // On top of that, 15 of the 21 obstruction boxes a park generated had `min`
  // greater than `max`, which makes the ray/slab test meaningless — so most of
  // the geometry cast no shadow at all.
  it('reports the sun-side half as shadier, for every park at usable sun angles', async () => {
    const { getStadium3DModel } = await import('../../data/stadium3DGeometry');
    const { OptimizedShadeCalculator3D, createSunPosition } = await import('../shadeCalculation3DOptimized');

    const failures: string[] = [];
    for (const stadium of MLB_STADIUMS) {
      if (stadium.roof === 'fixed') continue;
      const detailed = (await getStadiumSections(stadium.id, 'MLB')) as any[];
      const simple = detailed.map(s => ({
        id: s.id, name: s.name,
        level: (s.level === 'standing' ? 'lower' : s.level),
        baseAngle: s.baseAngle, angleSpan: s.angleSpan, covered: s.covered, price: s.price,
      }));
      const model = getStadium3DModel(stadium as any, simple as any);
      const calc = new OptimizedShadeCalculator3D(model, false);

      for (const hour of HOURS) {
        const utc = calendarDateAndTimeToUTC(DATE, hour, 0, stadium.timezone);
        const sun = getSunPosition(utc, stadium.latitude, stadium.longitude);
        if (sun.altitudeDegrees <= 0) continue;
        // Above ~70° the sun is close enough to overhead that azimuth stops
        // carrying real information: what shades a seat is whatever sits
        // directly above it. Asserting a side preference there would be
        // asserting noise.
        if (sun.altitudeDegrees > 70) continue;

        const res = calc.calculateAllSectionsShade(
          createSunPosition(sun.azimuthDegrees, sun.altitudeDegrees),
        );
        const sunSide: number[] = [];
        const oppSide: number[] = [];
        for (const sec of model.sections) {
          const r = res.get(sec.id);
          if (!r) continue;
          const d = angularDistance(sectionCompassAngle(sec, stadium.orientation), sun.azimuthDegrees);
          if (d <= SUN_SIDE_MAX_DEG) sunSide.push(r.percentageInShade);
          else if (d >= OPP_SIDE_MIN_DEG) oppSide.push(r.percentageInShade);
        }
        if (!sunSide.length || !oppSide.length) continue;
        // Exact sourced maps are asymmetric: the two samples can contain a
        // different mix of tiers and real obstruction rays. Treat a reversal
        // smaller than one percentage point as structural sampling noise; the
        // sign bug this guards produced tens of points of reversed shade.
        if (mean(sunSide) + 1 < mean(oppSide)) {
          failures.push(`${stadium.id}@${hour}: sunSide=${mean(sunSide).toFixed(1)} oppSide=${mean(oppSide).toFixed(1)}`);
        }
      }
    }
    expect(failures).toEqual([]);
  }, 60000);

  it('finds real occlusion — obstruction geometry is not silently inert', async () => {
    // Guards the inverted-bounding-box defect: if AABBs regress to min > max,
    // the obstructions stop casting and average shade collapses toward zero.
    const { getStadium3DModel } = await import('../../data/stadium3DGeometry');
    const stadium = MLB_STADIUMS.find(s => s.id === 'angels')!;
    const model = getStadium3DModel(stadium as any, []);
    expect(model.obstructions.length).toBeGreaterThan(0);
    for (const obs of model.obstructions) {
      const { min, max } = obs.boundingBox;
      expect(min.x).toBeLessThanOrEqual(max.x);
      expect(min.y).toBeLessThanOrEqual(max.y);
      expect(min.z).toBeLessThanOrEqual(max.z);
    }
  });
});

describe('the four models agree with EACH OTHER on which half is shaded', () => {
  // Cross-model consistency. Before the fix, the venue page and the homepage
  // could give a fan opposite answers for the same seat at the same moment.
  it('no park/hour has two models disagreeing about the shaded half', () => {
    const failures: string[] = [];
    for (const { stadium, utc, sun, sections, sunSide, oppSide } of SAMPLES) {
      const calc = new SunCalculator(stadium as any);

      const exposureModel = (list: any[]) =>
        mean(list.map(s => getSectionSunExposure(s, sun.altitudeDegrees, sun.azimuthDegrees, stadium.orientation)));
      // Structure-neutral: hold the section fixed and move the sun, so the
      // comparison is not confounded by one half of the bowl having more roof.
      const rowModel = (list: any[], flip: boolean) =>
        mean(list.map(s => {
          const compass = sectionCompassAngle(s, stadium.orientation);
          const az = flip ? normalizeAngle(compass + 180) : compass;
          return 100 - calculateRowShadows(s, sun.altitudeDegrees, az, stadium.orientation).averageCoverage;
        }));
      const calcModel = (list: any[]) =>
        mean(calc.calculateShadows(
          { altitude: sun.altitudeDegrees, azimuth: sun.azimuthDegrees } as any,
          list.map(s => ({ ...s, depth: 50 })),
        ).map(r => r.sunExposure));
      const unifiedModel = (list: any[], prefix: string) => {
        const venue = { ...stadium, sport: 'baseball' } as any;
        const secs = list.map((s, i) => ({
          id: `${prefix}${i}`, name: `${prefix}${i}`, level: s.level,
          baseAngle: s.baseAngle, angleSpan: s.angleSpan, covered: false,
          price: 'moderate', venueType: 'baseball',
        }));
        return mean(getUnifiedVenueShade(venue, utc, secs).map(r => 100 - r.shadePercentage));
      };

      // Every model must call the SUN SIDE less sunny than the opposite side.
      const verdicts = {
        exposure: exposureModel(sunSide) < exposureModel(oppSide),
        rows: rowModel(sections, false) < rowModel(sections, true),
        calculator: calcModel(sunSide) < calcModel(oppSide),
        unified: unifiedModel(sunSide, 'S') < unifiedModel(oppSide, 'O'),
      };
      const disagreeing = Object.entries(verdicts).filter(([, v]) => !v).map(([k]) => k);
      if (disagreeing.length) {
        failures.push(`${stadium.id} @${sun.azimuthDegrees.toFixed(0)}°: ${disagreeing.join(', ')}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('published ballpark shade guidance (sourced in src/data/stadiums.ts)', () => {
  // Each case restates a claim already cited in the stadium data's own
  // provenance comments, or long-established fan guidance for that park. These
  // are the ground truth the models are accountable to.
  const CASES: Array<{
    id: string;
    hour: number;
    shadier: 'firstBase' | 'thirdBase' | 'behindHome' | 'centerField';
    sunnier: 'firstBase' | 'thirdBase' | 'behindHome' | 'centerField';
    claim: string;
  }> = [
    {
      id: 'bluejays', hour: 16, shadier: 'thirdBase', sunnier: 'firstBase',
      claim: 'Rogers Centre: "3rd base side is the shade side, 1st base side is sunny"',
    },
    {
      id: 'cubs', hour: 16, shadier: 'thirdBase', sunnier: 'firstBase',
      claim: 'Wrigley Field: third base side holds the afternoon shade; first base bakes',
    },
    {
      id: 'whitesox', hour: 19, shadier: 'firstBase', sunnier: 'thirdBase',
      claim: 'Rate Field: the user-reported bug — shade is on the FIRST base side, not third',
    },
    {
      id: 'redsox', hour: 19, shadier: 'thirdBase', sunnier: 'centerField',
      claim: 'Fenway Park: third base grandstand shades up while the bleachers roast',
    },
    {
      id: 'giants', hour: 16, shadier: 'firstBase', sunnier: 'thirdBase',
      claim: 'Oracle Park: first base side falls into shade first in the afternoon',
    },
    {
      id: 'rockies', hour: 19, shadier: 'thirdBase', sunnier: 'firstBase',
      claim: 'Coors Field: "oriented to the north, rises over RF, sets behind LF"',
    },
    {
      id: 'diamondbacks', hour: 16, shadier: 'thirdBase', sunnier: 'firstBase',
      claim: 'Chase Field: "sets behind the left field wall"',
    },
  ];

  const OFFSET = { firstBase: 90, thirdBase: -90, behindHome: 180, centerField: 0 };

  it.each(CASES)('$id — $claim', async ({ id, hour, shadier, sunnier }) => {
    const stadium = MLB_STADIUMS.find(s => s.id === id)!;
    expect(stadium).toBeDefined();
    const utc = calendarDateAndTimeToUTC(DATE, hour, 0, stadium.timezone);
    const sun = getSunPosition(utc, stadium.latitude, stadium.longitude);
    expect(sun.altitudeDegrees).toBeGreaterThan(0);

    // Build one representative uncovered lower-bowl section on each named side.
    const localFor = (side: keyof typeof OFFSET) =>
      normalizeAngle(stadium.orientation + 90 - normalizeAngle(stadium.orientation + OFFSET[side]));
    const sec = (side: keyof typeof OFFSET) => ({
      id: side, name: side, level: 'lower' as const,
      baseAngle: localFor(side), angleSpan: 0, covered: false,
    });

    const exposure = (side: keyof typeof OFFSET) =>
      getSectionSunExposure(sec(side) as any, sun.altitudeDegrees, sun.azimuthDegrees, stadium.orientation);

    expect(exposure(shadier)).toBeLessThan(exposure(sunnier));
  });
});
