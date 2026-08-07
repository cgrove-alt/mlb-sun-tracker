/**
 * Unit tests for the whole-game-window shade helpers (Phase 9 A5).
 *
 * These feed controlled sun samples directly into `calculateGameWindowShade`,
 * so they exercise the aggregation + progression logic without any astronomy.
 *
 * @jest-environment node
 */

import {
  calculateGameWindowShade,
  gameWindowOffsets,
  type RowShadowInputSection,
  type SunSample,
} from '../sunCalculator';

// An open lower-bowl section, three rows deep, no overhang — so its coverage
// is driven purely by the structure BEHIND the seats and the sun's bearing.
//
// With stadium orientation 0, sectionCompass = (0 + 90 − baseAngle) = 0, so
// this section sits on the north side of the bowl and its seats face south.
//
// NOTE: this fixture's comments used to say "sun azimuth 0 is directly behind
// (sunny); azimuth 180 shines across the bowl into the seats (shaded)" — which
// is the sun/shade relationship backwards, and the assertions below were
// written to match. A grandstand shades its own seats: with the sun at azimuth
// 0 it is behind this section and these seats are SHADED; at azimuth 180 it
// crosses the bowl into their faces and they are LIT. See bowlGeometry.ts.
const SECTION: RowShadowInputSection = {
  id: 'T1',
  name: 'Test Section',
  level: 'lower',
  baseAngle: 90,
  angleSpan: 0,
  covered: false,
  rows: [
    { rowNumber: '1',  seats: 20, elevation: 10, depth: 10, covered: false, overhangHeight: 0 },
    { rowNumber: '10', seats: 20, elevation: 30, depth: 30, covered: false, overhangHeight: 0 },
    { rowNumber: '20', seats: 20, elevation: 50, depth: 50, covered: false, overhangHeight: 0 },
  ],
};

// A 60° sun, high enough that the structure behind only reaches partway across
// the deck (45 ft of structure throws ~26 ft of shadow), so the rows separate.
// The azimuth sweeps from across the bowl round to behind the section, which is
// a genuine sun→shade game: lit at first pitch, shaded by the final out.
const SAMPLES: SunSample[] = [
  { minutesFromStart: 0,   altitudeDegrees: 60, azimuthDegrees: 180 }, // across bowl → lit
  { minutesFromStart: 90,  altitudeDegrees: 60, azimuthDegrees: 90 },  // side-on
  { minutesFromStart: 180, altitudeDegrees: 60, azimuthDegrees: 0 },   // sun behind → shaded
];

describe('gameWindowOffsets', () => {
  it('includes both endpoints with the given step', () => {
    expect(gameWindowOffsets(180, 30)).toEqual([0, 30, 60, 90, 120, 150, 180]);
  });

  it('always includes the final out even when step does not divide the window', () => {
    expect(gameWindowOffsets(100, 40)).toEqual([0, 40, 80, 100]);
  });

  it('defaults to a 180-minute window at 30-minute steps (7 samples)', () => {
    expect(gameWindowOffsets()).toHaveLength(7);
  });
});

describe('calculateGameWindowShade', () => {
  const result = calculateGameWindowShade(SECTION, SAMPLES, 0);

  it('produces one timeline point per sample', () => {
    expect(result.timeline).toHaveLength(3);
    expect(result.timeline.map((t) => t.minutesFromStart)).toEqual([0, 90, 180]);
  });

  it('classifies a sunny→shaded game as sun-to-shade', () => {
    expect(result.startCoverage).toBeLessThan(50);
    expect(result.endCoverage).toBeGreaterThanOrEqual(50);
    expect(result.progression).toBe('sun-to-shade');
  });

  it('aggregates per-row coverage with avg bounded by min/max', () => {
    const backRow = result.rows[result.rows.length - 1];
    expect(backRow.coverageMin).toBeLessThanOrEqual(backRow.coverageAvg);
    expect(backRow.coverageAvg).toBeLessThanOrEqual(backRow.coverageMax);
    expect(backRow.coverageStart).toBe(backRow.timeline[0].coverage);
    expect(backRow.coverageEnd).toBe(backRow.timeline[backRow.timeline.length - 1].coverage);
    // Across the window the back row goes from lit to shaded by the structure
    // behind it, which is the shadow fans watch creep down the bowl.
    expect(backRow.coverageEnd).toBeGreaterThan(backRow.coverageStart + 40);
  });

  it('shades the back rows before the front rows', () => {
    // The structure behind the seats casts forward, so the shadow line starts
    // at the back wall and moves toward the field as the sun drops.
    const [front, , back] = result.rows;
    expect(back.coverageEnd).toBeGreaterThan(front.coverageEnd);
  });

  it('reports section coverageMin/Max spanning the window', () => {
    expect(result.coverageMin).toBeLessThan(result.coverageMax);
  });

  it('degrades to a single-instant result when given one sample', () => {
    const single = calculateGameWindowShade(SECTION, [SAMPLES[2]], 0);
    expect(single.timeline).toHaveLength(1);
    expect(single.startCoverage).toBe(single.endCoverage);
  });
});
