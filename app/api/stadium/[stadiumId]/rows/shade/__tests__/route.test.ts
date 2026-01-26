/**
 * API Route Tests: /api/stadium/[stadiumId]/rows/shade
 *
 * Tests row-level shade calculation API endpoint
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock dependencies
jest.mock('../../../../../../../src/data/stadiums', () => ({
  MLB_STADIUMS: [
    {
      id: 'yankee-stadium',
      name: 'Yankee Stadium',
      latitude: 40.8296,
      longitude: -73.9262,
      orientation: 63,
    },
  ],
}));

jest.mock('../../../../../../../src/data/stadiumSections', () => ({
  getStadiumSections: jest.fn((stadiumId: string) => {
    if (stadiumId === 'yankee-stadium') {
      return [
        {
          id: 'section-100',
          name: 'Section 100',
          level: 'lower',
          baseAngle: 180,
          rows: [
            {
              rowNumber: '1',
              seats: 20,
              elevation: 10,
              depth: 2.8,
              covered: false,
              overhangHeight: 15,
            },
            {
              rowNumber: '2',
              seats: 20,
              elevation: 12,
              depth: 2.8,
              covered: false,
              overhangHeight: 15,
            },
          ],
        },
        {
          id: 'section-200',
          name: 'Section 200',
          level: 'upper',
          baseAngle: 90,
          rows: [
            {
              rowNumber: '1',
              seats: 18,
              elevation: 30,
              depth: 2.5,
              covered: true,
              overhangHeight: 0,
            },
          ],
        },
      ];
    }
    return [];
  }),
}));

jest.mock('../../../../../../../src/utils/sunCalculations', () => ({
  getSunPosition: jest.fn(() => ({
    altitude: 0.785398,
    azimuth: 3.14159,
    altitudeDegrees: 45,
    azimuthDegrees: 180,
  })),
}));

jest.mock('../../../../../../../src/utils/sunCalculator', () => ({
  calculateRowShadows: jest.fn((section) => ({
    sectionId: section.id,
    sectionName: section.name,
    rows: section.rows.map((row: any) => ({
      rowNumber: row.rowNumber,
      seats: row.seats,
      elevation: row.elevation,
      depth: row.depth,
      coverage: row.covered ? 100 : 50,
      sunExposure: row.covered ? 0 : 50,
      inShadow: row.covered,
      shadowSources: { roof: 0, upperDeck: 0, overhang: row.covered ? 0 : 50, bowl: 0 },
      recommendation: row.covered ? 'excellent' : 'good',
    })),
    averageCoverage: section.rows[0].covered ? 100 : 50,
    bestRows: [section.rows[0].rowNumber],
    worstRows: [section.rows[section.rows.length - 1].rowNumber],
  })),
}));

describe('GET /api/stadium/[stadiumId]/rows/shade', () => {
  const createRequest = (url: string) => {
    return new NextRequest(new URL(url, 'http://localhost:3000'));
  };

  const createParams = (stadiumId: string) => ({
    params: Promise.resolve({ stadiumId }),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Valid Requests', () => {
    it('should return all sections with default date/time', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('stadium');
      expect(data.stadium.id).toBe('yankee-stadium');
      expect(data).toHaveProperty('date');
      expect(data).toHaveProperty('time', '13:00');
      expect(data).toHaveProperty('sunPosition');
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('sections');
      expect(data.sections).toHaveLength(2);
    });

    it('should return all sections with custom date and time', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?date=2025-06-15&time=15:30');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.date).toBe('2025-06-15');
      expect(data.time).toBe('15:30');
      expect(data.sections).toHaveLength(2);
    });

    it('should return single section when sectionId provided', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?sectionId=section-100');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('section');
      expect(data.section.sectionId).toBe('section-100');
      expect(data.section.rows).toHaveLength(2);
      expect(data).not.toHaveProperty('sections');
      expect(data).not.toHaveProperty('summary');
    });

    it('should find section by name', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?sectionId=Section%20100');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.section.sectionName).toBe('Section 100');
    });

    it('should include correct cache headers', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, stale-while-revalidate=86400');
    });

    it('should calculate correct summary statistics', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(data.summary).toHaveProperty('totalSections', 2);
      expect(data.summary).toHaveProperty('totalRows', 3);
      expect(data.summary).toHaveProperty('excellentShadeRows');
      expect(data.summary).toHaveProperty('goodShadeRows');
      expect(data.summary).toHaveProperty('averageCoverage');
      expect(typeof data.summary.averageCoverage).toBe('number');
    });
  });

  describe('Validation Errors (400)', () => {
    it('should return 400 for invalid date format', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?date=invalid-date');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid date parameter');
    });

    it('should return 400 for invalid time format', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?time=25:00');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Invalid time parameter|Time out of range/);
    });

    it('should return 400 for time with invalid hour', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?time=24:00');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Time out of range');
    });

    it('should return 400 for time with invalid minute', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?time=12:60');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Time out of range');
    });

    it('should return 400 for malformed time string', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?time=12-30');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid time parameter');
    });
  });

  describe('Not Found Errors (404)', () => {
    it('should return 404 for non-existent stadium', async () => {
      const request = createRequest('/api/stadium/non-existent-stadium/rows/shade');
      const params = createParams('non-existent-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Stadium not found');
      expect(data.stadiumId).toBe('non-existent-stadium');
    });

    it('should return 404 for non-existent section', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?sectionId=non-existent');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Section not found');
      expect(data.sectionId).toBe('non-existent');
    });
  });

  describe('Server Error Handling (500)', () => {
    it('should return 500 when calculateRowShadows throws error', async () => {
      const { calculateRowShadows } = require('../../../../../../../src/utils/sunCalculator');
      calculateRowShadows.mockImplementationOnce(() => {
        throw new Error('Calculation failed');
      });

      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Internal server error');
      expect(data.message).toBe('Calculation failed');
    });

    it('should handle unknown errors gracefully', async () => {
      const { calculateRowShadows } = require('../../../../../../../src/utils/sunCalculator');
      calculateRowShadows.mockImplementationOnce(() => {
        throw 'Unknown error';
      });

      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Internal server error');
      expect(data.message).toBe('Unknown error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle stadium with no sections', async () => {
      const { getStadiumSections } = require('../../../../../../../src/data/stadiumSections');
      getStadiumSections.mockReturnValueOnce([]);

      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('No sections found');
    });

    it('should handle time with single digit hour', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?time=9:30');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.time).toBe('09:30');
    });

    it('should handle midnight time (00:00)', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade?time=0:00');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.time).toBe('00:00');
    });

    it('should include sun position with isDay flag', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(data.sunPosition).toHaveProperty('altitude', 45);
      expect(data.sunPosition).toHaveProperty('azimuth', 180);
      expect(data.sunPosition).toHaveProperty('isDay', true);
    });

    it('should include stadium orientation in response', async () => {
      const request = createRequest('/api/stadium/yankee-stadium/rows/shade');
      const params = createParams('yankee-stadium');

      const response = await GET(request, params);
      const data = await response.json();

      expect(data.stadium.orientation).toBe(63);
    });
  });
});
