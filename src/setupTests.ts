// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  takeRecords = jest.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    serviceWorker: {
      register: jest.fn(() => Promise.resolve({
        scope: '/',
        installing: null,
        waiting: null,
        active: null,
        addEventListener: jest.fn(),
        update: jest.fn(() => Promise.resolve()),
      })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getRegistration: jest.fn(() => Promise.resolve(undefined)),
      controller: null,
    },
  },
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: () => ({ ok: true, json: () => Promise.resolve({}) }),
  } as Response)
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});