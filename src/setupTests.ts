// Jest setup file for test configuration
import '@testing-library/jest-dom';

// Mock environment variables
(process.env as any).NODE_ENV = 'test';

// Mock fetch for API calls
global.fetch = jest.fn();

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
