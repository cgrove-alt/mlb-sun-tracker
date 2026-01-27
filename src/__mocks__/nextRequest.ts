/**
 * Mock utilities for Next.js Request/Response in tests
 * Use with @jest-environment node
 */

import { NextRequest } from 'next/server';

export interface MockRequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
  url?: string;
}

/**
 * Creates a properly mocked NextRequest for testing
 * Handles JSON body parsing correctly in test environment
 */
export const createMockNextRequest = (options: MockRequestOptions = {}): NextRequest => {
  const {
    method = 'GET',
    body,
    headers = {},
    searchParams = {},
    url = 'http://localhost:3000/api/test'
  } = options;

  const fullUrl = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    fullUrl.searchParams.set(key, value);
  });

  const requestInit: RequestInit = {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  };

  // For POST/PUT/PATCH with body, create a proper Request with body
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    requestInit.body = bodyString;
  }

  const request = new NextRequest(fullUrl, requestInit);

  // Mock the json() method to return the body directly
  if (body) {
    const originalJson = request.json.bind(request);
    request.json = jest.fn(async () => {
      if (typeof body === 'string') {
        try {
          return JSON.parse(body);
        } catch {
          return body;
        }
      }
      return body;
    });
  }

  return request;
};

/**
 * Mocks global fetch for Airtable or external API calls
 */
export const mockFetch = (responseData?: any, options?: { ok?: boolean; status?: number }) => {
  const mockResponse = {
    ok: options?.ok ?? true,
    status: options?.status ?? 200,
    json: async () => responseData || {},
    text: async () => JSON.stringify(responseData || {}),
    headers: new Headers(),
  };

  global.fetch = jest.fn(() => Promise.resolve(mockResponse as any));
  return global.fetch;
};

/**
 * Restores fetch to original implementation
 */
export const restoreFetch = () => {
  if (jest.isMockFunction(global.fetch)) {
    (global.fetch as jest.Mock).mockRestore();
  }
};
