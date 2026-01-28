/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET, PATCH, DELETE } from '../user-feedback/route';

const createMockRequest = (options: {
  method: string;
  body?: any;
  searchParams?: Record<string, string>;
}): NextRequest => {
  const url = new URL('http://localhost:3000/api/admin/analytics/user-feedback');

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

describe('User Feedback Analytics API', () => {
  describe('POST /api/admin/analytics/user-feedback', () => {
    it('should track user feedback successfully', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
          section: '203',
          issueType: 'shade-data',
          description: 'Shade calculation seems incorrect for evening games',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Feedback tracked');
    });

    it('should reject feedback without stadium ID', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          stadiumName: 'Yankee Stadium',
          issueType: 'shade-data',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Stadium ID and issue type are required');
    });

    it('should reject feedback without issue type', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Stadium ID and issue type are required');
    });

    it('should aggregate feedback by stadium', async () => {
      // Submit multiple feedback for same stadium
      const stadiumId = 'redsox';

      for (let i = 0; i < 3; i++) {
        const request = createMockRequest({
          method: 'POST',
          body: {
            stadiumId,
            stadiumName: 'Fenway Park',
            issueType: 'shade-data',
            description: `Test feedback ${i}`,
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
      expect(data.stadiumsWithIssues).toBeDefined();
    });
  });

  describe('GET /api/admin/analytics/user-feedback', () => {
    it('should return empty analytics when no data', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('stadiumsWithIssues');
      expect(data).toHaveProperty('recentFeedback');
      expect(data).toHaveProperty('summary');
      expect(Array.isArray(data.stadiumsWithIssues)).toBe(true);
      expect(Array.isArray(data.recentFeedback)).toBe(true);
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
      expect(data.stadiumsWithIssues.length).toBeLessThanOrEqual(5);
    });

    it('should support issue type filter', async () => {
      const request = createMockRequest({
        method: 'GET',
        searchParams: {
          issueType: 'shade-data',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.recentFeedback)).toBe(true);
    });

    it('should support status filter', async () => {
      const request = createMockRequest({
        method: 'GET',
        searchParams: {
          status: 'new',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.recentFeedback)).toBe(true);
    });

    it('should calculate issue type distribution', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toHaveProperty('issueTypeDistribution');
      expect(typeof data.summary.issueTypeDistribution).toBe('object');
    });

    it('should calculate status distribution', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toHaveProperty('statusDistribution');
      expect(data.summary.statusDistribution).toHaveProperty('new');
      expect(data.summary.statusDistribution).toHaveProperty('reviewed');
      expect(data.summary.statusDistribution).toHaveProperty('resolved');
    });

    it('should calculate feedback trends', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toHaveProperty('feedbackTrend');
      expect(data.summary.feedbackTrend).toHaveProperty('last7Days');
      expect(data.summary.feedbackTrend).toHaveProperty('previous7Days');
      expect(data.summary.feedbackTrend).toHaveProperty('percentageChange');
    });
  });

  describe('PATCH /api/admin/analytics/user-feedback', () => {
    it('should update feedback status', async () => {
      // First, add some feedback
      const postRequest = createMockRequest({
        method: 'POST',
        body: {
          stadiumId: 'yankees',
          stadiumName: 'Yankee Stadium',
          issueType: 'shade-data',
          description: 'Test feedback',
        },
      });
      await POST(postRequest);

      // Update status
      const patchRequest = createMockRequest({
        method: 'PATCH',
        body: {
          feedbackIndex: 0,
          status: 'reviewed',
        },
      });

      const response = await PATCH(patchRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should reject invalid status', async () => {
      const request = createMockRequest({
        method: 'PATCH',
        body: {
          feedbackIndex: 0,
          status: 'invalid-status',
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid status');
    });

    it('should reject missing parameters', async () => {
      const request = createMockRequest({
        method: 'PATCH',
        body: {
          feedbackIndex: 0,
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Feedback index and status are required');
    });

    it('should return 404 for non-existent feedback', async () => {
      const request = createMockRequest({
        method: 'PATCH',
        body: {
          feedbackIndex: 99999,
          status: 'reviewed',
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Feedback not found');
    });
  });

  describe('DELETE /api/admin/analytics/user-feedback', () => {
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

  describe('Feedback Aggregation', () => {
    it('should track feedback by issue type', async () => {
      const issueTypes = ['shade-data', 'section-info', 'obstruction'];

      for (const issueType of issueTypes) {
        const request = createMockRequest({
          method: 'POST',
          body: {
            stadiumId: 'dodgers',
            stadiumName: 'Dodger Stadium',
            issueType,
            description: `Test ${issueType}`,
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
      expect(data.summary.issueTypeDistribution).toBeDefined();
    });

    it('should sort stadiums by report count', async () => {
      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);

      const stadiums = data.stadiumsWithIssues;
      if (stadiums.length > 1) {
        // Verify descending order by total reports
        for (let i = 0; i < stadiums.length - 1; i++) {
          expect(stadiums[i].totalReports).toBeGreaterThanOrEqual(stadiums[i + 1].totalReports);
        }
      }
    });
  });
});
