/**
 * API Route Tests for Report Inaccuracy Endpoint
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '../route';

// Mock environment variables
const originalEnv = process.env;

describe('/api/report-inaccuracy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST endpoint', () => {
    describe('Validation', () => {
      it('should reject request without stadium ID', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadiumName: 'Test Stadium',
            issueType: 'shade-data',
            description: 'Test description is valid',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Stadium ID');
      });

      it('should reject request without stadium name', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            issueType: 'shade-data',
            description: 'Test description is valid',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Stadium name');
      });

      it('should reject request with invalid issue type', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'invalid-type',
            description: 'Test description is valid',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('issue type');
      });

      it('should reject request without description', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Description is required');
      });

      it('should reject description shorter than 10 characters', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            description: 'Too short',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('at least 10 characters');
      });

      it('should reject description longer than 1000 characters', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            description: 'a'.repeat(1001),
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('less than 1000 characters');
      });

      it('should reject section name longer than 50 characters', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            section: 'a'.repeat(51),
            issueType: 'shade-data',
            description: 'Valid description here',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Section name must be less than 50 characters');
      });

      it('should reject invalid email format', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            description: 'Valid description here',
            email: 'invalid-email',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Invalid email format');
      });

      it('should accept valid email format', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            description: 'Valid description here',
            email: 'user@example.com',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      });
    });

    describe('Successful Submission', () => {
      it('should accept valid minimal payload', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            description: 'The shade data seems incorrect for section 205',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toContain('submitted successfully');
      });

      it('should accept valid complete payload', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            section: 'Section 205, Row A',
            issueType: 'obstruction',
            description: 'There is a pole obstructing the view from this section',
            email: 'user@example.com',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      });

      it('should accept all valid issue types', async () => {
        const issueTypes = ['shade-data', 'section-info', 'obstruction', 'pricing', 'other'] as const;

        for (const issueType of issueTypes) {
          const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
            method: 'POST',
            body: JSON.stringify({
              stadium: 'yankee-stadium',
              stadiumName: 'Yankee Stadium',
              issueType,
              description: `Testing issue type: ${issueType}`,
              timestamp: new Date().toISOString(),
            }),
          });

          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
        }
      });
    });

    describe('Rate Limiting', () => {
      it('should allow up to 5 submissions per hour', async () => {
        const headers = new Headers({
          'x-forwarded-for': '192.168.1.1',
        });

        // Submit 5 times (should all succeed)
        for (let i = 0; i < 5; i++) {
          const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              stadium: 'yankee-stadium',
              stadiumName: 'Yankee Stadium',
              issueType: 'shade-data',
              description: `Valid description number ${i + 1}`,
              timestamp: new Date().toISOString(),
            }),
          });

          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
        }
      });

      it('should reject 6th submission within same hour', async () => {
        const headers = new Headers({
          'x-forwarded-for': '192.168.1.2',
        });

        // Submit 6 times
        for (let i = 0; i < 6; i++) {
          const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              stadium: 'yankee-stadium',
              stadiumName: 'Yankee Stadium',
              issueType: 'shade-data',
              description: `Valid description number ${i + 1}`,
              timestamp: new Date().toISOString(),
            }),
          });

          const response = await POST(request);
          const data = await response.json();

          if (i < 5) {
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
          } else {
            expect(response.status).toBe(429);
            expect(data.success).toBe(false);
            expect(data.error).toContain('Too many submissions');
            expect(data.retryAfter).toBeGreaterThan(0);
            expect(response.headers.get('Retry-After')).toBeTruthy();
          }
        }
      });
    });

    describe('Error Handling', () => {
      it('should handle malformed JSON gracefully', async () => {
        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: 'invalid json',
        });

        const response = await POST(request);

        expect(response.status).toBe(500);
      });

      it('should still succeed even if Airtable fails', async () => {
        // Set up Airtable credentials (will fail because we're not mocking fetch)
        process.env.AIRTABLE_API_KEY = 'test-key';
        process.env.AIRTABLE_BASE_ID = 'test-base';

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
          method: 'POST',
          body: JSON.stringify({
            stadium: 'yankee-stadium',
            stadiumName: 'Yankee Stadium',
            issueType: 'shade-data',
            description: 'Valid description here',
            timestamp: new Date().toISOString(),
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        // Should still succeed even if Airtable fails
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
      });
    });
  });

  describe('GET endpoint', () => {
    it('should return API documentation in development mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true,
        writable: true,
      });

      const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Report Inaccuracy API');
      expect(data.endpoint).toBe('POST /api/report-inaccuracy');
      expect(data.requiredFields).toContain('stadium');
      expect(data.requiredFields).toContain('stadiumName');
      expect(data.requiredFields).toContain('issueType');
      expect(data.requiredFields).toContain('description');
      expect(data.optionalFields).toContain('section');
      expect(data.optionalFields).toContain('email');
      expect(data.issueTypes).toHaveLength(5);

      // Restore
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        configurable: true,
        writable: true,
      });
    });

    it('should return 403 in production mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true,
        writable: true,
      });

      const request = new NextRequest('http://localhost:3000/api/report-inaccuracy', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Not available in production');

      // Restore
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        configurable: true,
        writable: true,
      });
    });
  });
});
