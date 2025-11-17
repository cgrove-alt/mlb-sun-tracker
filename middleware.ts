import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle seat data JSON requests
  if (pathname.startsWith('/data/seats/') && pathname.endsWith('.json')) {
    const response = NextResponse.next();

    // Add cache headers for seat data
    response.headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');

    // Check if client accepts gzip encoding
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    if (acceptEncoding.includes('gzip')) {
      // The server will automatically serve .gz files if they exist
      response.headers.set('Vary', 'Accept-Encoding');
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all seat data JSON files
    '/data/seats/:path*.json',
  ],
};