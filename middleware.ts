import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Next.js's dev server compiles with eval-based source maps and React Refresh,
  // so 'unsafe-eval' is required for HMR to work locally. Production ships no
  // eval'd code, and allowing it there would defeat much of the point of having
  // a CSP — so it is scoped to development only.
  const isDev = process.env.NODE_ENV !== 'production';
  const scriptSrc = [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : '',
    'https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com',
  ]
    .filter(Boolean)
    .join(' ');

  // Security headers that apply to all requests (mobile and desktop).
  //
  // This middleware is the source of truth for security headers on HTML routes.
  // `vercel.json` repeats a subset for paths the matcher below excludes (static
  // assets); the two previously disagreed on X-Frame-Options (DENY here,
  // SAMEORIGIN there), which left the effective policy depending on which layer
  // won. They are now both DENY, matching `frame-ancestors 'none'` in the CSP.
  const headers = {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection in older browsers
    'X-XSS-Protection': '1; mode=block',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob: https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.open-meteo.com https://statsapi.mlb.com https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://*.google-analytics.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
  };

  // Apply all security headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add HSTS for production only
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo|manifest|robots|sitemap|sw).*)',
  ],
};