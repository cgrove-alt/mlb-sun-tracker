/**
 * Parameter-validation tests for /api/stadium/[stadiumId]/rows/shade
 *
 * The endpoint used to accept anything: `?month=99&hour=abc` returned a healthy
 * 200 computed from the DEFAULT date and time, so a caller with a typo'd or
 * invented parameter silently received data for the wrong moment. Likewise
 * `?date=2999-01-01` and `?window=abc` were answered rather than rejected.
 *
 * Note the deliberate asymmetry these tests pin down: out-of-RANGE window/step
 * values are clamped (an established, separately-tested contract), while
 * NON-NUMERIC ones are rejected.
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
    },
  ],
}));

jest.mock('../../../../../../../src/data/stadium-data-aggregator', () => ({
  getStadiumSections: jest.fn(() => [
    {
      id: 'section-100',
      name: 'Section 100',
      level: 'lower',
      baseAngle: 180,
      rows: [
        { rowNumber: '1', seats: 20, elevation: 10, depth: 2.8, covered: false },
        { rowNumber: '2', seats: 20, elevation: 12, depth: 5.6, covered: false },
      ],
    },
  ]),
  hasSpecificData: jest.fn(() => ({ hasSections: true, hasObstructions: false })),
}));

const createRequest = (url: string) =>
  new NextRequest(new URL(url, 'http://localhost:3000'));
const createParams = (stadiumId: string) => ({
  params: Promise.resolve({ stadiumId }),
});

const BASE = '/api/stadium/yankees/rows/shade';

async function call(query: string) {
  const res = await GET(createRequest(`${BASE}${query}`), createParams('yankees'));
  return { status: res.status, body: await res.json() };
}

describe('shade API — unknown parameters', () => {
  it('rejects a made-up parameter instead of silently using defaults', async () => {
    const { status, body } = await call('?month=99&hour=abc');
    expect(status).toBe(400);
    expect(body.code).toBe('UNKNOWN_PARAMETER');
    expect(body.unknownParams).toEqual(expect.arrayContaining(['month', 'hour']));
  });

  it('names the allowed parameters so the caller can self-correct', async () => {
    const { body } = await call('?bogus=1');
    expect(body.allowedParams).toEqual(
      expect.arrayContaining(['date', 'time', 'sectionId', 'use3d', 'cache', 'window', 'step'])
    );
  });

  it('rejects a misspelled real parameter', async () => {
    const { status, body } = await call('?dat=2025-07-04');
    expect(status).toBe(400);
    expect(body.unknownParams).toEqual(['dat']);
  });

  it.each(['date', 'time', 'sectionId', 'use3d', 'cache', 'window', 'step'])(
    'accepts the documented parameter %s',
    async param => {
      const value = param === 'date' ? '2025-07-04'
        : param === 'time' ? '13:00'
        : param === 'sectionId' ? 'section-100'
        : param === 'use3d' || param === 'cache' ? 'false'
        : param === 'window' ? '180'
        : '30';
      const { status } = await call(`?${param}=${value}`);
      expect(status).not.toBe(400);
    }
  );
});

describe('shade API — date range', () => {
  it.each(['1900-01-01', '1989-12-31', '2999-01-01', '2051-01-01'])(
    'rejects out-of-range date %s',
    async date => {
      const { status, body } = await call(`?date=${date}&time=13:00`);
      expect(status).toBe(400);
      expect(body.code).toBe('DATE_OUT_OF_RANGE');
    }
  );

  it.each(['1990-01-01', '2025-07-04', '2050-12-31'])(
    'accepts in-range date %s',
    async date => {
      const { status } = await call(`?date=${date}&time=13:00`);
      expect(status).toBe(200);
    }
  );

  it('still rejects an unparseable date with INVALID_DATE', async () => {
    const { status, body } = await call('?date=garbage');
    expect(status).toBe(400);
    expect(body.code).toBe('INVALID_DATE');
  });
});

describe('shade API — hour/time range', () => {
  it.each(['25:00', '24:00', '12:60'])('rejects out-of-range time %s', async time => {
    const { status, body } = await call(`?time=${time}`);
    expect(status).toBe(400);
    expect(body.code).toBe('TIME_OUT_OF_RANGE');
  });

  it.each(['abc', '12-30', '1230'])('rejects malformed time %s', async time => {
    const { status, body } = await call(`?time=${time}`);
    expect(status).toBe(400);
    expect(body.code).toBe('INVALID_TIME');
  });

  it.each(['00:00', '9:30', '13:00', '23:59'])('accepts valid time %s', async time => {
    const { status } = await call(`?time=${time}`);
    expect(status).toBe(200);
  });
});

describe('shade API — window/step', () => {
  it('rejects a non-numeric window rather than falling back to the default', async () => {
    const { status, body } = await call('?time=13:00&window=abc');
    expect(status).toBe(400);
    expect(body.code).toBe('INVALID_WINDOW');
  });

  it('rejects a non-numeric step', async () => {
    const { status, body } = await call('?time=13:00&window=180&step=abc');
    expect(status).toBe(400);
    expect(body.code).toBe('INVALID_STEP');
  });

  // Clamping (not rejection) is the established contract for out-of-range values.
  it('still clamps an over-large window and an under-small step', async () => {
    const { status, body } = await call('?time=13:00&window=999&step=1');
    expect(status).toBe(200);
    expect(body.window.windowMinutes).toBe(300);
    expect(body.window.stepMinutes).toBe(15);
  });

  it('still clamps a negative window to zero', async () => {
    const { status, body } = await call('?time=13:00&window=-500');
    expect(status).toBe(200);
    expect(body.window.windowMinutes).toBe(0);
  });
});

describe('shade API — returns real data for valid requests', () => {
  it('is not empty: returns sections and rows', async () => {
    const { status, body } = await call('?date=2025-07-04&time=13:00');
    expect(status).toBe(200);
    expect(body.summary.totalSections).toBeGreaterThan(0);
    expect(body.summary.totalRows).toBeGreaterThan(0);
    expect(Array.isArray(body.sections)).toBe(true);
    expect(body.sections[0].rows.length).toBeGreaterThan(0);
  });
});
