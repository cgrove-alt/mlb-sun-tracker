import * as fs from 'fs';
import { checkFileFreshness, type DataFreshnessReport } from '../check-data-freshness';

// Mock fs module
jest.mock('fs');

describe('check-data-freshness script', () => {
  const mockFilePath = '/test/path/yankees.ts';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkFileFreshness', () => {
    it('should identify current data (less than 1 year old)', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 6);
      const dateString = recentDate.toISOString().split('T')[0];

      const fileContent = `
        export const section = {
          id: '100',
          name: 'Test Section',
          lastUpdated: '${dateString}'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.status).toBe('current');
      expect(result.lastUpdated).toBe(dateString);
      expect(result.daysSinceUpdate).toBeLessThan(365);
    });

    it('should identify stale data (1-2 years old)', () => {
      const staleDate = new Date();
      staleDate.setFullYear(staleDate.getFullYear() - 1, staleDate.getMonth() - 3);
      const dateString = staleDate.toISOString().split('T')[0];

      const fileContent = `
        export const section = {
          id: '100',
          name: 'Test Section',
          lastUpdated: '${dateString}'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.status).toBe('warning');
      expect(result.lastUpdated).toBe(dateString);
      expect(result.daysSinceUpdate).toBeGreaterThan(365);
      expect(result.daysSinceUpdate).toBeLessThan(730);
    });

    it('should identify outdated data (over 2 years old)', () => {
      const outdatedDate = new Date();
      outdatedDate.setFullYear(outdatedDate.getFullYear() - 3);
      const dateString = outdatedDate.toISOString().split('T')[0];

      const fileContent = `
        export const section = {
          id: '100',
          name: 'Test Section',
          lastUpdated: '${dateString}'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.status).toBe('error');
      expect(result.lastUpdated).toBe(dateString);
      expect(result.daysSinceUpdate).toBeGreaterThan(730);
    });

    it('should identify missing timestamps', () => {
      const fileContent = `
        export const section = {
          id: '100',
          name: 'Test Section'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.status).toBe('missing');
      expect(result.lastUpdated).toBeNull();
      expect(result.daysSinceUpdate).toBeNull();
      expect(result.message).toContain('No lastUpdated timestamp found');
    });

    it('should respect custom warning threshold', () => {
      const date = new Date();
      date.setDate(date.getDate() - 200); // 200 days ago
      const dateString = date.toISOString().split('T')[0];

      const fileContent = `
        export const section = {
          id: '100',
          lastUpdated: '${dateString}'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 180, // Warn after 180 days
        errorDays: 365,
        format: 'text',
      });

      expect(result.status).toBe('warning');
    });

    it('should respect custom error threshold', () => {
      const date = new Date();
      date.setDate(date.getDate() - 400); // 400 days ago
      const dateString = date.toISOString().split('T')[0];

      const fileContent = `
        export const section = {
          id: '100',
          lastUpdated: '${dateString}'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 180,
        errorDays: 365, // Error after 365 days
        format: 'text',
      });

      expect(result.status).toBe('error');
    });

    it('should extract stadiumId from file path', () => {
      const fileContent = `
        export const section = {
          id: '100',
          lastUpdated: '2024-01-01'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.stadiumId).toBe('yankees');
    });

    it('should handle file read errors', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.status).toBe('missing');
      expect(result.lastUpdated).toBeNull();
    });

    it('should handle different timestamp formats', () => {
      const testCases = [
        "lastUpdated: '2024-01-15'",
        'lastUpdated: "2024-01-15"',
        "lastUpdated:'2024-01-15'",
        'lastUpdated:"2024-01-15"',
      ];

      testCases.forEach(timestampLine => {
        const fileContent = `
          export const section = {
            id: '100',
            ${timestampLine}
          };
        `;

        (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

        const result = checkFileFreshness(mockFilePath, {
          warnDays: 365,
          errorDays: 730,
          format: 'text',
        });

        expect(result.lastUpdated).toBe('2024-01-15');
      });
    });
  });

  describe('Report structure', () => {
    it('should return complete report structure', () => {
      const fileContent = `
        export const section = {
          id: '100',
          lastUpdated: '2024-01-01'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result).toHaveProperty('stadiumId');
      expect(result).toHaveProperty('filePath');
      expect(result).toHaveProperty('lastUpdated');
      expect(result).toHaveProperty('daysSinceUpdate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
    });

    it('should include file path in report', () => {
      const fileContent = `
        export const section = {
          id: '100',
          lastUpdated: '2024-01-01'
        };
      `;

      (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      const result = checkFileFreshness(mockFilePath, {
        warnDays: 365,
        errorDays: 730,
        format: 'text',
      });

      expect(result.filePath).toBe(mockFilePath);
    });
  });
});
