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
  // Two real-shaped sections: one east-side open lower bowl with a back-row
  // overhang, and one fully covered upper section.
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
  it('returns real coverage for an east section at low west-sunset', async () => {
    // 2025-07-04 23:30 UTC ≈ 19:30 ET on July 4. Sun is in the west at ~7° at
    // Yankee Stadium. Section 130 is on the east side (baseAngle 90), so the
    // sun shines across the bowl into its front rows.
    const req = createRequest(
      '/api/stadium/yankees/rows/shade?date=2025-07-04&time=19:30',
    );
    const res = await GET(req, createParams('yankees'));
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.sunPosition.isDay).toBe(true);
    // Front row of the east section should NOT be in deep shadow — sun is
    // coming across the bowl directly into the seats. Pre-Phase 1, this code
    // path was unreachable (route imported a non-existent function).
    const section130 = data.sections.find(
      (s: { sectionId: string }) => s.sectionId === '130',
    );
    expect(section130).toBeDefined();
    const row1 = section130.rows.find(
      (r: { rowNumber: string }) => r.rowNumber === '1',
    );
    expect(row1).toBeDefined();
    expect(row1.coverage).toBeLessThan(20); // front row mostly lit

    // The back rows have a 15 ft overhang; at ~7° elevation the shadow runs
    // long, so they should be heavily shaded.
    const row20 = section130.rows.find(
      (r: { rowNumber: string }) => r.rowNumber === '20',
    );
    expect(row20.coverage).toBeGreaterThan(80);
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
});
