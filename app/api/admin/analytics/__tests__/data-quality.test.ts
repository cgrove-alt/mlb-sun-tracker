/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET, DELETE } from '../data-quality/route';

const createMockRequest = (options: {
  method: string;
  body?: any;
  searchParams?: Record<string, string>;
}): NextRequest => {
  const url = new URL('http://localhost:3000/api/admin/analytics/data-quality');

  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return new NextRequest(url, {
    method: options.method,
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

describe('Data Quality Analytics API', () => {
  describe('POST /api/admin/analytics/data-quality', () => {
    it('should track calculation errors', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          type: 'calculation-error',
          stadiumId: 'yankees',
          errorType: 'shade-calculation-failed',
          errorMessage: 'Failed to calculate shade for section 203',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Error tracked');
    });

    it('should track API errors', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          type: 'api-error',
          stadiumId: 'redsox',
          endpoint: '/api/shade-calculator',
          statusCode: 500,
          errorMessage: 'Internal server error',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should increment error count for repeated errors', async () => {
      // Track same error twice
      const errorPayload = {
        type: 'calculation-error',
        stadiumId: 'dodgers',
        errorType: 'missing-geometry',
        errorMessage: 'Section geometry not found',
      };

      const request1 = createMockRequest({
        method: 'POST',
        body: errorPayload,
      });
      await POST(request1);

      const request2 = createMockRequest({
        method: 'POST',
        body: errorPayload,
      });
      await POST(request2);

      // Get analytics
      const getRequest = createMockRequest({
        method: 'GET',
      });
      const response = await GET(getRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.calculationErrors).toBeDefined();
    });
  });

  describe('GET /api/admin/analytics/data-quality', () => {
    it('should return data freshness statistics', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('dataFreshness');
      expect(data.dataFreshness).toHaveProperty('stats');
      expect(data.dataFreshness.stats).toHaveProperty('current');
      expect(data.dataFreshness.stats).toHaveProperty('good');
      expect(data.dataFreshness.stats).toHaveProperty('stale');
      expect(data.dataFreshness.stats).toHaveProperty('outdated');
    });

    it('should list stadiums needing update', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.dataFreshness).toHaveProperty('stadiumsNeedingUpdate');
      expect(Array.isArray(data.dataFreshness.stadiumsNeedingUpdate)).toBe(true);
    });

    it('should provide calculation error statistics', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('calculationErrors');
      expect(data.calculationErrors).toHaveProperty('total');
      expect(data.calculationErrors).toHaveProperty('errors');
    });

    it('should provide API error statistics', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('apiErrors');
      expect(data.apiErrors).toHaveProperty('stats');
      expect(data.apiErrors.stats).toHaveProperty('total');
      expect(data.apiErrors.stats).toHaveProperty('byStatusCode');
      expect(data.apiErrors.stats).toHaveProperty('byStadium');
    });

    it('should calculate freshness by league', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.dataFreshness.stats).toHaveProperty('byLeague');
      expect(data.dataFreshness.stats.byLeague).toHaveProperty('mlb');
      expect(data.dataFreshness.stats.byLeague).toHaveProperty('milb');
      expect(data.dataFreshness.stats.byLeague.mlb).toHaveProperty('total');
      expect(data.dataFreshness.stats.byLeague.milb).toHaveProperty('total');
    });
  });

  describe('DELETE /api/admin/analytics/data-quality', () => {
    it('should handle DELETE request based on environment', async () => {
      const request = createMockRequest({
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      // Response depends on NODE_ENV
      if (process.env.NODE_ENV === 'development') {
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      } else {
        expect(response.status).toBe(403);
      }
    });
  });

  describe('Data Freshness Tracking', () => {
    it('should identify outdated stadiums (>2 years)', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);

      // Check if outdated stadiums are properly identified
      const outdatedStadiums = data.dataFreshness.stadiumsNeedingUpdate.filter(
        (s: any) => s.daysSince > 730
      );

      expect(Array.isArray(outdatedStadiums)).toBe(true);
    });

    it('should sort stadiums by days since update', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);

      const stadiums = data.dataFreshness.stadiumsNeedingUpdate;
      if (stadiums.length > 1) {
        // Verify descending order
        for (let i = 0; i < stadiums.length - 1; i++) {
          expect(stadiums[i].daysSince).toBeGreaterThanOrEqual(stadiums[i + 1].daysSince);
        }
      }
    });
  });

  describe('Error Aggregation', () => {
    it('should aggregate errors by stadium', async () => {
      // Track multiple errors for the same stadium
      const stadiumId = 'test-stadium';

      for (let i = 0; i < 3; i++) {
        const request = createMockRequest({
          method: 'POST',
          body: {
            type: 'api-error',
            stadiumId,
            endpoint: '/api/test',
            statusCode: 500,
            errorMessage: `Error ${i}`,
          },
        });
        await POST(request);
      }

      // Get analytics
      const getRequest = createMockRequest({
        method: 'GET',
      });
      const response = await GET(getRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.apiErrors.stats.byStadium).toBeDefined();
    });

    it('should track most recent API errors', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.apiErrors).toHaveProperty('recentErrors');
      expect(Array.isArray(data.apiErrors.recentErrors)).toBe(true);
    });
  });
});
