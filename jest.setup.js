/**
 * Jest setup file - conditionally loads DOM setup based on test environment
 */

// Only load DOM-related setup if we're in jsdom environment
if (typeof window !== 'undefined') {
  require('./src/setupTests.ts');
}
