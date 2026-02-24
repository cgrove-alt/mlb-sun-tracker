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

// Mock Next.js Request/Response for API route testing
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    method: string;
    url: string;
    headers: Headers;
    body: ReadableStream | null;

    constructor(input: string | URL, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input.toString();
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);

      // Simple body handling for tests
      if (init?.body) {
        this.body = {
          getReader: () => ({
            read: async () => ({ done: true, value: undefined })
          })
        } as any;
      } else {
        this.body = null;
      }
    }

    json = async () => {
      if (typeof (this as any)._bodyInit === 'string') {
        return JSON.parse((this as any)._bodyInit);
      }
      return {};
    };

    text = async () => {
      if (typeof (this as any)._bodyInit === 'string') {
        return (this as any)._bodyInit;
      }
      return '';
    };

    clone = () => new Request(this.url, { method: this.method, headers: this.headers });
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    status: number;
    statusText: string;
    headers: Headers;
    ok: boolean;
    body: ReadableStream | null;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers);
      this.ok = this.status >= 200 && this.status < 300;
      this.body = null;
      (this as any)._body = body;
    }

    json = async () => {
      if (typeof (this as any)._body === 'string') {
        return JSON.parse((this as any)._body);
      }
      return (this as any)._body || {};
    };

    text = async () => {
      if (typeof (this as any)._body === 'string') {
        return (this as any)._body;
      }
      return String((this as any)._body || '');
    };

    clone = () => new Response((this as any)._body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  } as any;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    private map: Map<string, string>;

    constructor(init?: HeadersInit) {
      this.map = new Map();
      if (init) {
        if (init instanceof Headers) {
          (init as any).map.forEach((value: string, key: string) => {
            this.map.set(key.toLowerCase(), value);
          });
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => {
            this.map.set(key.toLowerCase(), value);
          });
        } else {
          Object.entries(init).forEach(([key, value]) => {
            this.map.set(key.toLowerCase(), value);
          });
        }
      }
    }

    get = (name: string) => this.map.get(name.toLowerCase()) || null;
    set = (name: string, value: string) => { this.map.set(name.toLowerCase(), value); };
    has = (name: string) => this.map.has(name.toLowerCase());
    delete = (name: string) => { this.map.delete(name.toLowerCase()); };
    append = (name: string, value: string) => {
      const existing = this.get(name);
      this.set(name, existing ? `${existing}, ${value}` : value);
    };
    forEach = (callback: (value: string, key: string) => void) => {
      this.map.forEach((value, key) => callback(value, key));
    };
  } as any;
}