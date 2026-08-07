/**
 * Tests for the shared bowl-geometry primitive.
 *
 * This module is the one place the sun/shade relationship is defined. If these
 * tests pass and a shade model still points the wrong way, the model is not
 * built on this primitive.
 *
 * @jest-environment node
 */

import {
  normalizeAngle,
  angularDistance,
  sectionCompassAngle,
  sunIncidence,
  shadowReachFt,
  horizonBlockFactor,
  backStructureShadeFraction,
  overhangShadeFraction,
  structuralShadeFraction,
  directSunPercent,
  BOWL_DEFAULTS,
} from '../bowlGeometry';

describe('angle helpers', () => {
  it('normalizes into [0, 360)', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(-90)).toBe(270);
    expect(normalizeAngle(725)).toBe(5);
  });

  it('measures the smallest angle between bearings', () => {
    expect(angularDistance(0, 10)).toBe(10);
    expect(angularDistance(350, 10)).toBe(20);
    expect(angularDistance(10, 350)).toBe(20);
    expect(angularDistance(0, 180)).toBe(180);
    expect(angularDistance(0, 190)).toBe(170);
  });

  it('never exceeds 180 across a full sweep', () => {
    for (let a = 0; a < 360; a += 7) {
      for (let b = 0; b < 360; b += 11) {
        const d = angularDistance(a, b);
        expect(d).toBeGreaterThanOrEqual(0);
        expect(d).toBeLessThanOrEqual(180);
      }
    }
  });
});

describe('sectionCompassAngle', () => {
  // Facing due north from home plate: 1B east, CF north, 3B west, HP south.
  it.each([
    ['1B', 0, 90],
    ['CF', 90, 0],
    ['3B', 180, 270],
    ['behind home', 270, 180],
  ])('orientation 0: %s (local %i) → compass %i', (_l, base, expected) => {
    expect(sectionCompassAngle({ baseAngle: base, angleSpan: 0 }, 0)).toBe(expected);
  });

  it('rotates with the park', () => {
    expect(sectionCompassAngle({ baseAngle: 0, angleSpan: 0 }, 120)).toBe(210);
    expect(sectionCompassAngle({ baseAngle: 180, angleSpan: 0 }, 120)).toBe(30);
  });

  it('uses the section centre when angleSpan is given', () => {
    expect(sectionCompassAngle({ baseAngle: 0, angleSpan: 20 }, 0)).toBe(80);
  });

  it('tolerates a missing angleSpan', () => {
    expect(sectionCompassAngle({ baseAngle: 0 }, 0)).toBe(90);
  });
});

describe('sunIncidence — THE sign convention', () => {
  it('sunBehind is 1 when the sun sits on the section’s own side', () => {
    const i = sunIncidence(270, 270);
    expect(i.angleDiffDeg).toBe(0);
    expect(i.sunBehind).toBeCloseTo(1, 10);
    expect(i.sunFacing).toBeCloseTo(0, 10);
  });

  it('sunFacing is 1 when the sun is straight across the bowl', () => {
    const i = sunIncidence(270, 90);
    expect(i.angleDiffDeg).toBe(180);
    expect(i.sunBehind).toBeCloseTo(0, 10);
    expect(i.sunFacing).toBeCloseTo(1, 10);
  });

  it('splits evenly at right angles', () => {
    const i = sunIncidence(270, 0);
    expect(i.angleDiffDeg).toBe(90);
    expect(i.sunBehind).toBeCloseTo(0.5, 10);
  });

  it('always sums to 1 and stays in [0, 1]', () => {
    for (let az = 0; az < 360; az += 13) {
      for (let sc = 0; sc < 360; sc += 17) {
        const i = sunIncidence(az, sc);
        expect(i.sunBehind + i.sunFacing).toBeCloseTo(1, 10);
        expect(i.sunBehind).toBeGreaterThanOrEqual(0);
        expect(i.sunBehind).toBeLessThanOrEqual(1);
      }
    }
  });

  it('is continuous — no seam at the old 90° branch point', () => {
    let maxJump = 0;
    let prev = sunIncidence(0, 0).sunBehind;
    for (let d = 1; d <= 360; d++) {
      const cur = sunIncidence(0, d).sunBehind;
      maxJump = Math.max(maxJump, Math.abs(cur - prev));
      prev = cur;
    }
    // The smoothstep's steepest slope is 1.5 / (2 × half-width) per degree,
    // so a 1° step moves it by under 0.02. The hard branch it replaced jumped
    // by ~0.8 of the range in a single degree.
    expect(maxJump).toBeLessThan(0.02);
  });

  it('is symmetric about the sun', () => {
    for (let d = 0; d <= 180; d += 9) {
      expect(sunIncidence(100, 100 + d).sunBehind).toBeCloseTo(
        sunIncidence(100, 100 - d).sunBehind,
        10,
      );
    }
  });
});

describe('shadowReachFt', () => {
  it('equals the height at 45°', () => {
    expect(shadowReachFt(45, 45)).toBeCloseTo(45, 6);
  });

  it('grows as the sun drops', () => {
    expect(shadowReachFt(20, 10)).toBeGreaterThan(shadowReachFt(20, 30));
    expect(shadowReachFt(20, 30)).toBeGreaterThan(shadowReachFt(20, 60));
  });

  it('is Infinity at or below the horizon', () => {
    expect(shadowReachFt(20, 0)).toBe(Infinity);
    expect(shadowReachFt(20, -5)).toBe(Infinity);
  });
});

describe('horizonBlockFactor', () => {
  it('is 0 below the horizon and 1 above the stadium rim', () => {
    expect(horizonBlockFactor(-1)).toBe(0);
    expect(horizonBlockFactor(0)).toBe(0);
    expect(horizonBlockFactor(BOWL_DEFAULTS.rimAngleDeg)).toBe(1);
    expect(horizonBlockFactor(60)).toBe(1);
  });

  it('ramps monotonically through the rim band', () => {
    let prev = 0;
    for (let a = 0; a <= BOWL_DEFAULTS.rimAngleDeg; a += 1) {
      const f = horizonBlockFactor(a);
      expect(f).toBeGreaterThanOrEqual(prev);
      prev = f;
    }
  });
});

describe('backStructureShadeFraction — the deep-shade mechanism', () => {
  it('shades a lower bowl more as the sun drops', () => {
    const noon = backStructureShadeFraction(70, 'lower');
    const mid = backStructureShadeFraction(45, 'lower');
    const low = backStructureShadeFraction(20, 'lower');
    expect(noon).toBeLessThan(mid);
    expect(mid).toBeLessThan(low);
    expect(low).toBeCloseTo(1, 6);
  });

  it('shades a lower bowl more than an upper deck at the same sun', () => {
    expect(backStructureShadeFraction(45, 'lower')).toBeGreaterThan(
      backStructureShadeFraction(45, 'upper'),
    );
  });

  it('is fully shaded below the horizon and bounded to [0, 1]', () => {
    expect(backStructureShadeFraction(-3, 'lower')).toBe(1);
    for (let a = -10; a <= 90; a += 3) {
      for (const lvl of ['field', 'lower', 'club', 'upper', 'suite'] as const) {
        const f = backStructureShadeFraction(a, lvl);
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(1);
      }
    }
  });

  it('falls back to the lower-bowl profile for an unknown level', () => {
    expect(backStructureShadeFraction(45, undefined)).toBe(
      backStructureShadeFraction(45, 'lower'),
    );
  });
});

describe('overhangShadeFraction — the back-rows-under-the-lip mechanism', () => {
  it('reaches further back as the sun drops', () => {
    expect(overhangShadeFraction(20, 20, 40)).toBeGreaterThan(overhangShadeFraction(60, 20, 40));
  });

  it('reports no shade rather than fabricating it when depth data is missing', () => {
    // The old model divided by max(depth, 0.001) and pinned 647 real rows to
    // 100% shade regardless of the sun. Missing depth must mean "unknown".
    expect(overhangShadeFraction(45, 20, 0)).toBe(0);
    expect(overhangShadeFraction(45, 20, undefined)).toBe(0);
  });

  it('reports no shade when there is no overhang', () => {
    expect(overhangShadeFraction(45, 0, 30)).toBe(0);
    expect(overhangShadeFraction(45, undefined, 30)).toBe(0);
  });
});

describe('structuralShadeFraction — sign check in both regimes', () => {
  const base = { sunAltitudeDeg: 30, sunAzimuthDeg: 270, level: 'lower' as const };

  it('shades the side the sun is on far more than the side across the bowl', () => {
    const sunSide = structuralShadeFraction({ ...base, sectionCompassDeg: 270 });
    const oppSide = structuralShadeFraction({ ...base, sectionCompassDeg: 90 });
    expect(sunSide).toBeGreaterThan(oppSide);
    expect(sunSide - oppSide).toBeGreaterThan(0.5);
  });

  it('varies monotonically from the sun side round to the opposite side', () => {
    let prev = Infinity;
    for (let d = 0; d <= 180; d += 10) {
      const f = structuralShadeFraction({ ...base, sectionCompassDeg: 270 + d });
      expect(f).toBeLessThanOrEqual(prev + 1e-9);
      prev = f;
    }
  });

  it('is fully shaded below the horizon', () => {
    expect(structuralShadeFraction({ ...base, sunAltitudeDeg: -2, sectionCompassDeg: 90 })).toBe(1);
  });
});

describe('directSunPercent', () => {
  const base = { sunAltitudeDeg: 30, sunAzimuthDeg: 270, level: 'lower' as const };

  it('is 0 below the horizon', () => {
    expect(directSunPercent({ ...base, sunAltitudeDeg: -1, sectionCompassDeg: 90 })).toBe(0);
  });

  it('reports the cross-bowl side as sunnier than the sun side', () => {
    expect(directSunPercent({ ...base, sectionCompassDeg: 90 })).toBeGreaterThan(
      directSunPercent({ ...base, sectionCompassDeg: 270 }),
    );
  });

  it('still separates the two sides at high noon', () => {
    // The old model went completely flat above 45° sun, leaving day games with
    // no orientation signal at all — the hours when shade matters most.
    const hi = { ...base, sunAltitudeDeg: 72 };
    const lit = directSunPercent({ ...hi, sectionCompassDeg: 90 });
    const shaded = directSunPercent({ ...hi, sectionCompassDeg: 270 });
    expect(lit - shaded).toBeGreaterThan(10);
  });

  it('stays within [0, 100] across a full parameter sweep', () => {
    for (let alt = -10; alt <= 90; alt += 5) {
      for (let az = 0; az < 360; az += 30) {
        for (let sc = 0; sc < 360; sc += 30) {
          const v = directSunPercent({
            sunAltitudeDeg: alt,
            sunAzimuthDeg: az,
            sectionCompassDeg: sc,
            level: 'lower',
          });
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});
