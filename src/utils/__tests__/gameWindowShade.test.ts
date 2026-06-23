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

// East-facing section with a back-row overhang. With stadium orientation 0,
// sectionLocal = baseAngle = 90 → sectionCompass = (0 + 90 - 90) = 0, so the
// seats face compass 180. Sun azimuth 0 is directly behind (opp=0, sunny);
// azimuth 180 shines across the bowl into the seats (opp=1, overhang shades).
const SECTION: RowShadowInputSection = {
  id: 'T1',
  name: 'Test Section',
  level: 'lower',
  baseAngle: 90,
  angleSpan: 0,
  covered: false,
  rows: [
    { rowNumber: '1', seats: 20, elevation: 30, depth: 10, covered: false, overhangHeight: 15 },
  ],
};

// Low sun (10°) so the overhang shadow runs long; azimuth sweeps from behind
// the section to across the bowl, so coverage should rise through the game.
const SAMPLES: SunSample[] = [
  { minutesFromStart: 0,   altitudeDegrees: 10, azimuthDegrees: 0 },   // sun behind → sunny
  { minutesFromStart: 90,  altitudeDegrees: 10, azimuthDegrees: 90 },  // side-on
  { minutesFromStart: 180, altitudeDegrees: 10, azimuthDegrees: 180 }, // across bowl → shaded
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
    const row = result.rows[0];
    expect(row.coverageMin).toBeLessThanOrEqual(row.coverageAvg);
    expect(row.coverageAvg).toBeLessThanOrEqual(row.coverageMax);
    expect(row.coverageStart).toBe(row.timeline[0].coverage);
    expect(row.coverageEnd).toBe(row.timeline[row.timeline.length - 1].coverage);
    // Across the window the back row goes from lit to overhang-shaded.
    expect(row.coverageEnd).toBeGreaterThan(row.coverageStart + 40);
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
