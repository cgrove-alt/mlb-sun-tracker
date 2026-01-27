import { NextRequest, NextResponse } from 'next/server';
import { mlbDataFreshness, milbDataFreshness } from '@/src/data/stadium-data-freshness';

/**
 * Data Quality Analytics API
 * Provides insights into stadium data completeness, freshness, and user-reported issues
 */

// In-memory storage for calculation errors and API errors
const calculationErrorsStore: Map<string, {
  stadiumId: string;
  errorType: string;
  errorMessage: string;
  count: number;
  firstOccurred: number;
  lastOccurred: number;
}> = new Map();

const apiErrorsStore: Array<{
  stadiumId: string;
  endpoint: string;
  statusCode: number;
  errorMessage: string;
  timestamp: number;
}> = [];

const MAX_API_ERRORS = 1000;

/**
 * POST /api/admin/analytics/data-quality
 * Track calculation or API errors
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, stadiumId, errorType, errorMessage, endpoint, statusCode } = payload;

    if (type === 'calculation-error') {
      // Track calculation errors (e.g., shade calculation failures)
      const key = `${stadiumId}-${errorType}`;
      const existing = calculationErrorsStore.get(key);

      if (existing) {
        existing.count++;
        existing.lastOccurred = Date.now();
      } else {
        calculationErrorsStore.set(key, {
          stadiumId,
          errorType,
          errorMessage: errorMessage || 'Unknown error',
          count: 1,
          firstOccurred: Date.now(),
          lastOccurred: Date.now(),
        });
      }
    } else if (type === 'api-error') {
      // Track API errors
      apiErrorsStore.push({
        stadiumId: stadiumId || 'unknown',
        endpoint: endpoint || 'unknown',
        statusCode: statusCode || 500,
        errorMessage: errorMessage || 'Unknown error',
        timestamp: Date.now(),
      });

      // Trim if too large
      if (apiErrorsStore.length > MAX_API_ERRORS) {
        apiErrorsStore.splice(0, apiErrorsStore.length - MAX_API_ERRORS);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Error tracked' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to track error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/analytics/data-quality
 * Get data quality analytics
 */
export async function GET(request: NextRequest) {
  try {
    // Calculate data freshness statistics
    const now = Date.now();
    const allFreshness = [...mlbDataFreshness, ...milbDataFreshness];

    const freshnessStats = {
      current: 0, // < 6 months
      good: 0,    // 6-12 months
      stale: 0,   // 1-2 years
      outdated: 0, // > 2 years
      byLeague: {
        mlb: { current: 0, good: 0, stale: 0, outdated: 0, total: mlbDataFreshness.length },
        milb: { current: 0, good: 0, stale: 0, outdated: 0, total: milbDataFreshness.length },
      },
    };

    const stadiumsNeedingUpdate: Array<{
      stadiumId: string;
      lastUpdated: string;
      daysSince: number;
      notes: string;
      league: string;
    }> = [];

    // Process MLB
    mlbDataFreshness.forEach(stadium => {
      const lastUpdated = new Date(stadium.lastUpdated);
      const daysSince = (now - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSince < 180) {
        freshnessStats.current++;
        freshnessStats.byLeague.mlb.current++;
      } else if (daysSince < 365) {
        freshnessStats.good++;
        freshnessStats.byLeague.mlb.good++;
      } else if (daysSince < 730) {
        freshnessStats.stale++;
        freshnessStats.byLeague.mlb.stale++;
        stadiumsNeedingUpdate.push({
          stadiumId: stadium.stadiumId,
          lastUpdated: stadium.lastUpdated,
          daysSince: Math.round(daysSince),
          notes: stadium.notes || '',
          league: 'mlb',
        });
      } else {
        freshnessStats.outdated++;
        freshnessStats.byLeague.mlb.outdated++;
        stadiumsNeedingUpdate.push({
          stadiumId: stadium.stadiumId,
          lastUpdated: stadium.lastUpdated,
          daysSince: Math.round(daysSince),
          notes: stadium.notes || '',
          league: 'mlb',
        });
      }
    });

    // Process MiLB
    milbDataFreshness.forEach(stadium => {
      const lastUpdated = new Date(stadium.lastUpdated);
      const daysSince = (now - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSince < 180) {
        freshnessStats.current++;
        freshnessStats.byLeague.milb.current++;
      } else if (daysSince < 365) {
        freshnessStats.good++;
        freshnessStats.byLeague.milb.good++;
      } else if (daysSince < 730) {
        freshnessStats.stale++;
        freshnessStats.byLeague.milb.stale++;
        stadiumsNeedingUpdate.push({
          stadiumId: stadium.stadiumId,
          lastUpdated: stadium.lastUpdated,
          daysSince: Math.round(daysSince),
          notes: stadium.notes || '',
          league: 'milb',
        });
      } else {
        freshnessStats.outdated++;
        freshnessStats.byLeague.milb.outdated++;
        stadiumsNeedingUpdate.push({
          stadiumId: stadium.stadiumId,
          lastUpdated: stadium.lastUpdated,
          daysSince: Math.round(daysSince),
          notes: stadium.notes || '',
          league: 'milb',
        });
      }
    });

    // Sort stadiums needing update by days since
    stadiumsNeedingUpdate.sort((a, b) => b.daysSince - a.daysSince);

    // Get calculation errors
    const calculationErrors = Array.from(calculationErrorsStore.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 errors

    // Get API error statistics
    const apiErrorStats = {
      total: apiErrorsStore.length,
      last24Hours: apiErrorsStore.filter(e => now - e.timestamp < 24 * 60 * 60 * 1000).length,
      last7Days: apiErrorsStore.filter(e => now - e.timestamp < 7 * 24 * 60 * 60 * 1000).length,
      byStatusCode: {} as Record<number, number>,
      byStadium: {} as Record<string, number>,
    };

    apiErrorsStore.forEach(error => {
      apiErrorStats.byStatusCode[error.statusCode] =
        (apiErrorStats.byStatusCode[error.statusCode] || 0) + 1;
      apiErrorStats.byStadium[error.stadiumId] =
        (apiErrorStats.byStadium[error.stadiumId] || 0) + 1;
    });

    // Get top 10 stadiums with most errors
    const topErrorStadiums = Object.entries(apiErrorStats.byStadium)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([stadiumId, count]) => ({ stadiumId, errorCount: count }));

    // Recent API errors (last 20)
    const recentApiErrors = apiErrorsStore
      .slice(-20)
      .reverse()
      .map(error => ({
        ...error,
        timestamp: new Date(error.timestamp).toISOString(),
      }));

    return NextResponse.json({
      dataFreshness: {
        stats: freshnessStats,
        stadiumsNeedingUpdate: stadiumsNeedingUpdate.slice(0, 30), // Top 30 needing updates
        totalTracked: allFreshness.length,
      },
      calculationErrors: {
        total: calculationErrorsStore.size,
        errors: calculationErrors,
      },
      apiErrors: {
        stats: apiErrorStats,
        topErrorStadiums,
        recentErrors: recentApiErrors,
      },
    });
  } catch (error) {
    console.error('Failed to get data quality analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/analytics/data-quality
 * Clear error tracking data (development only)
 */
export async function DELETE(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  calculationErrorsStore.clear();
  apiErrorsStore.length = 0;

  return NextResponse.json({
    success: true,
    message: 'Error tracking data cleared',
  });
}
