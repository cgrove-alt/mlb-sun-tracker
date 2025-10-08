/**
 * Analytics service for production metrics tracking
 * Supports multiple backends: Vercel KV, Google Analytics, custom database
 */

interface MetricData {
  name: string;
  value: number;
  url: string;
  timestamp: number;
  userAgent?: string;
  country?: string;
  city?: string;
}

interface AnalyticsBackend {
  send(metric: MetricData): Promise<void>;
}

/**
 * Google Analytics 4 backend
 */
class GoogleAnalyticsBackend implements AnalyticsBackend {
  private measurementId: string;
  private apiSecret: string;

  constructor(measurementId: string, apiSecret: string) {
    this.measurementId = measurementId;
    this.apiSecret = apiSecret;
  }

  async send(metric: MetricData): Promise<void> {
    if (!this.measurementId || !this.apiSecret) return;

    try {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: 'web-vitals',
            events: [{
              name: 'web_vitals',
              params: {
                metric_name: metric.name,
                metric_value: metric.value,
                page_path: metric.url,
                event_category: 'Web Vitals',
                event_label: metric.name,
                value: Math.round(metric.value),
                non_interaction: true,
              },
            }],
          }),
        }
      );

      if (!response.ok) {
        console.error('GA4 error:', response.status);
      }
    } catch (error) {
      console.error('Failed to send to GA4:', error);
    }
  }
}

/**
 * Vercel KV backend (simple key-value storage)
 */
class VercelKVBackend implements AnalyticsBackend {
  async send(metric: MetricData): Promise<void> {
    // Only available if @vercel/kv is installed and configured
    // This would require: npm install @vercel/kv
    // And environment variable: KV_REST_API_URL and KV_REST_API_TOKEN

    try {
      // For now, just log that KV would be used
      if (process.env.KV_REST_API_URL) {
        // Would send to KV here
        // const { kv } = await import('@vercel/kv');
        // await kv.lpush(`metrics:${metric.name}`, JSON.stringify(metric));
        // await kv.expire(`metrics:${metric.name}`, 60 * 60 * 24 * 30); // 30 days
      }
    } catch (error) {
      console.error('Failed to send to Vercel KV:', error);
    }
  }
}

/**
 * Console backend for development
 */
class ConsoleBackend implements AnalyticsBackend {
  async send(metric: MetricData): Promise<void> {
    const { name, value } = metric;

    // Color-coded based on thresholds
    const getColor = (name: string, value: number): string => {
      switch (name) {
        case 'LCP':
          return value <= 2500 ? '🟢' : value <= 4000 ? '🟡' : '🔴';
        case 'INP':
          return value <= 200 ? '🟢' : value <= 500 ? '🟡' : '🔴';
        case 'FID': // Legacy support
          return value <= 100 ? '🟢' : value <= 300 ? '🟡' : '🔴';
        case 'CLS':
          return value <= 0.1 ? '🟢' : value <= 0.25 ? '🟡' : '🔴';
        case 'TTFB':
          return value <= 800 ? '🟢' : value <= 1800 ? '🟡' : '🔴';
        default:
          return '⚪';
      }
    };

    console.log(`${getColor(name, value)} ${name}: ${value.toFixed(2)} (${metric.url})`);
  }
}

/**
 * Main Analytics class
 */
export class Analytics {
  private backends: AnalyticsBackend[] = [];
  private static instance: Analytics;

  private constructor() {
    // Initialize backends based on environment
    if (process.env.NODE_ENV === 'development') {
      this.backends.push(new ConsoleBackend());
    } else {
      // Production backends
      if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
        this.backends.push(
          new GoogleAnalyticsBackend(
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
            process.env.GA_API_SECRET
          )
        );
      }

      if (process.env.KV_REST_API_URL) {
        this.backends.push(new VercelKVBackend());
      }
    }
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  async trackMetric(data: MetricData): Promise<void> {
    // Send to all configured backends in parallel
    await Promise.allSettled(
      this.backends.map(backend => backend.send(data))
    );
  }

  async trackWebVital(name: string, value: number, url: string): Promise<void> {
    await this.trackMetric({
      name,
      value,
      url,
      timestamp: Date.now(),
    });
  }

  async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    // Track errors to analytics
    console.error('Application error:', error, context);

    // Could send to error tracking service like Sentry here
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.captureException(error, { extra: context });
    }
  }
}

// Export singleton
export const analytics = Analytics.getInstance();

// Helper to track Core Web Vitals
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const url = window.location.pathname;

    onLCP((metric) => analytics.trackWebVital('LCP', metric.value, url));
    onINP((metric) => analytics.trackWebVital('INP', metric.value, url)); // INP replaced FID
    onCLS((metric) => analytics.trackWebVital('CLS', metric.value, url));
    onFCP((metric) => analytics.trackWebVital('FCP', metric.value, url));
    onTTFB((metric) => analytics.trackWebVital('TTFB', metric.value, url));
  });
}
