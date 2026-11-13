import { rowLight, shadedFraction, statusFor, type ParkEnvelope, type StandProfile } from '../shadeEngine';

// Physics checks with a simple, made-up stand. The stand's back faces 180°
// (south), so a sun at 180° is directly behind it and a sun at 0° is in the
// fans' faces.
const LOWER: StandProfile = { rows: 20, frontRowHeightFt: 5, rakeDeg: 25, backHeightFt: 60 };
const COVERED: StandProfile = {
  rows: 20,
  frontRowHeightFt: 5,
  rakeDeg: 25,
  backHeightFt: 60,
  overhang: { coveredFromRow: 13, soffitHeightFt: 40 },
};
const OPEN_AIR: ParkEnvelope = { roof: 'open', farRimHeightFt: 100, fieldCrossingFt: 500 };

describe('shade engine: whole-park conditions', () => {
  it('a fixed roof shades every row', () => {
    const light = rowLight(LOWER, 180, { ...OPEN_AIR, roof: 'fixed' }, { azimuthDeg: 0, altitudeDeg: 60 });
    expect(shadedFraction(light)).toBe(1);
  });

  it('no direct sun once the sun has set', () => {
    expect(shadedFraction(rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 300, altitudeDeg: -2 }))).toBe(1);
  });

  it('a low sun in front is blocked by the far side of the stadium', () => {
    // Rim 100 ft high, 500 ft away: about 10° from field level.
    expect(shadedFraction(rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 0, altitudeDeg: 5 }))).toBe(1);
  });
});

describe('shade engine: sun behind the stand', () => {
  it('a mid-afternoon sun behind a tall stand shades all of it', () => {
    expect(shadedFraction(rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 180, altitudeDeg: 30 }))).toBe(1);
  });

  it('a near-overhead sun behind the stand shades only the back rows', () => {
    const light = rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 180, altitudeDeg: 75 });
    expect(light[0]).toBe('sun');
    expect(light[light.length - 1]).toBe('shade');
  });

  it('rows under a deck are shaded whenever the sun is behind', () => {
    const light = rowLight(COVERED, 180, OPEN_AIR, { azimuthDeg: 180, altitudeDeg: 80 });
    expect(light.slice(12).every((l) => l === 'shade')).toBe(true);
  });

  it('shade grows as the sun drops', () => {
    const at = (altitudeDeg: number) => shadedFraction(rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 180, altitudeDeg }));
    expect(at(70)).toBeLessThanOrEqual(at(55));
    expect(at(55)).toBeLessThanOrEqual(at(40));
  });

  it('a sun running along the rows does not count as behind them', () => {
    // 89° off the back direction at 30° elevation: the cross-section angle is
    // nearly vertical, so the stand behind cannot block it.
    const light = rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 271, altitudeDeg: 30 });
    expect(light[0]).toBe('sun');
  });
});

describe('shade engine: sun in the fans\' faces', () => {
  it('an open stand facing a high sun is all in sun', () => {
    expect(shadedFraction(rowLight(LOWER, 180, OPEN_AIR, { azimuthDeg: 0, altitudeDeg: 60 }))).toBe(0);
  });

  it('a high sun in front hits the underside of the deck: the back covered rows stay shaded', () => {
    // Rows 13–15 sit just behind the deck's front edge with the underside
    // well above them, so a 60° sun still reaches them. From row 16 back the
    // ray hits the underside first (worked: shade from row index ≥ 14.7).
    const light = rowLight(COVERED, 180, OPEN_AIR, { azimuthDeg: 0, altitudeDeg: 60 });
    expect(light.slice(0, 15).every((l) => l === 'sun')).toBe(true);
    expect(light.slice(15).every((l) => l === 'shade')).toBe(true);
  });

  it('a near-overhead sun in front shades every covered row behind the drip line', () => {
    // Row 13 sits right under the deck's front edge with the underside 16 ft
    // above the fans' heads, so a sun 5° off vertical still slips past the
    // edge onto it. Every row behind it is shaded.
    const light = rowLight(COVERED, 180, OPEN_AIR, { azimuthDeg: 0, altitudeDeg: 85 });
    expect(light.slice(13).every((l) => l === 'shade')).toBe(true);
  });

  it('a lower sun in front shines in under the deck onto the first covered rows', () => {
    const light = rowLight(COVERED, 180, OPEN_AIR, { azimuthDeg: 0, altitudeDeg: 15 });
    expect(light[12]).toBe('sun');
  });

  it('a deck reaching out past the seats keeps that sun off them', () => {
    // One row under a 9-ft ceiling, as at a suite.
    const suite: StandProfile = { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 59 } };
    const sun = { azimuthDeg: 0, altitudeDeg: 30 };
    expect(rowLight(suite, 180, OPEN_AIR, sun)).toEqual(['sun']);
    expect(rowLight({ ...suite, overhang: { ...suite.overhang!, reachFt: 17 } }, 180, OPEN_AIR, sun)).toEqual(['shade']);
  });

  it("a sun behind that passes a deck's edge between its underside and its front hits the front", () => {
    // Row 5 is two rows in front of the edge: from its head the underside
    // (30 ft) rises at about 63°, the deck's front (40 ft) at about 73°.
    const stand: StandProfile = { rows: 10, frontRowHeightFt: 10, rakeDeg: 15, backHeightFt: 10, overhang: { coveredFromRow: 8, soffitHeightFt: 30 } };
    const sun = { azimuthDeg: 180, altitudeDeg: 68 };
    expect(rowLight(stand, 180, OPEN_AIR, sun)[4]).toBe('sun');
    expect(rowLight({ ...stand, deckFrontFt: 40 }, 180, OPEN_AIR, sun)[4]).toBe('shade');
    // A higher sun clears the front too.
    expect(rowLight({ ...stand, deckFrontFt: 40 }, 180, OPEN_AIR, { ...sun, altitudeDeg: 78 })[4]).toBe('sun');
  });
});

describe('shade engine: status bands', () => {
  it.each([
    [1, 'shaded'],
    [0.75, 'shaded'],
    [0.5, 'partial'],
    [0.25, 'sun'],
    [0, 'sun'],
  ] as const)('%d of rows shaded is %s', (fraction, status) => {
    expect(statusFor(fraction)).toBe(status);
  });
});
