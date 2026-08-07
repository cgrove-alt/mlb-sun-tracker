/**
 * Integration tests for /api/stadium/[stadiumId]/rows/shade
 *
 * Differs from route.test.ts: does NOT mock calculateRowShadows or
 * getSunPosition, so the real math runs end-to-end. Only the data layer is
 * stubbed so the test owns its inputs. This is the regression guard for the
 * Phase 1 fix — if the route's imports break again, this test will fail at
 * module load instead of silently passing on mocks.
 *
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from '../route';

jest.mock('../../../../../../../src/data/stadiums', () => ({
  MLB_STADIUMS: [
    {
      id: 'yankees',
      name: 'Yankee Stadium',
      latitude: 40.8296,
      longitude: -73.9262,
      orientation: 55,
      timezone: 'America/New_York',
      roof: 'open',
    },
  ],
}));

jest.mock('../../../../../../../src/data/stadium-data-aggregator', () => ({
  // Three real-shaped sections: an open lower bowl ACROSS the bowl from the
  // evening sun (with a back-row overhang), its mirror image with the sun
  // BEHIND it, and one fully covered upper section.
  //
  // With orientation 55°, sectionCompass = 55 + 90 − (baseAngle + span/2):
  //   '130' baseAngle  90 → compass  45° (NE) — sun at ~292° shines into it.
  //   '129' baseAngle 203 → compass 292° (WNW) — sun sits directly behind it.
  getStadiumSections: jest.fn((stadiumId: string) => {
    if (stadiumId !== 'yankees') return [];
    return [
      {
        id: '130',
        name: 'Section 130',
        level: 'lower',
        baseAngle: 90,
        angleSpan: 20,
        covered: false,
        rows: [
          { rowNumber: '1',  seats: 20, elevation: 10, depth: 2.5,  covered: false, overhangHeight: 0 },
          { rowNumber: '10', seats: 20, elevation: 30, depth: 25,   covered: false, overhangHeight: 15 },
          { rowNumber: '20', seats: 20, elevation: 50, depth: 50,   covered: false, overhangHeight: 15 },
        ],
      },
      {
        id: '129',
        name: 'Section 129',
        level: 'lower',
        baseAngle: 203,
        angleSpan: 20,
        covered: false,
        rows: [
          { rowNumber: '1',  seats: 20, elevation: 10, depth: 2.5, covered: false, overhangHeight: 0 },
          { rowNumber: '10', seats: 20, elevation: 30, depth: 25,  covered: false, overhangHeight: 0 },
          { rowNumber: '20', seats: 20, elevation: 50, depth: 50,  covered: false, overhangHeight: 0 },
        ],
      },
      {
        id: '320',
        name: 'Section 320',
        level: 'upper',
        baseAngle: 270,
        angleSpan: 20,
        covered: true,
        rows: [
          { rowNumber: '1', seats: 18, elevation: 60, depth: 2.5, covered: true, overhangHeight: 0 },
        ],
      },
    ];
  }),
  // 3D path is gated by hasObstructions; keep it false so the 2D real-calc
  // path is exercised. Phase 1's mlb3DCalculator wrapper is unit-tested
  // separately via the smoke runs in /tmp; integration of the 3D route path
  // requires obstruction fixtures and is out of scope for this guard.
  hasSpecificData: jest.fn(() => ({ hasSections: true, hasObstructions: false })),
}));

const createRequest = (url: string) =>
  new NextRequest(new URL(url, 'http://localhost:3000'));
const createParams = (stadiumId: string) => ({
  params: Promise.resolve({ stadiumId }),
});

describe('GET /api/stadium/[stadiumId]/rows/shade — real-calc integration', () => {
  it('returns real coverage for a cross-bowl section at low west-sunset', async () => {
    // 2025-07-04 19:30 ET. Sun is WNW (az ~292°) at ~9° above the horizon at
    // Yankee Stadium. Section 130 sits at compass 45°, so the sun crosses the
    // bowl and shines into those seats.
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=19:30',
    );
    const res = await GET(req, createParams('yankees'));
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.sunPosition.isDay).toBe(true);
    const section130 = data.sections.find(
      (s: { sectionId: string }) => s.sectionId === '130',
    );
    expect(section130).toBeDefined();

    // Front row: open to the sky with the sun in its face, so it is the
    // brightest seat in the park at this moment. It is not 0% shaded, because
    // a 9° sun is below the far grandstand's rim (~12° from mid-bowl) and that
    // structure clips part of the light. See BOWL_DEFAULTS.rimAngleDeg.
    const row1 = section130.rows.find(
      (r: { rowNumber: string }) => r.rowNumber === '1',
    );
    expect(row1).toBeDefined();
    expect(row1.coverage).toBeLessThan(35);

    // Back rows sit under a 15 ft overhang. At 9° the lip throws its shadow
    // ~91 ft back, far beyond this 50 ft deck, so they are fully shaded.
    const row20 = section130.rows.find(
      (r: { rowNumber: string }) => r.rowNumber === '20',
    );
    expect(row20.coverage).toBeGreaterThanOrEqual(95);
    expect(row20.coverage).toBeGreaterThan(row1.coverage + 40);
  });

  it('reports the section with the sun BEHIND it as the shaded one', async () => {
    // The sign check, run through the live route rather than the unit layer.
    // Section 129 sits at compass 292° — the same bearing as the sun — so the
    // grandstand behind those seats blocks it and they are in deep shade.
    // Section 130 sits across the bowl at compass 45° and is lit.
    //
    // Getting this backwards is the defect this whole audit was about: three
    // of the site's four shade models had it inverted, and the site spent that
    // time recommending the sunny side.
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=19:30',
    );
    const data = await (await GET(req, createParams('yankees'))).json();

    const sunBehind = data.sections.find((s: { sectionId: string }) => s.sectionId === '129');
    const sunFacing = data.sections.find((s: { sectionId: string }) => s.sectionId === '130');
    expect(sunBehind).toBeDefined();
    expect(sunFacing).toBeDefined();

    const frontRow = (s: any) => s.rows.find((r: { rowNumber: string }) => r.rowNumber === '1').coverage;
    expect(frontRow(sunBehind)).toBeGreaterThan(frontRow(sunFacing) + 40);
    expect(sunBehind.averageCoverage).toBeGreaterThan(sunFacing.averageCoverage);
  });

  it('reports covered sections as 100% shaded regardless of time', async () => {
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=13:00',
    );
    const res = await GET(req, createParams('yankees'));
    const data = await res.json();

    const section320 = data.sections.find(
      (s: { sectionId: string }) => s.sectionId === '320',
    );
    expect(section320.rows.every((r: { coverage: number }) => r.coverage === 100)).toBe(true);
    expect(section320.rows.every((r: { sunExposure: number }) => r.sunExposure === 0)).toBe(true);
  });

  // PRIMARY REGRESSION for the timezone fix.
  // `time=19:30` MUST be interpreted as 19:30 in the stadium's local timezone
  // (America/New_York → EDT in July), not 19:30 UTC. Pre-fix the route did
  // setHours(19, 30) on Vercel's UTC runtime, which produced 15:30 ET — a
  // midday-sun answer for a query that meant sunset.
  it('interprets ?time as stadium-local, not server UTC', async () => {
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=19:30',
    );
    const res = await GET(req, createParams('yankees'));
    const data = await res.json();
    // 19:30 EDT on July 4 ≈ 23:30 UTC. At Yankee Stadium the sun should
    // be in the west (azimuth roughly 280–300°) and low (elevation under 15°).
    // Pre-fix the API returned ~midday sun (azimuth ~230°, altitude ~60°)
    // because it computed for 19:30 UTC = 15:30 ET.
    expect(data.sunPosition.azimuth).toBeGreaterThan(270);
    expect(data.sunPosition.azimuth).toBeLessThan(310);
    expect(data.sunPosition.altitude).toBeGreaterThan(0);
    expect(data.sunPosition.altitude).toBeLessThan(20);
  });

  it('reports all rows fully shaded at night', async () => {
    // Local midnight ET — sun well below horizon.
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=04:00',
    );
    const res = await GET(req, createParams('yankees'));
    const data = await res.json();

    expect(data.sunPosition.isDay).toBe(false);
    for (const section of data.sections) {
      for (const row of section.rows) {
        expect(row.coverage).toBe(100);
        expect(row.sunExposure).toBe(0);
      }
    }
  });

  it('returns the expected response shape (regression guard for missing imports)', async () => {
    const req = createRequest('/api/stadium/yankees/rows/shade');
    const res = await GET(req, createParams('yankees'));
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data).toHaveProperty('stadium.id', 'yankees');
    expect(data).toHaveProperty('sunPosition.altitude');
    expect(data).toHaveProperty('sunPosition.azimuth');
    expect(data).toHaveProperty('summary.totalSections');
    expect(Array.isArray(data.sections)).toBe(true);
    for (const section of data.sections) {
      expect(section).toHaveProperty('sectionId');
      expect(section).toHaveProperty('rows');
      expect(Array.isArray(section.rows)).toBe(true);
      for (const row of section.rows) {
        expect(row).toHaveProperty('rowNumber');
        expect(row).toHaveProperty('coverage');
        expect(row).toHaveProperty('sunExposure');
        expect(row).toHaveProperty('inShadow');
        expect(row).toHaveProperty('recommendation');
        expect(row.coverage + row.sunExposure).toBe(100);
      }
    }
  });

  // --- Whole-game-window mode (Phase 9 A5) -------------------------------

  it('returns single-instant shape unchanged when ?window is absent', async () => {
    const req = createRequest('/api/stadium/yankees/rows/shade?date=2025-07-04&time=19:00');
    const res = await GET(req, createParams('yankees'));
    const data = await res.json();
    expect(data.calculation.method).toBe('2D');
    expect(data).not.toHaveProperty('window');
    expect(data).toHaveProperty('sunPosition.azimuth');
  });

  it('aggregates shade across the game when ?window is set', async () => {
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=18:00&window=180&step=30',
    );
    const res = await GET(req, createParams('yankees'));
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.calculation.method).toBe('2D-window');
    expect(data.window).toMatchObject({ windowMinutes: 180, stepMinutes: 30, samples: 7 });

    const section130 = data.sections.find(
      (s: { sectionId: string }) => s.sectionId === '130',
    );
    expect(section130).toBeDefined();
    // One timeline point per sample, ordered from first pitch.
    expect(section130.timeline).toHaveLength(7);
    expect(section130.timeline[0].minutesFromStart).toBe(0);
    expect(section130.timeline[6].minutesFromStart).toBe(180);
    expect(['shaded-all', 'sunny-all', 'sun-to-shade', 'shade-to-sun', 'mixed'])
      .toContain(section130.progression);

    // As the sun sets over a 6→9pm window, the east bowl's back rows get
    // progressively more shaded — coverage at the final out ≥ first pitch.
    const row20 = section130.rows.find((r: { rowNumber: string }) => r.rowNumber === '20');
    expect(row20.coverageEnd).toBeGreaterThanOrEqual(row20.coverageStart);
    expect(row20.coverageMin).toBeLessThanOrEqual(row20.coverageAvg);
    expect(row20.coverageAvg).toBeLessThanOrEqual(row20.coverageMax);

    // Window summary buckets every section by progression.
    const { shadedAllSections, sunToShadeSections, shadeToSunSections, sunnyAllSections } =
      data.summary;
    expect(
      shadedAllSections + sunToShadeSections + shadeToSunSections + sunnyAllSections,
    ).toBeLessThanOrEqual(data.summary.totalSections);
  });

  it('caps the window at 300 minutes and the step at 15–60', async () => {
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=13:00&window=999&step=1',
    );
    const res = await GET(req, createParams('yankees'));
    const data = await res.json();
    expect(data.window.windowMinutes).toBe(300);
    expect(data.window.stepMinutes).toBe(15);
  });
});
