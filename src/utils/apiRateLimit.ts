/**
 * API Rate Limiting Middleware
 * Prevents abuse of API endpoints
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiter } from './validation';

// Create rate limiters for different API endpoints
const rateLimiters = new Map<string, RateLimiter>();

// Get or create a rate limiter for a specific endpoint
function getRateLimiter(endpoint: string, maxRequests: number = 30, windowMs: number = 60000): RateLimiter {
  if (!rateLimiters.has(endpoint)) {
    rateLimiters.set(endpoint, new RateLimiter(maxRequests, windowMs));
  }
  return rateLimiters.get(endpoint)!;
}

// Get client identifier from request
function getClientIdentifier(req: NextApiRequest): string {
  // Use X-Forwarded-For header if behind a proxy, otherwise use socket address
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const forwardedIps = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return forwardedIps[0].trim();
  }
  
  // Fallback to socket remote address
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Rate limiting middleware for API routes
 * @param endpoint - Name of the API endpoint
 * @param maxRequests - Maximum requests per window (default: 30)
 * @param windowMs - Time window in milliseconds (default: 60000)
 */
export function withRateLimit(
  endpoint: string,
  maxRequests: number = 30,
  windowMs: number = 60000
) {
  return function rateLimitMiddleware(
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
  ) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const limiter = getRateLimiter(endpoint, maxRequests, windowMs);
      const clientId = getClientIdentifier(req);
      const identifier = `${endpoint}:${clientId}`;
      
      if (!limiter.isAllowed(identifier)) {
        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
        return;
      }
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Window', (windowMs / 1000).toString());
      
      // Call the actual handler
      return handler(req, res);
    };
  };
}

/**
 * Global rate limiting for all API routes
 * Prevents a single client from overwhelming the API
 */
export function withGlobalRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000
) {
  return withRateLimit('global', maxRequests, windowMs);
}