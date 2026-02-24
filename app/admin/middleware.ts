import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple authentication middleware for admin routes
 *
 * For MVP: Uses environment variable password
 * For production: Should be replaced with proper authentication (NextAuth, Clerk, Auth0)
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for admin authentication
  const adminPassword = process.env.ADMIN_PASSWORD;

  // If no admin password is set, allow access in development only
  if (!adminPassword) {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    } else {
      return NextResponse.json(
        { error: 'Admin access not configured' },
        { status: 403 }
      );
    }
  }

  // Check for authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Simple token validation (for MVP)
  // In production, use proper JWT validation
  if (token !== adminPassword) {
    return NextResponse.json(
      { error: 'Invalid authentication' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
