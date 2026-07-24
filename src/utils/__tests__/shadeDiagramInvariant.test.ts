import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumSectionsAsync } from '../../data/getStadiumSections';
import { getSunPosition } from '../sunPosition';
import { getSectionSunExposure } from '../sectionSunCalculations';
import { shadeTierOf, reconciledExposure } from '../sectionShadeTier';
import { stadiumLocalToUTC } from '../stadiumTime';

// The MLB shade diagram must NEVER show a section as sunnier than its structural
// tier permits (covered → always shaded; partial → at most "light sun"; fixed
// dome → all shaded). reconciledExposure() enforces this; this test proves it
// holds for every section of all 30 MLB venues across a spread of game times.
const SAMPLE_TIMES: Array<[string, string]> = [
  ['2026-04-05', '13:00'], // spring afternoon
  ['2026-07-15', '13:00'], // summer high noon
  ['2026-07-15', '18:30'], // summer evening (default)
  ['2026-09-20', '17:00'], // fall late-afternoon
];
const LIGHT_MAX = 35; // "light sun" upper bound in the diagram's buckets

describe('MLB shade diagram / table reconciliation invariant', () => {
  test('diagram never shows more sun than the section table tier permits (all 30 MLB venues)', async () => {
    for (const stadium of MLB_STADIUMS) {
      const domed = stadium.roof === 'fixed';
      const sections = await getStadiumSectionsAsync(stadium.id);
      expect(sections.length).toBeGreaterThan(0);

      for (const [date, time] of SAMPLE_TIMES) {
        const sun = getSunPosition(stadiumLocalToUTC(date, time, stadium.timezone), stadium.latitude, stadium.longitude);
        for (const s of sections as any[]) {
          if (typeof s.baseAngle !== 'number' || typeof s.angleSpan !== 'number') continue;
          const belowHorizon = sun.altitudeDegrees <= 0;
          const raw = domed || belowHorizon
            ? 0
            : getSectionSunExposure(s, sun.altitudeDegrees, sun.azimuthDegrees, stadium.orientation);
          const shown = reconciledExposure(raw, s, domed || belowHorizon);
          const tier = shadeTierOf(s);

          // Never adds sun beyond the raw model.
          expect(shown).toBeLessThanOrEqual(raw);
          // Fixed dome or covered tier → always shaded (0).
          if (domed || tier === 'covered') expect(shown).toBe(0);
          // Partial tier → at most light sun.
          if (!domed && tier === 'partial') expect(shown).toBeLessThanOrEqual(LIGHT_MAX);
        }
      }
    }
  }, 30000);
});
