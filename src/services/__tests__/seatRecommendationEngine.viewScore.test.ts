/**
 * Regression test for the third-base view-preference band.
 *
 * The wide band was written `angle >= 240 && angle <= 30`, which no number can
 * satisfy. The branch was unreachable, so sections just outside the 270°–360°
 * core band scored the 30 fallback instead of the intended 70. The band wraps
 * through 0°/360°, so it needs `||`.
 */
import { SeatRecommendationEngine } from '../seatRecommendationEngine';

// scoreView is private; reach it directly so the branch is tested in isolation.
function scoreView(baseAngle: number, preference: string, level = 'lower'): number {
  const engine = new SeatRecommendationEngine();
  return (engine as any).scoreView({ baseAngle, level }, preference);
}

describe('scoreView — third-base preference', () => {
  // Core band 270-360 scores 100, unaffected by the fix.
  it.each([270, 300, 359, 360])('scores %i° as the core band (100)', angle => {
    expect(scoreView(angle, 'third-base')).toBe(100);
  });

  // These are the angles the dead branch was supposed to cover. Before the fix
  // every one of them returned 30.
  it.each([240, 250, 265, 269])('scores %i° in the wraparound band (70)', angle => {
    expect(scoreView(angle, 'third-base')).toBe(70);
  });

  it.each([0, 10, 25, 30])('scores %i° in the wraparound band past 0° (70)', angle => {
    expect(scoreView(angle, 'third-base')).toBe(70);
  });

  // Genuinely outside both bands: first-base / outfield side.
  it.each([31, 90, 150, 200, 239])('scores %i° as outside the band (30)', angle => {
    expect(scoreView(angle, 'third-base')).toBe(30);
  });

  it('never leaves the wide band unreachable', () => {
    const inWideBand = [240, 250, 260, 269, 0, 15, 30];
    const scores = inWideBand.map(a => scoreView(a, 'third-base'));
    expect(scores.every(s => s === 70)).toBe(true);
  });
});
