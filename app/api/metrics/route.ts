import { NextRequest, NextResponse } from 'next/server';
import { analytics } from '@/lib/analytics';

// In-memory storage for development only
const metricsStore: any[] = [];
const MAX_METRICS = 1000;

export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json();

    // Get geo data from Vercel headers
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Track each metric to analytics service
    const metricPromises = [];

    if (metrics.LCP) {
      metricPromises.push(analytics.trackMetric({
        name: 'LCP',
        value: metrics.LCP,
        url: metrics.url || 'unknown',
        timestamp: Date.now(),
        userAgent,
        country,
        city,
      }));

      // Warn on poor LCP
      if (metrics.LCP > 2500) {
        console.warn(`Poor LCP: ${metrics.LCP}ms for ${metrics.url} (${country}/${city})`);
      }
    }

    if (metrics.FID) {
      metricPromises.push(analytics.trackMetric({
        name: 'FID',
        value: metrics.FID,
        url: metrics.url || 'unknown',
        timestamp: Date.now(),
        userAgent,
        country,
        city,
      }));
    }

    if (metrics.INP) {
      metricPromises.push(analytics.trackMetric({
        name: 'INP',
        value: metrics.INP,
        url: metrics.url || 'unknown',
        timestamp: Date.now(),
        userAgent,
        country,
        city,
      }));

      // Warn on poor INP (replaces FID)
      if (metrics.INP > 200) {
        console.warn(`Poor INP: ${metrics.INP}ms for ${metrics.url} (${country}/${city})`);
      }
    }

    if (metrics.CLS) {
      metricPromises.push(analytics.trackMetric({
        name: 'CLS',
        value: metrics.CLS,
        url: metrics.url || 'unknown',
        timestamp: Date.now(),
        userAgent,
        country,
        city,
      }));

      // Warn on poor CLS
      if (metrics.CLS > 0.1) {
        console.warn(`Poor CLS: ${metrics.CLS} for ${metrics.url} (${country}/${city})`);
      }
    }

    if (metrics.FCP) {
      metricPromises.push(analytics.trackMetric({
        name: 'FCP',
        value: metrics.FCP,
        url: metrics.url || 'unknown',
        timestamp: Date.now(),
        userAgent,
        country,
        city,
      }));
    }

    if (metrics.TTFB) {
      metricPromises.push(analytics.trackMetric({
        name: 'TTFB',
        value: metrics.TTFB,
        url: metrics.url || 'unknown',
        timestamp: Date.now(),
        userAgent,
        country,
        city,
      }));
    }

    // Send all metrics in parallel
    await Promise.allSettled(metricPromises);

    // Store in memory for development/debugging
    if (process.env.NODE_ENV === 'development') {
      metricsStore.push({
        ...metrics,
        serverTimestamp: Date.now(),
        country,
        city,
      });

      // Keep only recent metrics in memory
      if (metricsStore.length > MAX_METRICS) {
        metricsStore.splice(0, metricsStore.length - MAX_METRICS);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Metrics recorded' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  // Get query parameters for filtering
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '100');
  const sortBy = searchParams.get('sortBy') || 'serverTimestamp';

  // Get recent metrics
  const recentMetrics = metricsStore.slice(-limit);

  // Calculate averages
  const averages = {
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0,
    FCP: 0,
    count: recentMetrics.length,
  };

  recentMetrics.forEach((metric) => {
    if (metric.LCP) averages.LCP += metric.LCP;
    if (metric.FID) averages.FID += metric.FID;
    if (metric.CLS) averages.CLS += metric.CLS;
    if (metric.TTFB) averages.TTFB += metric.TTFB;
    if (metric.FCP) averages.FCP += metric.FCP;
  });

  if (averages.count > 0) {
    averages.LCP /= averages.count;
    averages.FID /= averages.count;
    averages.CLS /= averages.count;
    averages.TTFB /= averages.count;
    averages.FCP /= averages.count;
  }

  // Calculate percentiles
  const calculatePercentile = (values: number[], percentile: number) => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  };

  const lcpValues = recentMetrics.map(m => m.LCP).filter(Boolean);
  const fidValues = recentMetrics.map(m => m.FID).filter(Boolean);
  const clsValues = recentMetrics.map(m => m.CLS).filter(Boolean);

  const percentiles = {
    LCP: {
      p50: calculatePercentile(lcpValues, 50),
      p75: calculatePercentile(lcpValues, 75),
      p90: calculatePercentile(lcpValues, 90),
      p99: calculatePercentile(lcpValues, 99),
    },
    FID: {
      p50: calculatePercentile(fidValues, 50),
      p75: calculatePercentile(fidValues, 75),
      p90: calculatePercentile(fidValues, 90),
      p99: calculatePercentile(fidValues, 99),
    },
    CLS: {
      p50: calculatePercentile(clsValues, 50),
      p75: calculatePercentile(clsValues, 75),
      p90: calculatePercentile(clsValues, 90),
      p99: calculatePercentile(clsValues, 99),
    },
  };

  // Web Vitals thresholds
  const scores = {
    LCP: {
      good: lcpValues.filter(v => v <= 2500).length,
      needsImprovement: lcpValues.filter(v => v > 2500 && v <= 4000).length,
      poor: lcpValues.filter(v => v > 4000).length,
    },
    FID: {
      good: fidValues.filter(v => v <= 100).length,
      needsImprovement: fidValues.filter(v => v > 100 && v <= 300).length,
      poor: fidValues.filter(v => v > 300).length,
    },
    CLS: {
      good: clsValues.filter(v => v <= 0.1).length,
      needsImprovement: clsValues.filter(v => v > 0.1 && v <= 0.25).length,
      poor: clsValues.filter(v => v > 0.25).length,
    },
  };

  return NextResponse.json({
    metrics: recentMetrics,
    summary: {
      totalCount: metricsStore.length,
      returnedCount: recentMetrics.length,
      averages,
      percentiles,
      scores,
    },
  });
}