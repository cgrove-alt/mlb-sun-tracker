import { NextRequest, NextResponse } from 'next/server';

/**
 * Stadium View Analytics API
 * Tracks page views and interactions per stadium
 */

// In-memory storage for development/MVP
// TODO: Replace with persistent storage (Vercel KV, PostgreSQL, or MongoDB)
const stadiumViewsStore: Map<string, {
  stadiumId: string;
  stadiumName: string;
  views: number;
  uniqueVisitors: Set<string>;
  lastViewed: number;
  league: string;
}> = new Map();

const viewEvents: Array<{
  stadiumId: string;
  timestamp: number;
  userAgent: string;
  country: string;
  city: string;
  sessionId: string;
}> = [];

// Max events to keep in memory
const MAX_EVENTS = 10000;

/**
 * POST /api/admin/analytics/stadium-views
 * Track a stadium page view
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { stadiumId, stadiumName, league } = payload;

    // Validation
    if (!stadiumId || typeof stadiumId !== 'string') {
      return NextResponse.json(
        { error: 'Stadium ID is required' },
        { status: 400 }
      );
    }

    // Get geo and session data from headers
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const sessionId = request.headers.get('x-session-id') || `session-${Date.now()}-${Math.random()}`;

    // Update aggregated view count
    const existing = stadiumViewsStore.get(stadiumId);
    if (existing) {
      existing.views++;
      existing.uniqueVisitors.add(sessionId);
      existing.lastViewed = Date.now();
    } else {
      stadiumViewsStore.set(stadiumId, {
        stadiumId,
        stadiumName: stadiumName || stadiumId,
        views: 1,
        uniqueVisitors: new Set([sessionId]),
        lastViewed: Date.now(),
        league: league || 'unknown',
      });
    }

    // Store raw event
    viewEvents.push({
      stadiumId,
      timestamp: Date.now(),
      userAgent,
      country,
      city,
      sessionId,
    });

    // Trim events if too large
    if (viewEvents.length > MAX_EVENTS) {
      viewEvents.splice(0, viewEvents.length - MAX_EVENTS);
    }

    return NextResponse.json(
      { success: true, message: 'View tracked' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to track stadium view:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track view' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/analytics/stadium-views
 * Get stadium view analytics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'views'; // views | uniqueVisitors | lastViewed
    const league = searchParams.get('league') || 'all'; // mlb | milb | nfl | soccer | all

    // Convert Map to array
    let stadiums = Array.from(stadiumViewsStore.values()).map(stadium => ({
      stadiumId: stadium.stadiumId,
      stadiumName: stadium.stadiumName,
      views: stadium.views,
      uniqueVisitors: stadium.uniqueVisitors.size,
      lastViewed: stadium.lastViewed,
      league: stadium.league,
    }));

    // Filter by league
    if (league !== 'all') {
      stadiums = stadiums.filter(s => s.league === league);
    }

    // Sort
    stadiums.sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'uniqueVisitors') return b.uniqueVisitors - a.uniqueVisitors;
      if (sortBy === 'lastViewed') return b.lastViewed - a.lastViewed;
      return 0;
    });

    // Limit
    const topStadiums = stadiums.slice(0, limit);

    // Calculate totals
    const totalViews = stadiums.reduce((sum, s) => sum + s.views, 0);
    const totalUniqueVisitors = new Set(
      viewEvents.map(e => e.sessionId)
    ).size;

    // Get recent events (last 100)
    const recentEvents = viewEvents.slice(-100).reverse();

    // Calculate views by league
    const viewsByLeague = stadiums.reduce((acc, stadium) => {
      const league = stadium.league;
      if (!acc[league]) {
        acc[league] = { views: 0, stadiums: 0 };
      }
      acc[league].views += stadium.views;
      acc[league].stadiums++;
      return acc;
    }, {} as Record<string, { views: number; stadiums: number }>);

    return NextResponse.json({
      topStadiums,
      summary: {
        totalViews,
        totalUniqueVisitors,
        totalStadiums: stadiumViewsStore.size,
        averageViewsPerStadium: stadiumViewsStore.size > 0
          ? Math.round(totalViews / stadiumViewsStore.size)
          : 0,
        viewsByLeague,
      },
      recentEvents: recentEvents.slice(0, 20), // Last 20 events
    });
  } catch (error) {
    console.error('Failed to get stadium views:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/analytics/stadium-views
 * Clear analytics data (development only)
 */
export async function DELETE(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  stadiumViewsStore.clear();
  viewEvents.length = 0;

  return NextResponse.json({
    success: true,
    message: 'Analytics data cleared',
  });
}
