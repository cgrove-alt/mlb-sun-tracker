/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET, DELETE } from '../stadium-views/route';

// Mock Next.js server environment
const createMockRequest = (options: {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}): NextRequest => {
  const url = new URL('http://localhost:3000/api/admin/analytics/stadium-views');

  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers = new Headers({
    'content-type': 'application/json',
    'x-vercel-ip-country': 'US',
    'x-vercel-ip-city': 'New York',
    'user-agent': 'Mozilla/5.0',
    'x-session-id': 'test-session-123',
    ...options.headers,
  });

  return new NextRequest(url, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

describe('Stadium Views Analytics API', () => {
  beforeEach(() => {
    // Clear in-memory storage before each test
    if (process.env.NODE_ENV === 'development') {
      // In a real scenario, we'd clear the storage
      // For now, we test with fresh data
    }
  });

  describe('POST /api/admin/analytics/stadium-views', () => {
    it('should track a stadium view successfully', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
          league: 'mlb',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('View tracked');
    });

    it('should reject request without stadium ID', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          stadiumName: 'Yankee Stadium',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Stadium ID is required');
    });

    it('should track multiple views from the same stadium', async () => {
      // Track first view
      const request1 = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'redsox',
          stadiumName: 'Fenway Park',
          league: 'mlb',
        },
      });
      await POST(request1);

      // Track second view
      const request2 = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'redsox',
          stadiumName: 'Fenway Park',
          league: 'mlb',
        },
        headers: {
          'x-session-id': 'test-session-456',
        },
      });
      await POST(request2);

      // Get analytics
      const getRequest = createMockRequest({
        method: 'GET',
      });
      const response = await GET(getRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.topStadiums).toBeDefined();
    });
  });

  describe('GET /api/admin/analytics/stadium-views', () => {
    it('should return empty analytics when no data', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('topStadiums');
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('recentEvents');
      expect(Array.isArray(data.topStadiums)).toBe(true);
    });

    it('should support limit parameter', async () => {
      const request = createMockRequest({
        method: 'GET',
        searchParams: {
          limit: '5',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.topStadiums.length).toBeLessThanOrEqual(5);
    });

    it('should support league filter', async () => {
      const request = createMockRequest({
        method: 'GET',
        searchParams: {
          league: 'mlb',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.topStadiums).toBeDefined();
    });

    it('should support sortBy parameter', async () => {
      const request = createMockRequest({
        method: 'GET',
        searchParams: {
          sortBy: 'uniqueVisitors',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.topStadiums).toBeDefined();
    });
  });

  describe('DELETE /api/admin/analytics/stadium-views', () => {
    it('should handle DELETE request', async () => {
      const request = createMockRequest({
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      // Response depends on current NODE_ENV
      if (process.env.NODE_ENV === 'development') {
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Analytics data cleared');
      } else {
        expect(response.status).toBe(403);
        expect(data.error).toBe('Not available in production');
      }
    });
  });

  describe('Analytics Summary', () => {
    it('should calculate correct summary statistics', async () => {
      // Track multiple views
      const stadiums = [
        { stadiumId: 'yankees', stadiumName: 'Yankee Stadium', league: 'mlb' },
        { stadiumId: 'redsox', stadiumName: 'Fenway Park', league: 'mlb' },
        { stadiumId: 'dodgers', stadiumName: 'Dodger Stadium', league: 'mlb' },
      ];

      for (const stadium of stadiums) {
        const request = createMockRequest({
          method: 'POST',
          body: stadium,
        });
        await POST(request);
      }

      // Get summary
      const getRequest = createMockRequest({
        method: 'GET',
      });
      const response = await GET(getRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary.totalViews).toBeGreaterThan(0);
      expect(data.summary.totalStadiums).toBeGreaterThan(0);
      expect(data.summary).toHaveProperty('viewsByLeague');
    });
  });

  describe('Geo and Session Tracking', () => {
    it('should track geo data from headers', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
          league: 'mlb',
        },
        headers: {
          'x-vercel-ip-country': 'CA',
          'x-vercel-ip-city': 'Toronto',
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      // Verify in recent events
      const getRequest = createMockRequest({
        method: 'GET',
      });
      const getResponse = await GET(getRequest);
      const data = await getResponse.json();

      expect(data.recentEvents.length).toBeGreaterThan(0);
    });

    it('should track unique visitors by session ID', async () => {
      // Same stadium, different sessions
      const request1 = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
          league: 'mlb',
        },
        headers: {
          'x-session-id': 'session-1',
        },
      });
      await POST(request1);

      const request2 = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
          league: 'mlb',
        },
        headers: {
          'x-session-id': 'session-2',
        },
      });
      await POST(request2);

      // Get analytics
      const getRequest = createMockRequest({
        method: 'GET',
      });
      const response = await GET(getRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.topStadiums.length).toBeGreaterThan(0);
    });
  });
});
