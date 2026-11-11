import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumSections } from '../../data/stadium-data-aggregator';
import { getOrientationPrecision } from '../../data/stadiumOrientationProvenance';
import { parkGameShade } from '../parkShade';
import { stadiumLocalToUTC } from '../stadiumTime';

// Every MLB park must give fans an answer: Shaded, Partial or Sun for every
// seat section at every half hour, with a confidence label and a sentence.
describe('every MLB park has a shade answer', () => {
  it.each(MLB_STADIUMS.map((s) => [s.id, s] as const))('%s: July 1:05 PM game', async (_id, stadium) => {
    const sections = await getStadiumSections(stadium.id, 'MLB');
    const result = parkGameShade(
      stadium,
      sections,
      stadiumLocalToUTC('2025-07-15', '13:05', stadium.timezone),
      getOrientationPrecision(stadium.id),
    );
    expect(result.sections.length).toBeGreaterThan(sections.length * 0.6);
    for (const section of result.sections) {
      expect(section.samples).toHaveLength(7);
      for (const sample of section.samples) expect(['shaded', 'partial', 'sun']).toContain(sample.status);
      expect(['high', 'medium', 'low']).toContain(section.confidence);
      expect(section.sentence).toMatch(/^Section .+: .+\.$/);
    }
  });

  it('a fixed-roof park is shaded everywhere, with high confidence', async () => {
    const rays = MLB_STADIUMS.find((s) => s.roof === 'fixed')!;
    const sections = await getStadiumSections(rays.id, 'MLB');
    const result = parkGameShade(rays, sections, stadiumLocalToUTC('2025-07-15', '13:05', rays.timezone), 5);
    expect(result.sections.every((s) => s.samples.every((x) => x.status === 'shaded'))).toBe(true);
    expect(result.sections.every((s) => s.confidence === 'high')).toBe(true);
  });

  it('marks which parks have their own profile', async () => {
    const yankees = MLB_STADIUMS.find((s) => s.id === 'yankees')!;
    // Comerica Park has no profile yet (batch 4 of the 28-park plan).
    const tigers = MLB_STADIUMS.find((s) => s.id === 'tigers')!;
    const at = (s: typeof yankees) => stadiumLocalToUTC('2025-07-15', '13:05', s.timezone);
    expect(parkGameShade(yankees, await getStadiumSections('yankees', 'MLB'), at(yankees), 1).profiled).toBe(true);
    expect(parkGameShade(tigers, await getStadiumSections('tigers', 'MLB'), at(tigers), 12).profiled).toBe(false);
  });
});
